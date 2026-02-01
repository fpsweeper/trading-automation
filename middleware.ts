import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE_NAME = 'access_token'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

    // Normalize pathname (remove trailing slash, but not for root)
    const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

    // Routes
    const protectedRoutes = ['/dashboard', '/profile', '/change-password', '/wallet', '/bots', '/settings']
    const authRoutes = ['/login', '/register', '/forgot-password']

    console.log('Middleware running for path:', path, 'Has token:', !!token)

    // 1️⃣ Check protected routes - redirect to login if no token
    if (protectedRoutes.includes(path) && !token) {
        console.log('Redirecting to login - protected route without token')
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 2️⃣ Check auth routes - redirect to dashboard if already authenticated
    if (authRoutes.includes(path) && token) {
        console.log('Redirecting to dashboard - auth route with token')
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    console.log('Middleware passed for path:', path)
    // 3️⃣ All other pages → allow
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/change-password',
        '/login',
        '/register',
        '/wallet',
        '/bots',
        '/settings',
        '/forgot-password',
    ],
}