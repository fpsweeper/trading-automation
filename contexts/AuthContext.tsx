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
            const token = localStorage.getItem('auth_token')

            if (!token) {
                setIsAuthenticated(false)
                setUsername('')
                return
            }

            // Call API with Authorization header
            const res = await fetch('/api/auth', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await res.json()
            setIsAuthenticated(data.isAuthenticated)
            console.log('Auth data:', data)
            setUsername(data.email) // Use email if username not available

        } catch (error) {
            console.error('Auth check failed:', error)
            setIsAuthenticated(false)
            setUsername('')
        }
    }

    const logout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            })
            localStorage.removeItem('auth_token')
            setIsAuthenticated(false)
            setUsername('')
        } catch (error) {
            console.error('Logout failed:', error)
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