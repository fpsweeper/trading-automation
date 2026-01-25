"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    const auth = localStorage.getItem("harvest3_auth")
    if (!auth) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)
    setLoading(false)
  }, [router])

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, validate current password and update password
      if (currentPassword === "admin") {
        setShowSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
      } else {
        setError("Current password is incorrect")
      }
    } catch (err) {
      setError("Failed to change password. Please try again.")
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-primary" />
            <span className="font-medium">Back to Profile</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H3</span>
            </div>
            <span className="font-bold hidden sm:inline">Harvest 3</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Change Password</h1>
          <p className="text-muted-foreground">Update your account password to keep your account secure</p>
        </div>

        <Card className="p-8 border border-border max-w-2xl">
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-700">Password changed successfully!</p>
                <p className="text-sm text-green-600 mt-1">Your password has been updated. Please use your new password for future logins.</p>
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
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">For demo: use "admin"</p>
            </div>

            {/* New Password */}
            <div className="space-y-3">
              <Label htmlFor="new-password" className="text-foreground font-medium">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
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
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength ? getPasswordStrengthColor().replace("text-", "bg-") : "bg-secondary"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-secondary/30 rounded-lg p-3 space-y-1 text-xs text-muted-foreground">
                <p className="font-medium text-foreground text-xs mb-2">Password Requirements:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li className={newPassword.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>One uppercase letter</li>
                  <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>One number</li>
                  <li className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""}>One special character</li>
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-3">
              <Label htmlFor="confirm-password" className="text-foreground font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}

              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-xs text-green-600">Passwords match</p>
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !currentPassword || !newPassword || !confirmPassword}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>

          {/* Additional Security Options */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="font-bold text-foreground mb-4">Additional Security Options</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground text-sm">Active Sessions</p>
                  <p className="text-xs text-muted-foreground mt-1">Manage devices logged into your account</p>
                </div>
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  View
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
