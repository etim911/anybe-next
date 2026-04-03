import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public paths - no auth required
  const publicPaths = [
    '/auth',
    '/terms',
    '/privacy',
    '/mock-login',
    '/api/auth/send-otp',
    '/api/auth/verify-otp',
    '/api/auth/logout',
  ]
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Skip static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)) {
    return NextResponse.next()
  }

  // Check for auth token
  const authToken = request.cookies.get('guest-token')?.value
  
  if (!authToken) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // Verify the JWT
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing')
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(authToken, secret)
  } catch (error) {
    console.error('JWT Verification error:', error);
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}