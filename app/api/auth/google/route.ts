import { NextResponse } from 'next/server'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'

export async function GET(req: Request) {
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 })
  }

  // Get the current host from the request to handle different ports
  const url = new URL(req.url)
  const redirectUri = GOOGLE_REDIRECT_URI || `${url.protocol}//${url.host}/api/auth/google/callback`

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  
  return NextResponse.redirect(authUrl)
}