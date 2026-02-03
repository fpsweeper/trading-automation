"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react"
import { BorderBeam } from "@/components/ui/border-beam"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"
import Link from "next/link"

const translations = {
  en: {
    badge: "AI-Powered Trading Platform",
    title: "Automate Your Trading",
    titleHighlight: "with Harvest 3",
    subtitle: "Build, test, and deploy sophisticated trading strategies in minutes. Let AI-powered automation maximize your returns while you sleep.",
    cta: "Get Started Free",
    secondary: "View Demo",
    stats: [
      { value: "99.9%", label: "Uptime" },
      { value: "<1ms", label: "Latency" },
      { value: "24/7", label: "Support" },
      { value: "50K+", label: "Users" },
    ],
  },
  // ... other languages
}

export default function Hero() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)
  }, [])

  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "opacity-30"
        )}
      />

      {/* Gradient Orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          {/* Animated Badge */}
          <div className="relative">
            <AnimatedGradientText>
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="inline animate-gradient bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] bg-clip-text text-transparent font-medium">
                {t.badge}
              </span>
            </AnimatedGradientText>
          </div>

          {/* Main Heading with Animation */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                {t.title}
              </span>
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mt-2">
                {t.titleHighlight}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 px-8 py-6 text-lg"
              >
                {t.cta}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 px-8 py-6 text-lg hover:bg-primary/5"
            >
              {t.secondary}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 w-full max-w-3xl">
            {t.stats.map((stat, idx) => (
              <div
                key={idx}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  )
}