"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Lock, ArrowLeft, CheckCircle2, Hash } from "lucide-react"
import { toast } from "sonner"

export default function ResetPasswordPage() {
    const router = useRouter()
    const [code, setCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
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

    const handlePasswordChange = (value: string) => {
        setNewPassword(value)
        setPasswordStrength(calculatePasswordStrength(value))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!code) {
            setError("Reset code is required")
            return
        }

        if (code.length !== 6) {
            setError("Reset code must be 6 characters")
            return
        }

        if (!newPassword || !confirmPassword) {
            setError("Password fields are required")
            return
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code.toUpperCase(),
                    newPassword,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Failed to reset password")
                toast.error(data.error || "Failed to reset password")
                return
            }

            toast.success("Password reset successfully!")
            setSuccess(true)

            setTimeout(() => {
                router.push('/login')
            }, 2000)

        } catch (err) {
            console.error('Reset password error:', err)
            setError("Failed to reset password. Please try again.")
            toast.error("Failed to reset password. Please try again.")
        } finally {
            setLoading(false)
        }
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

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">H3</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">Harvest 3</span>
                        </Link>
                    </div>

                    <Card className="p-8 border border-border text-center">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground mb-2">Password Reset!</h1>
                        <p className="text-muted-foreground mb-6">
                            Your password has been successfully reset. You can now log in with your new password.
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                            Redirecting to login page...
                        </p>
                    </Card>
                </div>
            </div>
        )
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
                    <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Enter Reset Code</h1>
                    <p className="text-muted-foreground text-center text-sm mb-6">
                        Enter the 6-digit code we sent to your email and choose a new password
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-destructive text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        {/* Reset Code */}
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-foreground">
                                Reset Code
                            </Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground uppercase tracking-widest text-center text-lg font-mono"
                                    maxLength={6}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-foreground">
                                New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="new-password"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                                    required
                                    disabled={loading}
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
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-foreground">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-destructive">Passwords do not match</p>
                            )}

                            {confirmPassword && newPassword === confirmPassword && (
                                <p className="text-xs text-green-600 dark:text-green-400">Passwords match ✓</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !code || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>

                    <div className="space-y-2 text-center text-sm">
                        <Link href="/forgot-password" className="block text-primary hover:underline">
                            Didn't receive a code? Send again
                        </Link>
                        <Link href="/login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}