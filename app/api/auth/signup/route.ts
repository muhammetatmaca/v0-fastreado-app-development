import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')
    const existing = await users.findOne({ email })
    if (existing) return NextResponse.json({ error: 'User exists' }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    const result = await users.insertOne({ email, name, passwordHash })
    const userId = result.insertedId.toString()

    return NextResponse.json({ user: { id: userId, email, name } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
