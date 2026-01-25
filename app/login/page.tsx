"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Mail, Lock, Chrome, Wallet } from "lucide-react"

export default function LoginPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const { connected, publicKey, connect, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (email === "admin@gmail.com" && password === "admin") {
        localStorage.setItem("harvest3_auth", JSON.stringify({ username: "admin", email }))
        router.push("/dashboard")
      } else {
        setError("Invalid email or password. Demo: admin@gmail.com / admin")
      }
    } catch (err) {
      setError("Failed to login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    // Integrate with Google OAuth
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Google login initiated")
    } finally {
      setLoading(false)
    }
  }

  const handleSolanaLogin = async () => {
    if (connected && publicKey) {
      // User is already connected
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Solana wallet login:", publicKey.toString())
        // Integrate with backend authentication using publicKey
      } finally {
        setLoading(false)
      }
    } else {
      // Open wallet modal to let user select and connect wallet
      setVisible(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H3</span>
            </div>
            <span className="text-xl font-bold text-foreground">Harvest 3</span>
          </Link>
        </div>

        <Card className="p-8 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Welcome Back</h1>
          <p className="text-muted-foreground text-center text-sm mb-6">Sign in to your trading automation platform</p>

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Email & Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-input border-border accent-primary" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* OAuth & Wallet Options */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="outline"
              className="w-full border-border hover:bg-secondary bg-transparent"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button
              type="button"
              onClick={handleSolanaLogin}
              disabled={loading}
              variant="outline"
              className="w-full border-border hover:bg-secondary bg-transparent"
            >
              <Wallet className="w-5 h-5 mr-2" />
              {connected ? `Solana (${publicKey?.toString().slice(0, 8)}...)` : "Solana Wallet"}
            </Button>
          </div>

          <p className="text-center text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </Card>

        {/* Disclaimer Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link href="/#disclaimer" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/#disclaimer" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
