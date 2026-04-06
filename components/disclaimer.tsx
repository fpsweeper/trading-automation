"use client"

import { AlertCircle, ShieldAlert } from "lucide-react"
import { Card } from "@/components/ui/card"
import { BlurFade } from "@/components/ui/blur-fade"
import { useLanguage } from "@/contexts/LanguageContext"

const translations = {
  en: {
    title: "Risk Disclosure",
    subtitle: "Please read carefully before using the platform",
    content: [
      "Harvest 3 is a simulation trading platform. All trades are simulated using real market data from Binance. No real money is traded, and no real assets are bought or sold.",
      "Past simulation performance is not indicative of future results. Strategy outcomes in simulation may differ significantly from real-market trading due to slippage, liquidity, and execution differences.",
      "This platform is not investment advice. Nothing on Harvest 3 constitutes financial advice. Always consult a qualified financial advisor before making real investment decisions.",
      "The points system represents platform credits used to operate bots. Points are consumed per trade and can be purchased via crypto deposit. Points have no monetary value and are non-refundable.",
      "Harvest 3 is not liable for any decisions made based on simulation results, nor for any technical issues including bot execution delays, data interruptions, or platform downtime.",
    ],
  },
  fr: {
    title: "Divulgation des risques",
    subtitle: "Veuillez lire attentivement avant d'utiliser la plateforme",
    content: [
      "Harvest 3 est une plateforme de trading en simulation. Tous les trades sont simulés avec des données de marché réelles de Binance. Aucun argent réel n'est échangé.",
      "Les performances passées en simulation ne garantissent pas les résultats futurs. Les résultats peuvent différer significativement du trading réel.",
      "Cette plateforme ne constitue pas un conseil en investissement. Consultez toujours un conseiller financier qualifié avant de prendre de vraies décisions d'investissement.",
      "Le système de points représente des crédits de plateforme. Les points n'ont aucune valeur monétaire et ne sont pas remboursables.",
      "Harvest 3 n'est pas responsable des décisions prises sur la base des résultats de simulation ni des problèmes techniques.",
    ],
  },
  es: {
    title: "Divulgación de riesgos",
    subtitle: "Por favor lea atentamente antes de usar la plataforma",
    content: [
      "Harvest 3 es una plataforma de trading de simulación. Todos los trades se simulan con datos reales de Binance. No se opera con dinero real.",
      "El rendimiento pasado en simulación no indica resultados futuros. Los resultados pueden diferir significativamente del trading real.",
      "Esta plataforma no constituye asesoramiento de inversión. Consulte siempre a un asesor financiero calificado antes de tomar decisiones reales.",
      "El sistema de puntos representa créditos de plataforma. Los puntos no tienen valor monetario y no son reembolsables.",
      "Harvest 3 no es responsable de las decisiones tomadas basándose en resultados de simulación ni de problemas técnicos.",
    ],
  },
  de: {
    title: "Risikohinweis",
    subtitle: "Bitte lesen Sie dies sorgfältig, bevor Sie die Plattform verwenden",
    content: [
      "Harvest 3 ist eine Simulations-Trading-Plattform. Alle Trades werden mit echten Binance-Marktdaten simuliert. Es wird kein echtes Geld gehandelt.",
      "Vergangene Simulationsleistungen sind kein Indikator für zukünftige Ergebnisse. Simulationsergebnisse können erheblich vom realen Handel abweichen.",
      "Diese Plattform ist keine Anlageberatung. Konsultieren Sie immer einen qualifizierten Finanzberater, bevor Sie echte Investitionsentscheidungen treffen.",
      "Das Punktesystem stellt Plattform-Credits dar. Punkte haben keinen Geldwert und sind nicht erstattungsfähig.",
      "Harvest 3 haftet nicht für Entscheidungen auf Basis von Simulationsergebnissen oder für technische Probleme.",
    ],
  },
  ja: {
    title: "リスク開示",
    subtitle: "プラットフォームを使用する前に注意深くお読みください",
    content: [
      "Harvest 3はシミュレーション取引プラットフォームです。すべての取引はBinanceの実際の市場データを使用してシミュレートされます。実際のお金は取引されません。",
      "過去のシミュレーションパフォーマンスは将来の結果を示すものではありません。シミュレーション結果は実際の取引と大きく異なる場合があります。",
      "このプラットフォームは投資アドバイスではありません。実際の投資決定を行う前に、資格のある金融アドバイザーに相談してください。",
      "ポイントシステムはプラットフォームクレジットを表します。ポイントに金銭的価値はなく、返金不可です。",
      "Harvest 3はシミュレーション結果に基づく決定や技術的問題に対して責任を負いません。",
    ],
  },
  pt: {
    title: "Divulgação de riscos",
    subtitle: "Por favor, leia atentamente antes de usar a plataforma",
    content: [
      "Harvest 3 é uma plataforma de trading de simulação. Todas as negociações são simuladas usando dados reais de mercado da Binance. Nenhum dinheiro real é negociado.",
      "O desempenho passado em simulação não indica resultados futuros. Os resultados podem diferir significativamente do trading real.",
      "Esta plataforma não constitui conselho de investimento. Consulte sempre um consultor financeiro qualificado antes de tomar decisões reais.",
      "O sistema de pontos representa créditos da plataforma. Os pontos não têm valor monetário e não são reembolsáveis.",
      "Harvest 3 não é responsável por decisões tomadas com base em resultados de simulação ou por problemas técnicos.",
    ],
  },
  zh: {
    title: "风险披露",
    subtitle: "使用平台前请仔细阅读",
    content: [
      "Harvest 3是一个模拟交易平台。所有交易都使用Binance的真实市场数据进行模拟。不交易真实货币，不买卖真实资产。",
      "过去的模拟表现不代表未来结果。由于滑点、流动性和执行差异，模拟结果可能与真实市场交易有显著差异。",
      "本平台不提供投资建议。在做出真实投资决策之前，请始终咨询合格的金融顾问。",
      "积分系统代表用于运营机器人的平台积分。积分没有货币价值，不可退款。",
      "Harvest 3对基于模拟结果做出的任何决定或任何技术问题（包括机器人执行延迟、数据中断或平台停机）不承担责任。",
    ],
  },
}

export default function Disclaimer() {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/5 to-background -z-10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <BlurFade delay={0.2} inView>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-destructive" />
              </div>
              <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">{t.title}</h2>
                <p className="text-muted-foreground mt-2">{t.subtitle}</p>
              </div>
            </div>
          </BlurFade>
          <BlurFade delay={0.4} inView>
            <Card className="relative overflow-hidden border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-background">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-destructive/0 via-destructive/30 to-destructive/0 animate-pulse" />
              <div className="relative p-8 sm:p-10 space-y-6">
                {t.content.map((paragraph, idx) => (
                  <BlurFade key={idx} delay={0.2 + idx * 0.1} inView>
                    <div className="flex gap-4">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm sm:text-base leading-relaxed text-foreground/90">{paragraph}</p>
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