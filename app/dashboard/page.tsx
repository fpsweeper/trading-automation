"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { ShineBorder } from "@/components/ui/shine-border"
import {
  DollarSign,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Loader2,
  AlertCircle,
  X,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"

// Types
interface PointsBalance {
  points: number
}

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
  instructions: {
    step1: string
    step2: string
    step3: string
    step4: string
    step5?: string
  }
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

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const [pendingDeposits, setPendingDeposits] = useState<PendingDeposit[]>([])
  const [loadingPending, setLoadingPending] = useState(true)
  const [activePendingDeposit, setActivePendingDeposit] = useState<PendingDeposit | null>(null)

  // Points state
  const [pointsBalance, setPointsBalance] = useState<number>(0)
  const [loadingPoints, setLoadingPoints] = useState(true)

  // Deposit flow state
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

  // Recent deposits state
  const [recentDeposits, setRecentDeposits] = useState<Deposit[]>([])
  const [loadingDeposits, setLoadingDeposits] = useState(true)

  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [resumeCandidate, setResumeCandidate] = useState<PendingDeposit | null>(null)

  const handleStartDeposit = async () => {
    // ✅ Check if user has a pending deposit for this exact chain and amount
    const existingPending = pendingDeposits.find(
      p => p.chain === selectedChain &&
        p.baseAmount === selectedPackage &&
        !p.expired
    )

    if (existingPending) {
      // ✅ AUTO-RESUME: Don't ask, just resume directly
      toast.info(`Resuming your incomplete ${existingPending.chain} deposit of $${existingPending.exactAmount.toFixed(2)}`)
      handleResumePendingDeposit(existingPending)
      return
    }

    // No existing pending deposit - start new one
    startNewDeposit()
  }

  const startNewDeposit = async () => {
    setShowDepositModal(true)
    setDepositStep("instructions")
    setDepositError(null)
    setTransactionHash("")
    sessionStorage.removeItem("pendingDepositId")

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/deposits/instructions/${selectedChain}?amount=${selectedPackage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const data: DepositInstructions & { pendingDepositId: string } = await response.json()
        setDepositInstructions(data)
        sessionStorage.setItem("pendingDepositId", data.pendingDepositId)
      } else {
        toast.error("Failed to load deposit instructions")
        setShowDepositModal(false)
      }
    } catch (error) {
      console.error("Error fetching instructions:", error)
      toast.error("Error loading deposit instructions")
      setShowDepositModal(false)
    }
  }

  // Package options
  const packages = [
    { amount: 10, points: 5, popular: false },
    { amount: 50, points: 25, popular: true },
    { amount: 100, points: 50, popular: false },
    { amount: 500, points: 250, popular: false },
  ]

  // Chain configurations
  // Chain configurations with real logos
  const chains = [
    {
      id: "SOLANA",
      name: "Solana",
      color: "purple",
      logo: "/solana.svg"
    },
    {
      id: "BEP20",
      name: "BEP20",
      color: "yellow",
      logo: "/bnb.svg"
    },
    {
      id: "TRC20",
      name: "TRC20",
      color: "red",
      logo: "/tron.svg"
    },
  ]

  const fetchPendingDeposits = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/pending-deposits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data: PendingDeposit[] = await response.json()
        setPendingDeposits(data)

        // Set first active pending deposit
        if (data.length > 0 && !data[0].expired) {
          setActivePendingDeposit(data[0])
        }
      }
    } catch (error) {
      console.error("Error fetching pending deposits:", error)
    } finally {
      setLoadingPending(false)
    }
  }

  // Call on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchPointsBalance()
      fetchRecentDeposits()
      fetchPendingDeposits() // ✅ NEW
    }
  }, [isAuthenticated])

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)
    setLoading(false)
  }, [router])

  // Fetch points balance
  useEffect(() => {
    if (isAuthenticated) {
      fetchPointsBalance()
      fetchRecentDeposits()
    }
  }, [isAuthenticated])

  const fetchPointsBalance = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/points/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data: PointsBalance = await response.json()
        setPointsBalance(data.points)
      }
    } catch (error) {
      console.error("Error fetching points:", error)
    } finally {
      setLoadingPoints(false)
    }
  }

  const fetchRecentDeposits = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/deposits/history?page=0&size=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRecentDeposits(data.content || [])
      }
    } catch (error) {
      console.error("Error fetching deposits:", error)
    } finally {
      setLoadingDeposits(false)
    }
  }

  const handleResumePendingDeposit = (pending: PendingDeposit) => {
    // Set deposit instructions from pending deposit
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

    // Store pending deposit ID
    sessionStorage.setItem("pendingDepositId", pending.id)

    // Open modal at instructions step
    setShowDepositModal(true)
    setDepositStep("instructions")
  }

  const handleCancelPendingDeposit = async (id: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/pending-deposits/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("Pending deposit cancelled")
        fetchPendingDeposits() // Refresh
        setActivePendingDeposit(null)
      } else {
        toast.error("Failed to cancel pending deposit")
      }
    } catch (error) {
      console.error("Error cancelling pending deposit:", error)
      toast.error("Error cancelling pending deposit")
    }
  }

  const handleCopyAddress = () => {
    if (depositInstructions) {
      navigator.clipboard.writeText(depositInstructions.depositAddress)
      setCopiedAddress(true)
      toast.success("Address copied!")
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  const handleCopyToken = () => {
    if (depositInstructions) {
      navigator.clipboard.writeText(depositInstructions.tokenAddress)
      setCopiedToken(true)
      toast.success("Token address copied!")
      setTimeout(() => setCopiedToken(false), 2000)
    }
  }

  const handleSubmitTransaction = async () => {
    if (!transactionHash.trim()) {
      toast.error("Please enter a transaction hash")
      return
    }

    if (!depositInstructions) {
      toast.error("Deposit instructions not loaded")
      return
    }

    setIsSubmitting(true)
    setDepositError(null)

    try {
      const token = localStorage.getItem("auth_token")

      // ✅ Get pending deposit ID from session storage
      const pendingDepositId = sessionStorage.getItem("pendingDepositId")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/deposits/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactionHash: transactionHash.trim(),
          chain: selectedChain,
          exactAmountUsd: depositInstructions.exactAmount,
          pendingDepositId: pendingDepositId, // ✅ Include pending deposit ID
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // ✅ Clear pending deposit ID
        sessionStorage.removeItem("pendingDepositId")

        setDepositStep("processing")
        pollDepositStatus(transactionHash.trim())

        // ✅ Refresh pending deposits
        fetchPendingDeposits()
      } else {
        setDepositError(data.error || "Failed to submit deposit")
        toast.error(data.error || "Failed to submit deposit")
      }
    } catch (error) {
      console.error("Error submitting deposit:", error)
      setDepositError("Network error. Please try again.")
      toast.error("Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const pollDepositStatus = async (txHash: string) => {
    let attempts = 0
    const maxAttempts = 60 // Poll for 5 minutes (every 5 seconds)

    const poll = setInterval(async () => {
      attempts++

      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/deposits/status/${txHash}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()

          if (data.status === "CONFIRMED") {
            clearInterval(poll)
            setDepositStep("success")
            fetchPointsBalance() // Refresh points
            fetchRecentDeposits() // Refresh deposits
            toast.success("Deposit confirmed! Points credited.")
          } else if (data.status === "FAILED") {
            clearInterval(poll)
            setDepositError(data.failureReason || "Deposit verification failed")
            setDepositStep("submit")
            toast.error("Deposit failed")
          }
        }

        if (attempts >= maxAttempts) {
          clearInterval(poll)
          toast.info("Verification is taking longer than expected. Check back soon.")
        }
      } catch (error) {
        console.error("Error polling status:", error)
      }
    }, 5000) // Poll every 5 seconds
  }

  const handleCloseModal = () => {
    setShowDepositModal(false)
    setDepositStep("instructions")
    setTransactionHash("")
    setDepositError(null)
    setDepositInstructions(null)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "FAILED":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const getChainColor = (chain: string) => {
    switch (chain) {
      case "SOLANA":
        return "text-purple-600"
      case "BEP20":
        return "text-yellow-600"
      case "TRC20":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getBlockExplorerUrl = (chain: string, txHash: string) => {
    switch (chain) {
      case "SOLANA":
        return `https://solscan.io/tx/${txHash}`
      case "BEP20":
        return `https://bscscan.com/tx/${txHash}`
      case "TRC20":
        return `https://tronscan.org/#/transaction/${txHash}`
      default:
        return "#"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your points and deposits</p>
        </div>

        {/* Points Balance Card */}
        <div className="mb-8">
          <div className="relative rounded-2xl">
            <ShineBorder
              borderWidth={2}
              duration={10}
              shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            />
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
                        {pointsBalance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
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
                    <p className="text-sm text-muted-foreground">
                      You already started this deposit
                    </p>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Chain</p>
                      <p className="font-medium">{resumeCandidate.chain}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Amount</p>
                      <p className="font-medium">${resumeCandidate.exactAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded p-2">
                    <p className="text-xs text-orange-600">
                      <strong>Important:</strong> You must send exactly ${resumeCandidate.exactAmount.toFixed(2)}
                      {" "}(includes ${resumeCandidate.securityAmount.toFixed(2)} security amount)
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setShowResumeDialog(false)
                      handleResumePendingDeposit(resumeCandidate)
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Resume This Deposit
                  </Button>
                  <Button
                    onClick={async () => {
                      setShowResumeDialog(false)
                      await handleCancelPendingDeposit(resumeCandidate.id)
                      // Wait for cancel to complete, then start new
                      setTimeout(startNewDeposit, 500)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel & Start New
                  </Button>
                  <Button
                    onClick={() => {
                      setShowResumeDialog(false)
                      setResumeCandidate(null)
                    }}
                    variant="ghost"
                    className="w-full"
                  >
                    Go Back
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Expires in {Math.floor(resumeCandidate.timeRemainingSeconds / 3600)}h{" "}
                  {Math.floor((resumeCandidate.timeRemainingSeconds % 3600) / 60)}m
                </p>
              </div>
            </Card>
          </div>
        )}

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
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">Chain</p>
                      <p className="font-medium">{activePendingDeposit.chain}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">Amount</p>
                      <p className="font-medium">${activePendingDeposit.exactAmount.toFixed(2)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">Points</p>
                      <p className="font-medium">{activePendingDeposit.pointsToReceive}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">Expires In</p>
                      <p className="font-medium">
                        {Math.floor(activePendingDeposit.timeRemainingSeconds / 3600)}h{" "}
                        {Math.floor((activePendingDeposit.timeRemainingSeconds % 3600) / 60)}m
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancelPendingDeposit(activePendingDeposit.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleResumePendingDeposit(activePendingDeposit)}
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  Resume Deposit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCancelPendingDeposit(activePendingDeposit.id)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
        {/* Quick Deposit Section */}
        <Card className="p-6 mb-8 border border-border">
          <h2 className="text-xl font-bold mb-6">Quick Deposit</h2>

          {/* Chain Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">Select Network</label>
            <div className="grid grid-cols-3 gap-3">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => setSelectedChain(chain.id as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${selectedChain === chain.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                    }`}
                >
                  <div className="flex justify-center mb-2">
                    <img
                      src={chain.logo}
                      alt={chain.name}
                      className="w-10 h-10"
                    />
                  </div>
                  <p className="font-medium text-foreground">{chain.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Package Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">Select Package</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {packages.map((pkg) => (
                <button
                  key={pkg.amount}
                  onClick={() => setSelectedPackage(pkg.amount)}
                  className={`relative p-4 rounded-lg border-2 transition-all ${selectedPackage === pkg.amount
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                    }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </div>
                  )}
                  <p className="text-2xl font-bold text-foreground">${pkg.amount}</p>
                  <p className="text-sm text-muted-foreground mt-1">{pkg.points} Points</p>
                </button>
              ))}
            </div>
          </div>

          {/* Start Deposit Button */}
          <ShimmerButton onClick={handleStartDeposit} className="w-full py-4 text-lg font-semibold ">
            <span className="text-white">Start Deposit</span>

            <ChevronRight className="w-5 h-5 ml-2" />
          </ShimmerButton>
        </Card>

        {/* Recent Deposits */}
        <Card className="p-6 border border-border">
          <h2 className="text-xl font-bold mb-6">Recent Deposits</h2>

          {loadingDeposits ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Chain</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Points</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">TX Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeposits.map((deposit) => (
                    <tr key={deposit.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm">
                        {new Date(deposit.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${getChainColor(deposit.chain)}`}>
                          {deposit.chain}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="font-medium">${deposit?.exactAmountUsd?.toFixed(2) || deposit.amountUsd}</div>
                        {deposit.exactAmountUsd && deposit.exactAmountUsd !== deposit.amountUsd && (
                          <div className="text-xs text-muted-foreground">
                            (Base: ${deposit.amountUsd})
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">{deposit.pointsIssued}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeColor(
                            deposit.status
                          )}`}
                        >
                          {deposit.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">

                        <a
                          href={getBlockExplorerUrl(deposit.chain, deposit.transactionHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
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
      {
        showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur-sm z-10">
                <h2 className="text-2xl font-bold">
                  Deposit ${selectedPackage} - {selectedChain}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {depositStep === "instructions" && depositInstructions && (
                  <div className="space-y-6">
                    {/* Exact Amount Warning */}
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-orange-700">Important: Send Exact Amount</p>
                          <p className="text-sm text-orange-600 mt-1">
                            You must send <strong>exactly ${depositInstructions?.exactAmount?.toFixed(2)}</strong>
                            {" "}(${depositInstructions.baseAmount} + ${depositInstructions?.securityAmount?.toFixed(2)} security)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Amount Breakdown */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground mb-1">Package</p>
                        <p className="font-medium">${depositInstructions.baseAmount}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <p className="text-sm text-orange-600 mb-1">Security</p>
                        <p className="font-medium text-orange-700">+${depositInstructions?.securityAmount?.toFixed(2)}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-sm text-primary mb-1">Total</p>
                        <p className="text-lg font-bold text-primary">${depositInstructions?.exactAmount?.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Deposit Address */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Send {depositInstructions.token} to this address:
                      </label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={depositInstructions.depositAddress}
                          className="font-mono text-sm"
                        />
                        <Button onClick={handleCopyAddress} variant="outline" size="icon">
                          {copiedAddress ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center p-4 bg-white rounded-lg">
                      <QRCodeSVG value={depositInstructions.depositAddress} size={200} />
                    </div>

                    {/* Network Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground mb-1">Network</p>
                        <p className="font-medium">{depositInstructions.chain}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground mb-1">Token</p>
                        <p className="font-medium">{depositInstructions.token}</p>
                      </div>
                    </div>

                    {/* Token Contract */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Token Contract Address:
                      </label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={depositInstructions.tokenAddress}
                          className="font-mono text-sm"
                        />
                        <Button onClick={handleCopyToken} variant="outline" size="icon">
                          {copiedToken ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h3 className="font-medium text-blue-700 mb-3">Instructions:</h3>
                      <ol className="space-y-2 text-sm text-blue-600">
                        {Object.values(depositInstructions.instructions).map((instruction, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="font-medium">{idx + 1}.</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Next Button */}
                    <Button
                      onClick={() => setDepositStep("submit")}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      I've Sent the Transaction
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {depositStep === "submit" && (
                  <div className="space-y-6">
                    {/* Transaction Hash Input */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Paste Transaction Hash:
                      </label>
                      <Input
                        placeholder="Enter transaction hash..."
                        value={transactionHash}
                        onChange={(e) => setTransactionHash(e.target.value)}
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        You can find this in your wallet after sending the transaction
                      </p>
                    </div>

                    {/* Error Message */}
                    {depositError && (
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700">Error</p>
                          <p className="text-sm text-red-600 mt-1">{depositError}</p>
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setDepositStep("instructions")}
                        variant="outline"
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmitTransaction}
                        disabled={isSubmitting || !transactionHash.trim()}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {depositStep === "processing" && (
                  <div className="py-12 text-center space-y-6">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">Verifying Transaction...</h3>
                      <p className="text-muted-foreground">
                        This may take 30-60 seconds. Please don't close this window.
                      </p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-sm text-muted-foreground">
                        We're checking the blockchain for your transaction. You'll be notified once it's confirmed.
                      </p>
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
                        <p className="text-3xl font-bold text-primary">
                          +{depositInstructions?.pointsToReceive} Points
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleCloseModal}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )
      }
    </div >
  )
}