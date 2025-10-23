import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    if (error || !code) {
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', req.url))
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.redirect(new URL('/login?error=google_not_configured', req.url))
    }

    // Get the current host from the request to handle different ports
    const redirectUri = GOOGLE_REDIRECT_URI || `${url.protocol}//${url.host}/api/auth/google/callback`

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    const tokens = await tokenResponse.json()
    if (!tokens.access_token) {
      return NextResponse.redirect(new URL('/login?error=google_token_failed', req.url))
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const googleUser = await userResponse.json()
    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=google_user_failed', req.url))
    }

    // For now, create a simple user object without MongoDB (temporary fix)
    const user = {
      _id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name || googleUser.email.split('@')[0],
      avatar: googleUser.picture,
      plan: 'free'
    }

    // Create JWT token
    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )

    // Redirect to library with token
    const response = NextResponse.redirect(new URL('/library', req.url))
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })

    // Also set user data cookie for immediate access
    response.cookies.set('user-data', JSON.stringify({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      plan: user.plan || 'free'
    }), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })

    return response
  } catch (err) {
    console.error('Google OAuth error:', err)
    return NextResponse.redirect(new URL('/login?error=google_server_error', req.url))
  }
}