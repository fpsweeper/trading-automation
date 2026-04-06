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
import GlowLine from "@/components/ui/glowline"
import { ShineBorder } from "@/components/ui/shine-border"
import { useLanguage } from "@/contexts/LanguageContext"

const t = {
    en: { title: "Enter Reset Code", subtitle: "Enter the 6-digit code we sent to your email and choose a new password", code: "Reset Code", codePlaceholder: "Enter 6-digit code", newPassword: "New Password", newPlaceholder: "Enter new password", confirmPassword: "Confirm Password", confirmPlaceholder: "Confirm new password", submit: "Reset Password", submitting: "Resetting...", resend: "Didn't receive a code? Send again", backToLogin: "Back to Login", successTitle: "Password Reset!", successMsg: "Your password has been successfully reset. You can now log in with your new password.", redirecting: "Redirecting to login page...", strength: "Password Strength", match: "Passwords match ✓", noMatch: "Passwords do not match", error: "Failed to reset password. Please try again." },
    fr: { title: "Entrer le code", subtitle: "Entrez le code à 6 chiffres envoyé à votre email et choisissez un nouveau mot de passe", code: "Code de réinitialisation", codePlaceholder: "Entrer le code à 6 chiffres", newPassword: "Nouveau mot de passe", newPlaceholder: "Entrer le nouveau mot de passe", confirmPassword: "Confirmer le mot de passe", confirmPlaceholder: "Confirmer le nouveau mot de passe", submit: "Réinitialiser", submitting: "Réinitialisation...", resend: "Vous n'avez pas reçu de code ? Renvoyer", backToLogin: "Retour à la connexion", successTitle: "Mot de passe réinitialisé !", successMsg: "Votre mot de passe a été réinitialisé avec succès.", redirecting: "Redirection vers la page de connexion...", strength: "Force du mot de passe", match: "Les mots de passe correspondent ✓", noMatch: "Les mots de passe ne correspondent pas", error: "Échec de la réinitialisation. Veuillez réessayer." },
    es: { title: "Ingresar código", subtitle: "Ingresa el código de 6 dígitos que te enviamos y elige una nueva contraseña", code: "Código de restablecimiento", codePlaceholder: "Ingresar código de 6 dígitos", newPassword: "Nueva contraseña", newPlaceholder: "Ingresar nueva contraseña", confirmPassword: "Confirmar contraseña", confirmPlaceholder: "Confirmar nueva contraseña", submit: "Restablecer contraseña", submitting: "Restableciendo...", resend: "¿No recibiste el código? Reenviar", backToLogin: "Volver al inicio de sesión", successTitle: "¡Contraseña restablecida!", successMsg: "Tu contraseña ha sido restablecida con éxito.", redirecting: "Redirigiendo a la página de inicio de sesión...", strength: "Seguridad de la contraseña", match: "Las contraseñas coinciden ✓", noMatch: "Las contraseñas no coinciden", error: "Error al restablecer la contraseña. Inténtalo de nuevo." },
    de: { title: "Code eingeben", subtitle: "Geben Sie den 6-stelligen Code ein und wählen Sie ein neues Passwort", code: "Reset-Code", codePlaceholder: "6-stelligen Code eingeben", newPassword: "Neues Passwort", newPlaceholder: "Neues Passwort eingeben", confirmPassword: "Passwort bestätigen", confirmPlaceholder: "Neues Passwort bestätigen", submit: "Passwort zurücksetzen", submitting: "Zurücksetzen...", resend: "Keinen Code erhalten? Erneut senden", backToLogin: "Zurück zur Anmeldung", successTitle: "Passwort zurückgesetzt!", successMsg: "Ihr Passwort wurde erfolgreich zurückgesetzt.", redirecting: "Weiterleitung zur Anmeldeseite...", strength: "Passwort-Stärke", match: "Passwörter stimmen überein ✓", noMatch: "Passwörter stimmen nicht überein", error: "Fehler beim Zurücksetzen. Bitte versuchen Sie es erneut." },
    ja: { title: "リセットコードを入力", subtitle: "メールに送信された6桁のコードと新しいパスワードを入力してください", code: "リセットコード", codePlaceholder: "6桁のコードを入力", newPassword: "新しいパスワード", newPlaceholder: "新しいパスワードを入力", confirmPassword: "パスワードの確認", confirmPlaceholder: "新しいパスワードを確認", submit: "パスワードをリセット", submitting: "リセット中...", resend: "コードを受け取れませんでしたか？再送信", backToLogin: "ログインに戻る", successTitle: "パスワードリセット完了！", successMsg: "パスワードが正常にリセットされました。", redirecting: "ログインページにリダイレクト中...", strength: "パスワード強度", match: "パスワードが一致しています ✓", noMatch: "パスワードが一致しません", error: "リセットに失敗しました。もう一度お試しください。" },
    pt: { title: "Inserir código", subtitle: "Digite o código de 6 dígitos que enviamos ao seu e-mail e escolha uma nova senha", code: "Código de redefinição", codePlaceholder: "Inserir código de 6 dígitos", newPassword: "Nova senha", newPlaceholder: "Inserir nova senha", confirmPassword: "Confirmar senha", confirmPlaceholder: "Confirmar nova senha", submit: "Redefinir senha", submitting: "Redefinindo...", resend: "Não recebeu um código? Reenviar", backToLogin: "Voltar ao login", successTitle: "Senha redefinida!", successMsg: "Sua senha foi redefinida com sucesso.", redirecting: "Redirecionando para a página de login...", strength: "Força da senha", match: "As senhas coincidem ✓", noMatch: "As senhas não coincidem", error: "Falha ao redefinir a senha. Por favor, tente novamente." },
    zh: { title: "输入重置码", subtitle: "输入我们发送到您邮箱的6位验证码，并选择新密码", code: "重置码", codePlaceholder: "输入6位验证码", newPassword: "新密码", newPlaceholder: "输入新密码", confirmPassword: "确认密码", confirmPlaceholder: "确认新密码", submit: "重置密码", submitting: "重置中...", resend: "没有收到验证码？重新发送", backToLogin: "返回登录", successTitle: "密码已重置！", successMsg: "您的密码已成功重置。", redirecting: "正在重定向到登录页面...", strength: "密码强度", match: "密码匹配 ✓", noMatch: "密码不匹配", error: "重置密码失败，请重试。" },
}

