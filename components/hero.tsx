"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from "lucide-react"

const translations = {
  en: {
    title: "Automate Your Trading with Harvest 3",
    subtitle: "Build, test, and deploy trading strategies in minutes. Let AI-powered automation maximize your returns.",
    cta: "Get Started Free",
    secondary: "View Demo",
    badge: "No credit card required",
  },
  es: {
    title: "Automatiza Tu Trading con Harvest 3",
    subtitle:
      "Construye, prueba e implementa estrategias de trading en minutos. Deja que la automatización impulsada por IA maximice tus rendimientos.",
    cta: "Comenzar Gratis",
    secondary: "Ver Demo",
    badge: "Sin tarjeta de crédito requerida",
  },
  fr: {
    title: "Automatisez Votre Trading avec Harvest 3",
    subtitle:
      "Construisez, testez et déployez des stratégies de trading en quelques minutes. Laissez l'automatisation alimentée par l'IA maximiser vos rendements.",
    cta: "Commencer Gratuitement",
    secondary: "Voir la Démo",
    badge: "Aucune carte de crédit requise",
  },
  de: {
    title: "Automatisieren Sie Ihren Handel mit Harvest 3",
    subtitle:
      "Erstellen, testen und stellen Sie Handelsstrategien in Minuten bereit. Lassen Sie KI-gestützte Automatisierung Ihre Renditen maximieren.",
    cta: "Kostenlos Starten",
    secondary: "Demo Ansehen",
    badge: "Keine Kreditkarte erforderlich",
  },
  ja: {
    title: "Harvest 3で取引を自動化",
    subtitle: "数分でトレーディング戦略を構築、テスト、デプロイします。AI駆動の自動化があなたの収益を最大化させます。",
    cta: "無料で始める",
    secondary: "デモを表示",
    badge: "クレジットカードは不要",
  },
  pt: {
    title: "Automatize Sua Negociação com Harvest 3",
    subtitle:
      "Construa, teste e implemente estratégias de negociação em minutos. Deixe a automação alimentada por IA maximizar seus retornos.",
    cta: "Começar Grátis",
    secondary: "Ver Demonstração",
    badge: "Nenhum cartão de crédito necessário",
  },
  zh: {
    title: "使用Harvest 3自动化您的交易",
    subtitle: "在几分钟内构建、测试和部署交易策略。让AI驱动的自动化最大化您的回报。",
    cta: "免费开始",
    secondary: "查看演示",
    badge: "无需信用卡",
  },
}

export default function Hero() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)
    const handleStorageChange = () => {
      const lang = localStorage.getItem("language") || "en"
      setLanguage(lang)
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 dark:opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 dark:opacity-10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">{t.title}</h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground text-balance max-w-2xl">{t.subtitle}</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {t.cta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              {t.secondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
