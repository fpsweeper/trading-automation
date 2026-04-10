"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Moon, Sun, Globe, LogOut, User, Bell, HelpCircle, X, Menu, Check, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { Logo } from "./logo"

interface Notification {
  id: string; type: string; title: string; message: string
  read: boolean; createdAt: string; botName?: string; symbol?: string; amount?: number
}

const API = process.env.NEXT_PUBLIC_API_URL

const languages = {
  en: { name: "English", flag: "🇬🇧" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  ja: { name: "日本語", flag: "🇯🇵" },
  pt: { name: "Português", flag: "🇵🇹" },
  zh: { name: "中文", flag: "🇨🇳" },
}

function authHeader() {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
}

function notifDotColor(type: string) {
  switch (type) {
    case "BOT_BUY": return "bg-green-500"
    case "BOT_SELL": return "bg-blue-500"
    case "BOT_TAKE_PROFIT": return "bg-emerald-500"
    case "BOT_STOP_LOSS": return "bg-red-500"
    case "BOT_STARTED": return "bg-green-400"
    case "BOT_PAUSED": return "bg-yellow-500"
    case "BOT_STOPPED": return "bg-gray-400"
    case "BOT_AUTO_PAUSED": return "bg-orange-500"
    case "DEPOSIT_SUCCESS": return "bg-emerald-500"
    case "LOW_POINTS": return "bg-orange-400"
    default: return "bg-blue-500"
  }
}

function fmtTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function NotificationPanel({ notifications, unreadCount, loading, onMarkAllRead, onDismiss, onClearAll, onClose }: {
  notifications: Notification[]; unreadCount: number; loading: boolean
  onMarkAllRead: () => void; onDismiss: (id: string) => void; onClearAll: () => void; onClose: () => void
}) {
  return (
    <>
      <div className="p-4 border-b border-border bg-background/95 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={onMarkAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground ml-1"><X className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div>
            {notifications.map(n => (
              <div key={n.id} className={`p-4 border-b border-border/50 hover:bg-muted/30 transition-colors flex items-start gap-3 last:border-b-0 ${!n.read ? "bg-primary/5" : ""}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notifDotColor(n.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${!n.read ? "font-semibold" : "font-medium"} text-foreground`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{fmtTime(n.createdAt)}</p>
                </div>
                <button onClick={() => onDismiss(n.id)} className="text-muted-foreground hover:text-foreground flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-3 border-t border-border bg-background/95 text-center">
          <button onClick={onClearAll} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Clear all notifications</button>
        </div>
      )}
    </>
  )
}

export default function Header() {
  const { isAuthenticated, role, username, logout } = useAuth()
  // ✅ Global language context — changing here instantly updates Hero, Features, Footer etc.
  const { language, setLanguage } = useLanguage()
  const router = useRouter()

  const [isDark, setIsDark] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifLoading, setNotifLoading] = useState(false)

  useEffect(() => {
    const dark = localStorage.getItem("theme") === "dark"
    setIsDark(dark)
    if (dark) document.documentElement.classList.add("dark")
  }, [])

  useEffect(() => {
    if (showMobileMenu) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [showMobileMenu])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem("theme", next ? "dark" : "light")
    document.documentElement.classList.toggle("dark", next)
  }

  // ✅ setLanguage from context — all components using useLanguage() re-render instantly
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as any)
    setShowLangMenu(false)
    setShowMobileMenu(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setShowMobileMenu(false)
      router.push("/")
      window.location.reload()
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    setNotifLoading(true)
    try {
      const res = await fetch(`${API}api/notifications?limit=30`, { headers: authHeader() })
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications ?? [])
      setUnreadCount(data.unreadCount ?? 0)
    } catch { } finally { setNotifLoading(false) }
  }, [isAuthenticated])

  useEffect(() => { if (isAuthenticated) fetchNotifications() }, [isAuthenticated, fetchNotifications])

  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API}api/notifications/unread-count`, { headers: authHeader() })
        if (res.ok) { const data = await res.json(); setUnreadCount(data.unreadCount ?? 0) }
      } catch { }
    }, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  useEffect(() => {
    if (showNotifications && isAuthenticated) fetchNotifications()
  }, [showNotifications, isAuthenticated, fetchNotifications])

  useEffect(() => {
    const handler = () => setTimeout(fetchNotifications, 800)
    window.addEventListener("notification:refresh", handler)
    return () => window.removeEventListener("notification:refresh", handler)
  }, [fetchNotifications])

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API}api/notifications/read-all`, { method: "PUT", headers: authHeader() })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch { }
  }

  const handleDismiss = async (id: string) => {
    try {
      await fetch(`${API}api/notifications/${id}/read`, { method: "PUT", headers: authHeader() })
      setNotifications(prev => prev.filter(n => n.id !== id))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch { setNotifications(prev => prev.filter(n => n.id !== id)) }
  }

  const handleClearAll = async () => {
    try {
      await fetch(`${API}api/notifications`, { method: "DELETE", headers: authHeader() })
      setNotifications([]); setUnreadCount(0)
    } catch { }
  }

  const bellButton = () => (
    <Button variant="ghost" size="sm" onClick={() => setShowNotifications(!showNotifications)} className="relative">
      <Bell className="w-4 h-4" />
      {unreadCount > 0 && (
        <span className={`absolute top-0 right-0 flex items-center justify-center text-white font-bold rounded-full bg-red-500 ${unreadCount > 9 ? "w-4 h-4 text-[9px]" : "w-3.5 h-3.5 text-[9px]"}`}>
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  )

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center hover:opacity-90 transition-all duration-300">
              <Logo size="md" variant="default" />
            </Link>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-4">
              {/* Language */}
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs">{language.toUpperCase()}</span>
                </Button>
                {showLangMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                      {Object.entries(languages).map(([code, { name, flag }]) => (
                        <button key={code} onClick={() => handleLanguageChange(code)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === code ? "bg-primary text-primary-foreground" : ""}`}>
                          <span>{flag}</span>{name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Link href="/help"><Button variant="ghost" size="sm"><HelpCircle className="w-4 h-4" /></Button></Link>

              {isAuthenticated && (
                <div className="relative">
                  {bellButton()}
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-xl shadow-2xl max-h-[480px] overflow-hidden flex flex-col z-50">
                        <NotificationPanel notifications={notifications} unreadCount={unreadCount} loading={notifLoading}
                          onMarkAllRead={handleMarkAllRead} onDismiss={handleDismiss} onClearAll={handleClearAll} onClose={() => setShowNotifications(false)} />
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{username}</span>
                      </div>
                    </Link>

                    {isAuthenticated && role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                        <Shield className="w-4 h-4" />
                        Admin
                      </Link>
                    )}

                    <Link href="/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
                    <Link href="/wallet"><Button variant="outline" size="sm">Wallet</Button></Link>
                    <Link href="/bots"><Button variant="outline" size="sm">Bots</Button></Link>
                    <Button variant="outline" size="sm" className="border-border text-destructive hover:bg-destructive/10 bg-transparent" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login"><Button variant="outline" size="sm">Login</Button></Link>
                    <Link href="/register"><Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button></Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              {isAuthenticated && bellButton()}
              <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-background border-l border-border z-50 lg:hidden overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
              <h2 className="font-bold text-lg">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(false)}><X className="w-5 h-5" /></Button>
            </div>
            <div className="p-4 space-y-6">
              {isAuthenticated && (
                <div className="pb-4 border-b border-border">
                  <Link href="/profile" onClick={() => setShowMobileMenu(false)}>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{username}</p>
                        <p className="text-xs text-muted-foreground">View Profile</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="space-y-2">
                  {[["Dashboard", "/dashboard"], ["Wallet", "/wallet"], ["Bots", "/bots"]].map(([label, href]) => (
                    <Link key={href} href={href} onClick={() => setShowMobileMenu(false)}>
                      <Button variant="ghost" className="w-full justify-start text-base h-12">{label}</Button>
                    </Link>
                  ))}
                </div>
              )}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Settings</h3>
                <div>
                  <Button variant="ghost" className="w-full justify-between text-base h-12" onClick={() => setShowLangMenu(!showLangMenu)}>
                    <span className="flex items-center gap-2"><Globe className="w-4 h-4" />Language</span>
                    <span className="text-sm text-muted-foreground">
                      {languages[language as keyof typeof languages].flag} {languages[language as keyof typeof languages].name}
                    </span>
                  </Button>
                  {showLangMenu && (
                    <div className="mt-2 space-y-1 pl-4">
                      {Object.entries(languages).map(([code, { name, flag }]) => (
                        <button key={code} onClick={() => handleLanguageChange(code)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${language === code ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                          <span>{flag}</span>{name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Link href="/help" onClick={() => setShowMobileMenu(false)}>
                  <Button variant="ghost" className="w-full justify-start text-base h-12">
                    <HelpCircle className="w-4 h-4 mr-2" />Help & Support
                  </Button>
                </Link>
              </div>
              <div className="space-y-2 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <Button variant="destructive" className="w-full h-12 text-base" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />Logout
                  </Button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="outline" className="w-full h-12 text-base">Login</Button>
                    </Link>
                    <Link href="/register" onClick={() => setShowMobileMenu(false)}>
                      <Button className="w-full h-12 text-base bg-primary hover:bg-primary/90">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Notifications */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setShowNotifications(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border z-50 lg:hidden flex flex-col">
            <NotificationPanel notifications={notifications} unreadCount={unreadCount} loading={notifLoading}
              onMarkAllRead={handleMarkAllRead} onDismiss={handleDismiss} onClearAll={handleClearAll} onClose={() => setShowNotifications(false)} />
          </div>
        </>
      )}
    </>
  )
}