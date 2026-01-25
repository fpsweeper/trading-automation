"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

const translations = {
  en: {
    title: "Important Disclaimer",
    content: [
      'Harvest 3 is provided "as is" without warranties. Trading and investing carry significant risks, including the potential loss of principal.',
      "Past performance is not indicative of future results. All trading strategies carry risk, and users must understand these risks before deploying any strategy.",
      "This platform is not investment advice. Consult with qualified financial advisors before making investment decisions. Users are solely responsible for their trading decisions and outcomes.",
      "Market conditions can change rapidly. The system may experience technical issues, latency, or outages that could affect trading performance.",
      "Harvest 3 is not liable for losses incurred through the use of this platform, including losses due to technical failures or market volatility.",
    ],
  },
  es: {
    title: "Aviso Legal Importante",
    content: [
      'Harvest 3 se proporciona "tal cual" sin garantías. El comercio e inversión conllevan riesgos significativos, incluyendo la pérdida potencial del capital.',
      "El rendimiento pasado no es indicativo de resultados futuros. Todas las estrategias comerciales conllevan riesgos, y los usuarios deben entender estos riesgos antes de implementar cualquier estrategia.",
      "Esta plataforma no es asesoramiento de inversión. Consulte con asesores financieros calificados antes de tomar decisiones de inversión.",
      "Las condiciones del mercado pueden cambiar rápidamente. El sistema puede experimentar problemas técnicos, latencia u interrupciones que podrían afectar el rendimiento del trading.",
      "Harvest 3 no es responsable de las pérdidas incurridas a través del uso de esta plataforma, incluyendo pérdidas debido a fallos técnicos o volatilidad del mercado.",
    ],
  },
  fr: {
    title: "Avis Juridique Important",
    content: [
      'Harvest 3 est fourni "tel quel" sans garanties. Le trading et l\'investissement comportent des risques importants, y compris la perte potentielle du capital.',
      "Les performances passées ne sont pas indicatives des résultats futurs. Toutes les stratégies de trading comportent des risques, et les utilisateurs doivent comprendre ces risques avant de déployer une stratégie.",
      "Cette plateforme n'est pas un conseil en investissement. Consultez des conseillers financiers qualifiés avant de prendre des décisions d'investissement.",
      "Les conditions du marché peuvent changer rapidement. Le système peut connaître des problèmes techniques, de la latence ou des interruptions qui pourraient affecter les performances du trading.",
      "Harvest 3 n'est pas responsable des pertes subies par l'utilisation de cette plateforme, y compris les pertes dues à des défaillances techniques ou à la volatilité du marché.",
    ],
  },
  de: {
    title: "Wichtiger Disclaimer",
    content: [
      'Harvest 3 wird "wie gehabt" ohne Gewährleistung bereitgestellt. Handel und Investitionen bergen erhebliche Risiken, einschließlich des möglichen Kapitalverlusts.',
      "Die bisherige Wertentwicklung ist kein Indikator für künftige Ergebnisse. Alle Handelsstrategien bergen Risiken, und Benutzer müssen diese Risiken verstehen, bevor sie eine Strategie einsetzen.",
      "Diese Plattform ist keine Anlageberatung. Konsultieren Sie vor Investitionsentscheidungen mit qualifizierten Finanzberatern.",
      "Marktbedingungen können sich schnell ändern. Das System kann technische Probleme, Latenz oder Ausfallzeiten erleben, die die Handelsleistung beeinträchtigen könnten.",
      "Harvest 3 haftet nicht für Verluste, die durch die Nutzung dieser Plattform entstehen, einschließlich Verluste aufgrund technischer Fehler oder Marktvolatilität.",
    ],
  },
  ja: {
    title: "重要な免責事項",
    content: [
      "Harvest 3は「現状有姿」で保証なしで提供されます。トレーディングと投資には元本損失の可能性を含む重大なリスクが伴います。",
      "過去のパフォーマンスは将来の結果を示すものではありません。すべてのトレーディング戦略にはリスクが伴い、戦略をデプロイする前にこれらのリスクを理解する必要があります。",
      "このプラットフォームは投資アドバイスではありません。投資決定を行う前に、適格な財務顧問に相談してください。",
      "市場条件は急速に変わる可能性があります。システムは技術的な問題、遅延、またはトレーディングパフォーマンスに影響を与える可能性のある停止を経験する可能性があります。",
      "Harvest 3は、このプラットフォームの使用により発生した損失（技術的障害または市場変動による損失を含む）に対して責任を負いません。",
    ],
  },
  pt: {
    title: "Aviso Legal Importante",
    content: [
      'Harvest 3 é fornecido "como está" sem garantias. O trading e investimento envolvem riscos significativos, incluindo perda potencial do principal.',
      "O desempenho passado não é indicativo de resultados futuros. Todas as estratégias de trading envolvem risco, e os usuários devem entender esses riscos antes de implementar qualquer estratégia.",
      "Esta plataforma não é conselho de investimento. Consulte consultores financeiros qualificados antes de tomar decisões de investimento.",
      "As condições do mercado podem mudar rapidamente. O sistema pode sofrer problemas técnicos, latência ou interrupções que podem afetar o desempenho do trading.",
      "Harvest 3 não é responsável por perdas incorridas através do uso desta plataforma, incluindo perdas devido a falhas técnicas ou volatilidade do mercado.",
    ],
  },
  zh: {
    title: "重要免责声明",
    content: [
      'Harvest 3以"现状"提供，不提供任何担保。交易和投资涉及重大风险，包括本金损失的可能性。',
      "过往表现不代表未来结果。所有交易策略都存在风险，用户在部署任何策略之前必须了解这些风险。",
      "该平台不是投资建议。在做出投资决定之前，请咨询合格的财务顾问。",
      "市场条件可能会迅速变化。系统可能会遇到技术问题、延迟或中断，这可能会影响交易性能。",
      "Harvest 3不对通过使用此平台导致的任何损失负责，包括因技术故障或市场波动导致的损失。",
    ],
  },
}

export default function Disclaimer() {
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 mt-1">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t.title}</h2>
          </div>

          <Card className="p-6 sm:p-8 border border-destructive/20 bg-destructive/5">
            <div className="space-y-4">
              {t.content.map((paragraph, idx) => (
                <p key={idx} className="text-sm sm:text-base text-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
