import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protect /events - require auth (check for stored guest via cookie or redirect)
  // Note: consumer auth uses localStorage which isn't accessible in middleware
  // So we use a lightweight 'guest-verified' cookie set after successful auth
  if (pathname.startsWith('/events')) {
    const guestVerified = request.cookies.get('guest-verified')?.value
    if (!guestVerified) {
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/events/:path*']
}
