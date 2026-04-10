'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    username: string
    role: string
    checkAuth: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState('')
    const [role, setRole] = useState('')

    const checkAuth = async () => {
        try {
            const token = typeof window !== 'undefined'
                ? localStorage.getItem('auth_token')
                : null

            const headers: Record<string, string> = {}
            if (token) headers['Authorization'] = `Bearer ${token}`

            const res = await fetch('/api/auth', {
                headers,
                credentials: 'include',
            })

            if (!res.ok) {
                setIsAuthenticated(false)
                setUsername('')
                setRole('')
                return
            }

            const data = await res.json()
            setIsAuthenticated(data.isAuthenticated ?? false)
            setUsername(data.email ?? data.username ?? '')
            setRole(data.role ?? 'USER')   // ← new

        } catch (error) {
            console.error('Auth check failed:', error)
            setIsAuthenticated(false)
            setUsername('')
            setRole('')
        }
    }

    const logout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            })
        } catch (error) {
            console.error('Logout API call failed:', error)
        } finally {
            localStorage.removeItem('auth_token')
            setIsAuthenticated(false)
            setUsername('')
            setRole('')                    // ← new
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, role, checkAuth, logout }}>
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