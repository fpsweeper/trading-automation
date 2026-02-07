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
import { toast } from "sonner"
import GoogleLoginButton from "@/components/GoogleLoginButton"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { ShineBorder } from "@/components/ui/shine-border"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"

export default function LoginPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const { connected, publicKey, connect, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { checkAuth } = useAuth()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Call Next.js API route (sets Next.js cookie)
      let res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error || "Login failed");
        return;
      }

      const { token } = await res.json();
      // ✅ ONLY HERE
      localStorage.setItem("auth_token", token);

      // ✅ ALSO call Spring Boot directly to set its cookie
      /*const resOne = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!resOne.ok) {
        const data = await resOne.json();
        toast.error(data.error || data.message || "Login failed");
        return;
      }

      const token = await resOne.text();
      // ✅ ONLY HERE
      localStorage.setItem("auth_token", token);*/


      const resMe = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
        method: "GET",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
      });

      if (!resMe.ok) {
        const error = await resMe.json().catch(() => ({ error: "Invalid response" }));
        console.error("Login error:", resMe.status, error);
      } else {
        const data = await resMe.json();
        console.log("User data:", data);
      }

      toast.success("Login successful!");
      await checkAuth()
      router.push("/dashboard")

    } catch (err) {
      console.error("Login error:", err)
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
      <AnimatedGridPattern />
      <div className="w-full max-w-md">

        <Card className="
            relative overflow-hidden p-8
            bg-white/60 dark:bg-white/5
            backdrop-blur-xl
            border border-white/20 dark:border-white/10
            shadow-xl shadow-black/5 dark:shadow-black/30
            rounded-2xl
          ">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-center">Welcome Back</h1>
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
                <Mail className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
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
                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
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

          <div className="space-y-3 mb-6">
            <GoogleLoginButton mode="login" />
          </div>

          <div className="text-center text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="relative z-10 text-primary hover:underline font-medium"
            >
              Sign up
            </Link>

          </div>
          <ShineBorder shineColor="#A3E635" borderWidth={3} />
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link href="/terms-privacy" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/terms-privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
