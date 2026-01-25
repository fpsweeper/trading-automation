"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun, Globe, LogOut, User, Bell, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const [isDark, setIsDark] = useState(false)
  const [language, setLanguage] = useState("en")
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
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

  useEffect(() => {
    const auth = localStorage.getItem("harvest3_auth")
    if (auth) {
      const authData = JSON.parse(auth)
      setUsername(authData.username)
      setIsAuthenticated(true)
    }
  }, [])

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

  const handleLogout = () => {
    localStorage.removeItem("harvest3_auth")
    setIsAuthenticated(false)
    setUsername("")
  }

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H3</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">Harvest 3</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{language.toUpperCase()}</span>
              </Button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg">
                  {Object.entries(languages).map(([code, { name, flag }]) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 ${
                        language === code ? "bg-primary text-primary-foreground" : ""
                      }`}
                    >
                      <span>{flag}</span>
                      {name}
                    </button>
                  ))}
                </div>
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
                  <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-2xl max-h-96 overflow-hidden flex flex-col">
                    {/* Header */}
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

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                      {notifications.length > 0 ? (
                        <div className="space-y-0">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className="p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors flex items-start gap-3 last:border-b-0"
                            >
                              <div
                                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                  notif.type === "success"
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

                    {/* Footer */}
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
        </div>
      </div>
    </header>
  )
}
