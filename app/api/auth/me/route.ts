import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie')
    if (!cookieHeader) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    const tokenMatch = cookieHeader.match(/token=([^;]+)/)
    if (!tokenMatch) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    const token = tokenMatch[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any

    const client = await clientPromise
    const db = client.db('fastreado')
    const users = db.collection('users')
    const user = await users.findOne({ _id: new ObjectId(decoded.sub) })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan || 'free'
      }
    })
  } catch (err) {
    console.error('Auth me error:', err)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}