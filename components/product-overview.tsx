"use client"

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { Bot, Zap, Layers, TrendingUp, Bell, ShieldCheck, BarChart2, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"

const translations = {
  en: {
    title: "Everything your bots need",
    subtitle: "Built for traders who take strategy seriously",
    features: [
      { name: "DCA Strategy", description: "Buy at regular intervals using RSI, MACD and MA indicators. Set entry/exit conditions and let the bot manage the rest. 1 point per trade.", icon: Coins, className: "col-span-3 lg:col-span-1", cta: "Get started", bg: "blue" },
      { name: "Grid Trading", description: "Place buy orders at calculated price levels below market. Sells automatically at your take profit. Ideal for sideways markets. 1 point per trade.", icon: Layers, className: "col-span-3 lg:col-span-2", cta: "Get started", bg: "purple" },
      { name: "Scalping", description: "Fast in-and-out trades using RSI and MACD momentum signals. Uses your configured stop loss and take profit on every position. 1 point per trade.", icon: Zap, className: "col-span-3 lg:col-span-2", cta: "Get started", bg: "orange" },
      { name: "Real Binance Data", description: "Live price feeds and OHLCV candles from Binance. Your bots execute on real market data with simulated slippage and 0.1% trading fees.", icon: TrendingUp, className: "col-span-3 lg:col-span-1", cta: "Learn more", bg: "green" },
      { name: "Indicator Conditions", description: "Chain RSI, MACD, Bollinger Bands, and Moving Averages with AND/OR logic to build precise entry and exit rules.", icon: BarChart2, className: "col-span-3 lg:col-span-1", cta: "Build conditions", bg: null },
      { name: "Live Notifications", description: "Real-time alerts for every buy, sell, take profit, stop loss, bot lifecycle event, and low points warning.", icon: Bell, className: "col-span-3 lg:col-span-1", cta: "See notifications", bg: null },
      { name: "Points System", description: "1 point is deducted per successful trade across all strategies. Purchase points via crypto deposit. Points never expire.", icon: ShieldCheck, className: "col-span-3 lg:col-span-1", cta: "View packages", bg: null },
    ],
  },
  fr: {
    title: "Tout ce dont vos bots ont besoin",
    subtitle: "Conçu pour les traders qui prennent la stratégie au sérieux",
    features: [
      { name: "Stratégie DCA", description: "Achetez à intervalles réguliers en utilisant RSI, MACD et MA. Définissez des conditions d'entrée/sortie. 1 point par trade.", icon: Coins, className: "col-span-3 lg:col-span-1", cta: "Commencer", bg: "blue" },
      { name: "Trading en Grille", description: "Placez des ordres d'achat à des niveaux de prix calculés. Vend automatiquement au take profit. Idéal pour les marchés en range. 1 point par trade.", icon: Layers, className: "col-span-3 lg:col-span-2", cta: "Commencer", bg: "purple" },
      { name: "Scalping", description: "Trades rapides utilisant les signaux RSI et MACD. Utilise votre stop loss et take profit configurés. 1 point par trade.", icon: Zap, className: "col-span-3 lg:col-span-2", cta: "Commencer", bg: "orange" },
      { name: "Données Binance réelles", description: "Flux de prix et chandeliers OHLCV de Binance. Vos bots s'exécutent sur des données réelles avec slippage simulé et frais de 0,1%.", icon: TrendingUp, className: "col-span-3 lg:col-span-1", cta: "En savoir plus", bg: "green" },
      { name: "Conditions d'indicateurs", description: "Combinez RSI, MACD, Bollinger Bands et moyennes mobiles avec une logique ET/OU.", icon: BarChart2, className: "col-span-3 lg:col-span-1", cta: "Créer des conditions", bg: null },
      { name: "Notifications en direct", description: "Alertes temps réel pour chaque achat, vente, take profit, stop loss et événement de bot.", icon: Bell, className: "col-span-3 lg:col-span-1", cta: "Voir les notifications", bg: null },
      { name: "Système de points", description: "1 point déduit par trade réussi pour toutes les stratégies. Achetez des points par dépôt crypto. Les points n'expirent pas.", icon: ShieldCheck, className: "col-span-3 lg:col-span-1", cta: "Voir les forfaits", bg: null },
    ],
  },
  es: {
    title: "Todo lo que tus bots necesitan",
    subtitle: "Construido para traders que se toman la estrategia en serio",
    features: [
      { name: "Estrategia DCA", description: "Compra a intervalos regulares usando indicadores RSI, MACD y MA. Define condiciones de entrada/salida. 1 punto por trade.", icon: Coins, className: "col-span-3 lg:col-span-1", cta: "Empezar", bg: "blue" },
      { name: "Grid Trading", description: "Coloca órdenes de compra en niveles de precio calculados. Vende automáticamente en tu take profit. Ideal para mercados laterales. 1 punto por trade.", icon: Layers, className: "col-span-3 lg:col-span-2", cta: "Empezar", bg: "purple" },
      { name: "Scalping", description: "Trades rápidos usando señales RSI y MACD. Usa tu stop loss y take profit configurados en cada posición. 1 punto por trade.", icon: Zap, className: "col-span-3 lg:col-span-2", cta: "Empezar", bg: "orange" },
      { name: "Datos reales de Binance", description: "Precios en vivo y velas OHLCV de Binance. Tus bots ejecutan con datos reales con slippage simulado y comisiones del 0,1%.", icon: TrendingUp, className: "col-span-3 lg:col-span-1", cta: "Saber más", bg: "green" },
      { name: "Condiciones de indicadores", description: "Combina RSI, MACD, Bandas de Bollinger y medias móviles con lógica AND/OR.", icon: BarChart2, className: "col-span-3 lg:col-span-1", cta: "Crear condiciones", bg: null },
      { name: "Notificaciones en vivo", description: "Alertas en tiempo real para cada compra, venta, take profit, stop loss y evento de bot.", icon: Bell, className: "col-span-3 lg:col-span-1", cta: "Ver notificaciones", bg: null },
      { name: "Sistema de puntos", description: "1 punto deducido por trade exitoso en todas las estrategias. Compra puntos mediante depósito cripto. Los puntos no expiran.", icon: ShieldCheck, className: "col-span-3 lg:col-span-1", cta: "Ver paquetes", bg: null },
    ],
  },
  de: {
    title: "Alles, was Ihre Bots brauchen",
    subtitle: "Für Trader gebaut, die Strategie ernst nehmen",
    features: [
      { name: "DCA-Strategie", description: "Kaufen Sie in regelmäßigen Abständen mit RSI-, MACD- und MA-Indikatoren. 1 Punkt pro Trade.", icon: Coins, className: "col-span-3 lg:col-span-1", cta: "Starten", bg: "blue" },
      { name: "Grid-Trading", description: "Kaufaufträge auf berechneten Preisniveaus. Verkauft automatisch beim Take-Profit. 1 Punkt pro Trade.", icon: Layers, className: "col-span-3 lg:col-span-2", cta: "Starten", bg: "purple" },
      { name: "Scalping", description: "Schnelle Trades mit RSI- und MACD-Signalen. Nutzt Ihren konfigurierten Stop-Loss und Take-Profit. 1 Punkt pro Trade.", icon: Zap, className: "col-span-3 lg:col-span-2", cta: "Starten", bg: "orange" },
      { name: "Echte Binance-Daten", description: "Live-Preise und OHLCV-Kerzen von Binance mit simuliertem Slippage und 0,1% Handelsgebühren.", icon: TrendingUp, className: "col-span-3 lg:col-span-1", cta: "Mehr erfahren", bg: "green" },
      { name: "Indikatorbedingungen", description: "RSI, MACD, Bollinger-Bänder und gleitende Durchschnitte mit UND/ODER-Logik kombinieren.", icon: BarChart2, className: "col-span-3 lg:col-span-1", cta: "Bedingungen erstellen", bg: null },
      { name: "Live-Benachrichtigungen", description: "Echtzeit-Benachrichtigungen für jeden Kauf, Verkauf, Take-Profit, Stop-Loss und Bot-Ereignis.", icon: Bell, className: "col-span-3 lg:col-span-1", cta: "Benachrichtigungen", bg: null },
      { name: "Punktesystem", description: "1 Punkt wird pro erfolgreichem Trade abgezogen. Punkte per Krypto-Einzahlung kaufen. Punkte verfallen nicht.", icon: ShieldCheck, className: "col-span-3 lg:col-span-1", cta: "Pakete ansehen", bg: null },
    ],
  },
  ja: {
    title: "ボットに必要なすべて",
    subtitle: "戦略を真剣に考えるトレーダーのために構築",
    features: [
      { name: "DCA戦略", description: "RSI、MACD、MAインジケーターを使って定期的に購入。エントリー/エグジット条件を設定。取引ごと1ポイント。", icon: Coins, className: "col-span-3 lg:col-span-1", cta: "始める", bg: "blue" },
      { name: "グリッドトレーディング", description: "市場価格を下回る計算された価格レベルに買い注文を設定。テイクプロフィットで自動売却。取引ごと1ポイント。", icon: Layers, className: "col-span-3 lg:col-span-2", cta: "始める", bg: "purple" },
      { name: "スキャルピング", description: "RSIとMACDのシグナルを使った高速取引。設定したストップロスとテイクプロフィットを使用。取引ごと1ポイント。", icon: Zap, className: "col-span-3 lg:col-span-2", cta: "始める", bg: "orange" },
      { name: "実際のBinanceデータ", description: "BinanceのリアルタイムOHLCVデータ。シミュレートされたスリッページと0.1%の手数料で実行。", icon: TrendingUp, className: "col-span-3 lg:col-span-1", cta: "詳しく", bg: "green" },
      { name: "インジケーター条件", description: "RSI、MACD、ボリンジャーバンド、移動平均をAND/ORロジックで組み合わせる。", icon: BarChart2, className: "col-span-3 lg:col-span-1", cta: "条件を作成", bg: null },
      { name: "ライブ通知", description: "すべての買い、売り、テイクプロフィット、ストップロス、ボットイベントのリアルタイムアラート。", icon: Bell, className: "col-span-3 lg:col-span-1", cta: "通知を見る", bg: null },
      { name: "ポイントシステム", description: "すべての戦略で成功した取引ごとに1ポイントが差し引かれます。ポイントは期限切れになりません。", icon: ShieldCheck, className: "col-span-3 lg:col-span-1", cta: "パッケージを見る", bg: null },
    ],
  },
  pt: {
    title: "Tudo o que seus bots precisam",
    subtitle: "Construído para traders que levam a estratégia a sério",
    features: [
      { name: "Estratégia DCA", description: "Compre em intervalos regulares usando indicadores RSI, MACD e MA. Defina condições de entrada/saída. 1 ponto por trade.", icon: Coins, className: "col-span-3 lg:col-span-1", cta: "Começar", bg: "blue" },
      { name: "Grid Trading", description: "Coloque ordens de compra em níveis de preço calculados. Vende automaticamente no take profit. 1 ponto por trade.", icon: Layers, className: "col-span-3 lg:col-span-2", cta: "Começar", bg: "purple" },
      { name: "Scalping", description: "Trades rápidos usando sinais RSI e MACD. Usa seu stop loss e take profit configurados. 1 ponto por trade.", icon: Zap, className: "col-span-3 lg:col-span-2", cta: "Começar", bg: "orange" },
      { name: "Dados reais da Binance", description: "Preços ao vivo e velas OHLCV da Binance com slippage simulado e taxas de 0,1%.", icon: TrendingUp, className: "col-span-3 lg:col-span-1", cta: "Saiba mais", bg: "green" },
      { name: "Condições de indicadores", description: "Combine RSI, MACD, Bandas de Bollinger e médias móveis com lógica E/OU.", icon: BarChart2, className: "col-span-3 lg:col-span-1", cta: "Criar condições", bg: null },
      { name: "Notificações ao vivo", description: "Alertas em tempo real para cada compra, venda, take profit, stop loss e evento do bot.", icon: Bell, className: "col-span-3 lg:col-span-1", cta: "Ver notificações", bg: null },
      { name: "Sistema de pontos", description: "1 ponto deduzido por trade bem-sucedido em todas as estratégias. Os pontos nunca expiram.", icon: ShieldCheck, className: "col-span-3 lg:col-span-1", cta: "Ver pacotes", bg: null },
    ],
  },
  zh: {
    title: "您的机器人所需的一切",
    subtitle: "专为认真对待策略的交易者而构建",
    features: [
      { name: "DCA策略", description: "使用RSI、MACD和MA指标定期买入。设置进出场条件，让机器人处理其余事项。每笔交易1积分。", icon: Coins, className: "col-span-3 lg:col-span-1", cta: "开始", bg: "blue" },
      { name: "网格交易", description: "在低于市场价的计算价格水平下单买入。自动在您的止盈价卖出。适合横盘市场。每笔交易1积分。", icon: Layers, className: "col-span-3 lg:col-span-2", cta: "开始", bg: "purple" },
      { name: "剥头皮", description: "使用RSI和MACD动量信号进行快速交易。使用您配置的止损和止盈。每笔交易1积分。", icon: Zap, className: "col-span-3 lg:col-span-2", cta: "开始", bg: "orange" },
      { name: "真实Binance数据", description: "来自Binance的实时价格和OHLCV蜡烛图，模拟滑点和0.1%交易费。", icon: TrendingUp, className: "col-span-3 lg:col-span-1", cta: "了解更多", bg: "green" },
      { name: "指标条件", description: "用AND/OR逻辑组合RSI、MACD、布林带和移动平均线，构建精确的进出场规则。", icon: BarChart2, className: "col-span-3 lg:col-span-1", cta: "创建条件", bg: null },
      { name: "实时通知", description: "每次买入、卖出、止盈、止损、机器人生命周期事件和积分不足警告的实时提醒。", icon: Bell, className: "col-span-3 lg:col-span-1", cta: "查看通知", bg: null },
      { name: "积分系统", description: "所有策略每笔成功交易扣除1积分。通过加密货币充值购买积分。积分永不过期。", icon: ShieldCheck, className: "col-span-3 lg:col-span-1", cta: "查看套餐", bg: null },
    ],
  },
}

const BG: Record<string, JSX.Element> = {
  blue: <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50" />,
  purple: <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-50" />,
  orange: <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-50" />,
  green: <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-50" />,
}

export default function ProductOverview() {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background -z-10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl">{t.subtitle}</p>
        </div>
        <BentoGrid className="max-w-7xl mx-auto">
          {t.features.map((feature, idx) => (
            <BentoCard key={idx} name={feature.name} className={cn("relative group", feature.className)}
              background={feature.bg ? BG[feature.bg] : undefined}
              Icon={feature.icon} description={feature.description} href="/register" cta={feature.cta} />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}