"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import GlowLine from "@/components/ui/glowline"
import { ShineBorder } from "@/components/ui/shine-border"
import { TypingAnimation } from "@/components/ui/typing-animation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send reset email")
        toast.error(data.error || "Failed to send reset email")
        return
      }

      toast.success("Reset code sent to your email!")
      setSubmitted(true)

    } catch (err) {
      console.error('Forgot password error:', err)
      setError("Failed to send reset email. Please try again.")
      toast.error("Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">

          <Card className="p-8 border border-border text-center">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a 6-digit reset code to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              The code will expire in 1 hour. If you don't see the email, check your spam folder.
            </p>
            <Link href="/reset-password">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3">
                Enter Reset Code
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="h-fit flex items-center justify-center bg-background px-4 py-4">

      <div className="w-full max-w-md">
        <div className="w-full flex justify-center items-center py-10 text-4xl font-bold">
          <img src="/icon.svg" alt="" />
          HARVEST3
        </div>
        <Card className="
            relative overflow-hidden p-8
            bg-white/60 dark:bg-white/5
            backdrop-blur-xl
            border border-white/20 dark:border-white/10
            shadow-xl shadow-black/5 dark:shadow-black/30
            rounded-2xl
          ">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-center">Reset Password</h1>
          <div className="relative w-full mb-6">
            <GlowLine
              orientation="horizontal"
              position="50%"
              color="lightgreen"
            />
          </div>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Enter your email address and we'll send you a code to reset your password
          </p>

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email Address
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
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>

          <Link href="/login" className="flex items-center justify-center gap-2 text-primary hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
          <ShineBorder shineColor="#A3E635" borderWidth={3} />
        </Card>
      </div>
    </div>
  )
}