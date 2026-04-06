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
import { toast } from "sonner"
import GoogleLoginButton from "@/components/GoogleLoginButton"
import StrongPasswordInput from "@/components/ui/strongPassword"
import GlowLine from "@/components/ui/glowline"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { ShineBorder } from "@/components/ui/shine-border"
import { useLanguage } from "@/contexts/LanguageContext"

const t = {
  en: { title: "Create Account", subtitle: "Join the future of trading automation", email: "Email", confirmPassword: "Confirm Password", confirmPlaceholder: "••••••••", terms: "I agree to the", termsLink: "Terms of Service", and: "and", privacyLink: "Privacy Policy", submit: "Create Account", submitting: "Creating account...", hasAccount: "Already have an account?", signIn: "Sign in", success: "Account created successfully! Please verify your email.", error: "Failed to create account. Please try again.", passwordRequired: "Password is required", confirmRequired: "Please confirm your password", passwordMatch: "Passwords do not match", termsRequired: "You must accept the terms", redirecting: "Redirecting to email verification..." },
  fr: { title: "Créer un compte", subtitle: "Rejoignez l'avenir du trading automatisé", email: "Email", confirmPassword: "Confirmer le mot de passe", confirmPlaceholder: "••••••••", terms: "J'accepte les", termsLink: "Conditions d'utilisation", and: "et la", privacyLink: "Politique de confidentialité", submit: "Créer un compte", submitting: "Création en cours...", hasAccount: "Vous avez déjà un compte ?", signIn: "Se connecter", success: "Compte créé avec succès ! Veuillez vérifier votre email.", error: "Échec de la création du compte. Veuillez réessayer.", passwordRequired: "Le mot de passe est requis", confirmRequired: "Veuillez confirmer votre mot de passe", passwordMatch: "Les mots de passe ne correspondent pas", termsRequired: "Vous devez accepter les conditions", redirecting: "Redirection vers la vérification de l'email..." },
  es: { title: "Crear cuenta", subtitle: "Únete al futuro del trading automatizado", email: "Correo electrónico", confirmPassword: "Confirmar contraseña", confirmPlaceholder: "••••••••", terms: "Acepto los", termsLink: "Términos de servicio", and: "y la", privacyLink: "Política de privacidad", submit: "Crear cuenta", submitting: "Creando cuenta...", hasAccount: "¿Ya tienes una cuenta?", signIn: "Iniciar sesión", success: "¡Cuenta creada! Por favor verifica tu email.", error: "Error al crear la cuenta. Inténtalo de nuevo.", passwordRequired: "La contraseña es obligatoria", confirmRequired: "Por favor confirma tu contraseña", passwordMatch: "Las contraseñas no coinciden", termsRequired: "Debes aceptar los términos", redirecting: "Redirigiendo a la verificación de email..." },
  de: { title: "Konto erstellen", subtitle: "Treten Sie der Zukunft des automatisierten Handels bei", email: "E-Mail", confirmPassword: "Passwort bestätigen", confirmPlaceholder: "••••••••", terms: "Ich stimme den", termsLink: "Nutzungsbedingungen", and: "und der", privacyLink: "Datenschutzrichtlinie", submit: "Konto erstellen", submitting: "Konto wird erstellt...", hasAccount: "Haben Sie bereits ein Konto?", signIn: "Anmelden", success: "Konto erfolgreich erstellt! Bitte überprüfen Sie Ihre E-Mail.", error: "Konto konnte nicht erstellt werden. Bitte versuchen Sie es erneut.", passwordRequired: "Passwort ist erforderlich", confirmRequired: "Bitte bestätigen Sie Ihr Passwort", passwordMatch: "Passwörter stimmen nicht überein", termsRequired: "Sie müssen den Bedingungen zustimmen", redirecting: "Weiterleitung zur E-Mail-Verifizierung..." },
  ja: { title: "アカウント作成", subtitle: "自動取引の未来に参加しよう", email: "メールアドレス", confirmPassword: "パスワードの確認", confirmPlaceholder: "••••••••", terms: "同意します：", termsLink: "利用規約", and: "および", privacyLink: "プライバシーポリシー", submit: "アカウントを作成", submitting: "作成中...", hasAccount: "すでにアカウントをお持ちですか？", signIn: "サインイン", success: "アカウントが作成されました！メールを確認してください。", error: "アカウントの作成に失敗しました。もう一度お試しください。", passwordRequired: "パスワードは必須です", confirmRequired: "パスワードを確認してください", passwordMatch: "パスワードが一致しません", termsRequired: "利用規約に同意する必要があります", redirecting: "メール確認ページへリダイレクト中..." },
  pt: { title: "Criar conta", subtitle: "Junte-se ao futuro do trading automatizado", email: "E-mail", confirmPassword: "Confirmar senha", confirmPlaceholder: "••••••••", terms: "Concordo com os", termsLink: "Termos de Serviço", and: "e a", privacyLink: "Política de Privacidade", submit: "Criar conta", submitting: "Criando conta...", hasAccount: "Já tem uma conta?", signIn: "Entrar", success: "Conta criada com sucesso! Por favor, verifique seu e-mail.", error: "Falha ao criar conta. Por favor, tente novamente.", passwordRequired: "A senha é obrigatória", confirmRequired: "Por favor, confirme sua senha", passwordMatch: "As senhas não coincidem", termsRequired: "Você deve aceitar os termos", redirecting: "Redirecionando para verificação de e-mail..." },
  zh: { title: "创建账户", subtitle: "加入自动化交易的未来", email: "电子邮件", confirmPassword: "确认密码", confirmPlaceholder: "••••••••", terms: "我同意", termsLink: "服务条款", and: "和", privacyLink: "隐私政策", submit: "创建账户", submitting: "创建中...", hasAccount: "已有账户？", signIn: "登录", success: "账户创建成功！请验证您的电子邮件。", error: "创建账户失败，请重试。", passwordRequired: "密码是必填项", confirmRequired: "请确认您的密码", passwordMatch: "密码不匹配", termsRequired: "您必须接受条款", redirecting: "正在重定向到邮件验证..." },
}

