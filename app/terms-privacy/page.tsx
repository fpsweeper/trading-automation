'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronDown, ArrowLeft } from 'lucide-react'

export default function TermsPrivacyPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms')
  const [openSection, setOpenSection] = useState<number | null>(0)

  const termsData = [
    {
      title: '1. Introduction',
      content:
        'Welcome to Harvest 3. These Terms of Service ("Terms") govern your access to and use of the Harvest 3 website, mobile applications, trading automation tools, and related services (collectively, the "Service"). By using Harvest 3, you agree to be legally bound by these Terms. If you do not agree, you must discontinue use of the Service immediately.',
    },
    {
      title: '2. Eligibility and Accounts',
      content:
        'You must be at least 18 years old and legally permitted to use trading platforms in your jurisdiction. You are responsible for safeguarding your account credentials and for all activity conducted through your account. Harvest 3 is not responsible for unauthorized access resulting from your failure to secure your account.',
    },
    {
      title: '3. Trading Automation & User Control',
      content:
        'Harvest 3 provides software tools that allow users to automate trading strategies on supported exchanges. You retain full control over strategy configuration, activation, and deactivation. We do not initiate trades independently, and all trading activity occurs strictly according to parameters defined by you.',
    },
    {
      title: '4. No Financial Advice',
      content:
        'Harvest 3 does not provide investment, financial, tax, or legal advice. Any information, indicators, or performance data provided through the Service are for informational purposes only and should not be construed as recommendations or guarantees of profit.',
    },
    {
      title: '5. Trading Risks',
      content:
        'Trading digital assets and using automated strategies involve substantial risk, including the potential loss of all invested capital. Market conditions, system latency, exchange outages, and software errors may impact performance. Past results are not indicative of future outcomes. You assume full responsibility for all trading decisions and results.',
    },
    {
      title: '6. API Keys and Security',
      content:
        'You are solely responsible for the creation, permissions, and security of exchange API keys connected to Harvest 3. We strongly recommend using restricted permissions and IP whitelisting where available. Harvest 3 is not liable for losses caused by compromised API credentials or misconfigured permissions.',
    },
    {
      title: '7. Service Availability',
      content:
        'We do not guarantee uninterrupted or error-free operation of the Service. Maintenance, updates, exchange issues, or force majeure events may result in downtime or degraded performance.',
    },
    {
      title: '8. Limitation of Liability',
      content:
        'To the maximum extent permitted by law, Harvest 3 shall not be liable for any indirect, incidental, consequential, or punitive damages. Our total liability for any claim related to the Service shall not exceed the fees paid by you to Harvest 3 during the twelve (12) months preceding the claim.',
    },
    {
      title: '9. Termination',
      content:
        'We may suspend or terminate your access to the Service at any time, with or without notice, if we believe you have violated these Terms or applicable laws. Upon termination, your right to use the Service immediately ceases.',
    },
    {
      title: '10. Governing Law',
      content:
        'These Terms are governed by and construed in accordance with the laws of the jurisdiction in which Harvest 3 operates, without regard to conflict of law principles.',
    },
  ]

  const privacyData = [
    {
      title: '1. Information We Collect',
      content:
        'We collect information you provide directly, including name, email address, and account details. We also collect technical data such as IP address, device information, and usage activity. Exchange API data is collected solely to enable trading automation.',
    },
    {
      title: '2. How We Use Information',
      content:
        'Your information is used to operate, maintain, and improve the Service, communicate important updates, provide customer support, and prevent fraud or abuse. We may use aggregated data for analytics and performance monitoring.',
    },
    {
      title: '3. Data Sharing',
      content:
        'We do not sell your personal data. Information may be shared with trusted service providers who assist in operating the Service, or when required by law or regulatory authorities.',
    },
    {
      title: '4. Data Security',
      content:
        'We use industry-standard security practices including encryption, access controls, and secure infrastructure. However, no system is completely secure, and we cannot guarantee absolute protection.',
    },
    {
      title: '5. API Keys & Exchange Data',
      content:
        'API keys are encrypted at rest and in transit. Harvest 3 never stores your exchange passwords and only performs actions explicitly authorized by your API permissions.',
    },
    {
      title: '6. Cookies & Analytics',
      content:
        'Cookies and similar technologies are used to maintain sessions, improve usability, and analyze platform usage. You may control cookies through your browser settings.',
    },
    {
      title: '7. Your Rights',
      content:
        'You may request access, correction, or deletion of your personal data, subject to legal and operational requirements. Account deletion requests can be made through support.',
    },
    {
      title: '8. Children’s Privacy',
      content:
        'Harvest 3 is not intended for individuals under 18 years of age, and we do not knowingly collect data from minors.',
    },
    {
      title: '9. International Transfers',
      content:
        'Your data may be processed in jurisdictions outside your country of residence. By using the Service, you consent to such transfers.',
    },
    {
      title: '10. Contact',
      content:
        'For privacy-related questions, contact us at privacy@harvest3.com. We aim to respond within 30 days.',
    },
  ]

  const data = activeTab === 'terms' ? termsData : privacyData

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/70 backdrop-blur">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Terms & Privacy
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Learn how Harvest 3 operates, the risks involved in trading
            automation, and how we protect your data.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Tabs */}
        <div className="mb-8">
          <div className="grid grid-cols-2 max-w-md rounded-xl bg-secondary p-1">
            <button
              onClick={() => setActiveTab('terms')}
              className={`py-2 rounded-lg font-medium transition ${activeTab === 'terms'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground'
                }`}
            >
              Terms
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-2 rounded-lg font-medium transition ${activeTab === 'privacy'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground'
                }`}
            >
              Privacy
            </button>
          </div>
        </div>

        <div className="max-w-full">
          {/* Last Updated */}
          <Card className="mb-8 p-4 sm:p-6 bg-secondary/30">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Last Updated:</span>{' '}
              January 23, 2026
            </p>
          </Card>

          {/* Accordion */}
          <div className="space-y-3">
            {data.map((section, index) => {
              const isOpen = openSection === index

              return (
                <Card key={index} className="border border-border">
                  <button
                    onClick={() =>
                      setOpenSection(isOpen ? null : index)
                    }
                    className="w-full text-left p-4 sm:p-6 flex items-start justify-between gap-4"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-base sm:text-lg">
                      {section.title}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    />
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

          {/* CTA */}
          <Card className="mt-12 p-6 sm:p-8 text-center bg-primary/5 border-primary/40">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Questions or concerns?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our support team is happy to clarify anything about our terms or
              privacy practices.
            </p>
            <Button>Contact Support</Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
