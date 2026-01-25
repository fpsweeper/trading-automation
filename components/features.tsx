"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"

const translations = {
  en: {
    title: "Everything You Need",
    description: "Comprehensive tools for every stage of your trading journey",
    features: [
      "Real-time market data and feeds",
      "Custom indicator library",
      "Multi-strategy portfolio management",
      "Risk management tools",
      "Paper trading environment",
      "Live trading integration",
      "Performance analytics dashboard",
      "API access for custom solutions",
    ],
  },
  es: {
    title: "Todo Lo Que Necesitas",
    description: "Herramientas completas para cada etapa de tu viaje comercial",
    features: [
      "Datos y feeds de mercado en tiempo real",
      "Biblioteca de indicadores personalizada",
      "Gestión de cartera multiestrategia",
      "Herramientas de gestión de riesgos",
      "Entorno de negociación en papel",
      "Integración de trading en vivo",
      "Panel de análisis de rendimiento",
      "Acceso a API para soluciones personalizadas",
    ],
  },
  fr: {
    title: "Tout Ce Dont Vous Avez Besoin",
    description: "Des outils complets pour chaque étape de votre parcours commercial",
    features: [
      "Données et flux de marché en temps réel",
      "Bibliothèque d'indicateurs personnalisés",
      "Gestion de portefeuille multi-stratégies",
      "Outils de gestion des risques",
      "Environnement de trading papier",
      "Intégration du trading en direct",
      "Tableau de bord d'analyse des performances",
      "Accès API pour les solutions personnalisées",
    ],
  },
  de: {
    title: "Alles, Was Sie Brauchen",
    description: "Umfassende Tools für jede Phase Ihrer Handelsreise",
    features: [
      "Echtzeit-Marktdaten und Feeds",
      "Benutzerdefinierte Indikator-Bibliothek",
      "Verwaltung von Multi-Strategie-Portfolios",
      "Risikomanagement-Tools",
      "Papierhandelsmittel",
      "Integration von Live-Handel",
      "Performance-Analytics-Dashboard",
      "API-Zugriff für benutzerdefinierte Lösungen",
    ],
  },
  ja: {
    title: "あなたが必要なもの",
    description: "トレーディングジャーニーのあらゆる段階での包括的なツール",
    features: [
      "リアルタイム市場データとフィード",
      "カスタムインジケーターライブラリ",
      "マルチ戦略ポートフォリオ管理",
      "リスク管理ツール",
      "ペーパートレーディング環境",
      "ライブトレーディング統合",
      "パフォーマンス分析ダッシュボード",
      "カスタムソリューション用のAPIアクセス",
    ],
  },
  pt: {
    title: "Tudo Que Você Precisa",
    description: "Ferramentas abrangentes para cada etapa de sua jornada comercial",
    features: [
      "Dados de mercado em tempo real e feeds",
      "Biblioteca de indicadores personalizados",
      "Gerenciamento de portfólio de múltiplas estratégias",
      "Ferramentas de gerenciamento de riscos",
      "Ambiente de negociação em papel",
      "Integração de trading ao vivo",
      "Painel de análise de desempenho",
      "Acesso à API para soluções personalizadas",
    ],
  },
  zh: {
    title: "您需要的一切",
    description: "为您的交易之旅的每个阶段提供全面工具",
    features: [
      "实时市场数据和源",
      "自定义指标库",
      "多策略投资组合管理",
      "风险管理工具",
      "模拟交易环境",
      "实盘交易整合",
      "性能分析仪表板",
      "用于自定义解决方案的API访问",
    ],
  },
}

export default function Features() {
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
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{t.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">{t.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {t.features.map((feature, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/20">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{feature}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
