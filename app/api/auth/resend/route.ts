import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { sendVerificationEmail } from '@/lib/mailer'
import { randomInt } from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const client = await clientPromise
    const db = client.db('fastreado')
    const users = db.collection('users')

    const user = await users.findOne({ email })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const code = String(randomInt(100000, 999999))
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

    await users.updateOne({ email }, { $set: { 'verification.code': code, 'verification.expiresAt': expiresAt, 'verification.verified': false } })

    try {
      await sendVerificationEmail(email, code)
    } catch (err) {
      console.warn('Failed to send verification email', err)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
