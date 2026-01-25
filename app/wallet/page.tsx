"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  LogOut,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Copy,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react"

export default function WalletPage() {
  const router = useRouter()
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

  // Mock wallet data
  const walletData = {
    credits: 5250.75,
    points: 12450,
    status: "active",
    totalDeposited: 15000,
    totalSpent: 9749.25,
  }

  // Mock usage history
  const usageHistory = [
    {
      id: "USG001",
      date: "2024-01-20",
      type: "bot",
      description: "BTC Grid Bot - 24h automation",
      amount: -125.5,
      status: "completed",
    },
    {
      id: "USG002",
      date: "2024-01-19",
      type: "bot",
      description: "ETH DCA Bot - Daily execution",
      amount: -89.75,
      status: "completed",
    },
    {
      id: "USG003",
      date: "2024-01-19",
      type: "fee",
      description: "Trading fees - January settlement",
      amount: -250.0,
      status: "completed",
    },
    {
      id: "USG004",
      date: "2024-01-18",
      type: "bot",
      description: "SOL Arbitrage Bot - 12h run",
      amount: -156.25,
      status: "completed",
    },
    {
      id: "USG005",
      date: "2024-01-17",
      type: "subscription",
      description: "Premium Plan - Monthly",
      amount: -99.99,
      status: "completed",
    },
    {
      id: "USG006",
      date: "2024-01-16",
      type: "bot",
      description: "Multi-pair Bot - Premium",
      amount: -428.75,
      status: "completed",
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wallet & Billing</h1>
          <p className="text-muted-foreground">Manage your account credits, points, and payment history</p>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Credits Balance */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Credits Balance</h3>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              ${walletData.credits.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-2">USD equivalent</p>
          </Card>

          {/* Points Balance */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Points Balance</h3>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{walletData.points.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Redeemable points</p>
          </Card>

          {/* Account Status */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-lg font-bold text-green-500 capitalize">{walletData.status}</p>
            <p className="text-xs text-green-600 mt-2">Verified and active</p>
          </Card>

          {/* Total Deposited */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Deposited</h3>
              <ArrowDownLeft className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${walletData.totalDeposited.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Lifetime deposits</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Deposit Instructions */}
          <div className="lg:col-span-1">
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Deposit Instructions</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      1
                    </div>
                    <p className="text-sm font-medium">Choose Payment Method</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">Credit card, debit card, or bank transfer</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      2
                    </div>
                    <p className="text-sm font-medium">Enter Amount</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">Minimum $10, no maximum limit</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      3
                    </div>
                    <p className="text-sm font-medium">Complete Payment</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">Secure payment processing via Stripe</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      4
                    </div>
                    <p className="text-sm font-medium">Credits Instant</p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">Credits appear in your account immediately</p>
                </div>

                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Make a Deposit
                </Button>
              </div>

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-700">
                  All payments are encrypted and processed securely by Stripe.
                </p>
              </div>
            </Card>
          </div>

          {/* Status Overview */}
          <div className="lg:col-span-2">
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Account Status</h2>
              </div>

              <div className="space-y-4">
                {/* Email Verification */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">Email Verification</p>
                    <p className="text-sm text-muted-foreground">admin@gmail.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-500">Verified</span>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Enhanced security</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    Enable 2FA
                  </Button>
                </div>

                {/* Payment Method */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">Payment Methods</p>
                    <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    Manage
                  </Button>
                </div>

                {/* API Keys */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">API Keys</p>
                    <p className="text-sm text-muted-foreground">1 active key</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    View All
                  </Button>
                </div>

                {/* Spending Limit */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">Monthly Spending Limit</p>
                    <p className="text-sm text-muted-foreground">$5,000 / month</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    Adjust
                  </Button>
                </div>

                {/* Account Health */}
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="font-medium text-green-700">Account Healthy</p>
                  </div>
                  <p className="text-sm text-green-600">All account checks passed. Your account is in good standing.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Usage History */}
        <Card className="border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Usage History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Description
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase">Amount</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-muted-foreground uppercase">ID</th>
                </tr>
              </thead>
              <tbody>
                {usageHistory.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">{item.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.type === "bot" && <Bot className="w-4 h-4 text-primary" />}
                        {item.type === "fee" && <AlertCircle className="w-4 h-4 text-orange-500" />}
                        {item.type === "subscription" && <CreditCard className="w-4 h-4 text-blue-500" />}
                        <span className="capitalize text-sm font-medium">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.description}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium text-destructive">
                        ${Math.abs(item.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-medium capitalize">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => copyToClipboard(item.id, item.id)}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        {copiedId === item.id ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            {item.id}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Spent: <span className="font-bold text-foreground">${walletData.totalSpent.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</span>
            </p>
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              View More
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}

const Bot = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="10" x="3" y="11" rx="2" />
    <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
    <line x1="9" x2="9" y1="5" y2="3" />
    <line x1="15" x2="15" y1="5" y2="3" />
  </svg>
)
