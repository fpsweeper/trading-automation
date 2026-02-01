"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  LogOut,
  Play,
  Pause,
  Trash2,
  Settings,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Clock,
  Activity,
  Power,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface Bot {
  id: string
  name: string
  strategy: string
  pair: string
  status: "running" | "paused" | "stopped"
  profit: number
  profitPercentage: number
  roi: number
  startDate: string
  trades: number
  winRate: number
  uptime: string
}

export default function BotsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [botStates, setBotStates] = useState<{ [key: string]: "running" | "paused" | "stopped" }>({
    bot001: "running",
    bot002: "running",
    bot003: "paused",
    bot004: "running",
  })
  const [formData, setFormData] = useState({
    botName: "",
    strategy: "grid",
    pair: "BTC/USDT",
    gridLevels: "10",
    gridPrice: "1",
    simulationMode: false,
  })

  useEffect(() => {
    /*const auth = localStorage.getItem("harvest3_auth")
    if (!auth) {
      router.push("/login")
      return
    }

    const authData = JSON.parse(auth)
    setUsername(authData.username)*/
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
    setShowModal(false)
    setFormData({
      botName: "",
      strategy: "grid",
      pair: "BTC/USDT",
      gridLevels: "10",
      gridPrice: "1",
      simulationMode: false,
    })
  }

  const toggleBotStatus = (botId: string) => {
    setBotStates((prev) => ({
      ...prev,
      [botId]: prev[botId] === "running" ? "paused" : "running",
    }))
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

  const baseBots: Bot[] = [
    {
      id: "bot001",
      name: "BTC Grid Bot",
      strategy: "Grid Trading",
      pair: "BTC/USDT",
      status: "running",
      profit: 1245.5,
      profitPercentage: 12.4,
      roi: 24.8,
      startDate: "2024-01-10",
      trades: 156,
      winRate: 68,
      uptime: "99.8%",
    },
    {
      id: "bot002",
      name: "ETH DCA Bot",
      strategy: "Dollar Cost Averaging",
      pair: "ETH/USDT",
      status: "running",
      profit: 850.25,
      profitPercentage: 8.5,
      roi: 17.0,
      startDate: "2024-01-05",
      trades: 120,
      winRate: 72,
      uptime: "99.9%",
    },
    {
      id: "bot003",
      name: "SOL Arbitrage",
      strategy: "Arbitrage",
      pair: "SOL/USDT",
      status: "paused",
      profit: 420.75,
      profitPercentage: 4.2,
      roi: 8.4,
      startDate: "2024-01-01",
      trades: 89,
      winRate: 75,
      uptime: "98.5%",
    },
    {
      id: "bot004",
      name: "Multi-Pair Bot",
      strategy: "Momentum",
      pair: "BTC/ETH/SOL",
      status: "running",
      profit: 2100.0,
      profitPercentage: 21.0,
      roi: 42.0,
      startDate: "2023-12-20",
      trades: 234,
      winRate: 65,
      uptime: "99.5%",
    },
  ]

  const bots = baseBots.map((bot) => ({
    ...bot,
    status: botStates[bot.id] as "running" | "paused" | "stopped",
  }))

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
      {/*<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H3</span>
            </div>
            <span className="font-bold">Harvest 3</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {username}</span>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
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
      </header>*/}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bot Management</h1>
            <p className="text-muted-foreground">Create and manage your trading automation bots</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Bot
          </Button>
        </div>

        {/* Bot Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Bots</h3>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{bots.length}</p>
            <p className="text-xs text-muted-foreground mt-2">{bots.filter((b) => b.status === "running").length} running</p>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Profit</h3>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-500">
              $
              {bots
                .reduce((acc, bot) => acc + bot.profit, 0)
                .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-green-600 mt-2">Combined earnings</p>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Avg Win Rate</h3>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {(bots.reduce((acc, bot) => acc + bot.winRate, 0) / bots.length).toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">Success rate</p>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Avg ROI</h3>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {(bots.reduce((acc, bot) => acc + bot.roi, 0) / bots.length).toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">Return on investment</p>
          </Card>
        </div>

        {/* Bots List */}
        <div className="space-y-4">
          {bots.map((bot) => (
            <Card
              key={bot.id}
              className="p-6 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start mb-4">
                {/* Bot Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-foreground">{bot.name}</h3>
                    <div
                      className={`w-2 h-2 rounded-full ${bot.status === "running"
                        ? "bg-green-500"
                        : bot.status === "paused"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                        }`}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{bot.strategy}</p>
                  <p className="text-xs text-muted-foreground mt-1">{bot.pair}</p>
                </div>

                {/* Performance */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Profit</p>
                  <p className="text-lg font-bold text-green-500">
                    ${bot.profit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-green-600">+{bot.profitPercentage}%</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Trades</p>
                    <p className="text-lg font-bold text-foreground">{bot.trades}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="text-lg font-bold text-foreground">{bot.winRate}%</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <Link href={`/bots/${bot.id}`}>
                    <Button variant="outline" size="sm" className="border-border bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-border bg-transparent ${bot.status === "running"
                      ? "text-yellow-600 hover:bg-yellow-500/10"
                      : "text-green-600 hover:bg-green-500/10"
                      }`}
                    onClick={() => toggleBotStatus(bot.id)}
                  >
                    {bot.status === "running" ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-destructive hover:bg-destructive/10 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground">Uptime</p>
                    <p className="text-xs font-medium text-foreground">{bot.uptime}</p>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${parseFloat(bot.uptime)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Create Bot Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur-sm">
              <h2 className="text-2xl font-bold">Create New Bot</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Bot Name */}
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

              {/* Strategy Selection */}
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
                <p className="text-xs text-muted-foreground italic mt-2">
                  {strategies.find((s) => s.id === formData.strategy)?.description}
                </p>
              </div>

              {/* Pair Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Trading Pair</label>
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

              {/* Parameters */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Parameters</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Grid Levels</label>
                    <Input
                      type="number"
                      name="gridLevels"
                      value={formData.gridLevels}
                      onChange={handleInputChange}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Grid Spread (%)</label>
                    <Input
                      type="number"
                      name="gridPrice"
                      value={formData.gridPrice}
                      onChange={handleInputChange}
                      step="0.1"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Take Profit (%)</label>
                    <Input
                      type="number"
                      placeholder="10"
                      defaultValue="10"
                      step="0.1"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Stop Loss (%)</label>
                    <Input
                      type="number"
                      placeholder="5"
                      defaultValue="5"
                      step="0.1"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Simulation Toggle */}
              <div>
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
                  <div className="mt-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">Simulation Mode Enabled</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Your bot will trade with virtual funds. No real transactions will occur.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-border bg-background/95 backdrop-blur-sm">
              <Button
                variant="outline"
                className="border-border bg-transparent"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBot}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Bot
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
