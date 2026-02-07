'use client'

import { useState } from 'react'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface GoogleLoginButtonProps {
    mode?: 'login' | 'register'
}

export default function GoogleLoginButton({
    mode = 'login'
}: GoogleLoginButtonProps) {
    const router = useRouter()
    const { checkAuth } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleAuth = async (credentialResponse: CredentialResponse) => {
        setIsLoading(true)

        try {
            const response = await fetch('/api/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: credentialResponse.credential,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || 'Google authentication failed')
                setIsLoading(false)
                return
            }

            // ✅ Store token in localStorage (same as regular login)
            if (data.accessToken) {
                localStorage.setItem('auth_token', data.accessToken)
                console.log('Google auth token stored in localStorage')
            }

            toast.success(mode === 'login' ? 'Login successful!' : 'Account created successfully!')
            await checkAuth()
            router.push('/dashboard')
            router.refresh()

        } catch (error) {
            console.error('Google auth error:', error)
            toast.error('Failed to authenticate with Google')
            setIsLoading(false)
        }
    }

    const handleGoogleError = () => {
        console.error('Google authentication failed')
        toast.error('Google authentication failed. Please try again.')
        setIsLoading(false)
    }

    if (isLoading) {
        return (
            <div className="
                w-full flex items-center justify-center gap-3
                px-6 py-3.5 rounded-xl
                bg-white dark:bg-gray-800
                border-2 border-gray-200 dark:border-gray-700
                text-gray-700 dark:text-gray-200
                font-semibold text-base
                shadow-sm
            ">
                <div className="relative">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <div className="absolute inset-0 animate-ping">
                        <Loader2 className="w-5 h-5 text-primary opacity-20" />
                    </div>
                </div>
                <span className="bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                    Authenticating...
                </span>
            </div>
        )
    }

    return (
        <div className="w-full google-button-container">
            {/* Custom Styling */}
            <style jsx global>{`
                /* Make Google button full width */
                .google-button-container > div,
                .google-button-container > div > div {
                    width: 100% !important;
                }
                
                .google-button-container iframe {
                    width: 100% !important;
                    height: 56px !important;
                }

                /* Custom styling for Google button */
                .google-button-container div[role="button"] {
                    width: 100% !important;
                    height: 56px !important;
                    border-radius: 0.75rem !important;
                    border: 2px solid rgb(229, 231, 235) !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
                    font-size: 1rem !important;
                    font-weight: 600 !important;
                    position: relative !important;
                    overflow: hidden !important;
                }

                .google-button-container div[role="button"]:hover {
                    border-color: rgb(209, 213, 219) !important;
                    box-shadow: 
                        0 10px 15px -3px rgb(0 0 0 / 0.1), 
                        0 4px 6px -4px rgb(0 0 0 / 0.1),
                        0 0 0 3px rgb(59, 130, 246, 0.1) !important;
                    transform: translateY(-2px) !important;
                }

                .google-button-container div[role="button"]:active {
                    transform: translateY(0) !important;
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
                }

                /* Dark mode */
                .dark .google-button-container div[role="button"] {
                    border-color: rgb(55, 65, 81) !important;
                    background-color: rgb(31, 41, 55) !important;
                }

                .dark .google-button-container div[role="button"]:hover {
                    border-color: rgb(75, 85, 99) !important;
                    box-shadow: 
                        0 10px 15px -3px rgb(0 0 0 / 0.5), 
                        0 4px 6px -4px rgb(0 0 0 / 0.5),
                        0 0 0 3px rgb(59, 130, 246, 0.2) !important;
                }

                /* Shimmer effect */
                .google-button-container div[role="button"]::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.3),
                        transparent
                    );
                    transition: left 0.5s;
                }

                .google-button-container div[role="button"]:hover::before {
                    left: 100%;
                }

                .dark .google-button-container div[role="button"]::before {
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.1),
                        transparent
                    );
                }
            `}</style>

            <GoogleLogin
                onSuccess={handleGoogleAuth}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text={mode === 'login' ? 'continue_with' : 'signup_with'}
                width="400"
                logo_alignment="left"
            />
        </div>
    )
}