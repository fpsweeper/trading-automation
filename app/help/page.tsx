"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ChevronDown,
  Mail,
  MessageCircle,
  Github,
  Twitter,
  FileText,
  Zap,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Construction,
} from "lucide-react"
import GlowLine from "@/components/ui/glowline"

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      question: "How do I get started with Harvest 3?",
      answer: "Start by creating an account and connecting your exchange API keys. Then navigate to the Bots section to create your first trading bot by selecting a strategy, trading pair, and parameters.",
    },
    {
      question: "What strategies are available?",
      answer: "We offer four main strategies: Grid Trading (profit from volatility), Dollar Cost Averaging (regular investing), Arbitrage (price differences), and Momentum (trend following). Each strategy is optimized for different market conditions.",
    },
    {
      question: "Is my API key secure?",
      answer: "Yes, your API keys are encrypted and stored securely. We recommend setting IP restrictions and read-only permissions when generating API keys from your exchange. Never share your API secret with anyone.",
    },
    {
      question: "What fees does Harvest 3 charge?",
      answer: "We charge a performance fee of 20% on profits after losses are recovered. There are no monthly subscription fees. You only pay when you profit.",
    },
    {
      question: "Can I test a bot before going live?",
      answer: "Yes! Each bot can be run in Simulation Mode, which allows you to test your strategy with virtual funds before risking real money.",
    },
    {
      question: "How do I withdraw funds?",
      answer: "Navigate to your Wallet section, click 'Withdraw', enter the amount and destination address. Withdrawals are processed within 24 hours.",
    },
  ]

  const guides = [
    {
      title: "Getting Started",
      description: "Learn the basics of Harvest 3 and set up your first bot",
      icon: BookOpen,
      topics: ["Creating an account", "Connecting your exchange", "Understanding the dashboard"],
    },
    {
      title: "Bot Management",
      description: "Master bot creation, configuration, and monitoring",
      icon: Zap,
      topics: ["Creating bots", "Configuring strategies", "Setting up alerts"],
    },
    {
      title: "Security Best Practices",
      description: "Keep your account and funds secure",
      icon: FileText,
      topics: ["API key management", "Two-factor authentication", "Account protection"],
    },
    {
      title: "Trading Strategies",
      description: "Deep dive into each trading strategy",
      icon: HelpCircle,
      topics: ["Grid trading explained", "DCA strategies", "Risk management"],
    },
  ]

  const contactChannels = [
    {
      title: "Email Support",
      description: "Get help via email",
      contact: "support@harvest3.com",
      icon: Mail,
      response: "Response within 24 hours",
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 24/7",
      icon: MessageCircle,
      response: "Average response: 5 minutes",
    },
    {
      title: "Community",
      description: "Join our Discord community",
      contact: "@harvest3_community",
      icon: Github,
      response: "Peer support available",
    },
    {
      title: "Twitter",
      description: "Follow for updates and news",
      contact: "@harvest3_trading",
      icon: Twitter,
      response: "Updates and announcements",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find answers to common questions, explore our guides, and get in touch with our support team.
          </p>
        </div>
      </div>
      <div className="relative w-full mb-6">
        <GlowLine
          orientation="horizontal"
          position="50%"
          color="lightgreen"
        />
      </div>
      <div className="w-full flex justify-center items-center py-15 text-5xl min-h-[30vh] text-center flex-wrap">
        <Construction className="w-50 h-50" />
        <div className="w-full text-center">Under Construction</div>

      </div>

    </div>
  )
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find answers to common questions, explore our guides, and get in touch with our support team.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* FAQs Section */}
        <div className="mb-16 max-w-3xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Find quick answers to common questions</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-foreground pr-4 text-lg">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""
                        }`}
                    />
                  </div>

                  {openFaq === index && (
                    <p className="text-muted-foreground mt-4 leading-relaxed">{faq.answer}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Guides Section */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Guides & Tutorials</h2>
            <p className="text-muted-foreground">Step-by-step guides to help you master Harvest 3</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide, index) => {
              const IconComponent = guide.icon
              return (
                <Card key={index} className="p-6 border border-border hover:border-primary/50 transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <h3 className="font-bold text-foreground mb-2 text-lg">{guide.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{guide.description}</p>

                  <div className="space-y-2">
                    {guide.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">{topic}</span>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4 border-border bg-transparent group-hover:bg-primary/10">
                    Read Guide
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
            <p className="text-muted-foreground">Choose your preferred way to contact us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactChannels.map((channel, index) => {
              const IconComponent = channel.icon
              return (
                <Card key={index} className="p-6 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{channel.title}</h3>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-foreground font-medium">{channel.contact}</p>
                    <p className="text-xs text-muted-foreground">{channel.response}</p>
                  </div>

                  <Button variant="outline" className="w-full border-border bg-transparent hover:bg-primary/10">
                    Contact
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Status & Docs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card className="p-8 border border-border">
            <h3 className="text-xl font-bold mb-3">System Status</h3>
            <p className="text-muted-foreground mb-4">Check the current status of Harvest 3 services</p>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              View Status Page
            </Button>
          </Card>

          <Card className="p-8 border border-border">
            <h3 className="text-xl font-bold mb-3">API Documentation</h3>
            <p className="text-muted-foreground mb-4">Integrate Harvest 3 with your own tools</p>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              View Docs
            </Button>
          </Card>
        </div>

        {/* CTA */}
        <Card className="p-8 border border-primary/50 bg-primary/5 text-center">
          <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
          <p className="text-muted-foreground mb-6">Our support team is ready to assist you</p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Contact Support
          </Button>
        </Card>
      </main>
    </div>
  )
}
