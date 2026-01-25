"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  LogOut,
  ArrowLeft,
  Settings,
  Play,
  Pause,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  Zap,
  Copy,
  CheckCircle,
} from "lucide-react"

export default function BotDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const botId = params.id as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
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

  // Mock bot details data
  const bot = {
    id: botId,
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
    config: {
      gridLevels: 10,
      gridSpread: "1%",
      takeProfitPercentage: "10%",
      stopLossPercentage: "5%",
      positionSize: "$1,000",
      maxActiveTrades: 5,
      simulationMode: false,
    },
  }

  // Mock activity log
  const activityLog = [
    {
      id: "act001",
      type: "trade",
      action: "Sell order completed",
      amount: "+$125.50",
      time: "2 minutes ago",
      status: "completed",
    },
    {
      id: "act002",
      type: "trade",
      action: "Buy signal triggered",
      amount: "-$1,000",
      time: "15 minutes ago",
      status: "completed",
    },
    {
      id: "act003",
      type: "alert",
      action: "Grid level reached",
      amount: "Level 5/10",
      time: "1 hour ago",
      status: "info",
    },
    {
      id: "act004",
      type: "trade",
      action: "Partial take profit",
      amount: "+$85.25",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: "act005",
      type: "alert",
      action: "Price volatility detected",
      amount: "±2.3%",
      time: "3 hours ago",
      status: "warning",
    },
  ]

  // Mock positions
  const positions = [
    {
      id: "pos001",
      symbol: "BTC",
      amount: 0.5,
      entryPrice: 43250,
      currentPrice: 45120,
      value: 22560,
      gain: 935,
      gainPercentage: 4.32,
      status: "open",
    },
    {
      id: "pos002",
      symbol: "BTC",
      amount: 0.25,
      entryPrice: 42800,
      currentPrice: 45120,
      value: 11280,
      gain: 577.5,
      gainPercentage: 5.38,
      status: "open",
    },
    {
      id: "pos003",
      symbol: "BTC",
      amount: 0.1,
      entryPrice: 44500,
      currentPrice: 45120,
      value: 4512,
      gain: 62,
      gainPercentage: 1.4,
      status: "pending",
    },
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
            <Link href="/bots">
              <Button variant="outline" size="sm">
                Back to Bots
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bot Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{bot.name}</h1>
              <div
                className={`w-3 h-3 rounded-full ${
                  bot.status === "running"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              />
              <span className="text-sm font-medium capitalize text-muted-foreground">{bot.status}</span>
            </div>
            <p className="text-muted-foreground">{bot.strategy} • {bot.pair}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              className={`${
                bot.status === "running"
                  ? "bg-yellow-600 text-white hover:bg-yellow-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              size="sm"
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
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-6 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Profit</p>
            <p className="text-2xl font-bold text-green-500">
              ${bot.profit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-green-600">+{bot.profitPercentage}%</p>
          </Card>

          <Card className="p-6 border border-border">
            <p className="text-xs text-muted-foreground mb-1">ROI</p>
            <p className="text-2xl font-bold text-foreground">{bot.roi}%</p>
            <p className="text-xs text-muted-foreground">Return on investment</p>
          </Card>

          <Card className="p-6 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Trades</p>
            <p className="text-2xl font-bold text-foreground">{bot.trades}</p>
            <p className="text-xs text-muted-foreground">Total executed</p>
          </Card>

          <Card className="p-6 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-foreground">{bot.winRate}%</p>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </Card>

          <Card className="p-6 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Uptime</p>
            <p className="text-2xl font-bold text-foreground">{bot.uptime}</p>
            <p className="text-xs text-muted-foreground">Availability</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bot Configuration */}
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Configuration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Strategy</p>
                <p className="text-sm font-medium text-foreground">{bot.strategy}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Trading Pair</p>
                <p className="text-sm font-medium text-foreground">{bot.pair}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Grid Levels</p>
                <p className="text-sm font-medium text-foreground">{bot.config.gridLevels}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Grid Spread</p>
                <p className="text-sm font-medium text-foreground">{bot.config.gridSpread}</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Take Profit</p>
                <p className="text-sm font-medium text-foreground">{bot.config.takeProfitPercentage}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Stop Loss</p>
                <p className="text-sm font-medium text-foreground">{bot.config.stopLossPercentage}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Position Size</p>
                <p className="text-sm font-medium text-foreground">{bot.config.positionSize}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Max Active Trades</p>
                <p className="text-sm font-medium text-foreground">{bot.config.maxActiveTrades}</p>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  {bot.config.simulationMode ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <p className="text-sm text-blue-600">Simulation Mode</p>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <p className="text-sm text-green-600">Live Trading</p>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground pt-2">
                Started: {bot.startDate}
              </p>
            </div>
          </Card>

          {/* Status */}
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Status</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-700">Running</p>
                  <p className="text-xs text-green-600">Bot is active</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-700">Monitoring</p>
                  <p className="text-xs text-blue-600">Real-time signals</p>
                </div>
                <Zap className="w-5 h-5 text-blue-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/30 border border-border/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Last Update</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>

              <Button variant="outline" className="w-full border-border bg-transparent" size="sm">
                Edit Configuration
              </Button>
            </div>
          </Card>

          {/* Performance Summary */}
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Performance</h2>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Profit</p>
                <p className="text-xl font-bold text-green-500">
                  ${bot.profit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Daily Average</p>
                <p className="text-xl font-bold text-green-500">
                  ${(bot.profit / 12).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Based on 12 days running</p>
              </div>

              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Winning Trades</p>
                <p className="text-lg font-bold text-foreground">
                  {Math.round(bot.trades * (bot.winRate / 100))} / {bot.trades}
                </p>
              </div>

              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${bot.winRate}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Positions Table */}
        <Card className="border border-border overflow-hidden mb-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold">Open Positions</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase">
                    Entry Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase">
                    Current Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase">
                    Value
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase">
                    Gain/Loss
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{position.symbol}</td>
                    <td className="px-6 py-4 text-muted-foreground">{position.amount}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      ${position.entryPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-foreground font-medium">
                      ${position.currentPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-foreground font-medium">
                      ${position.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {position.gain >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                        <div
                          className={position.gain >= 0 ? "text-green-500 font-medium" : "text-destructive font-medium"}
                        >
                          ${Math.abs(position.gain).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div
                          className={`text-xs ${
                            position.gainPercentage >= 0 ? "text-green-600" : "text-destructive"
                          }`}
                        >
                          ({position.gainPercentage > 0 ? "+" : ""}
                          {position.gainPercentage.toFixed(2)}%)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs font-medium capitalize px-2 py-1 rounded-full ${
                          position.status === "open"
                            ? "bg-green-500/20 text-green-700"
                            : "bg-yellow-500/20 text-yellow-700"
                        }`}
                      >
                        {position.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Activity Log */}
        <Card className="border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Activity Log
            </h2>
          </div>

          <div className="divide-y divide-border">
            {activityLog.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-secondary/30 transition-colors flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    activity.status === "completed"
                      ? "bg-green-500"
                      : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`font-medium ${
                          activity.amount.startsWith("+") ? "text-green-500" : "text-foreground"
                        }`}
                      >
                        {activity.amount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-border">
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              View Full History
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
