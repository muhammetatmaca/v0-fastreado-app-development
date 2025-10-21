import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import jwt from 'jsonwebtoken'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

    // exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData || !tokenData.id_token) return NextResponse.json({ error: 'Invalid token response' }, { status: 400 })

    // decode id_token to get user info
    const base64Url = tokenData.id_token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const buff = Buffer.from(base64, 'base64')
    const payload = JSON.parse(buff.toString('utf-8'))

    const email = payload.email
    const name = payload.name || payload.email

    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    let user = await users.findOne({ email })
    if (!user) {
      const result = await users.insertOne({ email, name, verification: { verified: true }, oauth: { provider: 'google' } })
      user = { _id: result.insertedId, email, name }
    }

    const token = jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })

    const res = NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL || '/')
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
