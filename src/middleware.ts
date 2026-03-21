import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define public routes that don't require authentication
  const publicPaths = ['/', '/auth', '/auth/callback', '/auth/reset-password']
  
  // TEMPORARY: Remove dashboard protection - will handle client-side
  // Define protected routes that require authentication
  const protectedPaths = ['/api/trades'] // Only protect API routes for now
  
  // Check if current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // Check if current path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )

  // Handle protected API routes - require authentication
  if (isProtectedPath) {
    const token = request.cookies.get('sb-access-token') || 
                  request.cookies.get('sb-refresh-token')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}