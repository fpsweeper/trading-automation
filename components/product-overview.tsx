"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { BarChart3, Zap, Shield, Cpu } from "lucide-react"

const translations = {
  en: {
    title: "Powerful Trading Automation",
    description: "Everything you need to succeed in algorithmic trading",
    features: [
      {
        title: "Advanced Backtesting",
        description: "Test strategies against historical data with high-fidelity simulation",
        icon: BarChart3,
      },
      {
        title: "Lightning Fast Execution",
        description: "Execute trades in milliseconds with optimized infrastructure",
        icon: Zap,
      },
      {
        title: "Enterprise Security",
        description: "Bank-grade encryption and compliance with financial regulations",
        icon: Shield,
      },
      {
        title: "AI-Powered Analytics",
        description: "Get insights from machine learning models and pattern recognition",
        icon: Cpu,
      },
    ],
  },
  es: {
    title: "Potente Automatización de Trading",
    description: "Todo lo que necesitas para tener éxito en el trading algorítmico",
    features: [
      {
        title: "Pruebas Avanzadas",
        description: "Prueba estrategias contra datos históricos con simulación de alta fidelidad",
        icon: BarChart3,
      },
      {
        title: "Ejecución Ultrarrápida",
        description: "Ejecuta operaciones en milisegundos con infraestructura optimizada",
        icon: Zap,
      },
      {
        title: "Seguridad Empresarial",
        description: "Encriptación de nivel bancario y cumplimiento de regulaciones financieras",
        icon: Shield,
      },
      {
        title: "Análisis Impulsado por IA",
        description: "Obtén información de modelos de aprendizaje automático",
        icon: Cpu,
      },
    ],
  },
  fr: {
    title: "Automatisation Puissante du Trading",
    description: "Tout ce dont vous avez besoin pour réussir le trading algorithmique",
    features: [
      {
        title: "Backtesting Avancé",
        description: "Testez les stratégies par rapport aux données historiques avec simulation haute fidélité",
        icon: BarChart3,
      },
      {
        title: "Exécution Éclair Rapide",
        description: "Exécutez les transactions en millisecondes avec infrastructure optimisée",
        icon: Zap,
      },
      {
        title: "Sécurité Entreprise",
        description: "Chiffrement de niveau bancaire et conformité aux réglementations financières",
        icon: Shield,
      },
      {
        title: "Analyse Alimentée par l'IA",
        description: "Obtenez des informations à partir de modèles d'apprentissage automatique",
        icon: Cpu,
      },
    ],
  },
  de: {
    title: "Leistungsstarke Handelsautomation",
    description: "Alles, was Sie für den Erfolg im algorithmischen Handel benötigen",
    features: [
      {
        title: "Fortgeschrittene Backtests",
        description: "Testen Sie Strategien anhand historischer Daten mit hochfideler Simulation",
        icon: BarChart3,
      },
      {
        title: "Blitzschnelle Ausführung",
        description: "Führen Sie Trades in Millisekunden mit optimierter Infrastruktur aus",
        icon: Zap,
      },
      {
        title: "Sicherheit auf Unternehmensebene",
        description: "Bankenstandardverschlüsselung und Einhaltung von Finanzvorschriften",
        icon: Shield,
      },
      {
        title: "KI-gestützte Analytik",
        description: "Erhalten Sie Erkenntnisse aus Machine-Learning-Modellen",
        icon: Cpu,
      },
    ],
  },
  ja: {
    title: "強力なトレーディング自動化",
    description: "アルゴリズム取引での成功に必要なすべて",
    features: [
      {
        title: "高度なバックテスト",
        description: "高忠実度シミュレーションで過去データに対して戦略をテスト",
        icon: BarChart3,
      },
      {
        title: "光速実行",
        description: "最適化されたインフラで数ミリ秒で取引を実行",
        icon: Zap,
      },
      {
        title: "エンタープライズセキュリティ",
        description: "銀行グレードの暗号化と金融規制への準拠",
        icon: Shield,
      },
      {
        title: "AI駆動分析",
        description: "機械学習モデルからの洞察を取得",
        icon: Cpu,
      },
    ],
  },
  pt: {
    title: "Automação Poderosa de Negociação",
    description: "Tudo que você precisa para ter sucesso no trading algorítmico",
    features: [
      {
        title: "Backtesting Avançado",
        description: "Teste estratégias com dados históricos com simulação de alta fidelidade",
        icon: BarChart3,
      },
      {
        title: "Execução Ultrarrápida",
        description: "Execute negociações em milissegundos com infraestrutura otimizada",
        icon: Zap,
      },
      {
        title: "Segurança Corporativa",
        description: "Criptografia em nível bancário e conformidade com regulamentações financeiras",
        icon: Shield,
      },
      {
        title: "Análise Impulsionada por IA",
        description: "Obtenha insights de modelos de aprendizado de máquina",
        icon: Cpu,
      },
    ],
  },
  zh: {
    title: "强大的交易自动化",
    description: "算法交易成功所需的一切",
    features: [
      {
        title: "高级回测",
        description: "使用高保真模拟针对历史数据测试策略",
        icon: BarChart3,
      },
      {
        title: "闪电快速执行",
        description: "使用优化的基础设施在毫秒内执行交易",
        icon: Zap,
      },
      {
        title: "企业级安全",
        description: "银行级加密和金融法规合规性",
        icon: Shield,
      },
      {
        title: "人工智能分析",
        description: "从机器学习模型获得见解",
        icon: Cpu,
      },
    ],
  },
}

export default function ProductOverview() {
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
    <section className="py-20 sm:py-32 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{t.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">{t.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {t.features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="p-6 border border-border hover:border-primary/50 transition-colors">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
