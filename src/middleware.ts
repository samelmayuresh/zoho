import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/editor',
  '/viewer',
  '/partner',
  '/leads',
  '/contacts',
  '/accounts',
  '/deals',
  '/projects',
  '/users',
  '/settings',
  '/profile'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/api/auth/login',
  '/api/auth/logout'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public (allow without authentication)
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith('/api/auth/')
  )

  // Special handling for login page - redirect authenticated users to their dashboard
  if (pathname === '/login') {
    const sessionCookie = request.cookies.get('crm-session')

    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie.value)
        if (sessionData.userId) {
          // Redirect based on role
          const userRole = sessionData.role
          switch (userRole) {
            case 'ADMIN':
              return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            case 'EDITOR':
              return NextResponse.redirect(new URL('/editor/workspace', request.url))
            case 'VIEWER':
              return NextResponse.redirect(new URL('/viewer/dashboard', request.url))
            case 'PARTNER':
              return NextResponse.redirect(new URL('/partner/portal', request.url))
            default:
              return NextResponse.redirect(new URL('/dashboard', request.url))
          }
        }
      } catch (error) {
        // Invalid session, continue to login
      }
    }
    return NextResponse.next()
  }

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // If it's a protected route, check for authentication
  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get('crm-session')

    if (!sessionCookie) {
      // No session, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Validate session data
      const sessionData = JSON.parse(sessionCookie.value)

      if (!sessionData.userId || !sessionData.role) {
        // Invalid session, redirect to login
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Check role-based access
      const userRole = sessionData.role

      // Admin can access everything
      if (userRole === 'ADMIN') {
        return NextResponse.next()
      }

      // Role-specific route protection
      if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      if (pathname.startsWith('/editor') && !['ADMIN', 'EDITOR'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      if (pathname.startsWith('/viewer') && !['ADMIN', 'EDITOR', 'VIEWER'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      if (pathname.startsWith('/partner') && !['ADMIN', 'PARTNER'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

    } catch (error) {
      // Invalid session data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // For any other route (not protected, not explicitly public), allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}