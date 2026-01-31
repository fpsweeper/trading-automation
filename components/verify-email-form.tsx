"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mail, Clock } from "lucide-react"
import { toast } from "sonner"

export function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email") || ""
  const [email, setEmail] = useState(emailParam)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (code.length < 6) {
      setError("Please enter a valid code")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code })
      });

      if (!res.ok) {
        const error = await res.json();
        console.log("Error response:", error);
        toast.error(error.message || "Verification failed");
        return
      }
      localStorage.setItem("registeredEmail", email);
      toast.success("Email verified successfully!");

      window.location.href = "/dashboard"
    } catch (err) {
      setError("Invalid verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendLoading(true)
    setError("")
    setResendSuccess(false)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const error = await res.json();
        console.log("Error response:", error);
        toast.error(error.message || "Registration failed");
        return
      }
      toast.success("Code resent successfully!");

      setResendSuccess(true)
    } catch (err) {
      setError("Failed to resend code. Please try again.")
    } finally {
      setResendLoading(false)
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
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Verify Your Email</h1>
          <p className="text-muted-foreground text-center text-sm mb-6">
            We've sent a verification code to
            <br />
            <span className="text-foreground font-medium">{email || "your email"}</span>
          </p>

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {resendSuccess && (
            <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-primary text-sm">Code resent successfully!</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Verification Code</label>
              <Input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-lg tracking-widest bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">Enter the 6-digit code from your email</p>
            </div>

            <Button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Didn't receive a code?</p>
            <Button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || resendCooldown > 0}
              variant="outline"
              className="w-full border-border hover:bg-secondary"
            >
              {resendCooldown > 0 ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Resend in {resendCooldown}s
                </>
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link href="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
