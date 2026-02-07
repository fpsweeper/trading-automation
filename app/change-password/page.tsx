"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { ShineBorder } from "@/components/ui/shine-border"
import GlowLine from "@/components/ui/glowline"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()
  const { checkAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword))
  }, [newPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setShowSuccess(false)

    if (!currentPassword) {
      setError("Current password is required")
      return
    }

    if (!newPassword || !confirmPassword) {
      setError("New password and confirmation are required")
      return
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match")
      return
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password")
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      let data = null

      if (!response.ok) {
        data = await response.json()
        setError(data.error || "Failed to change password")
        toast.error(data.error || "Failed to change password")
        return
      }

      data = await response.text()

      // Success
      setShowSuccess(true)
      toast.success(data)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      setTimeout(async () => {
        setShowSuccess(false)
        await logout()
        await checkAuth()
        router.push('/login')
      }, 1000)

    } catch (err) {
      console.error('Password change error:', err)
      setError("Failed to change password. Please try again.")
      toast.error("Failed to change password. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "text-red-500"
    if (passwordStrength <= 2) return "text-yellow-500"
    if (passwordStrength <= 3) return "text-yellow-600"
    if (passwordStrength === 4) return "text-lime-500"
    return "text-green-500"
  }

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 1) return "Weak"
    if (passwordStrength <= 2) return "Fair"
    if (passwordStrength <= 3) return "Good"
    if (passwordStrength === 4) return "Strong"
    return "Very Strong"
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Change Password</h1>
          <p className="text-muted-foreground">Update your account password to keep your account secure</p>
        </div>

        <div className="relative w-full mb-20">
          <GlowLine
            orientation="horizontal"
            position="50%"
            color="lightgreen"
          />
        </div>
        <Card className="
            relative overflow-hidden p-8
            bg-white/60 dark:bg-white/5
            backdrop-blur-xl
            border border-white/20 dark:border-white/10
            shadow-xl shadow-black/5 dark:shadow-black/30
            rounded-2xl
          ">
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">Password changed successfully!</p>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">Your password has been updated. Redirecting to profile...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-3">
              <Label htmlFor="current-password" className="text-foreground font-medium">
                Current Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-3">
              <Label htmlFor="new-password" className="text-foreground font-medium">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                  disabled={submitting}
                />
              </div>

              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Password Strength</span>
                    <span className={`text-xs font-medium ${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength ? getPasswordStrengthColor().replace("text-", "bg-") : "bg-secondary"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-secondary/30 rounded-lg p-3 space-y-1 text-xs text-muted-foreground">
                <p className="font-medium text-foreground text-xs mb-2">Password Requirements:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li className={newPassword.length >= 8 ? "text-green-600 dark:text-green-400" : ""}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? "text-green-600 dark:text-green-400" : ""}>
                    One uppercase letter
                  </li>
                  <li className={/[0-9]/.test(newPassword) ? "text-green-600 dark:text-green-400" : ""}>
                    One number
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600 dark:text-green-400" : ""}>
                    One special character
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-3">
              <Label htmlFor="confirm-password" className="text-foreground font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                  disabled={submitting}
                />
              </div>

              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}

              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-xs text-green-600 dark:text-green-400">Passwords match ✓</p>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Security Tip:</strong> Use a strong, unique password that you don't use on other websites. Consider using a password manager.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border bg-transparent"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
          <ShineBorder shineColor="#A3E635" borderWidth={3} />
        </Card>
      </main>
    </div>
  )
}