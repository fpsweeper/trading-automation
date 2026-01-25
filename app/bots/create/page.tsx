"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogOut, ArrowLeft, CheckCircle, AlertCircle, Settings } from "lucide-react"

export default function CreateBotPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    botName: "",
    strategy: "grid",
    pair: "BTC/USDT",
    gridLevels: "10",
    gridPrice: "1",
    simulationMode: false,
  })
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("harvest3_auth")
    if (!auth) {
      router.push("/login")
      return
    }

    const authData = JSON.parse(auth)
    setUsername(authData.username)
    setIsAuthenticated(true)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("harvest3_auth")
    router.push("/login")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const inputElement = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? inputElement.checked : value,
    }))
  }

  const handleCreateBot = () => {
    setShowSuccess(true)
    setTimeout(() => {
      router.push("/bots")
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const strategies = [
    { id: "grid", name: "Grid Trading", description: "Profit from volatility with grid levels" },
    { id: "dca", name: "Dollar Cost Averaging", description: "Invest fixed amounts at intervals" },
    { id: "arbitrage", name: "Arbitrage", description: "Exploit price differences" },
    { id: "momentum", name: "Momentum", description: "Follow market trends" },
  ]

  const pairs = [
    "BTC/USDT",
    "ETH/USDT",
    "SOL/USDT",
    "BTC/ETH",
    "ETH/SOL",
    "ADA/USDT",
    "XRP/USDT",
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H3</span>
            </div>
            <span className="font-bold">Harvest 3</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {username}</span>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-destructive hover:bg-destructive/10 bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link href="/bots" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Bots
        </Link>

        {/* Success Message */}
        {showSuccess && (
          <Card className="p-4 mb-6 bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-700">Bot created successfully!</p>
                <p className="text-sm text-green-600">Redirecting to bot details...</p>
              </div>
            </div>
          </Card>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Bot</h1>
          <p className="text-muted-foreground">Configure your automated trading strategy</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= stepNum
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 4 && (
                <div
                  className={`w-12 h-1 rounded-full ${
                    step > stepNum ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Bot Details */}
          {step >= 1 && (
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <h2 className="text-xl font-bold">Bot Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Bot Name</label>
                  <Input
                    type="text"
                    name="botName"
                    placeholder="e.g., My BTC Grid Bot"
                    value={formData.botName}
                    onChange={handleInputChange}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Strategy</label>
                  <select
                    name="strategy"
                    value={formData.strategy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
                  >
                    {strategies.map((strat) => (
                      <option key={strat.id} value={strat.id}>
                        {strat.name} - {strat.description}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-muted-foreground italic">
                  {strategies.find((s) => s.id === formData.strategy)?.description}
                </p>
              </div>
            </Card>
          )}

          {/* Step 2: Pair Selection */}
          {step >= 2 && (
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <h2 className="text-xl font-bold">Trading Pair</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Select Pair</label>
                  <select
                    name="pair"
                    value={formData.pair}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
                  >
                    {pairs.map((pair) => (
                      <option key={pair} value={pair}>
                        {pair}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Grid Levels</label>
                    <Input
                      type="number"
                      name="gridLevels"
                      value={formData.gridLevels}
                      onChange={handleInputChange}
                      className="bg-secondary border-border text-foreground"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Number of price levels</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Grid Spread (%)</label>
                    <Input
                      type="number"
                      name="gridPrice"
                      value={formData.gridPrice}
                      onChange={handleInputChange}
                      step="0.1"
                      className="bg-secondary border-border text-foreground"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Percentage between levels</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Parameters */}
          {step >= 3 && (
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <h2 className="text-xl font-bold">Parameters</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Take Profit (%)</label>
                    <Input
                      type="number"
                      placeholder="10"
                      defaultValue="10"
                      step="0.1"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Stop Loss (%)</label>
                    <Input
                      type="number"
                      placeholder="5"
                      defaultValue="5"
                      step="0.1"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Position Size (USDT)</label>
                    <Input
                      type="number"
                      placeholder="1000"
                      defaultValue="1000"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Max Active Trades</label>
                    <Input
                      type="number"
                      placeholder="5"
                      defaultValue="5"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Simulation Toggle */}
          {step >= 4 && (
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  4
                </div>
                <h2 className="text-xl font-bold">Simulation Mode</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg border border-border/50 cursor-pointer hover:bg-secondary/40 transition-colors">
                  <input
                    type="checkbox"
                    name="simulationMode"
                    checked={formData.simulationMode}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-foreground">Run in Simulation Mode</p>
                    <p className="text-sm text-muted-foreground">Test your strategy without risking real funds</p>
                  </div>
                </label>

                {formData.simulationMode && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">Simulation Mode Enabled</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Your bot will trade with virtual funds. No real transactions will occur. Perfect for backtesting strategies.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="border-border bg-transparent"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {step} of 4
            </div>

            {step === 4 ? (
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleCreateBot}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Bot
              </Button>
            ) : (
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setStep(Math.min(4, step + 1))}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
