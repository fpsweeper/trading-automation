"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Zap, Layers, TrendingUp } from "lucide-react"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

const translations = {
  en: {
    badge: "Trading Automation Platform",
    title: "Automate Your Trading",
    titleHighlight: "Without the Risk",
    subtitle: "Build and run DCA, Grid, and Scalping bots on real Binance market data. Perfect your strategy before going live.",
    cta: "Create an Account",
    secondary: "Sign In",
    stats: [
      { value: "3", label: "Strategies", icon: Layers },
      { value: "1pt", label: "Per Trade", icon: Zap },
      { value: "24/7", label: "Bot Execution", icon: Bot },
      { value: "100%", label: "Simulation", icon: TrendingUp },
    ],
  },
  fr: {
    badge: "Plateforme de Trading Automatisé",
    title: "Automatisez votre trading",
    titleHighlight: "Sans le risque",
    subtitle: "Créez et exécutez des bots DCA, Grid et Scalping sur des données Binance réelles. Perfectionnez votre stratégie avant de trader réellement.",
    cta: "Créer un compte",
    secondary: "Se connecter",
    stats: [
      { value: "3", label: "Stratégies", icon: Layers },
      { value: "1pt", label: "Par trade", icon: Zap },
      { value: "24/7", label: "Exécution", icon: Bot },
      { value: "100%", label: "Simulation", icon: TrendingUp },
    ],
  },
  es: {
    badge: "Plataforma de Trading Automatizado",
    title: "Automatiza tu trading",
    titleHighlight: "Sin el riesgo",
    subtitle: "Crea y ejecuta bots DCA, Grid y Scalping con datos reales de Binance. Perfecciona tu estrategia antes de operar en vivo.",
    cta: "Crear una cuenta",
    secondary: "Iniciar sesión",
    stats: [
      { value: "3", label: "Estrategias", icon: Layers },
      { value: "1pt", label: "Por trade", icon: Zap },
      { value: "24/7", label: "Ejecución", icon: Bot },
      { value: "100%", label: "Simulación", icon: TrendingUp },
    ],
  },
  de: {
    badge: "Trading-Automatisierungsplattform",
    title: "Automatisieren Sie Ihren Handel",
    titleHighlight: "Ohne das Risiko",
    subtitle: "Erstellen und betreiben Sie DCA-, Grid- und Scalping-Bots mit echten Binance-Marktdaten. Perfektionieren Sie Ihre Strategie.",
    cta: "Konto erstellen",
    secondary: "Anmelden",
    stats: [
      { value: "3", label: "Strategien", icon: Layers },
      { value: "1pt", label: "Pro Trade", icon: Zap },
      { value: "24/7", label: "Ausführung", icon: Bot },
      { value: "100%", label: "Simulation", icon: TrendingUp },
    ],
  },
  ja: {
    badge: "取引自動化プラットフォーム",
    title: "取引を自動化しよう",
    titleHighlight: "リスクなしで",
    subtitle: "実際のBinance市場データでDCA、グリッド、スキャルピングボットを構築・実行。本番前に戦略を磨きましょう。",
    cta: "アカウント作成",
    secondary: "サインイン",
    stats: [
      { value: "3", label: "戦略", icon: Layers },
      { value: "1pt", label: "取引ごと", icon: Zap },
      { value: "24/7", label: "実行", icon: Bot },
      { value: "100%", label: "シミュレーション", icon: TrendingUp },
    ],
  },
  pt: {
    badge: "Plataforma de Trading Automatizado",
    title: "Automatize seu trading",
    titleHighlight: "Sem o risco",
    subtitle: "Crie e execute bots DCA, Grid e Scalping com dados reais da Binance. Aperfeiçoe sua estratégia antes de operar ao vivo.",
    cta: "Criar uma conta",
    secondary: "Entrar",
    stats: [
      { value: "3", label: "Estratégias", icon: Layers },
      { value: "1pt", label: "Por trade", icon: Zap },
      { value: "24/7", label: "Execução", icon: Bot },
      { value: "100%", label: "Simulação", icon: TrendingUp },
    ],
  },
  zh: {
    badge: "交易自动化平台",
    title: "自动化您的交易",
    titleHighlight: "无需承担风险",
    subtitle: "在真实的Binance市场数据上构建和运行DCA、网格和剥头皮机器人。在上线前完善您的策略。",
    cta: "创建账户",
    secondary: "登录",
    stats: [
      { value: "3", label: "策略", icon: Layers },
      { value: "1pt", label: "每笔交易", icon: Zap },
      { value: "24/7", label: "机器人执行", icon: Bot },
      { value: "100%", label: "模拟", icon: TrendingUp },
    ],
  },
}

export default function Hero() {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <DotPattern className={cn("[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]", "opacity-30")} />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          <AnimatedGradientText>
            <Bot className="w-4 h-4 mr-2" />
            <span className="inline animate-gradient bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] bg-clip-text text-transparent font-medium">
              {t.badge}
            </span>
          </AnimatedGradientText>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">{t.title}</span>
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mt-2">{t.titleHighlight}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "DCA", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
              { label: "Grid Trading", color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
              { label: "Scalping", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
            ].map(s => (
              <span key={s.label} className={`px-3 py-1 rounded-full text-sm font-medium border ${s.color}`}>{s.label}</span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/register">
              <Button size="lg" className="group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 px-8 py-6 text-lg">
                {t.cta}<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-2 px-8 py-6 text-lg hover:bg-primary/5">{t.secondary}</Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 w-full max-w-3xl">
            {t.stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-all" />
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <Icon className="w-4 h-4 text-primary mb-2 mx-auto" />
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  )
}