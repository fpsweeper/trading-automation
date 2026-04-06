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
import { useLanguage } from "@/contexts/LanguageContext"

const t = {
  en: { title: "Reset Password", subtitle: "Enter your email and we'll send you a code to reset your password", email: "Email Address", submit: "Send Reset Code", submitting: "Sending...", backToLogin: "Back to Login", checkTitle: "Check Your Email", checkMsg: "We've sent a 6-digit reset code to", checkSub: "The code will expire in 1 hour. If you don't see the email, check your spam folder.", enterCode: "Enter Reset Code", error: "Failed to send reset email. Please try again." },
  fr: { title: "Réinitialiser le mot de passe", subtitle: "Entrez votre email et nous vous enverrons un code pour réinitialiser votre mot de passe", email: "Adresse email", submit: "Envoyer le code", submitting: "Envoi...", backToLogin: "Retour à la connexion", checkTitle: "Vérifiez votre email", checkMsg: "Nous avons envoyé un code à 6 chiffres à", checkSub: "Le code expire dans 1 heure. Si vous ne voyez pas l'email, vérifiez vos spams.", enterCode: "Entrer le code", error: "Échec de l'envoi. Veuillez réessayer." },
  es: { title: "Restablecer contraseña", subtitle: "Ingresa tu email y te enviaremos un código para restablecer tu contraseña", email: "Dirección de correo", submit: "Enviar código", submitting: "Enviando...", backToLogin: "Volver al inicio de sesión", checkTitle: "Revisa tu correo", checkMsg: "Enviamos un código de 6 dígitos a", checkSub: "El código expira en 1 hora. Si no ves el email, revisa tu carpeta de spam.", enterCode: "Ingresar código", error: "Error al enviar el email. Inténtalo de nuevo." },
  de: { title: "Passwort zurücksetzen", subtitle: "Geben Sie Ihre E-Mail ein und wir senden Ihnen einen Code zum Zurücksetzen", email: "E-Mail-Adresse", submit: "Code senden", submitting: "Senden...", backToLogin: "Zurück zur Anmeldung", checkTitle: "Überprüfen Sie Ihre E-Mail", checkMsg: "Wir haben einen 6-stelligen Code gesendet an", checkSub: "Der Code läuft in 1 Stunde ab. Wenn Sie die E-Mail nicht sehen, überprüfen Sie Ihren Spam-Ordner.", enterCode: "Code eingeben", error: "Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut." },
  ja: { title: "パスワードのリセット", subtitle: "メールアドレスを入力してください。リセットコードをお送りします", email: "メールアドレス", submit: "リセットコードを送信", submitting: "送信中...", backToLogin: "ログインに戻る", checkTitle: "メールを確認してください", checkMsg: "6桁のリセットコードを送信しました：", checkSub: "コードは1時間後に期限切れになります。メールが見つからない場合は迷惑メールをご確認ください。", enterCode: "コードを入力", error: "メールの送信に失敗しました。もう一度お試しください。" },
  pt: { title: "Redefinir senha", subtitle: "Insira seu e-mail e enviaremos um código para redefinir sua senha", email: "Endereço de e-mail", submit: "Enviar código", submitting: "Enviando...", backToLogin: "Voltar ao login", checkTitle: "Verifique seu e-mail", checkMsg: "Enviamos um código de 6 dígitos para", checkSub: "O código expira em 1 hora. Se não encontrar o e-mail, verifique sua pasta de spam.", enterCode: "Inserir código", error: "Falha ao enviar e-mail. Por favor, tente novamente." },
  zh: { title: "重置密码", subtitle: "输入您的电子邮件，我们将向您发送重置密码的验证码", email: "电子邮件地址", submit: "发送重置码", submitting: "发送中...", backToLogin: "返回登录", checkTitle: "检查您的电子邮件", checkMsg: "我们已向以下地址发送了6位重置码：", checkSub: "验证码将在1小时后过期。如果您没有看到邮件，请检查您的垃圾邮件文件夹。", enterCode: "输入验证码", error: "发送重置邮件失败，请重试。" },
}

export default function ForgotPasswordPage() {
  const { language } = useLanguage()
  const tr = t[language as keyof typeof t] || t.en
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    try {
      const response = await fetch("/api/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      const data = await response.json()
      if (!response.ok) { setError(data.error || tr.error); toast.error(data.error || tr.error); return }
      toast.success(tr.checkTitle); setSubmitted(true)
    } catch { setError(tr.error); toast.error(tr.error) } finally { setLoading(false) }
  }

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="p-8 border border-border text-center">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">{tr.checkTitle}</h1>
          <p className="text-muted-foreground mb-6">{tr.checkMsg} <span className="font-medium">{email}</span></p>
          <p className="text-sm text-muted-foreground mb-6">{tr.checkSub}</p>
          <Link href="/reset-password"><Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3">{tr.enterCode}</Button></Link>
          <Link href="/login"><Button variant="outline" className="w-full">{tr.backToLogin}</Button></Link>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="h-fit flex items-center justify-center bg-background px-4 py-4">
      <div className="w-full max-w-md">
        <div className="w-full flex justify-center items-center py-10 text-4xl font-bold">
          <img src="/icon.svg" alt="" />HARVEST3
        </div>
        <Card className="relative overflow-hidden p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl rounded-2xl">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-center">{tr.title}</h1>
          <div className="relative w-full mb-6"><GlowLine orientation="horizontal" position="50%" color="lightgreen" /></div>
          <p className="text-muted-foreground text-center text-sm mb-6">{tr.subtitle}</p>
          {error && <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"><p className="text-destructive text-sm">{error}</p></div>}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">{tr.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground" required disabled={loading} />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? tr.submitting : tr.submit}
            </Button>
          </form>
          <Link href="/login" className="flex items-center justify-center gap-2 text-primary hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />{tr.backToLogin}
          </Link>
          <ShineBorder shineColor="#A3E635" borderWidth={3} />
        </Card>
      </div>
    </div>
  )
}