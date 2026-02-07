"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Mail,
  KeyRound,
  Wallet,
  Twitter,
  MessageSquare,
  Check,
  ExternalLink,
  Shield,
  Sparkles,
  ChevronRight,
  Link as LinkIcon,
  Unlink,
  AlertCircle,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ShineBorder } from "@/components/ui/shine-border"
import GlowLine from "@/components/ui/glowline"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { BlurFade } from "@/components/ui/blur-fade"
import { toast } from "sonner"
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useAuth } from "@/contexts/AuthContext"

interface SolanaWalletData {
  walletAddress: string
  isVerified: boolean
  linkedAt: string
  nickname?: string
  isPrimary: boolean
}

interface UserData {
  email: string
  username: string
  firstName: string
  lastName: string
  authProvider: string
  isGoogleAccount: boolean
}

export default function ProfilePage() {

  const { isAuthenticated } = useAuth()
  const { publicKey, connected, disconnect, signMessage } = useWallet()
  const [isVerifying, setIsVerifying] = useState(false)

  const [userData, setUserData] = useState<UserData | null>(null)
  const [solanaWallet, setSolanaWallet] = useState<SolanaWalletData | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isLoadingWallet, setIsLoadingWallet] = useState(true)
  const [isLinking, setIsLinking] = useState(false)
  const [isUnlinking, setIsUnlinking] = useState(false)

  const [connections, setConnections] = useState({
    solana: false,
    twitter: false,
    discord: false,
  })

  /////////////////////////////////////////////////////////////////
  const [twitterAccount, setTwitterAccount] = useState<{
    twitterId: string
    username: string
    displayName: string
    profileImageUrl: string
    linkedAt: string
  } | null>(null)
  const [isLinkingTwitter, setIsLinkingTwitter] = useState(false)

  // Add to useEffect
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData()
      fetchSolanaWallet()
      fetchTwitterAccount()
    }
  }, [isAuthenticated])

  // Fetch Twitter account
  const fetchTwitterAccount = async () => {
    try {
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/social/twitter`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTwitterAccount(data)
        setConnections(prev => ({ ...prev, twitter: true }))
      } else if (response.status === 404) {
        setTwitterAccount(null)
        setConnections(prev => ({ ...prev, twitter: false }))
      }
    } catch (error) {
      console.error("Error fetching Twitter account:", error)
    }
  }

  // Link Twitter
  const handleLinkTwitter = async () => {
    if (!userData?.email) {
      toast.error("User email not found")
      return
    }

    setIsLinkingTwitter(true)

    try {
      console.log("Starting Twitter linking process...")
      const auth_token = localStorage.getItem('auth_token')
      // Get linking token
      const prepareRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/social/twitter/prepare`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`,
        },
      })

      if (!prepareRes.ok) {
        toast.error("Failed to prepare Twitter linking")
        setIsLinkingTwitter(false)
        return
      }
      console.log("Received response from prepare endpoint")

      const { token } = await prepareRes.json()

      // ✅ Store in localStorage (survives redirects)
      localStorage.setItem('twitter_link_token', token)

      console.log("Stored link token:", token)

      // Redirect to Twitter OAuth (without query parameter)
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}oauth2/authorization/twitter?statte=${encodeURIComponent(token)}`
    } catch (err) {
      console.error("Error:", err)
      toast.error("Failed to start Twitter linking")
      setIsLinkingTwitter(false)
    }
  }

  // Unlink Twitter
  const handleUnlinkTwitter = async () => {
    try {
      const auth_token = localStorage.getItem('auth_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/social/twitter/unlink`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.message || "Failed to unlink Twitter")
        return
      }

      setTwitterAccount(null)
      setConnections(prev => ({ ...prev, twitter: false }))
      toast.success("Twitter account unlinked successfully!")
    } catch (error) {
      console.error("Error unlinking Twitter:", error)
      toast.error("Failed to unlink Twitter")
    }
  }
  /////////////////////////////////////////////////////////////////

  const handleVerifyWallet = async () => {
    if (!connected) {
      toast.info("Please connect your wallet first")
      return
    }
    if (!publicKey || !solanaWallet) return

    if (!signMessage) {
      toast.error("Your wallet does not support message signing. Please use Phantom or Solflare.")
      return
    }
    try {

      setIsVerifying(true)

      // just trigger wallet popup
      const message = new TextEncoder().encode("Verify wallet ownership on HARVEST 3")
      await signMessage(message)

      // backend trust after signing
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/wallet/solana/verify?walletAddress=${solanaWallet.walletAddress}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      )

      // refresh wallet data
      fetchSolanaWallet()

    } finally {
      setIsVerifying(false)
    }
  }

  useEffect(() => {
    const handleTwitterCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const twitterStatus = params.get('twitter')

      if (twitterStatus === 'success') {
        // Check if we have a pending link token
        const linkToken = localStorage.getItem('twitter_link_token')

        if (linkToken) {
          console.log("Completing Twitter link with token:", linkToken)

          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/social/twitter/complete-link`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
              },
              body: JSON.stringify({ linkToken })
            })

            if (res.ok) {
              toast.success("Twitter account linked successfully!")
              fetchTwitterAccount()
            } else {
              const error = await res.json()
              toast.error(error.error || "Failed to complete Twitter linking")
            }
          } catch (err) {
            console.error('Failed to complete Twitter link:', err)
            toast.error("Failed to complete Twitter linking")
          } finally {
            localStorage.removeItem('twitter_link_token')
          }
        } else {
          toast.success("Twitter account linked successfully!")
          fetchTwitterAccount()
        }

        window.history.replaceState({}, '', '/profile')
      } else if (twitterStatus === 'error') {
        const message = params.get('message') || 'Failed to link Twitter account'
        toast.error(message)
        localStorage.removeItem('twitter_link_token')
        window.history.replaceState({}, '', '/profile')
      }
    }

    handleTwitterCallback()
  }, [])

  // Fetch user data
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData()
      fetchSolanaWallet()

    }
  }, [isAuthenticated])

  // Handle wallet connection
  useEffect(() => {
    if (connected && publicKey && !solanaWallet && !isLinking && isAuthenticated) {
      handleLinkWallet()
    }
  }, [connected, publicKey, solanaWallet, isAuthenticated])

  const fetchUserData = async () => {
    const token = localStorage.getItem('auth_token')
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched user data:", data)
        setUserData({
          email: data.email,
          username: "None",
          firstName: "None",
          lastName: "None",
          authProvider: data.authProvider || 'LOCAL',
          isGoogleAccount: data.authProvider === 'GOOGLE',
        })
      } else {
        toast.error("Failed to load user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast.error("Error loading user data")
    } finally {
      setIsLoadingUser(false)
    }
  }

  const fetchSolanaWallet = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/wallet/solana/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSolanaWallet(data)
        setConnections(prev => ({ ...prev, solana: true }))
      } else if (response.status === 404) {
        // No wallet linked
        console.log("No Solana wallet linked")
        setSolanaWallet(null)
        setConnections(prev => ({ ...prev, solana: false }))
      }
    } catch (error) {
      console.error("Error fetching Solana wallet:", error)
    } finally {
      setIsLoadingWallet(false)
    }
  }

  const handleLinkWallet = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsLinking(true)

    try {
      const walletAddress = publicKey.toBase58()

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/wallet/solana/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          walletAddress: walletAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Failed to link wallet")
        await disconnect()
        return
      }

      setSolanaWallet(data)
      setConnections(prev => ({ ...prev, solana: true }))
      toast.success("Solana wallet linked successfully!")
    } catch (error: any) {
      console.error("Error linking wallet:", error)
      toast.error(error.message || "Failed to link wallet")
      await disconnect()
    } finally {
      setIsLinking(false)
    }
  }

  const handleUnlinkWallet = async () => {
    setIsUnlinking(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/wallet/solana/unlink`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.message || "Failed to unlink wallet")
        return
      }

      // Disconnect wallet from UI
      await disconnect()

      setSolanaWallet(null)
      setConnections(prev => ({ ...prev, solana: false }))
      toast.success("Wallet unlinked successfully!")
    } catch (error) {
      console.error("Error unlinking wallet:", error)
      toast.error("Failed to unlink wallet")
    } finally {
      setIsUnlinking(false)
    }
  }

  const handleConnect = (service: 'twitter' | 'discord') => {
    // Placeholder for Twitter/Discord OAuth
    toast.info(`${service} integration coming soon!`)
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load user data</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email Card */}
            <BlurFade delay={0.2} inView>
              <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Email Address</h3>
                        <p className="text-sm text-muted-foreground">
                          {userData.isGoogleAccount ? "Google Account" : "Email & Password"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">Verified</span>
                    </div>
                  </div>

                  <div className="relative w-full mb-6 py-1">
                    <GlowLine
                      orientation="horizontal"
                      position="50%"
                      color="lightgreen"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex-1">
                        <p className="text-base font-medium text-foreground">{userData.email}</p>
                      </div>
                      {userData.isGoogleAccount && (
                        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-border/50">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          <span className="text-xs font-medium text-foreground">Google</span>
                        </div>
                      )}
                    </div>

                    {/* Authentication Method Info */}
                    <div className={cn(
                      "p-4 rounded-xl border",
                      userData.isGoogleAccount ? "bg-blue-500/5 border-blue-500/20" : "bg-primary/5 border-primary/20"
                    )}>
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          userData.isGoogleAccount ? "bg-blue-500/10" : "bg-primary/10"
                        )}>
                          {userData.isGoogleAccount ? (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                          ) : (
                            <KeyRound className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-1">
                            {userData.isGoogleAccount ? "Google Sign-In" : "Email & Password"}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {userData.isGoogleAccount
                              ? "You sign in using your Google account. No password required."
                              : "You sign in with your email and password. You can change your password anytime."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ShineBorder shineColor="#A3E635" borderWidth={3} />
              </Card>
            </BlurFade>

            {/* Solana Wallet Connection */}
            <BlurFade delay={0.3} inView>
              <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm group hover:border-primary/30 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Wallet className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          Solana Wallet
                          {solanaWallet && solanaWallet.isVerified && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                          {solanaWallet && !solanaWallet.isVerified && (
                            <Check className="w-4 h-4 text-orange-500" />
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isLoadingWallet ? "Loading..." : solanaWallet ? "Linked & " : "Link your Solana wallet"}
                          {!isLoadingWallet && solanaWallet && solanaWallet.isVerified && "Verified on " + new Date(solanaWallet.linkedAt).toLocaleDateString()}
                          {!isLoadingWallet && solanaWallet && !solanaWallet.isVerified && "Unverified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full mb-6 py-1">
                    <GlowLine orientation="horizontal" position="50%" color="lightgreen" />
                  </div>

                  {isLoadingWallet ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : solanaWallet ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20">
                        <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
                        <div className="flex items-center gap-2 flex-wrap justify-between">
                          <div className="flex items-center gap-2 flex-wrap"><code className="text-sm font-mono text-foreground break-all">
                            {solanaWallet.walletAddress}
                          </code>
                            <ExternalLink
                              className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors flex-shrink-0"
                              onClick={() => window.open(`https://solscan.io/account/${solanaWallet.walletAddress}`, '_blank')}
                            /></div>

                          {!connected ? (
                            <WalletMultiButton className="!w-full !justify-center" />
                          ) : (
                            !solanaWallet.isVerified ? (<Button
                              size="sm"
                              variant="outline"
                              className="mt-3 border-green-500/30 text-green-600 hover:bg-green-500/10"
                              onClick={handleVerifyWallet}
                              disabled={isVerifying}
                            >
                              {isVerifying ? (
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3 mr-2" />
                              )}
                              {isVerifying ? "Verifying..." : "Verify Wallet"}
                            </Button>) : (<div className="flex items-center gap-2 mt-2">
                              <Check className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
                            </div>)

                          )}
                        </div>

                        {/*solanaWallet.isVerified ? (
                          <div className="flex items-center gap-2 mt-2">
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
                          </div>
                        ) : (
                          <div>
                            !connected ? (
                              <WalletMultiButton className="!w-full !justify-center" />
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 border-green-500/30 text-green-600 hover:bg-green-500/10"
                                onClick={handleVerifyWallet}
                                disabled={isVerifying}
                              >
                                {isVerifying ? (
                                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                ) : (
                                  <Check className="w-3 h-3 mr-2" />
                                )}
                                {isVerifying ? "Verifying..." : "Verify Wallet"}
                              </Button>
                            )
                          </div>

                        )*/}

                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50"
                          onClick={handleUnlinkWallet}
                          disabled={isUnlinking}
                        >
                          {isUnlinking ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Unlink className="w-4 h-4 mr-2" />
                          )}
                          {isUnlinking ? "Disconnecting..." : "Disconnect"}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-border/50 hover:bg-muted/50"
                          onClick={() => window.open(`https://solscan.io/account/${solanaWallet.walletAddress}`, '_blank')}
                        >
                          View on Solscan
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <p className="text-sm text-muted-foreground text-center">
                          Connect your Solana wallet to enable trading and access DeFi features
                          <div className="wallet-adapter-button-wrapper">
                            <WalletMultiButton className="!bg-gradient-to-r !from-primary !to-accent hover:!from-primary/90 hover:!to-accent/90 !text-white !shadow-lg !shadow-primary/25 hover:!shadow-xl hover:!shadow-primary/40 !transition-all !duration-300 !w-full !justify-center" />
                          </div>
                        </p>
                      </div>

                      {!connected ? (
                        <>
                        </>
                      ) : (
                        <ShimmerButton
                          className="w-full shadow-2xl"
                          onClick={handleLinkWallet}
                          disabled={isLinking}
                        >
                          {isLinking ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              <span>Linking...</span>
                            </>
                          ) : (
                            <>
                              <Wallet className="w-4 h-4 mr-2" />
                              <span>Link Wallet to Account</span>
                            </>
                          )}
                        </ShimmerButton>
                      )}

                      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground">
                            We support Phantom, Solflare, and other popular Solana wallets
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {solanaWallet && <ShineBorder shineColor="#A3E635" borderWidth={3} />}
              </Card>
            </BlurFade>

            {/* Social Connections Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Twitter Connection */}
              <BlurFade delay={0.4} inView>
                <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm group hover:border-blue-500/30 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Twitter className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2">
                          X (Twitter)
                          {twitterAccount && <Check className="w-4 h-4 text-green-500" />}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {twitterAccount ? `@${twitterAccount.username}` : "Not connected"}
                        </p>
                      </div>
                    </div>

                    <div className="relative w-full mb-6 py-1">
                      <GlowLine orientation="horizontal" position="50%" color="blue" />
                    </div>

                    {twitterAccount ? (
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                          <div className="flex items-center gap-3">
                            {twitterAccount.profileImageUrl && (
                              <img
                                src={twitterAccount.profileImageUrl}
                                alt={twitterAccount.username}
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium">{twitterAccount.displayName}</p>
                              <p className="text-xs text-muted-foreground">@{twitterAccount.username}</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10"
                          onClick={handleUnlinkTwitter}
                        >
                          <Unlink className="w-3 h-3 mr-2" />
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-500 transition-all"
                        onClick={handleLinkTwitter}
                        disabled={isLinkingTwitter}
                      >
                        {isLinkingTwitter ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <LinkIcon className="w-4 h-4 mr-2" />
                        )}
                        {isLinkingTwitter ? "Connecting..." : "Connect X"}
                      </Button>
                    )}
                  </div>
                  {twitterAccount && <ShineBorder shineColor="#A3E635" borderWidth={3} />}
                </Card>
              </BlurFade>

              {/* Discord Connection */}
              <BlurFade delay={0.5} inView>
                <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm group hover:border-indigo-500/30 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2">
                          Discord
                          {connections.discord && <Check className="w-4 h-4 text-green-500" />}
                        </h3>
                        <p className="text-xs text-muted-foreground">Coming soon</p>
                      </div>
                    </div>

                    <div className="relative w-full mb-6 py-1">
                      <GlowLine orientation="horizontal" position="50%" color="purple" />
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-indigo-500/30 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-indigo-500 transition-all"
                      onClick={() => handleConnect('discord')}
                      disabled
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  </div>
                </Card>
              </BlurFade>
            </div>
          </div>

          {/* Right Column - Security & Actions */}
          <div className="space-y-6">
            {/* Security Card */}
            <BlurFade delay={0.6} inView>
              <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm sticky top-24">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Security</h3>
                      <p className="text-xs text-muted-foreground">Account protection</p>
                    </div>
                  </div>

                  <div className="relative w-full mb-6 py-1">
                    <GlowLine orientation="horizontal" position="50%" color="lightgreen" />
                  </div>

                  <div className="space-y-4">
                    {/* Password - Only for non-Google accounts */}
                    {!userData.isGoogleAccount && (
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <KeyRound className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Password</p>
                              <p className="text-xs text-muted-foreground">Manage your password</p>
                            </div>
                          </div>
                        </div>
                        <Link href="/change-password">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-border/50 hover:bg-primary/10 hover:border-primary/50 hover:text-primary group-hover:shadow-md transition-all"
                          >
                            Change Password
                            <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Google Account Notice */}
                    {userData.isGoogleAccount && (
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Google Account</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              You're signed in with Google. Password management is handled by your Google account.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/*<div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Two-Factor Auth</p>
                          <p className="text-xs text-muted-foreground">Not enabled</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-700 dark:hover:text-yellow-500"
                        disabled
                      >
                        Coming Soon
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>*/}

                    {/* Connection Status */}
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-3">Connected Services</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Solana</span>
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            solanaWallet ? (solanaWallet.isVerified ? "bg-green-500" : "bg-orange-500") : "bg-gray-400"
                          )} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Twitter</span>
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            twitterAccount?.username ? "bg-green-500" : "bg-gray-400"
                          )} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Discord</span>
                          <div className="w-2 h-2 rounded-full bg-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ShineBorder shineColor="#A3E635" borderWidth={3} />
              </Card>
            </BlurFade>

            {/* Quick Info */}
            <BlurFade delay={0.7} inView>
              <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Pro Tip</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Connect your Solana wallet to unlock premium trading features and automated DeFi strategies.
                    </p>
                  </div>
                </div>
              </Card>
            </BlurFade>
          </div>
        </div>
      </main>
    </div>
  )
}