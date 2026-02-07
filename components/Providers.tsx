'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { SolanaProvider } from '@/providers/solana-provider'
import { ReactNode } from 'react'
import '@solana/wallet-adapter-react-ui/styles.css'
import { Auth0Provider } from '@auth0/nextjs-auth0'

export function Providers({ children }: { children: ReactNode }) {
    return (

        <GoogleOAuthProvider locale="en" clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <AuthProvider>
                <SolanaProvider>
                    <Auth0Provider>
                        {children}
                    </Auth0Provider>
                </SolanaProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    )
}

