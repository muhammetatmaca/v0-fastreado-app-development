import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only run on library and other protected routes
  if (request.nextUrl.pathname.startsWith('/library') || 
      request.nextUrl.pathname.startsWith('/profile') ||
      request.nextUrl.pathname.startsWith('/settings')) {
    
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Just check if token exists, let the client-side handle user data fetching
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/library/:path*', '/profile/:path*', '/settings/:path*']
}