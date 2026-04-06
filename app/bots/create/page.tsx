"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogOut, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function CreateBotPage() {
  const router = useRouter()
  const { t } = useLanguage()

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
    return (<div className="min-h-screen flex items-center justify-center bg-background"> <div className="text-muted-foreground">Loading...</div> </div>
    )
  }

  if (!isAuthenticated) return null

  const strategies = [
    { id: "grid", name: t.gridTrading, description: t.gridDesc },
    { id: "dca", name: t.dca, description: t.dcaDesc },
    { id: "arbitrage", name: t.arbitrage, description: t.arbitrageDesc },
    { id: "momentum", name: t.momentum, description: t.momentumDesc },
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

  return (<div className="min-h-screen bg-background text-foreground">
    {/* Header */} <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"> <Link href="/" className="flex items-center gap-2"> <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"> <span className="text-primary-foreground font-bold text-sm">H3</span> </div> <span className="font-bold">Harvest 3</span> </Link>

      ```
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Welcome, {username}
        </span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
    </header>

    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link href="/bots" className="flex items-center gap-2 text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t.backToBots}
      </Link>

      {/* Success */}
      {showSuccess && (
        <Card className="p-4 mb-6 bg-green-500/10 border border-green-500/30">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-green-700">{t.success}</p>
              <p className="text-sm text-green-600">{t.redirecting}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.createBot}</h1>
        <p className="text-muted-foreground">{t.configureStrategy}</p>
      </div>

      {/* Steps */}
      <div className="mb-8 flex items-center gap-2">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= stepNum ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
            >
              {stepNum}
            </div>
            {stepNum < 4 && <div className="w-12 h-1 rounded-full bg-secondary" />}
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        {step >= 1 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">{t.botDetails}</h2>

            <label>{t.botName}</label>
            <Input name="botName" value={formData.botName} onChange={handleInputChange} />

            <label className="mt-4 block">{t.strategy}</label>
            <select name="strategy" value={formData.strategy} onChange={handleInputChange}>
              {strategies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - {s.description}
                </option>
              ))}
            </select>
          </Card>
        )}

        {/* Step 2 */}
        {step >= 2 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">{t.tradingPair}</h2>

            <label>{t.selectPair}</label>
            <select name="pair" value={formData.pair} onChange={handleInputChange}>
              {pairs.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <label className="mt-4">{t.gridLevels}</label>
            <Input name="gridLevels" value={formData.gridLevels} onChange={handleInputChange} />

            <label className="mt-4">{t.gridSpread}</label>
            <Input name="gridPrice" value={formData.gridPrice} onChange={handleInputChange} />
          </Card>
        )}

        {/* Step 3 */}
        {step >= 3 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">{t.parameters}</h2>

            <label>{t.takeProfit}</label>
            <Input />

            <label>{t.stopLoss}</label>
            <Input />

            <label>{t.positionSize}</label>
            <Input />

            <label>{t.maxTrades}</label>
            <Input />
          </Card>
        )}

        {/* Step 4 */}
        {step >= 4 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">{t.simulationMode}</h2>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="simulationMode"
                checked={formData.simulationMode}
                onChange={handleInputChange}
              />
              {t.runSimulation}
            </label>

            {formData.simulationMode && (
              <div className="mt-4 flex gap-2 text-blue-600">
                <AlertCircle className="w-4 h-4" />
                <p>{t.simulationDesc}</p>
              </div>
            )}
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <Button onClick={() => setStep(Math.max(1, step - 1))}>
            {t.previous}
          </Button>

          <span>
            {t.step} {step} {t.of} 4
          </span>

          {step === 4 ? (
            <Button onClick={handleCreateBot}>{t.createBotBtn}</Button>
          ) : (
            <Button onClick={() => setStep(Math.min(4, step + 1))}>
              {t.next}
            </Button>
          )}
        </div>
      </div>
    </main>
  </div>

  )
}
