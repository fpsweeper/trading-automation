'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronDown, ArrowLeft } from 'lucide-react'
import GlowLine from '@/components/ui/glowline'

export default function TermsPrivacyPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms')
  const [openSection, setOpenSection] = useState<number | null>(0)

  const termsData = [
    {
      title: '1. Introduction',
      content:
        'Welcome to Harvest 3. These Terms of Service ("Terms") govern your access to and use of the Harvest 3 website, applications, and trading automation platform (collectively, the "Service"). By creating an account or using Harvest 3, you agree to be legally bound by these Terms. If you do not agree, you must stop using the Service immediately.',
    },
    {
      title: '2. Eligibility and Accounts',
      content:
        'You must be at least 18 years old and legally permitted to use trading platforms in your jurisdiction to use Harvest 3. You are responsible for safeguarding your account credentials and for all activity conducted through your account. Harvest 3 is not responsible for unauthorized access resulting from your failure to secure your login information.',
    },
    {
      title: '3. Trading Automation',
      content:
        'Harvest 3 provides software tools that allow users to create, configure, and deploy automated trading bots using strategies including DCA (Dollar Cost Averaging), Grid Trading, and Scalping. Bots operate based entirely on parameters defined by the user, including indicator conditions (RSI, MACD, Bollinger Bands, Moving Averages), stop loss, take profit, position size, timeframe, and trading pair. You retain full control over bot configuration, activation, and deactivation at all times.',
    },
    {
      title: '4. Trading Modes',
      content:
        'Harvest 3 currently offers a simulation trading mode, where bots execute trades using real market data with virtual balances. Simulated results do not represent real financial performance and carry no monetary value. Additional trading modes, including live trading with real assets, may be introduced in future platform updates and will be governed by supplemental terms and applicable financial regulations.',
    },
    {
      title: '5. Points System',
      content:
        'Harvest 3 operates on a points-based system for platform usage. One (1) point is deducted per successful trade executed by a bot, regardless of strategy type. Points are purchased via crypto deposit (USDT on supported blockchain networks). Points have no monetary value outside the platform, are non-transferable between accounts, and are non-refundable once consumed. Points do not expire once credited to your account.',
    },
    {
      title: '6. Deposits and Payments',
      content:
        'Deposits are made in USDT cryptocurrency on supported blockchain networks (Solana, BEP20, TRC20) and are used to purchase platform points. Once a deposit is confirmed on-chain and points are credited to your account, the transaction is final and non-refundable. Harvest 3 is not responsible for funds sent to incorrect addresses, network transaction fees, or failed blockchain transactions caused by user error.',
    },
    {
      title: '7. No Financial Advice',
      content:
        'Harvest 3 does not provide investment, financial, tax, or legal advice. All information, strategy configurations, indicators, and performance data available through the Service are for informational and automation purposes only. Nothing on this platform constitutes a recommendation to buy, sell, or hold any financial asset. You should consult a qualified financial advisor before making real investment decisions.',
    },
    {
      title: '8. Trading Risks',
      content:
        'Automated trading involves inherent risks. Market conditions can change rapidly and unpredictably. Past strategy performance does not guarantee future results. Bot misconfiguration, market volatility, data feed interruptions, exchange outages, and software limitations may adversely affect outcomes. You assume full responsibility for all bot configurations, strategy choices, and their results.',
    },
    {
      title: '9. Service Availability',
      content:
        'We do not guarantee uninterrupted or error-free operation of the Service. Scheduled maintenance, software updates, market data provider outages, or force majeure events may cause platform downtime or delayed bot execution. Bot execution runs on a scheduled cycle and is subject to real-time market data availability.',
    },
    {
      title: '10. Limitation of Liability',
      content:
        'To the maximum extent permitted by law, Harvest 3 shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Service, including losses resulting from bot misconfiguration, strategy underperformance, platform downtime, or inaccurate market data. Our total liability for any claim related to the Service shall not exceed the total amount paid by you to Harvest 3 during the twelve (12) months preceding the claim.',
    },
    {
      title: '11. Termination',
      content:
        'We may suspend or terminate your account at any time, with or without notice, if we believe you have violated these Terms or applicable laws. Upon termination, your access to the platform ceases immediately. Any remaining points balance is forfeited, as points carry no monetary value.',
    },
    {
      title: '12. Changes to Terms',
      content:
        'Harvest 3 reserves the right to modify these Terms at any time. Material changes will be communicated via email or in-app notification. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.',
    },
    {
      title: '13. Governing Law',
      content:
        'These Terms are governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising under these Terms shall be resolved through good-faith negotiation before any formal legal proceedings are initiated.',
    },
  ]

  const privacyData = [
    {
      title: '1. Information We Collect',
      content:
        'We collect information you provide directly, including your email address and account details at registration. We also collect technical data such as IP address, device information, browser type, and platform usage activity including bots created, trades executed, and deposits made.',
    },
    {
      title: '2. How We Use Your Information',
      content:
        'Your information is used to operate and maintain your account, process point deposits, execute your trading bots, send platform notifications (trade events, bot lifecycle changes, deposit confirmations, low points warnings), provide customer support, and prevent fraud or abuse. We may use aggregated, anonymized data for analytics and platform improvements.',
    },
    {
      title: '3. Data Sharing',
      content:
        'We do not sell your personal data to third parties. Information may be shared with trusted infrastructure providers (cloud hosting, database services) who assist in operating the platform, or when required by law or regulatory authorities. All third-party service providers are bound by confidentiality obligations.',
    },
    {
      title: '4. Data Security',
      content:
        'We use industry-standard security practices including encryption at rest and in transit, access controls, and secure infrastructure. However, no system is completely secure. You are responsible for keeping your account credentials confidential and not sharing them with others.',
    },
    {
      title: '5. Crypto Deposits',
      content:
        'When you make a crypto deposit, your wallet address and transaction hash are recorded to verify and credit your points balance. This data is stored securely and used solely for deposit verification purposes. Harvest 3 does not store private keys or have custody of your crypto assets at any time.',
    },
    {
      title: '6. Notifications',
      content:
        'Harvest 3 sends in-app notifications for platform events including bot trade executions (buy, sell, take profit, stop loss), bot lifecycle changes (started, paused, stopped, auto-paused), deposit confirmations, and low points balance alerts. Notification history is stored and accessible within your account.',
    },
    {
      title: '7. Cookies and Analytics',
      content:
        'Cookies and similar technologies are used to maintain login sessions, remember your preferences (theme, language), and analyze platform usage patterns. You may control cookies through your browser settings, though disabling certain cookies may affect platform functionality.',
    },
    {
      title: '8. Your Rights',
      content:
        'You have the right to request access to, correction of, or deletion of your personal data at any time, subject to legal and operational requirements. Account deletion requests can be submitted through our support channel. Upon deletion, your account data, bot configurations, and trade history will be permanently removed.',
    },
    {
      title: "9. Children's Privacy",
      content:
        'Harvest 3 is not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors. If we become aware that a minor has created an account, we will terminate it promptly and delete associated data.',
    },
    {
      title: '10. International Data Transfers',
      content:
        'Your data may be processed in jurisdictions outside your country of residence, including countries that may have different data protection laws and standards. By using the Service, you consent to such transfers in accordance with this Privacy Policy.',
    },
    {
      title: '11. Data Retention',
      content:
        'We retain your account data for as long as your account remains active. Trade history, bot configurations, and deposit records are retained for operational and compliance purposes. You may request deletion of your data at any time by contacting support.',
    },
    {
      title: '12. Contact',
      content:
        'For privacy-related questions, data access requests, or deletion requests, contact us at privacy@harvest3.com. We aim to respond within 30 days of receiving your request.',
    },
  ]

  const data = activeTab === 'terms' ? termsData : privacyData

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/70 backdrop-blur">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Terms & Privacy</h1>
          <p className="text-muted-foreground max-w-2xl">
            Learn how Harvest 3 operates, the risks involved in automated
            trading, and how we protect your data.
          </p>
        </div>
      </header>

      <div className="relative w-full mb-6">
        <GlowLine orientation="horizontal" position="50%" color="lightgreen" />
      </div>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <div className="grid grid-cols-2 max-w-md rounded-xl bg-secondary p-1">
            <button
              onClick={() => { setActiveTab('terms'); setOpenSection(0) }}
              className={`py-2 rounded-lg font-medium transition ${activeTab === 'terms'
                  ? 'bg-background shadow text-foreground'
                  : 'text-muted-foreground'
                }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => { setActiveTab('privacy'); setOpenSection(0) }}
              className={`py-2 rounded-lg font-medium transition ${activeTab === 'privacy'
                  ? 'bg-background shadow text-foreground'
                  : 'text-muted-foreground'
                }`}
            >
              Privacy Policy
            </button>
          </div>
        </div>

        <div className="max-w-full">
          <Card className="mb-8 p-4 sm:p-6 bg-secondary/30">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Last Updated:</span>{' '}
              March 28, 2026
            </p>
          </Card>

          <div className="space-y-3">
            {data.map((section, index) => {
              const isOpen = openSection === index
              return (
                <Card key={index} className="border border-border">
                  <button
                    onClick={() => setOpenSection(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-6 flex items-start justify-between gap-4"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-base sm:text-lg">{section.title}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6 text-muted-foreground leading-relaxed">
                      {section.content}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          <Card className="mt-12 p-6 sm:p-8 text-center bg-primary/5 border-primary/40">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Questions or concerns?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is happy to clarify anything about our terms,
              privacy practices, points system, or deposit process.
            </p>
            <a href="mailto:support@harvest3.com">
              <Button>Contact Support</Button>
            </a>
          </Card>
        </div>
      </main>
    </div>
  )
}