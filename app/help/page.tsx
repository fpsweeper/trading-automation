"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, Mail, Construction } from "lucide-react"
import GlowLine from "@/components/ui/glowline"
import { useLanguage } from "@/contexts/LanguageContext"

const t = {
  en: { title: "Help & Support", subtitle: "Find answers to common questions or get in touch with our team.", underConstruction: "Under Construction", coming: "Full documentation and support portal coming soon.", contact: "In the meantime, reach us at", faqs: "Frequently Asked Questions", faqList: [{ q: "How do I get started?", a: "Create an account, top up your points balance via crypto deposit, then go to Bots and create your first trading bot using a DCA, Grid, or Scalping strategy." }, { q: "What strategies are available?", a: "Harvest 3 offers three strategies: DCA (Dollar Cost Averaging), Grid Trading, and Scalping. Each can be configured with custom indicator conditions, stop loss, and take profit." }, { q: "How do points work?", a: "Each successful trade executed by a bot costs 1 point. Points are purchased via USDT deposit on Solana, BEP20, or TRC20 networks. Points never expire." }, { q: "What happens when points run out?", a: "When your points balance reaches zero, your bot is automatically paused. You'll receive a notification and can top up anytime to resume." }, { q: "Is Harvest 3 using real money?", a: "Currently, Harvest 3 operates in simulation mode — bots execute trades using real Binance market data but with virtual balances. No real funds are traded." }, { q: "How do I deposit points?", a: "Go to the Dashboard or Wallet, select a package and network (Solana, BEP20, TRC20), send the exact USDT amount shown, then submit your transaction hash." }] },
  fr: { title: "Aide & Support", subtitle: "Trouvez des réponses aux questions courantes ou contactez notre équipe.", underConstruction: "En construction", coming: "La documentation complète et le portail de support arrivent bientôt.", contact: "En attendant, contactez-nous à", faqs: "Questions fréquemment posées", faqList: [{ q: "Comment commencer ?", a: "Créez un compte, rechargez votre solde de points via dépôt crypto, puis allez dans Bots et créez votre premier bot avec une stratégie DCA, Grid ou Scalping." }, { q: "Quelles stratégies sont disponibles ?", a: "Harvest 3 propose trois stratégies : DCA, Grid Trading et Scalping. Chacune peut être configurée avec des conditions d'indicateurs personnalisées, stop loss et take profit." }, { q: "Comment fonctionnent les points ?", a: "Chaque trade réussi exécuté par un bot coûte 1 point. Les points sont achetés via un dépôt USDT sur les réseaux Solana, BEP20 ou TRC20. Les points n'expirent pas." }, { q: "Que se passe-t-il quand les points sont épuisés ?", a: "Quand votre solde de points atteint zéro, votre bot est automatiquement mis en pause. Vous recevrez une notification et pourrez recharger à tout moment." }, { q: "Harvest 3 utilise-t-il de l'argent réel ?", a: "Actuellement, Harvest 3 fonctionne en mode simulation — les bots exécutent des trades avec des données de marché Binance réelles mais avec des soldes virtuels." }, { q: "Comment déposer des points ?", a: "Allez dans le Tableau de bord, sélectionnez un forfait et un réseau, envoyez le montant USDT exact affiché, puis soumettez votre hash de transaction." }] },
  es: { title: "Ayuda & Soporte", subtitle: "Encuentra respuestas a preguntas comunes o contáctanos.", underConstruction: "En construcción", coming: "Documentación completa y portal de soporte próximamente.", contact: "Mientras tanto, contáctanos en", faqs: "Preguntas frecuentes", faqList: [{ q: "¿Cómo empezar?", a: "Crea una cuenta, recarga tu saldo de puntos mediante depósito en cripto, luego ve a Bots y crea tu primer bot de trading." }, { q: "¿Qué estrategias están disponibles?", a: "Harvest 3 ofrece tres estrategias: DCA, Grid Trading y Scalping. Cada una se puede configurar con condiciones de indicadores personalizadas." }, { q: "¿Cómo funcionan los puntos?", a: "Cada trade exitoso ejecutado por un bot cuesta 1 punto. Los puntos se compran mediante depósito USDT y nunca caducan." }, { q: "¿Qué pasa cuando se agotan los puntos?", a: "Cuando tu saldo llega a cero, tu bot se pausa automáticamente y recibirás una notificación." }, { q: "¿Harvest 3 usa dinero real?", a: "Actualmente, Harvest 3 opera en modo simulación con datos de mercado reales de Binance pero con saldos virtuales." }, { q: "¿Cómo depositar puntos?", a: "Ve al Panel, selecciona un paquete y red, envía el monto exacto de USDT y envía tu hash de transacción." }] },
  de: { title: "Hilfe & Support", subtitle: "Finden Sie Antworten auf häufige Fragen oder kontaktieren Sie unser Team.", underConstruction: "Im Aufbau", coming: "Vollständige Dokumentation und Support-Portal folgen bald.", contact: "In der Zwischenzeit erreichen Sie uns unter", faqs: "Häufig gestellte Fragen", faqList: [{ q: "Wie fange ich an?", a: "Erstellen Sie ein Konto, laden Sie Ihr Punkteguthaben per Krypto-Einzahlung auf, dann erstellen Sie Ihren ersten Trading-Bot." }, { q: "Welche Strategien sind verfügbar?", a: "Harvest 3 bietet drei Strategien: DCA, Grid Trading und Scalping, jeweils mit konfigurierbaren Indikatorbedingungen." }, { q: "Wie funktionieren Punkte?", a: "Jeder erfolgreiche Trade kostet 1 Punkt. Punkte werden per USDT-Einzahlung gekauft und verfallen nicht." }, { q: "Was passiert, wenn Punkte aufgebraucht sind?", a: "Wenn Ihr Saldo null erreicht, wird Ihr Bot automatisch pausiert und Sie erhalten eine Benachrichtigung." }, { q: "Verwendet Harvest 3 echtes Geld?", a: "Derzeit läuft Harvest 3 im Simulationsmodus mit echten Binance-Marktdaten aber virtuellen Guthaben." }, { q: "Wie zahle ich Punkte ein?", a: "Gehen Sie zum Dashboard, wählen Sie ein Paket und Netzwerk, senden Sie den genauen USDT-Betrag und übermitteln Sie Ihren Transaktions-Hash." }] },
  ja: { title: "ヘルプ＆サポート", subtitle: "よくある質問の回答を見つけるか、チームにお問い合わせください。", underConstruction: "工事中", coming: "完全なドキュメントとサポートポータルは近日公開予定です。", contact: "その間は以下にお問い合わせください：", faqs: "よくある質問", faqList: [{ q: "始め方は？", a: "アカウントを作成し、暗号通貨入金でポイントをチャージして、ボットページで最初のトレーディングボットを作成してください。" }, { q: "どんな戦略が利用できますか？", a: "Harvest 3はDCA、グリッドトレーディング、スキャルピングの3つの戦略を提供しています。" }, { q: "ポイントはどのように機能しますか？", a: "ボットによる各成功トレードは1ポイントを消費します。ポイントはUSDT入金で購入でき、有効期限はありません。" }, { q: "ポイントがなくなったら？", a: "残高がゼロになると、ボットは自動的に一時停止され、通知が届きます。" }, { q: "Harvest 3は実際のお金を使いますか？", a: "現在、Harvest 3はシミュレーションモードで動作しており、実際のBinance市場データを使用しますが、仮想残高でトレードします。" }, { q: "ポイントを入金するには？", a: "ダッシュボードでパッケージとネットワークを選択し、表示された正確なUSDT金額を送金してください。" }] },
  pt: { title: "Ajuda & Suporte", subtitle: "Encontre respostas para perguntas comuns ou entre em contato com nossa equipe.", underConstruction: "Em construção", coming: "Documentação completa e portal de suporte em breve.", contact: "Enquanto isso, entre em contato conosco em", faqs: "Perguntas frequentes", faqList: [{ q: "Como começar?", a: "Crie uma conta, recarregue seu saldo de pontos via depósito cripto e crie seu primeiro bot de trading." }, { q: "Quais estratégias estão disponíveis?", a: "Harvest 3 oferece três estratégias: DCA, Grid Trading e Scalping, cada uma configurável com condições de indicadores." }, { q: "Como funcionam os pontos?", a: "Cada trade bem-sucedido executado por um bot custa 1 ponto. Os pontos são comprados via depósito USDT e nunca expiram." }, { q: "O que acontece quando os pontos acabam?", a: "Quando seu saldo chega a zero, seu bot é pausado automaticamente e você recebe uma notificação." }, { q: "Harvest 3 usa dinheiro real?", a: "Atualmente, Harvest 3 opera em modo simulação com dados reais da Binance mas com saldos virtuais." }, { q: "Como depositar pontos?", a: "Vá ao Painel, selecione um pacote e rede, envie o valor exato de USDT e envie seu hash de transação." }] },
  zh: { title: "帮助与支持", subtitle: "查找常见问题的答案或联系我们的团队。", underConstruction: "建设中", coming: "完整文档和支持门户即将推出。", contact: "与此同时，请联系我们：", faqs: "常见问题", faqList: [{ q: "如何开始？", a: "创建账户，通过加密货币存款充值积分余额，然后前往机器人页面创建您的第一个交易机器人。" }, { q: "有哪些策略？", a: "Harvest 3提供三种策略：DCA、网格交易和剥头皮，每种都可以配置自定义指标条件。" }, { q: "积分如何运作？", a: "机器人执行的每笔成功交易消耗1积分。积分通过USDT存款购买，永不过期。" }, { q: "积分用完怎么办？", a: "当您的积分余额为零时，您的机器人会自动暂停，您会收到通知。" }, { q: "Harvest 3使用真实货币吗？", a: "目前，Harvest 3在模拟模式下运行，使用真实的币安市场数据，但使用虚拟余额进行交易。" }, { q: "如何存入积分？", a: "前往仪表板，选择套餐和网络，发送显示的确切USDT金额，然后提交您的交易哈希。" }] },
}

export default function HelpPage() {
  const { language } = useLanguage()
  const tr = t[language as keyof typeof t] || t.en
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">{tr.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">{tr.subtitle}</p>
        </div>
      </div>
      <div className="relative w-full mb-6"><GlowLine orientation="horizontal" position="50%" color="lightgreen" /></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Under Construction banner */}
        <Card className="mb-12 p-8 border border-border text-center">
          <Construction className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">{tr.underConstruction}</h2>
          <p className="text-muted-foreground mb-4">{tr.coming}</p>
          <p className="text-sm text-muted-foreground">
            {tr.contact}{" "}
            <a href="mailto:support@harvest3.com" className="text-primary hover:underline">support@harvest3.com</a>
          </p>
        </Card>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">{tr.faqs}</h2>
          <div className="space-y-3">
            {tr.faqList.map((faq, index) => (
              <Card key={index} className="border border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-foreground pr-4 text-lg">{faq.q}</h3>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
                  </div>
                  {openFaq === index && <p className="text-muted-foreground mt-4 leading-relaxed">{faq.a}</p>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}