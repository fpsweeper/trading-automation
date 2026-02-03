"use client"

import { useState, useEffect } from "react"
import { AlertCircle, ShieldAlert } from "lucide-react"
import { Card } from "@/components/ui/card"
import { BlurFade } from "@/components/ui/blur-fade"

const translations = {
  en: {
    title: "Risk Disclosure",
    subtitle: "Please read carefully before trading",
    content: [
      'Harvest 3 is provided "as is" without warranties. Trading and investing carry significant risks, including the potential loss of principal.',
      "Past performance is not indicative of future results. All trading strategies carry risk, and users must understand these risks before deploying any strategy.",
      "This platform is not investment advice. Consult with qualified financial advisors before making investment decisions. Users are solely responsible for their trading decisions and outcomes.",
      "Market conditions can change rapidly. The system may experience technical issues, latency, or outages that could affect trading performance.",
      "Harvest 3 is not liable for losses incurred through the use of this platform, including losses due to technical failures or market volatility.",
    ],
  },
}

export default function Disclaimer() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)
  }, [])

  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/5 to-background -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <BlurFade delay={0.2} inView>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-destructive" />
              </div>
              <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  {t.title}
                </h2>
                <p className="text-muted-foreground mt-2">{t.subtitle}</p>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.4} inView>
            <Card className="relative overflow-hidden border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-background">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-destructive/0 via-destructive/30 to-destructive/0 animate-pulse" />

              <div className="relative p-8 sm:p-10 space-y-6">
                {t.content.map((paragraph, idx) => (
                  <BlurFade key={idx} delay={0.2 + idx * 0.1} inView>
                    <div className="flex gap-4">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                        {paragraph}
                      </p>
                    </div>
                  </BlurFade>
                ))}
              </div>
            </Card>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}