type RegisterFormValues = {
  email: string; password: string; confirmPassword: string; termsAccepted: boolean
}

export default function RegisterPage() {
  const { language } = useLanguage()
  const tr = t[language as keyof typeof t] || t.en
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, watch, control, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>()
  const password = watch("password")

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
      if (!res.ok) { const error = await res.json(); toast.error(error.message || tr.error); return }
      localStorage.setItem("registeredEmail", data.email)
      toast.success(tr.success)
      setSuccess(true)
      window.location.href = `/verify-email?email=${encodeURIComponent(data.email)}`
    } catch { toast.error(tr.error) }
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <AnimatedGridPattern />
      <Card className="relative overflow-hidden p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl rounded-2xl">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Account Created!</h1>
        <p className="text-muted-foreground">{tr.redirecting}</p>
      </Card>
    </div>
  )

  return (
    <div className="h-fit flex items-center justify-center bg-background px-4 py-4">
      <AnimatedGridPattern />
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl rounded-2xl">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/10" />
          <h1 className="relative text-4xl font-bold text-center mb-2">{tr.title}</h1>
          <p className="relative text-muted-foreground text-center text-sm mb-6">{tr.subtitle}</p>
          <div className="relative w-full mb-6"><GlowLine orientation="horizontal" position="50%" color="lightgreen" /></div>
          <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4">
            <div className="space-y-2">
              <Label>{tr.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                <Input type="email" placeholder="your@email.com" className="pl-10 bg-white/70 dark:bg-white/5 backdrop-blur-md border-white/30 dark:border-white/10"
                  {...register("email", { required: "Email is required" })} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <Controller name="password" control={control}
              rules={{ required: tr.passwordRequired, validate: { length: v => v.length >= 8 || "At least 8 characters", number: v => /\d/.test(v) || "At least one number", lowercase: v => /[a-z]/.test(v) || "At least one lowercase letter", uppercase: v => /[A-Z]/.test(v) || "At least one uppercase letter", special: v => /[^A-Za-z0-9]/.test(v) || "At least one special character" } }}
              render={({ field }) => <StrongPasswordInput value={field.value} onChange={field.onChange} />} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            <div className="space-y-2">
              <Label>{tr.confirmPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                <Input type="password" placeholder={tr.confirmPlaceholder} className="pl-10 bg-white/70 dark:bg-white/5 backdrop-blur-md border-white/30 dark:border-white/10"
                  {...register("confirmPassword", { required: tr.confirmRequired, validate: value => value === password || tr.passwordMatch })} />
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" className="w-5 h-5 accent-primary" {...register("termsAccepted", { required: tr.termsRequired })} />
              <label className="text-sm text-muted-foreground">
                {tr.terms}{" "}<Link href="/terms-privacy" className="text-primary underline">{tr.termsLink}</Link>{" "}{tr.and}{" "}<Link href="/terms-privacy" className="text-primary underline">{tr.privacyLink}</Link>
              </label>
            </div>
            {errors.termsAccepted && <p className="text-xs text-destructive">{errors.termsAccepted.message}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? tr.submitting : tr.submit}
            </Button>
            <GoogleLoginButton mode="register" />
          </form>
          <div className="relative text-center text-sm mt-6">
            {tr.hasAccount}{" "}<Link href="/login" className="text-primary underline">{tr.signIn}</Link>
          </div>
          <ShineBorder shineColor="#A3E635" borderWidth={3} />
        </Card>
      </div>
    </div>
  )
}