export default function ResetPasswordPage() {
    const router = useRouter()
    const { language } = useLanguage()
    const tr = t[language as keyof typeof t] || t.en
    const [code, setCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    const calcStrength = (p: string) => {
        let s = 0
        if (p.length >= 8) s++; if (p.length >= 12) s++
        if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++
        return s
    }

    const strengthColor = () => {
        if (passwordStrength <= 1) return "text-red-500"
        if (passwordStrength <= 2) return "text-yellow-500"
        if (passwordStrength <= 3) return "text-yellow-600"
        if (passwordStrength === 4) return "text-lime-500"
        return "text-green-500"
    }

    const strengthLabels: Record<string, string[]> = {
        en: ["Weak", "Fair", "Good", "Strong", "Very Strong"],
        fr: ["Faible", "Correct", "Bon", "Fort", "Très fort"],
        es: ["Débil", "Regular", "Buena", "Fuerte", "Muy fuerte"],
        de: ["Schwach", "Mäßig", "Gut", "Stark", "Sehr stark"],
        ja: ["弱い", "普通", "良い", "強い", "非常に強い"],
        pt: ["Fraca", "Regular", "Boa", "Forte", "Muito forte"],
        zh: ["弱", "一般", "良好", "强", "非常强"],
    }
    const strengthLabel = () => {
        const labels = strengthLabels[language] || strengthLabels.en
        return labels[Math.min(passwordStrength, 4)]
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError("")
        if (!code || code.length !== 6) { setError("Reset code must be 6 characters"); return }
        if (!newPassword || !confirmPassword) { setError("Password fields are required"); return }
        if (newPassword.length < 8) { setError("Password must be at least 8 characters"); return }
        if (newPassword !== confirmPassword) { setError(tr.noMatch); return }
        setLoading(true)
        try {
            const response = await fetch("/api/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: code.toUpperCase(), newPassword }) })
            const data = await response.json()
            if (!response.ok) { setError(data.error || tr.error); toast.error(data.error || tr.error); return }
            toast.success(tr.successTitle); setSuccess(true)
            setTimeout(() => router.push("/login"), 2000)
        } catch { setError(tr.error); toast.error(tr.error) } finally { setLoading(false) }
    }

    if (success) return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <Card className="p-8 border border-border text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">{tr.successTitle}</h1>
                    <p className="text-muted-foreground mb-6">{tr.successMsg}</p>
                    <p className="text-sm text-muted-foreground">{tr.redirecting}</p>
                </Card>
            </div>
        </div>
    )

    return (
        <div className="h-fit flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="w-full flex justify-center items-center py-10 text-4xl font-bold">
                    <img src="/icon.svg" alt="" />HARVEST3
                </div>
                <Card className="relative overflow-hidden p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl rounded-2xl">
                    <h1 className="text-2xl font-bold text-foreground mb-2 text-center">{tr.title}</h1>
                    <div className="relative w-full mb-6"><GlowLine orientation="horizontal" position="50%" color="lightgreen" /></div>
                    <p className="text-muted-foreground text-center text-sm mb-6">{tr.subtitle}</p>
                    {error && <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"><p className="text-destructive text-sm">{error}</p></div>}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-foreground">{tr.code}</Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                                <Input id="code" type="text" placeholder={tr.codePlaceholder} value={code} onChange={e => setCode(e.target.value.toUpperCase())} className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground uppercase tracking-widest text-center text-lg font-mono" maxLength={6} required disabled={loading} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-foreground">{tr.newPassword}</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                                <Input id="new-password" type="password" placeholder={tr.newPlaceholder} value={newPassword} onChange={e => { setNewPassword(e.target.value); setPasswordStrength(calcStrength(e.target.value)) }} className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground" required disabled={loading} />
                            </div>
                            {newPassword && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">{tr.strength}</span>
                                        <span className={`text-xs font-medium ${strengthColor()}`}>{strengthLabel()}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength ? strengthColor().replace("text-", "bg-") : "bg-secondary"}`} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-foreground">{tr.confirmPassword}</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                                <Input id="confirm-password" type="password" placeholder={tr.confirmPlaceholder} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground" required disabled={loading} />
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && <p className="text-xs text-destructive">{tr.noMatch}</p>}
                            {confirmPassword && newPassword === confirmPassword && <p className="text-xs text-green-600 dark:text-green-400">{tr.match}</p>}
                        </div>
                        <Button type="submit" disabled={loading || !code || !newPassword || !confirmPassword || newPassword !== confirmPassword} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            {loading ? tr.submitting : tr.submit}
                        </Button>
                    </form>
                    <div className="space-y-2 text-center text-sm">
                        <Link href="/forgot-password" className="block text-primary hover:underline">{tr.resend}</Link>
                        <Link href="/login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4" />{tr.backToLogin}
                        </Link>
                    </div>
                    <ShineBorder shineColor="#A3E635" borderWidth={3} />
                </Card>
            </div>
        </div>
    )
}