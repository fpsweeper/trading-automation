"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { ShineBorder } from "@/components/ui/shine-border"
import {
  Plus, Copy, Check, ExternalLink, Sparkles, Loader2,
  AlertCircle, X, ChevronRight, AlertTriangle,
  Bot, TrendingUp, TrendingDown, Zap, Layers, Coins,
} from "lucide-react"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"

const API = process.env.NEXT_PUBLIC_API_URL

// ─── Types ─────────────────────────────────────────────────────────────────

interface PointsBalance { points: number }

interface PendingDeposit {
  id: string
  chain: string
  baseAmount: number
  securityAmount: number
  exactAmount: number
  pointsToReceive: number
  platformWallet: string
  tokenAddress: string
  createdAt: string
  expiresAt: string
  timeRemainingSeconds: number
  expired: boolean
}

interface DepositInstructions {
  chain: string
  depositAddress: string
  baseAmount: number
  securityAmount: number
  exactAmount: number
  token: string
  tokenAddress: string
  pointsToReceive: number
  hasLinkedWallet: boolean
  linkedWalletAddress?: string
  instructions: { step1: string; step2: string; step3: string; step4: string; step5?: string }
}

interface Deposit {
  id: string
  transactionHash: string
  chain: string
  amountUsd: number
  exactAmountUsd: number
  pointsIssued: number
  status: string
  submittedAt: string
  confirmedAt?: string
}

interface BotSummary {
  id: string
  name: string
  strategyType: string
  tradingPair: string
  status: string
  totalPnl: number
  totalPnlPercentage: number
  totalTrades: number
  currentBalance: number
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function authHeader() {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
  return { Authorization: `Bearer ${token}` }
}

function statusDot(status: string) {
  switch (status) {
    case "SIMULATING": return "bg-green-500 animate-pulse"
    case "PAUSED": return "bg-yellow-500"
    case "STOPPED": return "bg-gray-400"
    default: return "bg-blue-500"
  }
}

function strategyIcon(strategy: string) {
  switch (strategy) {
    case "SCALPING": return <Zap className="w-3.5 h-3.5 text-orange-500" />
    case "GRID": return <Layers className="w-3.5 h-3.5 text-purple-500" />
    default: return <Coins className="w-3.5 h-3.5 text-blue-500" />
  }
}

// ─── Bots Summary Widget ────────────────────────────────────────────────────

function BotsSummaryWidget() {
  const [bots, setBots] = useState<BotSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}api/bots`, { headers: authHeader() })
      .then(r => r.json())
      .then(data => setBots(data.bots ?? []))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  const activeBots = bots.filter(b => b.status === "SIMULATING").length
  const totalPnl = bots.reduce((acc, b) => acc + (b.totalPnl ?? 0), 0)
  const pnlPos = totalPnl >= 0
  const previewBots = bots.slice(0, 4)

  return (
    <Card className="p-6 border border-border mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-base">Trading Bots</h2>
            {!loading && (
              <p className="text-xs text-muted-foreground">
                {activeBots} running · {bots.length} total
              </p>
            )}
          </div>
        </div>
        <Link href="/bots">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            Manage Bots <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Combined P&L — only if bots exist */}
      {!loading && bots.length > 0 && (
        <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${pnlPos
          ? "bg-green-500/10 border border-green-500/20"
          : "bg-red-500/10 border border-red-500/20"}`}>
          {pnlPos
            ? <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
            : <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0" />}
          <div>
            <p className="text-xs text-muted-foreground">Combined P&L</p>
            <p className={`text-lg font-bold font-mono ${pnlPos ? "text-green-500" : "text-destructive"}`}>
              {pnlPos ? "+" : ""}${Math.abs(totalPnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}

      {/* Bot list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 rounded-lg bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : bots.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">No bots yet</p>
          <Link href="/bots">
            <Button size="sm" className="gap-1.5">
              <Bot className="w-3.5 h-3.5" /> Create your first bot
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {previewBots.map(bot => {
            const pos = (bot.totalPnl ?? 0) >= 0
            return (
              <Link key={bot.id} href={`/bots/${bot.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot(bot.status)}`} />
                  <div className="flex-shrink-0">{strategyIcon(bot.strategyType)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{bot.name}</p>
                    <p className="text-xs text-muted-foreground">{bot.tradingPair} · {bot.strategyType}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold font-mono ${pos ? "text-green-500" : "text-destructive"}`}>
                      {pos ? "+" : ""}${Math.abs(bot.totalPnl).toFixed(2)}
                    </p>
                    <p className={`text-xs ${pos ? "text-green-600" : "text-destructive"}`}>
                      {pos ? "+" : ""}{bot.totalPnlPercentage.toFixed(2)}%
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Link>
            )
          })}

          {/* View all */}
          <Link href="/bots" className="block">
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-dashed border-border hover:border-primary/40 hover:bg-muted/20 transition-all text-xs text-muted-foreground hover:text-foreground">
              View all bots <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      )}
    </Card>
  )
}

