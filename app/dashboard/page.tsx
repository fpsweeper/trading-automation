"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, TrendingUp, TrendingDown, DollarSign, Percent, Settings, AlertCircle, Bot, PieChart as PieChartIcon, X, Lock, Unlock, CheckCircle2, AlertTriangle, Plus } from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Input } from "@/components/ui/input"

export default function DashboardPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<"1D" | "1W" | "1M" | "3M" | "1Y" | "ALL">("1M")
  const [showExchangeModal, setShowExchangeModal] = useState(false)
  const [selectedExchange, setSelectedExchange] = useState<"binance" | "coinbase" | "kraken" | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [testingConnection, setTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState<"pending" | "success" | "error" | null>(null)
  const [connectedExchanges, setConnectedExchanges] = useState<{ name: string; connected: boolean }[]>([
    { name: "Binance", connected: true },
    { name: "Coinbase", connected: false },
    { name: "Kraken", connected: false },
  ])

  useEffect(() => {
    // Check if user is logged in
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

  const handleTestConnection = async () => {
    setTestingConnection(true)
    setTestResult("pending")
    // Simulate API test
    setTimeout(() => {
      if (apiKey.length > 10 && apiSecret.length > 10) {
        setTestResult("success")
      } else {
        setTestResult("error")
      }
      setTestingConnection(false)
    }, 1500)
  }

  const handleSaveExchange = () => {
    if (testResult === "success") {
      setConnectedExchanges((prev) =>
        prev.map((ex) =>
          ex.name === (selectedExchange === "binance" ? "Binance" : selectedExchange === "coinbase" ? "Coinbase" : "Kraken")
            ? { ...ex, connected: true }
            : ex
        )
      )
      handleCloseModal()
    }
  }

  const handleCloseModal = () => {
    setShowExchangeModal(false)
    setSelectedExchange(null)
    setApiKey("")
    setApiSecret("")
    setTestResult(null)
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

  // Mock portfolio data
  const portfolioData = {
    totalValue: 125450.32,
    totalCost: 98320.15,
    unrealizedGain: 27130.17,
    gainPercentage: 27.58,
    dayChange: 3250.45,
    dayChangePercentage: 2.66,
    totalPnL: 27130.17,
    assets: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        amount: 0.85,
        value: 62450.32,
        costBasis: 48000,
        gain: 14450.32,
        gainPercentage: 30.1,
        dayChange: 1520.32,
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        amount: 5.2,
        value: 38920.15,
        costBasis: 32500,
        gain: 6420.15,
        gainPercentage: 19.75,
        dayChange: 980.15,
      },
      {
        symbol: "SOL",
        name: "Solana",
        amount: 120,
        value: 24080.85,
        costBasis: 17820.15,
        gain: 6260.7,
        gainPercentage: 35.1,
        dayChange: 750.0,
      },
    ],
  }

  // Mock active bots and alerts data
  const activeBots = [
    { id: 1, name: "BTC Grid Bot", status: "running", profit: 1245.5 },
    { id: 2, name: "ETH DCA Bot", status: "running", profit: 850.25 },
    { id: 3, name: "SOL Arbitrage", status: "paused", profit: 420.75 },
  ]

  const alerts = [
    { id: 1, type: "success", message: "BTC Grid Bot completed cycle", time: "2 min ago" },
    { id: 2, type: "warning", message: "ETH price approaching stop loss", time: "5 min ago" },
    { id: 3, type: "info", message: "New trading opportunity detected", time: "12 min ago" },
  ]

  // Mock PnL chart data
  const pnlData = [
    { date: "Jan 1", pnl: 0, cumulative: 0 },
    { date: "Jan 8", pnl: 1200, cumulative: 1200 },
    { date: "Jan 15", pnl: 2800, cumulative: 4000 },
    { date: "Jan 22", pnl: 1500, cumulative: 5500 },
    { date: "Jan 29", pnl: 3200, cumulative: 8700 },
    { date: "Feb 5", pnl: 2100, cumulative: 10800 },
    { date: "Feb 12", pnl: 4500, cumulative: 15300 },
    { date: "Feb 19", pnl: 2800, cumulative: 18100 },
    { date: "Feb 26", pnl: 5200, cumulative: 23300 },
    { date: "Mar 5", pnl: 3830, cumulative: 27130 },
  ]

  // Asset balance pie chart data
  const assetBalanceData = portfolioData.assets.map((asset) => ({
    name: asset.symbol,
    value: parseFloat(asset.value.toFixed(2)),
  }))

  const colors = ["#8b5cf6", "#6366f1", "#3b82f6"]

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
              className="border-border bg-transparent"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="w-4 h-4" />
            </Button>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Portfolio Summary</h1>
          <p className="text-muted-foreground">View your trading automation performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Portfolio Value */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              $
              {portfolioData.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Cost basis: $
              {portfolioData.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </Card>

          {/* Unrealized Gain */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Unrealized Gain</h3>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">
              $
              {portfolioData.unrealizedGain.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-green-600 mt-2">{portfolioData.gainPercentage.toFixed(2)}% return</p>
          </Card>

          {/* 24h Change */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">24h Change</h3>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">
              ${portfolioData.dayChange.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-green-600 mt-2">+{portfolioData.dayChangePercentage.toFixed(2)}%</p>
          </Card>

          {/* Total Assets */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Assets</h3>
              <Percent className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{portfolioData.assets.length}</p>
            <p className="text-xs text-muted-foreground mt-2">Active holdings</p>
          </Card>

          {/* Total PnL */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total PnL</h3>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">
              ${portfolioData.totalPnL.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-green-600 mt-2">All-time profit</p>
          </Card>
        </div>

        {/* Connected Exchanges Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Connected Exchanges</h2>
            <Button
              onClick={() => setShowExchangeModal(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Exchange
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {connectedExchanges.map((exchange) => (
              <Card key={exchange.name} className="p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-foreground">{exchange.name}</h3>
                  {exchange.connected ? (
                    <Lock className="w-5 h-5 text-green-500" />
                  ) : (
                    <Unlock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-2 h-2 rounded-full ${exchange.connected ? "bg-green-500" : "bg-gray-500"}`}
                  />
                  <p className="text-sm text-muted-foreground">
                    {exchange.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-border bg-transparent"
                  onClick={() => {
                    setSelectedExchange(
                      exchange.name === "Binance" ? "binance" : exchange.name === "Coinbase" ? "coinbase" : "kraken"
                    )
                    setShowExchangeModal(true)
                  }}
                >
                  {exchange.connected ? "Edit" : "Connect"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Add/Edit Exchange Modal */}
      {showExchangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-xl border border-border">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95">
              <h2 className="text-2xl font-bold">
                {selectedExchange ? `Connect ${selectedExchange.charAt(0).toUpperCase() + selectedExchange.slice(1)}` : "Select Exchange"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {!selectedExchange ? (
                <div className="space-y-3">
                  {["binance", "coinbase", "kraken"].map((exchange) => (
                    <button
                      key={exchange}
                      onClick={() => setSelectedExchange(exchange as "binance" | "coinbase" | "kraken")}
                      className="w-full p-4 text-left border border-border rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <h3 className="font-medium text-foreground capitalize">{exchange}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Connect your {exchange} API keys</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* API Key Input */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">API Key</label>
                    <Input
                      type="password"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-secondary border-border text-foreground"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Keep this secure and don't share with anyone
                    </p>
                  </div>

                  {/* API Secret Input */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">API Secret</label>
                    <Input
                      type="password"
                      placeholder="Enter your API secret"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>

                  {/* Permissions Info */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium text-blue-700">Required Permissions</p>
                    <ul className="space-y-2">
                      {[
                        { name: "Read Balance", status: true },
                        { name: "Read Orders", status: true },
                        { name: "Place Orders", status: true },
                        { name: "Cancel Orders", status: true },
                      ].map((permission) => (
                        <li key={permission.name} className="flex items-center gap-2 text-sm">
                          {permission.status ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                          )}
                          <span className="text-blue-600">{permission.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Test Connection Button */}
                  <Button
                    onClick={handleTestConnection}
                    disabled={!apiKey || !apiSecret || testingConnection}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {testingConnection ? "Testing..." : "Test Connection"}
                  </Button>

                  {/* Test Result */}
                  {testResult && (
                    <div
                      className={`p-4 rounded-lg border flex items-start gap-3 ${
                        testResult === "success"
                          ? "bg-green-500/10 border-green-500/30"
                          : testResult === "error"
                            ? "bg-red-500/10 border-red-500/30"
                            : "bg-blue-500/10 border-blue-500/30"
                      }`}
                    >
                      {testResult === "success" && (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-700">Connection Successful</p>
                            <p className="text-sm text-green-600 mt-1">Your API credentials are valid and permissions are correct.</p>
                          </div>
                        </>
                      )}
                      {testResult === "error" && (
                        <>
                          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-700">Connection Failed</p>
                            <p className="text-sm text-red-600 mt-1">Please check your API key and secret are correct.</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-border bg-background/95">
              {selectedExchange && (
                <Button
                  variant="outline"
                  className="border-border bg-transparent"
                  onClick={() => setSelectedExchange(null)}
                >
                  Back
                </Button>
              )}
              <Button
                variant="outline"
                className="border-border bg-transparent"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              {selectedExchange && testResult === "success" && (
                <Button
                  onClick={handleSaveExchange}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Save Connection
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
