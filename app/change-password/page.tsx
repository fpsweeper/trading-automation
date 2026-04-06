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
import { useLanguage } from "@/contexts/LanguageContext"
import { ShineBorder } from "@/components/ui/shine-border"
import GlowLine from "@/components/ui/glowline"

const t = {
  en: { title: "Change Password", subtitle: "Update your account password to keep your account secure", current: "Current Password", currentPlaceholder: "Enter your current password", new: "New Password", newPlaceholder: "Enter your new password", confirm: "Confirm New Password", confirmPlaceholder: "Confirm your new password", strength: "Password Strength", requirements: "Password Requirements", req1: "At least 8 characters", req2: "One uppercase letter", req3: "One number", req4: "One special character", tip: "Use a strong, unique password that you don't use on other websites. Consider using a password manager.", cancel: "Cancel", submit: "Update Password", submitting: "Updating...", successTitle: "Password changed successfully!", successMsg: "Your password has been updated. Redirecting to profile...", noMatch: "Passwords do not match", match: "Passwords match ✓", strengthLabels: ["Weak", "Fair", "Good", "Strong", "Very Strong"] },
  fr: { title: "Changer le mot de passe", subtitle: "Mettez à jour votre mot de passe pour sécuriser votre compte", current: "Mot de passe actuel", currentPlaceholder: "Entrez votre mot de passe actuel", new: "Nouveau mot de passe", newPlaceholder: "Entrez votre nouveau mot de passe", confirm: "Confirmer le nouveau mot de passe", confirmPlaceholder: "Confirmez votre nouveau mot de passe", strength: "Force du mot de passe", requirements: "Exigences du mot de passe", req1: "Au moins 8 caractères", req2: "Une lettre majuscule", req3: "Un chiffre", req4: "Un caractère spécial", tip: "Utilisez un mot de passe fort et unique. Envisagez d'utiliser un gestionnaire de mots de passe.", cancel: "Annuler", submit: "Mettre à jour", submitting: "Mise à jour...", successTitle: "Mot de passe changé avec succès !", successMsg: "Votre mot de passe a été mis à jour.", noMatch: "Les mots de passe ne correspondent pas", match: "Les mots de passe correspondent ✓", strengthLabels: ["Faible", "Correct", "Bon", "Fort", "Très fort"] },
  es: { title: "Cambiar contraseña", subtitle: "Actualiza tu contraseña para mantener tu cuenta segura", current: "Contraseña actual", currentPlaceholder: "Ingresa tu contraseña actual", new: "Nueva contraseña", newPlaceholder: "Ingresa tu nueva contraseña", confirm: "Confirmar nueva contraseña", confirmPlaceholder: "Confirma tu nueva contraseña", strength: "Seguridad de la contraseña", requirements: "Requisitos de contraseña", req1: "Al menos 8 caracteres", req2: "Una letra mayúscula", req3: "Un número", req4: "Un carácter especial", tip: "Usa una contraseña fuerte y única. Considera usar un gestor de contraseñas.", cancel: "Cancelar", submit: "Actualizar contraseña", submitting: "Actualizando...", successTitle: "¡Contraseña cambiada con éxito!", successMsg: "Tu contraseña ha sido actualizada.", noMatch: "Las contraseñas no coinciden", match: "Las contraseñas coinciden ✓", strengthLabels: ["Débil", "Regular", "Buena", "Fuerte", "Muy fuerte"] },
  de: { title: "Passwort ändern", subtitle: "Aktualisieren Sie Ihr Passwort, um Ihr Konto zu sichern", current: "Aktuelles Passwort", currentPlaceholder: "Aktuelles Passwort eingeben", new: "Neues Passwort", newPlaceholder: "Neues Passwort eingeben", confirm: "Neues Passwort bestätigen", confirmPlaceholder: "Neues Passwort bestätigen", strength: "Passwort-Stärke", requirements: "Passwort-Anforderungen", req1: "Mindestens 8 Zeichen", req2: "Ein Großbuchstabe", req3: "Eine Zahl", req4: "Ein Sonderzeichen", tip: "Verwenden Sie ein starkes, einzigartiges Passwort. Erwägen Sie die Verwendung eines Passwort-Managers.", cancel: "Abbrechen", submit: "Passwort aktualisieren", submitting: "Aktualisieren...", successTitle: "Passwort erfolgreich geändert!", successMsg: "Ihr Passwort wurde aktualisiert.", noMatch: "Passwörter stimmen nicht überein", match: "Passwörter stimmen überein ✓", strengthLabels: ["Schwach", "Mäßig", "Gut", "Stark", "Sehr stark"] },
  ja: { title: "パスワードの変更", subtitle: "アカウントのセキュリティを保つためにパスワードを更新してください", current: "現在のパスワード", currentPlaceholder: "現在のパスワードを入力", new: "新しいパスワード", newPlaceholder: "新しいパスワードを入力", confirm: "新しいパスワードの確認", confirmPlaceholder: "新しいパスワードを確認", strength: "パスワード強度", requirements: "パスワード要件", req1: "8文字以上", req2: "大文字1文字以上", req3: "数字1文字以上", req4: "特殊文字1文字以上", tip: "他のサイトで使用しない強力で固有のパスワードを使用してください。パスワードマネージャーの使用をお勧めします。", cancel: "キャンセル", submit: "パスワードを更新", submitting: "更新中...", successTitle: "パスワードが変更されました！", successMsg: "パスワードが更新されました。", noMatch: "パスワードが一致しません", match: "パスワードが一致しています ✓", strengthLabels: ["弱い", "普通", "良い", "強い", "非常に強い"] },
  pt: { title: "Alterar senha", subtitle: "Atualize sua senha para manter sua conta segura", current: "Senha atual", currentPlaceholder: "Digite sua senha atual", new: "Nova senha", newPlaceholder: "Digite sua nova senha", confirm: "Confirmar nova senha", confirmPlaceholder: "Confirme sua nova senha", strength: "Força da senha", requirements: "Requisitos de senha", req1: "Pelo menos 8 caracteres", req2: "Uma letra maiúscula", req3: "Um número", req4: "Um caractere especial", tip: "Use uma senha forte e única. Considere usar um gerenciador de senhas.", cancel: "Cancelar", submit: "Atualizar senha", submitting: "Atualizando...", successTitle: "Senha alterada com sucesso!", successMsg: "Sua senha foi atualizada.", noMatch: "As senhas não coincidem", match: "As senhas coincidem ✓", strengthLabels: ["Fraca", "Regular", "Boa", "Forte", "Muito forte"] },
  zh: { title: "更改密码", subtitle: "更新您的账户密码以保持账户安全", current: "当前密码", currentPlaceholder: "输入当前密码", new: "新密码", newPlaceholder: "输入新密码", confirm: "确认新密码", confirmPlaceholder: "确认新密码", strength: "密码强度", requirements: "密码要求", req1: "至少8个字符", req2: "一个大写字母", req3: "一个数字", req4: "一个特殊字符", tip: "使用其他网站未使用的强密码。建议使用密码管理器。", cancel: "取消", submit: "更新密码", submitting: "更新中...", successTitle: "密码更改成功！", successMsg: "您的密码已更新。", noMatch: "密码不匹配", match: "密码匹配 ✓", strengthLabels: ["弱", "一般", "良好", "强", "非常强"] },
}

