"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun, Globe, LogOut, User, Bell, HelpCircle, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Logo } from "./logo"

const languages = {
  en: { name: "English", flag: "🇬🇧" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  ja: { name: "日本語", flag: "🇯🇵" },
  pt: { name: "Português", flag: "🇵🇹" },
  zh: { name: "中文", flag: "🇨🇳" },
}

export default function Header() {
  const { isAuthenticated, username, logout } = useAuth()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [language, setLanguage] = useState("en")
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: "success", title: "Bot Completed Cycle", message: "BTC Grid Bot completed trading cycle with +$245.50", time: "2 min ago" },
    { id: 2, type: "warning", title: "Price Alert", message: "ETH/USDT approaching stop loss at $2,100", time: "8 min ago" },
    { id: 3, type: "info", title: "Bot Started", message: "SOL Arbitrage bot started successfully", time: "25 min ago" },
    { id: 4, type: "error", title: "Connection Error", message: "Failed to connect to Binance API", time: "1 hour ago" },
  ])

  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark"
    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false)
  }, [router])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showMobileMenu])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    setShowLangMenu(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setShowMobileMenu(false)
      router.push('/')
      window.location.reload()
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center hover:opacity-90 transition-all duration-300">
              <Logo size="md" variant="default" />
            </Link>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-4">
              {/* Language Selector */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs">{language.toUpperCase()}</span>
                </Button>
                {showLangMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLangMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                      {Object.entries(languages).map(([code, { name, flag }]) => (
                        <button
                          key={code}
                          onClick={() => handleLanguageChange(code)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === code ? "bg-primary text-primary-foreground" : ""
                            }`}
                        >
                          <span>{flag}</span>
                          {name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Help Link */}
              <Link href="/help">
                <Button variant="ghost" size="sm" title="Help & Support">
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </Link>

              {/* Notifications */}
              {isAuthenticated && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </Button>

                  {showNotifications && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-2xl max-h-96 overflow-hidden flex flex-col z-50">
                        <div className="p-4 border-b border-border bg-background/95 sticky top-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">Bot Events</h3>
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="overflow-y-auto flex-1">
                          {notifications.length > 0 ? (
                            <div className="space-y-0">
                              {notifications.map((notif) => (
                                <div
                                  key={notif.id}
                                  className="p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors flex items-start gap-3 last:border-b-0"
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.type === "success"
                                      ? "bg-green-500"
                                      : notif.type === "warning"
                                        ? "bg-yellow-500"
                                        : notif.type === "error"
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                      }`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground text-sm">{notif.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                                  </div>
                                  <button
                                    onClick={() => removeNotification(notif.id)}
                                    className="text-muted-foreground hover:text-foreground flex-shrink-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 text-center text-muted-foreground">
                              <p className="text-sm">No notifications</p>
                            </div>
                          )}
                        </div>

                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-border bg-background/95 text-center">
                            <button
                              onClick={() => setNotifications([])}
                              className="text-xs text-primary hover:underline"
                            >
                              Clear all
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Auth Buttons */}
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{username}</span>
                      </div>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/wallet">
                      <Button variant="outline" size="sm">
                        Wallet
                      </Button>
                    </Link>
                    <Link href="/bots">
                      <Button variant="outline" size="sm">
                        Bots
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-destructive hover:bg-destructive/10 bg-transparent"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" size="sm">
                        {language === "en" ? "Login" : language === "es" ? "Iniciar sesión" : "Connexion"}
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {language === "en" ? "Sign Up" : language === "es" ? "Registrarse" : "S'inscrire"}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Theme Toggle - Always visible on mobile */}
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Notifications - Only for authenticated users */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              )}

              {/* Hamburger Menu */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-background border-l border-border z-50 lg:hidden overflow-y-auto">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
              <h2 className="font-bold text-lg">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Menu Content */}
            <div className="p-4 space-y-6">
              {/* User Info (if authenticated) */}
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

              {/* Navigation Links (if authenticated) */}
              {isAuthenticated && (
                <div className="space-y-2">
                  <Link href="/dashboard" onClick={() => setShowMobileMenu(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/wallet" onClick={() => setShowMobileMenu(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12">
                      Wallet
                    </Button>
                  </Link>
                  <Link href="/bots" onClick={() => setShowMobileMenu(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12">
                      Bots
                    </Button>
                  </Link>
                </div>
              )}

              {/* Settings Section */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Settings
                </h3>

                {/* Language Selector */}
                <div>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-base h-12"
                    onClick={() => setShowLangMenu(!showLangMenu)}
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Language
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {languages[language as keyof typeof languages].flag}{" "}
                      {languages[language as keyof typeof languages].name}
                    </span>
                  </Button>

                  {showLangMenu && (
                    <div className="mt-2 space-y-1 pl-4">
                      {Object.entries(languages).map(([code, { name, flag }]) => (
                        <button
                          key={code}
                          onClick={() => handleLanguageChange(code)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${language === code
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                            }`}
                        >
                          <span>{flag}</span>
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Help Link */}
                <Link href="/help" onClick={() => setShowMobileMenu(false)}>
                  <Button variant="ghost" className="w-full justify-start text-base h-12">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </Button>
                </Link>
              </div>

              {/* Auth Actions */}
              <div className="space-y-2 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <Button
                    variant="destructive"
                    className="w-full h-12 text-base"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="outline" className="w-full h-12 text-base">
                        {language === "en" ? "Login" : language === "es" ? "Iniciar sesión" : "Connexion"}
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setShowMobileMenu(false)}>
                      <Button className="w-full h-12 text-base bg-primary hover:bg-primary/90">
                        {language === "en" ? "Sign Up" : language === "es" ? "Registrarse" : "S'inscrire"}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Notifications Panel */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border z-50 lg:hidden flex flex-col">
            <div className="p-4 border-b border-border bg-background/95 sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Bot Events</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length > 0 ? (
                <div className="space-y-0">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors flex items-start gap-3 last:border-b-0"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.type === "success"
                          ? "bg-green-500"
                          : notif.type === "warning"
                            ? "bg-yellow-500"
                            : notif.type === "error"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{notif.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="text-muted-foreground hover:text-foreground flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-border bg-background/95 text-center">
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}