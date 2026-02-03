"use client"

import { useState, useEffect } from "react"
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"
import { Check, Star } from "lucide-react"

const translations = {
  en: {
    title: "Trusted by traders worldwide",
    subtitle: "Join thousands of successful algorithmic traders",
    features: [
      "Real-time market data feeds",
      "Custom indicator library",
      "Multi-strategy portfolio",
      "Advanced risk management",
      "Paper trading sandbox",
      "Live trading integration",
      "Performance analytics",
      "API for custom solutions",
      "Backtesting engine",
      "Strategy marketplace",
      "Community signals",
      "24/7 monitoring",
    ],
    testimonials: [
      {
        name: "Alex Chen",
        role: "Quantitative Trader",
        content: "Harvest 3 has transformed my trading. The backtesting is incredibly accurate.",
        rating: 5,
      },
      {
        name: "Sarah Williams",
        role: "Day Trader",
        content: "Finally, a platform that actually works. My returns have doubled since switching.",
        rating: 5,
      },
      {
        name: "Michael Brown",
        role: "Crypto Trader",
        content: "The automation features are game-changing. I can sleep while my bots trade.",
        rating: 5,
      },
    ],
  },
}

const FeatureCard = ({ feature }: { feature: string }) => {
  return (
    <div className="relative w-64 flex-shrink-0">
      <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Check className="w-5 h-5 text-primary" />
        </div>
        <span className="font-medium">{feature}</span>
      </div>
    </div>
  )
}

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  return (
    <div className="relative w-80 flex-shrink-0">
      <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          ))}
        </div>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          "{testimonial.content}"
        </p>
        <div>
          <div className="font-semibold">{testimonial.name}</div>
          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function Features() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)
  }, [])

  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Features Marquee */}
        <div className="mb-16">
          <Marquee pauseOnHover className="[--duration:40s]">
            {t.features.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </Marquee>
        </div>

        {/* Testimonials Marquee */}
        <div>
          <Marquee reverse pauseOnHover className="[--duration:50s]">
            {t.testimonials.map((testimonial, idx) => (
              <TestimonialCard key={idx} testimonial={testimonial} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}