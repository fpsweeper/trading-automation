import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth0 } from './lib/auth0'

const AUTH_COOKIE_NAME = 'access_token'

export async function middleware(request: NextRequest) {
    // ─────────────────────────────────────────────
    // 1️⃣ Run Auth0 middleware first
    // ─────────────────────────────────────────────
    const authResponse = await auth0.middleware(request)

    // If Auth0 returns a response (redirect, callback handling, etc)
    if (authResponse) {
        return authResponse
    }

    // ─────────────────────────────────────────────
    // 2️⃣ Custom route protection logic
    // ─────────────────────────────────────────────
    const { pathname } = request.nextUrl
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

    // Normalize pathname (remove trailing slash except root)
    const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

    const protectedRoutes = [
        '/dashboard',
        '/profile',
        '/change-password',
        '/wallet',
        '/bots',
        '/settings',
    ]

    const authRoutes = ['/login', '/register', '/forgot-password']

    // Protected routes → redirect to login if not authenticated
    if (protectedRoutes.includes(path) && !token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Auth routes → redirect to dashboard if already authenticated
    if (authRoutes.includes(path) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Allow request
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, sitemap.xml, robots.txt
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
