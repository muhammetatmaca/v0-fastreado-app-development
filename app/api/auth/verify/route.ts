import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()
    if (!email || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    const user = await users.findOne({ email })
    if (!user || !user.verification) return NextResponse.json({ error: 'Invalid code or user' }, { status: 400 })

    if (user.verification.verified) return NextResponse.json({ ok: true })

    if (String(user.verification.code) !== String(code)) return NextResponse.json({ error: 'Invalid code' }, { status: 400 })

    if (new Date(user.verification.expiresAt) < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 400 })

    await users.updateOne({ email }, { $set: { 'verification.verified': true }, $unset: { 'verification.code': '', 'verification.expiresAt': '' } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
