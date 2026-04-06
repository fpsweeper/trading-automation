'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    username: string
    checkAuth: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState('')

    const checkAuth = async () => {
        try {
            // ✅ Use the token from localStorage for the Authorization header
            // but also rely on the httpOnly cookie being present (set by /api/login).
            // /api/auth should validate whichever is available.
            const token = typeof window !== 'undefined'
                ? localStorage.getItem('auth_token')
                : null

            const headers: Record<string, string> = {}
            if (token) headers['Authorization'] = `Bearer ${token}`

            const res = await fetch('/api/auth', {
                headers,
                credentials: 'include', // ✅ send the httpOnly cookie too
            })

            if (!res.ok) {
                setIsAuthenticated(false)
                setUsername('')
                return
            }

            const data = await res.json()
            setIsAuthenticated(data.isAuthenticated ?? false)
            setUsername(data.email ?? data.username ?? '')

        } catch (error) {
            console.error('Auth check failed:', error)
            setIsAuthenticated(false)
            setUsername('')
        }
    }

    const logout = async () => {
        try {
            // ✅ Clear httpOnly cookie server-side
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            })
        } catch (error) {
            console.error('Logout API call failed:', error)
        } finally {
            // ✅ Always clear localStorage regardless of API success
            localStorage.removeItem('auth_token')
            setIsAuthenticated(false)
            setUsername('')
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}