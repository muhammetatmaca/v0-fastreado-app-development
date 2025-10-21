import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/lib/mailer'
import { randomInt } from 'crypto'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const client = await clientPromise
    const db = client.db('fastreado')
    const users = db.collection('users')
    const existing = await users.findOne({ email })
    if (existing) return NextResponse.json({ error: 'User exists' }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    // create verification code
    const code = String(randomInt(100000, 999999))
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    const result = await users.insertOne({ email, name, passwordHash, verification: { verified: false, code, expiresAt } })
    const userId = result.insertedId.toString()

    // try to send verification email (best-effort)
    try {
      await sendVerificationEmail(email, code)
    } catch (err) {
      console.warn('Failed to send verification email', err)
    }

    return NextResponse.json({ user: { id: userId, email, name }, verificationRequired: true }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
