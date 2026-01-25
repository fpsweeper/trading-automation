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
        'Welcome to Harvest 3. These Terms of Service ("Terms") govern your use of our website, mobile application, and services (collectively, the "Service"). By accessing or using Harvest 3, you agree to be bound by these Terms. If you do not agree to any part of these Terms, you may not use our Service.',
    },
    {
      title: '2. User Accounts',
      content:
        'You are responsible for maintaining the confidentiality of your account credentials and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or password.',
    },
    {
      title: '3. User Responsibilities',
      content:
        'You agree not to use the Service for any unlawful or prohibited purpose. You agree not to access or search the Service by any means other than our publicly supported interfaces. You agree not to attempt to gain unauthorized access to any portion or feature of the Service.',
    },
    {
      title: '4. Trading Risks',
      content:
        'Trading cryptocurrencies and automated trading strategies involve substantial risk of loss. Past performance is not indicative of future results. You acknowledge that you understand the risks involved and accept full responsibility for your trading decisions and losses.',
    },
    {
      title: '5. API Keys and Security',
      content:
        'You are responsible for all activities that occur through your API keys. We recommend enabling IP whitelisting and using read-only permissions when providing API access. We are not liable for any losses resulting from compromised API keys or unauthorized access.',
    },
    {
      title: '6. Limitation of Liability',
      content:
        'In no event shall Harvest 3 be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability to you for any claims arising out of or relating to these Terms shall not exceed the amount paid by you to us in the past 12 months.',
    },
    {
      title: '7. Disclaimer of Warranties',
      content:
        'The Service is provided "as is" without warranties of any kind. We do not warrant that the Service will be uninterrupted, error-free, or free from viruses or other harmful components. You use the Service at your own risk.',
    },
    {
      title: '8. Modification of Terms',
      content:
        'We reserve the right to modify these Terms at any time. Changes will be effective upon posting to the website. Your continued use of the Service after any modification constitutes your acceptance of the modified Terms.',
    },
    {
      title: '9. Termination',
      content:
        'We may terminate or suspend your account and access to the Service at our sole discretion, without notice or liability, for any reason or no reason, including if you violate these Terms.',
    },
    {
      title: '10. Governing Law',
      content:
        'These Terms are governed by and construed in accordance with the laws of the jurisdiction in which Harvest 3 is incorporated, without regard to its conflict of law principles.',
    },
  ]

  const privacyData = [
    {
      title: '1. Information We Collect',
      content:
        'We collect information you provide directly, such as name, email address, and account information. We also collect information about your interactions with our Service, including IP address, browser type, and pages visited. Additionally, we collect information from your exchange API connections to facilitate trading services.',
    },
    {
      title: '2. How We Use Your Information',
      content:
        'We use your information to provide, maintain, and improve our Service. We use it to communicate with you about updates and changes. We use it to detect and prevent fraudulent transactions and abuse. We may also use your information for analytics and research purposes.',
    },
    {
      title: '3. Information Sharing',
      content:
        'We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our Service. We may disclose information when required by law or to protect our rights and the safety of our users.',
    },
    {
      title: '4. Data Security',
      content:
        'We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your information.',
    },
    {
      title: '5. API Keys and Exchange Data',
      content:
        'Your API keys are encrypted and stored securely on our servers. We only use your API keys to execute trading commands as directed by you. We never store your exchange passwords. You can revoke API access at any time through your exchange account.',
    },
    {
      title: '6. Cookies and Tracking',
      content:
        'We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser. We use analytics tools to understand how users interact with our Service and improve functionality.',
    },
    {
      title: '7. Your Rights',
      content:
        'You have the right to access your personal information and request corrections. You have the right to request deletion of your account and associated data. You can opt-out of marketing communications at any time by contacting us.',
    },
    {
      title: '8. Children\'s Privacy',
      content:
        'Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete such information immediately.',
    },
    {
      title: '9. International Data Transfers',
      content:
        'Your information may be transferred to, stored in, and processed in countries other than your country of residence. By using our Service, you consent to the transfer of your information to countries outside your country of residence.',
    },
    {
      title: '10. Contact Us',
      content:
        'If you have questions about our Privacy Policy, please contact us at privacy@harvest3.com. We will respond to your inquiry within 30 days. You can also contact us through our Help & Support page.',
    },
  ]

  const data = activeTab === 'terms' ? termsData : privacyData

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Terms & Privacy</h1>
          <p className="text-lg text-muted-foreground">
            Read our Terms of Service and Privacy Policy to understand how we protect your data
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Selection */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-6 py-3 font-medium rounded-lg transition-colors ${
              activeTab === 'terms'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-3 font-medium rounded-lg transition-colors ${
              activeTab === 'privacy'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Privacy Policy
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl">
          {/* Last Updated */}
          <Card className="p-6 border border-border mb-8 bg-secondary/20">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Last Updated:</span> January 23, 2026
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {activeTab === 'terms'
                ? 'These Terms of Service govern your use of Harvest 3 and all related services.'
                : 'This Privacy Policy explains how we collect, use, and protect your information.'}
            </p>
          </Card>

          {/* Sections */}
          <div className="space-y-3">
            {data.map((section, index) => (
              <Card
                key={index}
                className="border border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setOpenSection(openSection === index ? null : index)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-foreground pr-4 text-lg">{section.title}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                        openSection === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {openSection === index && (
                    <p className="text-muted-foreground mt-4 leading-relaxed">{section.content}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <Card className="mt-12 p-8 border border-primary/50 bg-primary/5 text-center">
            <h2 className="text-2xl font-bold mb-2">Questions about our policies?</h2>
            <p className="text-muted-foreground mb-6">
              Contact our support team for clarification on any terms or privacy practices.
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Contact Support
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
