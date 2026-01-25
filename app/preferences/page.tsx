"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  LogOut,
  Settings,
  Globe,
  Clock,
  DollarSign,
  Save,
  ChevronLeft,
} from "lucide-react"

interface Preferences {
  language: string
  timezone: string
  currency: string
}

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
]

const timezones = [
  "UTC",
  "GMT+1 (CET)",
  "GMT+2 (EET)",
  "America/New_York (EST)",
  "America/Chicago (CST)",
  "America/Denver (MST)",
  "America/Los_Angeles (PST)",
  "Asia/Tokyo (JST)",
  "Asia/Shanghai (CST)",
  "Asia/Hong_Kong (HKT)",
  "Asia/Singapore (SGT)",
  "Asia/Dubai (GST)",
  "Australia/Sydney (AEDT)",
  "Pacific/Auckland (NZDT)",
]

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
]

export default function PreferencesPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>({
    language: "en",
    timezone: "UTC",
    currency: "USD",
  })

  useEffect(() => {
    const auth = localStorage.getItem("harvest3_auth")
    if (!auth) {
      router.push("/login")
      return
    }

    const authData = JSON.parse(auth)
    setUsername(authData.username)
    setIsAuthenticated(true)

    // Load saved preferences
    const savedPrefs = localStorage.getItem("harvest3_preferences")
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs))
    } else {
      const savedLang = localStorage.getItem("language") || "en"
      setPreferences((prev) => ({ ...prev, language: savedLang }))
    }

    setLoading(false)
  }, [router])

  const handleSavePreferences = () => {
    localStorage.setItem("harvest3_preferences", JSON.stringify(preferences))
    localStorage.setItem("language", preferences.language)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("harvest3_auth")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const selectedLang = languages.find((l) => l.code === preferences.language)
  const selectedCurrency = currencies.find((c) => c.code === preferences.currency)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H3</span>
            </div>
            <span className="font-bold">Harvest 3</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-transparent"
              onClick={() => router.push("/profile")}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-destructive hover:bg-destructive/10 bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Preferences</h1>
          <p className="text-muted-foreground">Customize your Harvest 3 experience with your preferred settings</p>
        </div>

        {/* Preferences Cards */}
        <div className="space-y-6">
          {/* Language Preference */}
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Language</h2>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, language: lang.code }))
                  }
                  className={`p-3 rounded-lg border-2 transition-all text-center cursor-pointer ${
                    preferences.language === lang.code
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/30 hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-xs font-medium">{lang.name}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Timezone Preference */}
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Timezone</h2>
                <p className="text-sm text-muted-foreground">Select your timezone for accurate timestamps</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timezones.map((tz) => (
                <button
                  key={tz}
                  onClick={() => setPreferences((prev) => ({ ...prev, timezone: tz }))}
                  className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    preferences.timezone === tz
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/30 hover:border-primary/50"
                  }`}
                >
                  <div className="text-sm font-medium">{tz}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Currency Preference */}
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Currency</h2>
                <p className="text-sm text-muted-foreground">Choose your preferred currency for display</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, currency: curr.code }))
                  }
                  className={`p-3 rounded-lg border-2 transition-all text-center cursor-pointer ${
                    preferences.currency === curr.code
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/30 hover:border-primary/50"
                  }`}
                >
                  <div className="text-lg font-bold mb-1">{curr.symbol}</div>
                  <div className="text-xs font-medium">{curr.code}</div>
                  <div className="text-xs text-muted-foreground">{curr.name}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Current Selection Summary */}
          <Card className="p-6 border border-border bg-secondary/30">
            <h3 className="text-lg font-bold mb-4">Your Current Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-1">Language</p>
                <p className="text-lg font-bold">
                  {selectedLang?.flag} {selectedLang?.name}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-1">Timezone</p>
                <p className="text-lg font-bold">{preferences.timezone}</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-1">Currency</p>
                <p className="text-lg font-bold">
                  {selectedCurrency?.symbol} {selectedCurrency?.code}
                </p>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleSavePreferences}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
            <Link href="/profile" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-border bg-transparent h-12"
              >
                Cancel
              </Button>
            </Link>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-green-700 font-medium">
                ✓ Preferences saved successfully!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
