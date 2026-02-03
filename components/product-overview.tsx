"use client"

import { useState, useEffect } from "react"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { BarChart3, Zap, Shield, Cpu, LineChart, Bell, Code, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const translations = {
  en: {
    title: "Everything you need to succeed",
    subtitle: "Powerful features designed for serious traders",
    features: [
      {
        name: "Advanced Backtesting",
        description: "Test strategies against years of historical data with tick-level precision",
        icon: BarChart3,
        className: "col-span-3 lg:col-span-1",
        cta: "Learn more",
        background: (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 opacity-50" />
        ),
      },
      {
        name: "Lightning Fast",
        description: "Execute trades in under 1ms with our optimized infrastructure",
        icon: Zap,
        className: "col-span-3 lg:col-span-2",
        cta: "See performance",
        background: (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-50" />
        ),
      },
      {
        name: "Bank-Grade Security",
        description: "Your funds and data protected by enterprise encryption",
        icon: Shield,
        className: "col-span-3 lg:col-span-2",
        cta: "Security details",
        background: (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-50" />
        ),
      },
      {
        name: "AI Analytics",
        description: "Machine learning models analyze market patterns 24/7",
        icon: Cpu,
        className: "col-span-3 lg:col-span-1",
        cta: "Explore AI",
        background: (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50" />
        ),
      },
      {
        name: "Real-time Monitoring",
        description: "Track performance across all strategies in one dashboard",
        icon: LineChart,
        className: "col-span-3 lg:col-span-1",
        cta: "View demo",
      },
      {
        name: "Smart Alerts",
        description: "Get notified instantly when market conditions change",
        icon: Bell,
        className: "col-span-3 lg:col-span-1",
        cta: "Set up alerts",
      },
      {
        name: "API Access",
        description: "Full programmatic control with RESTful and WebSocket APIs",
        icon: Code,
        className: "col-span-3 lg:col-span-1",
        cta: "API docs",
      },
    ],
  },
  es: {
    title: "Todo lo que necesitas para tener éxito",
    subtitle: "Características poderosas diseñadas para traders serios",
    features: [
      {
        name: "Backtesting Avanzado",
        description: "Prueba estrategias con años de datos históricos con precisión de tick",
        icon: BarChart3,
        className: "col-span-3 lg:col-span-1",
        cta: "Más información",
        background: (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 opacity-50" />
        ),
      },
      {
        name: "Ultrarrápido",
        description: "Ejecuta operaciones en menos de 1ms con infraestructura optimizada",
        icon: Zap,
        className: "col-span-3 lg:col-span-2",
        cta: "Ver rendimiento",
        background: (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-50" />
        ),
      },
      {
        name: "Seguridad Bancaria",
        description: "Tus fondos y datos protegidos por encriptación empresarial",
        icon: Shield,
        className: "col-span-3 lg:col-span-2",
        cta: "Detalles de seguridad",
        background: (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-50" />
        ),
      },
      {
        name: "Análisis IA",
        description: "Modelos de aprendizaje automático analizan patrones 24/7",
        icon: Cpu,
        className: "col-span-3 lg:col-span-1",
        cta: "Explorar IA",
        background: (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50" />
        ),
      },
      {
        name: "Monitoreo en Tiempo Real",
        description: "Rastrea el rendimiento en todas las estrategias en un panel",
        icon: LineChart,
        className: "col-span-3 lg:col-span-1",
        cta: "Ver demo",
      },
      {
        name: "Alertas Inteligentes",
        description: "Recibe notificaciones instantáneas cuando cambian las condiciones",
        icon: Bell,
        className: "col-span-3 lg:col-span-1",
        cta: "Configurar alertas",
      },
      {
        name: "Acceso API",
        description: "Control programático completo con APIs RESTful y WebSocket",
        icon: Code,
        className: "col-span-3 lg:col-span-1",
        cta: "Documentación API",
      },
    ],
  },
}

export default function ProductOverview() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)
  }, [])

  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <BentoGrid className="max-w-7xl mx-auto">
          {t.features.map((feature, idx) => (
            <BentoCard
              key={idx}
              name={feature.name}
              className={cn("relative group", feature.className)}
              background={feature.background}
              Icon={feature.icon}
              description={feature.description}
              href="#"
              cta={feature.cta}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}