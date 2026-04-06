import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE_NAME = 'access_token'

const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/change-password',
    '/wallet',
    '/bots',
    '/settings',
]

const authRoutes = ['/login', '/register', '/forgot-password']

// Routes that should never be blocked
const publicRoutes = [
    '/',
    '/help',
    '/terms-privacy',
    '/verify-email',
]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // ── Skip API routes, static files, and Next.js internals ──────────────────
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Normalize path
    const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

    // ── Read JWT cookie ────────────────────────────────────────────────────────
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
    const isAuthenticated = !!token

    // ── Protected routes → redirect to login if not authenticated ─────────────
    const isProtected = protectedRoutes.some(r => path === r || path.startsWith(r + '/'))
    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // ── Auth routes → redirect to dashboard if already authenticated ───────────
    const isAuthRoute = authRoutes.includes(path)
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}