// ─── Main Dashboard Page ────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const [pendingDeposits, setPendingDeposits] = useState<PendingDeposit[]>([])
  const [loadingPending, setLoadingPending] = useState(true)
  const [activePendingDeposit, setActivePendingDeposit] = useState<PendingDeposit | null>(null)

  const [pointsBalance, setPointsBalance] = useState<number>(0)
  const [loadingPoints, setLoadingPoints] = useState(true)

  const [selectedChain, setSelectedChain] = useState<"SOLANA" | "BEP20" | "TRC20">("SOLANA")
  const [selectedPackage, setSelectedPackage] = useState<number>(50)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositStep, setDepositStep] = useState<"instructions" | "submit" | "processing" | "success">("instructions")
  const [depositInstructions, setDepositInstructions] = useState<DepositInstructions | null>(null)
  const [transactionHash, setTransactionHash] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [depositError, setDepositError] = useState<string | null>(null)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)

  const [recentDeposits, setRecentDeposits] = useState<Deposit[]>([])
  const [loadingDeposits, setLoadingDeposits] = useState(true)

  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [resumeCandidate, setResumeCandidate] = useState<PendingDeposit | null>(null)

  const packages = [
    { amount: 10, points: 5, popular: false },
    { amount: 50, points: 25, popular: true },
    { amount: 100, points: 50, popular: false },
    { amount: 500, points: 250, popular: false },
  ]

  const chains = [
    { id: "SOLANA", name: "Solana", logo: "/solana.svg" },
    { id: "BEP20", name: "BEP20", logo: "/bnb.svg" },
    { id: "TRC20", name: "TRC20", logo: "/tron.svg" },
  ]

  // ── Auth ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) { router.push("/login"); return }
    setIsAuthenticated(true)
    setLoading(false)
  }, [router])

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchPointsBalance = useCallback(async () => {
    try {
      const res = await fetch(`${API}api/points/balance`, { headers: authHeader() })
      if (res.ok) {
        const data: PointsBalance = await res.json()
        setPointsBalance(data.points)
      }
    } catch { }
    finally { setLoadingPoints(false) }
  }, [])

  const fetchRecentDeposits = useCallback(async () => {
    try {
      const res = await fetch(`${API}api/deposits/history?page=0&size=5`, { headers: authHeader() })
      if (res.ok) {
        const data = await res.json()
        setRecentDeposits(data.content || [])
      }
    } catch { }
    finally { setLoadingDeposits(false) }
  }, [])

  const fetchPendingDeposits = useCallback(async () => {
    try {
      const res = await fetch(`${API}api/pending-deposits`, { headers: authHeader() })
      if (res.ok) {
        const data: PendingDeposit[] = await res.json()
        setPendingDeposits(data)
        if (data.length > 0 && !data[0].expired) setActivePendingDeposit(data[0])
      }
    } catch { }
    finally { setLoadingPending(false) }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    fetchPointsBalance()
    fetchRecentDeposits()
    fetchPendingDeposits()
  }, [isAuthenticated, fetchPointsBalance, fetchRecentDeposits, fetchPendingDeposits])

  // ── Deposit handlers ──────────────────────────────────────────────────────

  const startNewDeposit = useCallback(async () => {
    setShowDepositModal(true)
    setDepositStep("instructions")
    setDepositError(null)
    setTransactionHash("")
    sessionStorage.removeItem("pendingDepositId")
    try {
      const res = await fetch(
        `${API}api/deposits/instructions/${selectedChain}?amount=${selectedPackage}`,
        { headers: authHeader() }
      )
      if (res.ok) {
        const data: DepositInstructions & { pendingDepositId: string } = await res.json()
        setDepositInstructions(data)
        sessionStorage.setItem("pendingDepositId", data.pendingDepositId)
      } else {
        toast.error("Failed to load deposit instructions")
        setShowDepositModal(false)
      }
    } catch {
      toast.error("Error loading deposit instructions")
      setShowDepositModal(false)
    }
  }, [selectedChain, selectedPackage])

  const handleStartDeposit = () => {
    const existing = pendingDeposits.find(
      p => p.chain === selectedChain && p.baseAmount === selectedPackage && !p.expired
    )
    if (existing) {
      toast.info(`Resuming your incomplete ${existing.chain} deposit of $${existing.exactAmount.toFixed(2)}`)
      handleResumePendingDeposit(existing)
      return
    }
    startNewDeposit()
  }

  const handleResumePendingDeposit = (pending: PendingDeposit) => {
    setDepositInstructions({
      chain: pending.chain,
      depositAddress: pending.platformWallet,
      baseAmount: pending.baseAmount,
      securityAmount: pending.securityAmount,
      exactAmount: pending.exactAmount,
      token: "USDT",
      tokenAddress: pending.tokenAddress,
      pointsToReceive: pending.pointsToReceive,
      hasLinkedWallet: false,
      instructions: {
        step1: `Send EXACTLY ${pending.exactAmount.toFixed(2)} USDT to the address above`,
        step2: `IMPORTANT: You must send ${pending.exactAmount.toFixed(2)} (includes $${pending.securityAmount.toFixed(2)} security amount)`,
        step3: "Copy the transaction hash after sending",
        step4: "Submit the transaction hash below",
        step5: `Your ${pending.pointsToReceive} points will be credited after confirmation`,
      },
    })
    sessionStorage.setItem("pendingDepositId", pending.id)
    setShowDepositModal(true)
    setDepositStep("instructions")
  }

  const handleCancelPendingDeposit = async (id: string) => {
    try {
      const res = await fetch(`${API}api/pending-deposits/${id}`, {
        method: "DELETE", headers: authHeader()
      })
      if (res.ok) {
        toast.success("Pending deposit cancelled")
        fetchPendingDeposits()
        setActivePendingDeposit(null)
      } else {
        toast.error("Failed to cancel pending deposit")
      }
    } catch {
      toast.error("Error cancelling pending deposit")
    }
  }

  const handleCopyAddress = () => {
    if (!depositInstructions) return
    navigator.clipboard.writeText(depositInstructions.depositAddress)
    setCopiedAddress(true)
    toast.success("Address copied!")
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const handleCopyToken = () => {
    if (!depositInstructions) return
    navigator.clipboard.writeText(depositInstructions.tokenAddress)
    setCopiedToken(true)
    toast.success("Token address copied!")
    setTimeout(() => setCopiedToken(false), 2000)
  }

  const handleSubmitTransaction = async () => {
    if (!transactionHash.trim()) { toast.error("Please enter a transaction hash"); return }
    if (!depositInstructions) { toast.error("Deposit instructions not loaded"); return }
    setIsSubmitting(true)
    setDepositError(null)
    try {
      const pendingDepositId = sessionStorage.getItem("pendingDepositId")
      const res = await fetch(`${API}api/deposits/submit`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionHash: transactionHash.trim(),
          chain: selectedChain,
          exactAmountUsd: depositInstructions.exactAmount,
          pendingDepositId,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        sessionStorage.removeItem("pendingDepositId")
        setDepositStep("processing")
        pollDepositStatus(transactionHash.trim())
        fetchPendingDeposits()
      } else {
        setDepositError(data.error || "Failed to submit deposit")
        toast.error(data.error || "Failed to submit deposit")
      }
    } catch {
      setDepositError("Network error. Please try again.")
      toast.error("Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const pollDepositStatus = (txHash: string) => {
    let attempts = 0
    const poll = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`${API}api/deposits/status/${txHash}`, { headers: authHeader() })
        if (res.ok) {
          const data = await res.json()
          if (data.status === "CONFIRMED") {
            clearInterval(poll)
            setDepositStep("success")
            fetchPointsBalance()
            fetchRecentDeposits()
            toast.success("Deposit confirmed! Points credited.")
          } else if (data.status === "FAILED") {
            clearInterval(poll)
            setDepositError(data.failureReason || "Deposit verification failed")
            setDepositStep("submit")
            toast.error("Deposit failed")
          }
        }
        if (attempts >= 60) { clearInterval(poll); toast.info("Verification is taking longer than expected. Check back soon.") }
      } catch { }
    }, 5000)
  }

  const handleCloseModal = () => {
    setShowDepositModal(false)
    setDepositStep("instructions")
    setTransactionHash("")
    setDepositError(null)
    setDepositInstructions(null)
  }

  // ── Display helpers ────────────────────────────────────────────────────────

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-500/10 text-green-700 border-green-500/20"
      case "PENDING": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "FAILED": return "bg-red-500/10 text-red-700 border-red-500/20"
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const getChainColor = (chain: string) => {
    switch (chain) {
      case "SOLANA": return "text-purple-600"
      case "BEP20": return "text-yellow-600"
      case "TRC20": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const getBlockExplorerUrl = (chain: string, txHash: string) => {
    switch (chain) {
      case "SOLANA": return `https://solscan.io/tx/${txHash}`
      case "BEP20": return `https://bscscan.com/tx/${txHash}`
      case "TRC20": return `https://tronscan.org/#/transaction/${txHash}`
      default: return "#"
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your points, deposits and bots</p>
        </div>

        {/* Points Balance Card */}
        <div className="mb-8">
          <div className="relative rounded-2xl">
            <ShineBorder borderWidth={2} duration={10} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <Card className="relative p-8 border-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-muted-foreground">Your Points Balance</h2>
                    {loadingPoints ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary mt-2" />
                    ) : (
                      <p className="text-5xl font-bold text-foreground mt-1">
                        {pointsBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                </div>
                <ShimmerButton
                  onClick={handleStartDeposit}
                  className="px-8 py-4 text-lg font-semibold w-full md:w-auto"
                  background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Points
                </ShimmerButton>
              </div>
            </Card>
          </div>
        </div>

        {/* ── Bots Summary Widget ── */}
        <BotsSummaryWidget />

        {/* Incomplete Deposit Banner */}
        {activePendingDeposit && !activePendingDeposit.expired && (
          <Card className="mb-8 border-orange-500 bg-orange-500/5">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-bold text-orange-700">Incomplete Deposit</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    You started a deposit but didn't complete it. You can resume where you left off.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: "Chain", value: activePendingDeposit.chain },
                      { label: "Amount", value: `$${activePendingDeposit.exactAmount.toFixed(2)}` },
                      { label: "Points", value: String(activePendingDeposit.pointsToReceive) },
                      { label: "Expires In", value: `${Math.floor(activePendingDeposit.timeRemainingSeconds / 3600)}h ${Math.floor((activePendingDeposit.timeRemainingSeconds % 3600) / 60)}m` },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-3 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleCancelPendingDeposit(activePendingDeposit.id)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => handleResumePendingDeposit(activePendingDeposit)} className="bg-orange-500 text-white hover:bg-orange-600">
                  Resume Deposit
                </Button>
                <Button variant="outline" onClick={() => handleCancelPendingDeposit(activePendingDeposit.id)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Resume Deposit Dialog */}
        {showResumeDialog && resumeCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md border border-border">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Incomplete Deposit Found</h3>
                    <p className="text-sm text-muted-foreground">You already started this deposit</p>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><p className="text-xs text-muted-foreground mb-1">Chain</p><p className="font-medium">{resumeCandidate.chain}</p></div>
                    <div><p className="text-xs text-muted-foreground mb-1">Amount</p><p className="font-medium">${resumeCandidate.exactAmount.toFixed(2)}</p></div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded p-2">
                    <p className="text-xs text-orange-600"><strong>Important:</strong> You must send exactly ${resumeCandidate.exactAmount.toFixed(2)} (includes ${resumeCandidate.securityAmount.toFixed(2)} security amount)</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button onClick={() => { setShowResumeDialog(false); handleResumePendingDeposit(resumeCandidate) }} className="w-full bg-orange-500 hover:bg-orange-600 text-white">Resume This Deposit</Button>
                  <Button onClick={async () => { setShowResumeDialog(false); await handleCancelPendingDeposit(resumeCandidate.id); setTimeout(startNewDeposit, 500) }} variant="outline" className="w-full">Cancel & Start New</Button>
                  <Button onClick={() => { setShowResumeDialog(false); setResumeCandidate(null) }} variant="ghost" className="w-full">Go Back</Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Expires in {Math.floor(resumeCandidate.timeRemainingSeconds / 3600)}h {Math.floor((resumeCandidate.timeRemainingSeconds % 3600) / 60)}m
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Deposit */}
        <Card className="p-6 mb-8 border border-border">
          <h2 className="text-xl font-bold mb-6">Quick Deposit</h2>

          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">Select Network</label>
            <div className="grid grid-cols-3 gap-3">
              {chains.map(chain => (
                <button key={chain.id} onClick={() => setSelectedChain(chain.id as "SOLANA" | "BEP20" | "TRC20")}
                  className={`p-4 rounded-lg border-2 transition-all ${selectedChain === chain.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                  <div className="flex justify-center mb-2">
                    <img src={chain.logo} alt={chain.name} className="w-10 h-10" />
                  </div>
                  <p className="font-medium text-foreground">{chain.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">Select Package</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {packages.map(pkg => (
                <button key={pkg.amount} onClick={() => setSelectedPackage(pkg.amount)}
                  className={`relative p-4 rounded-lg border-2 transition-all ${selectedPackage === pkg.amount ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                  {pkg.popular && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">Popular</div>
                  )}
                  <p className="text-2xl font-bold text-foreground">${pkg.amount}</p>
                  <p className="text-sm text-muted-foreground mt-1">{pkg.points} Points</p>
                </button>
              ))}
            </div>
          </div>

          <ShimmerButton onClick={handleStartDeposit} className="w-full py-4 text-lg font-semibold">
            <span className="text-white">Start Deposit</span>
            <ChevronRight className="w-5 h-5 ml-2" />
          </ShimmerButton>
        </Card>

        {/* Recent Deposits */}
        <Card className="p-6 border border-border">
          <h2 className="text-xl font-bold mb-6">Recent Deposits</h2>
          {loadingDeposits ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : recentDeposits.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No deposits yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Date", "Chain", "Amount", "Points", "Status", "TX Hash"].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentDeposits.map(deposit => (
                    <tr key={deposit.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm">{new Date(deposit.submittedAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4"><span className={`text-sm font-medium ${getChainColor(deposit.chain)}`}>{deposit.chain}</span></td>
                      <td className="py-3 px-4 text-sm">
                        <div className="font-medium">${deposit?.exactAmountUsd?.toFixed(2) || deposit.amountUsd}</div>
                        {deposit.exactAmountUsd && deposit.exactAmountUsd !== deposit.amountUsd && (
                          <div className="text-xs text-muted-foreground">(Base: ${deposit.amountUsd})</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">{deposit.pointsIssued}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeColor(deposit.status)}`}>{deposit.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <a href={getBlockExplorerUrl(deposit.chain, deposit.transactionHash)} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1">
                          {deposit.transactionHash.substring(0, 8)}...
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur-sm z-10">
              <h2 className="text-2xl font-bold">Deposit ${selectedPackage} - {selectedChain}</h2>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {depositStep === "instructions" && depositInstructions && (
                <div className="space-y-6">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-700">Important: Send Exact Amount</p>
                        <p className="text-sm text-orange-600 mt-1">
                          You must send <strong>exactly ${depositInstructions.exactAmount?.toFixed(2)}</strong>
                          {" "}(${depositInstructions.baseAmount} + ${depositInstructions.securityAmount?.toFixed(2)} security)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted"><p className="text-sm text-muted-foreground mb-1">Package</p><p className="font-medium">${depositInstructions.baseAmount}</p></div>
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20"><p className="text-sm text-orange-600 mb-1">Security</p><p className="font-medium text-orange-700">+${depositInstructions.securityAmount?.toFixed(2)}</p></div>
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20"><p className="text-sm text-primary mb-1">Total</p><p className="text-lg font-bold text-primary">${depositInstructions.exactAmount?.toFixed(2)}</p></div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Send {depositInstructions.token} to this address:</label>
                    <div className="flex gap-2">
                      <Input readOnly value={depositInstructions.depositAddress} className="font-mono text-sm" />
                      <Button onClick={handleCopyAddress} variant="outline" size="icon">
                        {copiedAddress ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <QRCodeSVG value={depositInstructions.depositAddress} size={200} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted"><p className="text-sm text-muted-foreground mb-1">Network</p><p className="font-medium">{depositInstructions.chain}</p></div>
                    <div className="p-4 rounded-lg bg-muted"><p className="text-sm text-muted-foreground mb-1">Token</p><p className="font-medium">{depositInstructions.token}</p></div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Token Contract Address:</label>
                    <div className="flex gap-2">
                      <Input readOnly value={depositInstructions.tokenAddress} className="font-mono text-sm" />
                      <Button onClick={handleCopyToken} variant="outline" size="icon">
                        {copiedToken ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="font-medium text-blue-700 mb-3">Instructions:</h3>
                    <ol className="space-y-2 text-sm text-blue-600">
                      {Object.values(depositInstructions.instructions).map((instruction, idx) => (
                        <li key={idx} className="flex gap-2"><span className="font-medium">{idx + 1}.</span><span>{instruction}</span></li>
                      ))}
                    </ol>
                  </div>

                  <Button onClick={() => setDepositStep("submit")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    I've Sent the Transaction <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {depositStep === "submit" && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Paste Transaction Hash:</label>
                    <Input placeholder="Enter transaction hash..." value={transactionHash} onChange={e => setTransactionHash(e.target.value)} className="font-mono" />
                    <p className="text-xs text-muted-foreground mt-2">You can find this in your wallet after sending the transaction</p>
                  </div>
                  {depositError && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div><p className="font-medium text-red-700">Error</p><p className="text-sm text-red-600 mt-1">{depositError}</p></div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button onClick={() => setDepositStep("instructions")} variant="outline" className="flex-1">Back</Button>
                    <Button onClick={handleSubmitTransaction} disabled={isSubmitting || !transactionHash.trim()} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Submit"}
                    </Button>
                  </div>
                </div>
              )}

              {depositStep === "processing" && (
                <div className="py-12 text-center space-y-6">
                  <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Verifying Transaction...</h3>
                    <p className="text-muted-foreground">This may take 30-60 seconds. Please don't close this window.</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground">We're checking the blockchain for your transaction. You'll be notified once it's confirmed.</p>
                  </div>
                </div>
              )}

              {depositStep === "success" && (
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Deposit Confirmed! 🎉</h3>
                    <p className="text-muted-foreground mb-4">Your points have been credited</p>
                    <div className="inline-block p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-3xl font-bold text-primary">+{depositInstructions?.pointsToReceive} Points</p>
                    </div>
                  </div>
                  <Button onClick={handleCloseModal} className="bg-primary text-primary-foreground hover:bg-primary/90">Done</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}