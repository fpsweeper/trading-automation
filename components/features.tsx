"use client"

import { useState, useEffect } from "react"
import { Marquee } from "@/components/ui/marquee"
import { Check, Bot, BarChart2, TrendingUp, Bell, Coins, Zap, Star, Loader2, Layers } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"

const API = process.env.NEXT_PUBLIC_API_URL

interface PointsPackage { id: string; name: string; description: string; points: number; priceUsd: number; popular: boolean; sortOrder: number }

const translations = {
  en: {
    howTitle: "How it works", howSubtitle: "From zero to automated trading in 4 steps",
    steps: [
      { step: "01", title: "Create a Bot", description: "Pick DCA, Grid, or Scalping. Use a suggested template or configure every parameter yourself.", icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10" },
      { step: "02", title: "Set Your Strategy", description: "Chain entry and exit conditions using RSI, MACD, Bollinger Bands, and Moving Averages with AND/OR logic.", icon: BarChart2, color: "text-purple-500", bg: "bg-purple-500/10" },
      { step: "03", title: "Start & Monitor", description: "Hit Start. Your bot runs every 5 minutes on real Binance data. Watch trades, P&L, and positions live.", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
      { step: "04", title: "Get Notified", description: "Real-time alerts for every buy, sell, take profit, stop loss, and low points balance.", icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10" },
    ],
    features: ["RSI-based entry", "MACD momentum", "Bollinger Bands", "MA crossovers", "Stop loss", "Take profit", "Multi-bot", "1 point/trade", "Candlestick chart", "Trade history", "Positions tracker", "Equity curve", "5m to 1d", "BTC ETH & more", "Notifications", "Crypto deposit"],
    packagesTitle: "Points Packages", packagesSubtitle: "1 point is deducted per successful trade. Top up anytime via crypto deposit. Points never expire.",
    mostPopular: "Most Popular", getStarted: "Get Started",
    included: ["All 3 strategies", "1 point per trade", "Points never expire", "Crypto deposit"],
  },
  fr: {
    howTitle: "Comment ça marche", howSubtitle: "De zéro au trading automatisé en 4 étapes",
    steps: [
      { step: "01", title: "Créer un bot", description: "Choisissez DCA, Grid ou Scalping. Utilisez un modèle ou configurez tout manuellement.", icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10" },
      { step: "02", title: "Définir la stratégie", description: "Combinez RSI, MACD, Bollinger Bands et moyennes mobiles avec une logique ET/OU.", icon: BarChart2, color: "text-purple-500", bg: "bg-purple-500/10" },
      { step: "03", title: "Démarrer & surveiller", description: "Votre bot s'exécute toutes les 5 minutes sur des données Binance réelles.", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
      { step: "04", title: "Recevoir des alertes", description: "Notifications en temps réel pour chaque achat, vente, take profit et stop loss.", icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10" },
    ],
    features: ["Conditions RSI", "Filtrage MACD", "Signaux Bollinger", "Croisements MA", "Stop loss", "Take profit auto", "Multi-bots", "1 point/trade", "Graphique chandeliers", "Historique trades", "Suivi positions", "Courbe d'équité", "5m à 1j", "BTC ETH & plus", "Notifications", "Dépôt crypto"],
    packagesTitle: "Forfaits de points", packagesSubtitle: "1 point est déduit par trade réussi. Rechargez à tout moment. Les points n'expirent pas.",
    mostPopular: "Le plus populaire", getStarted: "Commencer",
    included: ["3 stratégies", "1 point/trade", "Points sans expiration", "Dépôt crypto"],
  },
  es: {
    howTitle: "Cómo funciona", howSubtitle: "De cero al trading automatizado en 4 pasos",
    steps: [
      { step: "01", title: "Crear un bot", description: "Elige DCA, Grid o Scalping. Usa una plantilla sugerida o configura cada parámetro.", icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10" },
      { step: "02", title: "Definir la estrategia", description: "Combina condiciones RSI, MACD, Bandas de Bollinger y medias móviles con lógica AND/OR.", icon: BarChart2, color: "text-purple-500", bg: "bg-purple-500/10" },
      { step: "03", title: "Iniciar & monitorear", description: "Tu bot se ejecuta cada 5 minutos con datos reales de Binance.", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
      { step: "04", title: "Recibir alertas", description: "Alertas en tiempo real para cada compra, venta, take profit y stop loss.", icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10" },
    ],
    features: ["Condiciones RSI", "Filtro MACD", "Señales Bollinger", "Cruce de medias", "Stop loss", "Take profit", "Multi-bot", "1 punto/trade", "Gráfico velas", "Historial trades", "Rastreador posiciones", "Curva capital", "5m a 1d", "BTC ETH & más", "Notificaciones", "Depósito cripto"],
    packagesTitle: "Paquetes de puntos", packagesSubtitle: "1 punto se deduce por trade exitoso. Recarga cuando quieras. Los puntos no caducan.",
    mostPopular: "Más popular", getStarted: "Empezar",
    included: ["3 estrategias", "1 punto/trade", "Puntos sin caducidad", "Depósito cripto"],
  },
  de: {
    howTitle: "So funktioniert es", howSubtitle: "Von null zu automatisiertem Handel in 4 Schritten",
    steps: [
      { step: "01", title: "Bot erstellen", description: "Wählen Sie DCA, Grid oder Scalping. Nutzen Sie eine Vorlage oder konfigurieren Sie alles selbst.", icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10" },
      { step: "02", title: "Strategie festlegen", description: "Kombinieren Sie RSI, MACD, Bollinger-Bänder und gleitende Durchschnitte mit UND/ODER-Logik.", icon: BarChart2, color: "text-purple-500", bg: "bg-purple-500/10" },
      { step: "03", title: "Starten & überwachen", description: "Ihr Bot läuft alle 5 Minuten mit echten Binance-Daten.", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
      { step: "04", title: "Benachrichtigt werden", description: "Echtzeit-Benachrichtigungen für jeden Kauf, Verkauf, Take-Profit und Stop-Loss.", icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10" },
    ],
    features: ["RSI Bedingungen", "MACD Filter", "Bollinger Signale", "MA Kreuzungen", "Stop-Loss", "Take-Profit", "Multi-Bot", "1 Punkt/Trade", "Kerzendiagramm", "Trade-Verlauf", "Positions-Tracker", "Eigenkapital-Kurve", "5m bis 1T", "BTC ETH & mehr", "Benachrichtigungen", "Krypto-Einzahlung"],
    packagesTitle: "Punktepakete", packagesSubtitle: "1 Punkt wird pro erfolgreichem Trade abgezogen. Jederzeit aufladen. Punkte verfallen nicht.",
    mostPopular: "Beliebteste", getStarted: "Starten",
    included: ["Alle 3 Strategien", "1 Punkt/Trade", "Punkte verfallen nie", "Krypto-Einzahlung"],
  },
  ja: {
    howTitle: "使い方", howSubtitle: "ゼロから自動取引まで4ステップ",
    steps: [
      { step: "01", title: "ボット作成", description: "DCA、グリッド、スキャルピングから選択。テンプレートを使うか、すべてを自分で設定。", icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10" },
      { step: "02", title: "戦略を設定", description: "RSI、MACD、ボリンジャーバンド、移動平均をAND/ORで組み合わせる。", icon: BarChart2, color: "text-purple-500", bg: "bg-purple-500/10" },
      { step: "03", title: "開始＆監視", description: "ボットは5分ごとにBinanceの実際データで動作。取引、損益、ポジションをリアルタイムで確認。", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
      { step: "04", title: "通知を受信", description: "すべての買い、売り、テイクプロフィット、ストップロス、残高不足のリアルタイム通知。", icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10" },
    ],
    features: ["RSI条件", "MACDフィルター", "ボリンジャー", "MA交差", "ストップロス", "テイクプロフィット", "マルチボット", "1ポイント/取引", "ローソク足", "取引履歴", "ポジション追跡", "資産曲線", "5m〜1d", "BTC ETH & more", "通知", "暗号入金"],
    packagesTitle: "ポイントパッケージ", packagesSubtitle: "成功した取引ごとに1ポイントが差し引かれます。いつでもチャージ可能。ポイントは期限切れになりません。",
    mostPopular: "最も人気", getStarted: "始める",
    included: ["全3戦略", "1ポイント/取引", "ポイント無期限", "暗号入金"],
  },
  pt: {
    howTitle: "Como funciona", howSubtitle: "Do zero ao trading automatizado em 4 passos",
    steps: [
      { step: "01", title: "Criar um bot", description: "Escolha DCA, Grid ou Scalping. Use um template sugerido ou configure cada parâmetro.", icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10" },
      { step: "02", title: "Definir estratégia", description: "Combine condições RSI, MACD, Bandas de Bollinger e médias móveis com lógica E/OU.", icon: BarChart2, color: "text-purple-500", bg: "bg-purple-500/10" },
      { step: "03", title: "Iniciar & monitorar", description: "Seu bot executa a cada 5 minutos com dados reais da Binance.", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
      { step: "04", title: "Receber notificações", description: "Alertas em tempo real para cada compra, venda, take profit e stop loss.", icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10" },
    ],
    features: ["Condições RSI", "Filtro MACD", "Sinais Bollinger", "Cruzamentos MA", "Stop loss", "Take profit", "Multi-bot", "1 ponto/trade", "Gráfico velas", "Histórico trades", "Rastreador posições", "Curva capital", "5m a 1d", "BTC ETH & mais", "Notificações", "Depósito cripto"],
    packagesTitle: "Pacotes de pontos", packagesSubtitle: "1 ponto é deduzido por trade bem-sucedido. Recarregue quando quiser. Pontos nunca expiram.",
    mostPopular: "Mais popular", getStarted: "Começar",
    included: ["3 estratégias", "1 ponto/trade", "Pontos sem validade", "Depósito cripto"],
  },
  zh: {
    howTitle: "如何运作", howSubtitle: "4步从零到自动化交易",
    steps: [
      { step: "01", title: "创建机器人", description: "选择DCA、网格或剥头皮。使用建议模板或自行配置每个参数。", icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10" },
      { step: "02", title: "设置策略", description: "使用AND/OR逻辑组合RSI、MACD、布林带和移动平均线的进出场条件。", icon: BarChart2, color: "text-purple-500", bg: "bg-purple-500/10" },
      { step: "03", title: "启动并监控", description: "机器人每5分钟在真实Binance数据上运行。实时查看交易、盈亏和持仓。", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
      { step: "04", title: "接收通知", description: "每次买入、卖出、止盈、止损和积分余额不足的实时提醒。", icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10" },
    ],
    features: ["RSI条件", "MACD动量", "布林带信号", "MA交叉", "止损", "止盈", "多机器人", "1积分/交易", "K线图", "交易历史", "持仓追踪", "权益曲线", "5m至1d", "BTC ETH & more", "通知", "加密充值"],
    packagesTitle: "积分套餐", packagesSubtitle: "每笔成功交易扣除1积分。随时通过加密货币充值。积分永不过期。",
    mostPopular: "最受欢迎", getStarted: "开始",
    included: ["全部3种策略", "1积分/交易", "积分永不过期", "加密充值"],
  },
}

function FeatureChip({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border rounded-lg px-4 py-2.5 hover:border-primary/50 transition-colors flex-shrink-0">
      <Check className="w-4 h-4 text-primary flex-shrink-0" />
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
    </div>
  )
}

function PackageCard({ pkg, included, mostPopular, getStarted }: { pkg: PointsPackage; included: string[]; mostPopular: string; getStarted: string }) {
  return (
    <div className={`relative flex flex-col rounded-2xl border p-6 transition-all ${pkg.popular ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.03]" : "border-border bg-card/50 hover:border-primary/40"}`}>
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            <Star className="w-3 h-3" /> {mostPopular}
          </span>
        </div>
      )}
      <div className="mb-4">
        <h3 className="font-bold text-lg">{pkg.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{pkg.description}</p>
      </div>
      <div className="mb-4">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-black">${pkg.priceUsd}</span>
          <span className="text-muted-foreground text-sm mb-1">USD</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Coins className="w-4 h-4 text-primary" />
          <span className="font-semibold text-primary">{pkg.points.toLocaleString()} points</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <Zap className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">~{pkg.points.toLocaleString()} trades</span>
        </div>
      </div>
      <ul className="space-y-2 mb-6 flex-1">
        {included.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}
          </li>
        ))}
      </ul>
      <Link href="/register">
        <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>{getStarted}</Button>
      </Link>
    </div>
  )
}

export default function Features() {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.en

  const [packages, setPackages] = useState<PointsPackage[]>([])
  const [pkgLoading, setPkgLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}api/points/packages`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setPackages(data.packages ?? []); setPkgLoading(false) })
      .catch(() => {
        setPackages([
          { id: "1", name: "Starter", description: "Perfect to get started.", points: 30, priceUsd: 10, popular: false, sortOrder: 1 },
          { id: "2", name: "Trader", description: "Run multiple bots for weeks.", points: 200, priceUsd: 50, popular: true, sortOrder: 2 },
          { id: "3", name: "Pro", description: "High-frequency strategies.", points: 900, priceUsd: 200, popular: false, sortOrder: 3 },
          { id: "4", name: "Unlimited", description: "Maximum capacity power users.", points: 2000, priceUsd: 400, popular: false, sortOrder: 4 },
        ])
        setPkgLoading(false)
      })
  }, [])

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* How it works */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t.howTitle}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl">{t.howSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 max-w-6xl mx-auto">
          {t.steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/40 transition-colors">
                {idx < t.steps.length - 1 && <div className="hidden lg:block absolute top-10 left-full w-6 h-px bg-border z-10" />}
                <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center`}><Icon className={`w-5 h-5 ${step.color}`} /></div>
                <span className="text-4xl font-black text-muted-foreground/20 absolute top-4 right-6 select-none">{step.step}</span>
                <div>
                  <h3 className="font-bold text-base mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Features marquee */}
        <div className="mb-24">
          <Marquee pauseOnHover className="[--duration:40s]">
            {t.features.map((f, i) => <FeatureChip key={i} label={f} />)}
          </Marquee>
        </div>

        {/* Points Packages */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">{t.packagesTitle}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">{t.packagesSubtitle}</p>
        </div>
        {pkgLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} included={t.included} mostPopular={t.mostPopular} getStarted={t.getStarted} />)}
          </div>
        )}
      </div>
    </section>
  )
}