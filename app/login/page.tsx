"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Mail, Lock } from "lucide-react"
import { toast } from "sonner"
import GoogleLoginButton from "@/components/GoogleLoginButton"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { ShineBorder } from "@/components/ui/shine-border"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"

const t = {
  en: { title: "Welcome Back", subtitle: "Sign in to your trading automation platform", email: "Email", password: "Password", remember: "Remember me", forgot: "Forgot password?", submit: "Sign in", submitting: "Signing in...", noAccount: "Don't have an account?", signUp: "Sign up", orWith: "Or continue with", terms: "By continuing, you agree to our", termsLink: "Terms of Service", and: "and", privacyLink: "Privacy Policy", error: "Failed to login. Please try again." },
  fr: { title: "Bon retour", subtitle: "Connectez-vous à votre plateforme de trading automatisé", email: "Email", password: "Mot de passe", remember: "Se souvenir de moi", forgot: "Mot de passe oublié ?", submit: "Se connecter", submitting: "Connexion...", noAccount: "Pas encore de compte ?", signUp: "S'inscrire", orWith: "Ou continuer avec", terms: "En continuant, vous acceptez nos", termsLink: "Conditions d'utilisation", and: "et", privacyLink: "Politique de confidentialité", error: "Échec de la connexion. Veuillez réessayer." },
  es: { title: "Bienvenido de vuelta", subtitle: "Inicia sesión en tu plataforma de trading automatizado", email: "Correo electrónico", password: "Contraseña", remember: "Recuérdame", forgot: "¿Olvidaste tu contraseña?", submit: "Iniciar sesión", submitting: "Iniciando sesión...", noAccount: "¿No tienes cuenta?", signUp: "Regístrate", orWith: "O continuar con", terms: "Al continuar, aceptas nuestros", termsLink: "Términos de servicio", and: "y", privacyLink: "Política de privacidad", error: "Error al iniciar sesión." },
  de: { title: "Willkommen zurück", subtitle: "Melden Sie sich bei Ihrer Trading-Plattform an", email: "E-Mail", password: "Passwort", remember: "Angemeldet bleiben", forgot: "Passwort vergessen?", submit: "Anmelden", submitting: "Anmelden...", noAccount: "Noch kein Konto?", signUp: "Registrieren", orWith: "Oder weiter mit", terms: "Mit dem Fortfahren stimmen Sie unseren", termsLink: "Nutzungsbedingungen", and: "und", privacyLink: "Datenschutzrichtlinie", error: "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut." },
  ja: { title: "おかえりなさい", subtitle: "取引自動化プラットフォームにサインイン", email: "メールアドレス", password: "パスワード", remember: "ログイン状態を保持", forgot: "パスワードをお忘れですか？", submit: "サインイン", submitting: "サインイン中...", noAccount: "アカウントをお持ちでないですか？", signUp: "登録", orWith: "または続行", terms: "続行することで、", termsLink: "利用規約", and: "および", privacyLink: "プライバシーポリシー", error: "ログインに失敗しました。もう一度お試しください。" },
  pt: { title: "Bem-vindo de volta", subtitle: "Entre na sua plataforma de trading automatizado", email: "E-mail", password: "Senha", remember: "Lembrar de mim", forgot: "Esqueceu a senha?", submit: "Entrar", submitting: "Entrando...", noAccount: "Não tem uma conta?", signUp: "Cadastre-se", orWith: "Ou continue com", terms: "Ao continuar, você concorda com nossos", termsLink: "Termos de Serviço", and: "e", privacyLink: "Política de Privacidade", error: "Falha ao fazer login. Por favor, tente novamente." },
  zh: { title: "欢迎回来", subtitle: "登录您的自动交易平台", email: "电子邮件", password: "密码", remember: "记住我", forgot: "忘记密码？", submit: "登录", submitting: "登录中...", noAccount: "还没有账户？", signUp: "注册", orWith: "或继续使用", terms: "继续即表示您同意我们的", termsLink: "服务条款", and: "和", privacyLink: "隐私政策", error: "登录失败，请重试。" },
}

export default function LoginPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const { language } = useLanguage()
  const tr = t[language as keyof typeof t] || t.en
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { checkAuth } = useAuth()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }), credentials: "include" })
      if (!res.ok) { const data = await res.json(); toast.error(data.error || tr.error); return }
      const { token } = await res.json()
      localStorage.setItem("auth_token", token)
      toast.success("Login successful!")
      await checkAuth()
      router.push("/dashboard")
    } catch { setError(tr.error) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <AnimatedGridPattern />
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl rounded-2xl">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-center">{tr.title}</h1>
          <p className="text-muted-foreground text-center text-sm mb-6">{tr.subtitle}</p>
          {error && <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"><p className="text-destructive text-sm">{error}</p></div>}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">{tr.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">{tr.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground" required />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-input border-border accent-primary" />
                <span className="text-sm text-muted-foreground">{tr.remember}</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">{tr.forgot}</Link>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? tr.submitting : tr.submit}
            </Button>
          </form>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-card text-muted-foreground">{tr.orWith}</span></div>
          </div>
          <div className="space-y-3 mb-6"><GoogleLoginButton mode="login" /></div>
          <div className="text-center text-muted-foreground text-sm">
            {tr.noAccount}{" "}<Link href="/register" className="relative z-10 text-primary hover:underline font-medium">{tr.signUp}</Link>
          </div>
          <ShineBorder shineColor="#A3E635" borderWidth={3} />
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-6">
          {tr.terms}{" "}<Link href="/terms-privacy" className="text-primary hover:underline">{tr.termsLink}</Link>{" "}{tr.and}{" "}<Link href="/terms-privacy" className="text-primary hover:underline">{tr.privacyLink}</Link>
        </p>
      </div>
    </div>
  )
}