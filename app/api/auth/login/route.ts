import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')
    const user = await users.findOne({ email })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    if (user.verification && !user.verification.verified) {
      return NextResponse.json({ error: 'Email not verified', verificationRequired: true }, { status: 403 })
    }

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: '7d',
    })

    const res = NextResponse.json({ user: { id: user._id.toString(), email: user.email, name: user.name } })
    // Set httpOnly cookie
    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
