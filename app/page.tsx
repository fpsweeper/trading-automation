"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import ProductOverview from "@/components/product-overview"
import Disclaimer from "@/components/disclaimer"
import Footer from "@/components/footer"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <ProductOverview />
      <Features />
      <Disclaimer />
      <Footer />
    </main>
  )
}