export default function ChangePasswordPage() {
  const router = useRouter()
  const { isAuthenticated, logout, checkAuth } = useAuth()
  const { language } = useLanguage()
  const tr = t[language as keyof typeof t] || t.en

  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calcStrength = (p: string) => {
    let s = 0
    if (p.length >= 8) s++; if (p.length >= 12) s++
    if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }

  useEffect(() => { setPasswordStrength(calcStrength(newPassword)) }, [newPassword])

  const strengthColor = () => {
    if (passwordStrength <= 1) return "text-red-500"
    if (passwordStrength <= 2) return "text-yellow-500"
    if (passwordStrength <= 3) return "text-yellow-600"
    if (passwordStrength === 4) return "text-lime-500"
    return "text-green-500"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setShowSuccess(false)
    if (!currentPassword) { setError("Current password is required"); return }
    if (!newPassword || !confirmPassword) { setError("New password and confirmation are required"); return }
    if (newPassword.length < 8) { setError("New password must be at least 8 characters long"); return }
    if (newPassword !== confirmPassword) { setError(tr.noMatch); return }
    if (currentPassword === newPassword) { setError("New password must be different from current password"); return }
    setSubmitting(true)
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/change-password`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ currentPassword, newPassword }) })
      if (!response.ok) { const data = await response.json(); setError(data.error || "Failed to change password"); toast.error(data.error || "Failed to change password"); return }
      const data = await response.text()
      setShowSuccess(true); toast.success(data)
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
      setTimeout(async () => { setShowSuccess(false); await logout(); await checkAuth(); router.push("/login") }, 1000)
    } catch { setError("Failed to change password. Please try again."); toast.error("Failed to change password.") } finally { setSubmitting(false) }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{tr.title}</h1>
          <p className="text-muted-foreground">{tr.subtitle}</p>
        </div>
        <div className="relative w-full mb-20"><GlowLine orientation="horizontal" position="50%" color="lightgreen" /></div>
        <Card className="relative overflow-hidden p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl rounded-2xl">
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">{tr.successTitle}</p>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">{tr.successMsg}</p>
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
            <div className="space-y-3">
              <Label htmlFor="current-password" className="text-foreground font-medium">{tr.current}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input id="current-password" type="password" placeholder={tr.currentPlaceholder} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground" required disabled={submitting} />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="new-password" className="text-foreground font-medium">{tr.new}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input id="new-password" type="password" placeholder={tr.newPlaceholder} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground" required disabled={submitting} />
              </div>
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{tr.strength}</span>
                    <span className={`text-xs font-medium ${strengthColor()}`}>{tr.strengthLabels[Math.min(passwordStrength, 4)]}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength ? strengthColor().replace("text-", "bg-") : "bg-secondary"}`} />)}
                  </div>
                </div>
              )}
              <div className="bg-secondary/30 rounded-lg p-3 space-y-1 text-xs text-muted-foreground">
                <p className="font-medium text-foreground text-xs mb-2">{tr.requirements}:</p>
                <ul className="space-y-1 list-disc list-inside">
                  {[{ text: tr.req1, test: newPassword.length >= 8 }, { text: tr.req2, test: /[A-Z]/.test(newPassword) }, { text: tr.req3, test: /[0-9]/.test(newPassword) }, { text: tr.req4, test: /[^A-Za-z0-9]/.test(newPassword) }].map((req, i) => (
                    <li key={i} className={req.test ? "text-green-600 dark:text-green-400" : ""}>{req.text}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="confirm-password" className="text-foreground font-medium">{tr.confirm}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input id="confirm-password" type="password" placeholder={tr.confirmPlaceholder} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground" required disabled={submitting} />
              </div>
              {confirmPassword && newPassword !== confirmPassword && <p className="text-xs text-destructive">{tr.noMatch}</p>}
              {confirmPassword && newPassword === confirmPassword && <p className="text-xs text-green-600 dark:text-green-400">{tr.match}</p>}
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground"><strong>Security Tip:</strong> {tr.tip}</p>
            </div>
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button type="button" variant="outline" className="flex-1 border-border bg-transparent" onClick={() => router.back()} disabled={submitting}>{tr.cancel}</Button>
              <Button type="submit" disabled={submitting || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {submitting ? tr.submitting : tr.submit}
              </Button>
            </div>
          </form>
          <ShineBorder shineColor="#A3E635" borderWidth={3} />
        </Card>
      </main>
    </div>
  )
}