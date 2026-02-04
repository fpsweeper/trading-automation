"use client"

import type React from "react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Mail, Lock, CheckCircle2 } from "lucide-react"
import { Meteors } from "@/components/ui/meteors"
import { BorderBeam } from "@/components/ui/border-beam"
import { toast } from "sonner"
import GoogleLoginButton from "@/components/GoogleLoginButton"
import StrongPasswordInput from "@/components/ui/strongPassword"
import GlowLine from "@/components/ui/glowline"
import { Globe } from "@/components/ui/globe"
import { DottedMap } from "@/components/ui/dotted-map"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { ShineBorder } from "@/components/ui/shine-border"

type RegisterFormValues = {
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

export default function RegisterPage() {
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>()


  const password = watch("password")

  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Registering user with data:", data)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      )

      if (!res.ok) {
        const error = await res.json()
        toast.error(error.message || "Registration failed")
        return
      }

      localStorage.setItem("registeredEmail", data.email)
      toast.success("Account created successfully! Please verify your email.")
      setSuccess(true)

      window.location.href = `/verify-email?email=${encodeURIComponent(
        data.email
      )}`
    } catch {
      toast.error("Failed to create account. Please try again.")
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <AnimatedGridPattern />
        <Card className="
            relative overflow-hidden p-8
            bg-white/60 dark:bg-white/5
            backdrop-blur-xl
            border border-white/20 dark:border-white/10
            shadow-xl shadow-black/5 dark:shadow-black/30
            rounded-2xl
          ">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Account Created!</h1>
          <p className="text-muted-foreground">
            Redirecting to email verification...
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-fit flex items-center justify-center bg-background px-4 py-4">
      <AnimatedGridPattern />

      <div className="w-full max-w-md">
        <Card
          className="
            relative overflow-hidden p-8
            bg-white/60 dark:bg-white/5
            backdrop-blur-xl
            border border-white/20 dark:border-white/10
            shadow-xl shadow-black/5 dark:shadow-black/30
            rounded-2xl
          "
        >
          {/* Glass highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/10" />

          <h1 className="relative text-4xl font-bold text-center mb-2">
            Create Account
          </h1>

          <p className="relative text-muted-foreground text-center text-sm mb-6">
            Join the future of trading automation
          </p>

          <div className="relative w-full mb-6">
            <GlowLine
              orientation="horizontal"
              position="50%"
              color="lightgreen"
            />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative space-y-4"
          >
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="
            pl-10
            bg-white/70 dark:bg-white/5
            backdrop-blur-md
            border-white/30 dark:border-white/10
          "
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                validate: {
                  length: v => v.length >= 8 || "At least 8 characters",
                  number: v => /\d/.test(v) || "At least one number",
                  lowercase: v => /[a-z]/.test(v) || "At least one lowercase letter",
                  uppercase: v => /[A-Z]/.test(v) || "At least one uppercase letter",
                  special: v =>
                    /[^A-Za-z0-9]/.test(v) || "At least one special character",
                },
              }}
              render={({ field }) => (
                <StrongPasswordInput
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="
            pl-10
            bg-white/70 dark:bg-white/5
            backdrop-blur-md
            border-white/30 dark:border-white/10
          "
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                className="w-5 h-5 accent-primary"
                {...register("termsAccepted", {
                  required: "You must accept the terms",
                })}
              />
              <label className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link href="/#disclaimer" className="text-primary underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/#disclaimer" className="text-primary underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {errors.termsAccepted && (
              <p className="text-xs text-destructive">
                {errors.termsAccepted.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>

            <GoogleLoginButton mode="register" />
          </form>

          <div className="relative text-center text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline">
              Sign in
            </Link>
          </div>

          <ShineBorder shineColor="#A3E635" borderWidth={3} />
        </Card>

      </div>
    </div>
  )
}
