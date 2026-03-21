"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Plus, Play, Pause, Square, Eye, TrendingUp, TrendingDown,
  Activity, Bot, Coins, RefreshCw, AlertCircle, Loader2,
  X, ChevronRight, ChevronLeft, Zap, Clock,
  BarChart2, Layers, Shield, Check, ChevronsUpDown, Sparkles, Star
} from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// ─── Types ─────────────────────────────────────────────────────────────────

interface BotResponse {
  id: string; name: string; description?: string
  strategyType: "DCA" | "GRID" | "SCALPING"; tradingPair: string; timeframe: string
  status: "CREATED" | "SIMULATING" | "PAUSED" | "STOPPED" | "DELETED"
  initialBalance: number; currentBalance: number; totalPnl: number; totalPnlPercentage: number
  stopLossPercentage?: number; takeProfitPercentage?: number; maxPositionSizePercentage: number
  totalTrades: number; openPositions: number; createdAt: string; startedAt?: string
  lastExecutionTime?: string; nextExecutionTime?: string; pointsPerDay?: number
}

interface CreateBotForm {
  name: string; description: string
  strategyType: "DCA" | "GRID" | "SCALPING"; tradingPair: string; timeframe: string
  initialBalance: number; stopLossPercentage: number; takeProfitPercentage: number
  maxPositionSizePercentage: number; pointsPerDay: number
  entryConditions: ConditionForm[]; exitConditions: ConditionForm[]
}

interface ConditionForm {
  indicatorName: string; operator: string; comparisonValue: number; logicalOperator: "AND" | "OR"
}

// ─── Suggested Configs ─────────────────────────────────────────────────────

interface SuggestedConfig {
  id: string
  name: string
  description: string
  tag: string
  tagColor: string
  icon: React.ReactNode
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  expectedFrequency: string
  preset: Partial<CreateBotForm>
}

const SUGGESTED_CONFIGS: SuggestedConfig[] = [
  {
    id: "dca-rsi-basic",
    name: "RSI Dip Buyer",
    description: "Buys when RSI signals oversold conditions and sells on recovery. Classic DCA with RSI filter.",
    tag: "DCA",
    tagColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    icon: <Coins className="w-5 h-5 text-blue-500" />,
    difficulty: "Beginner",
    expectedFrequency: "2–5 trades/day",
    preset: {
      name: "RSI Dip Buyer",
      strategyType: "DCA",
      tradingPair: "BTCUSDT",
      timeframe: "15m",
      stopLossPercentage: 3,
      takeProfitPercentage: 2,
      maxPositionSizePercentage: 25,
      entryConditions: [
        { indicatorName: "RSI_14", operator: "<", comparisonValue: 40, logicalOperator: "AND" },
        { indicatorName: "MACD_HISTOGRAM", operator: ">", comparisonValue: -100, logicalOperator: "AND" },
      ],
      exitConditions: [
        { indicatorName: "RSI_14", operator: ">", comparisonValue: 60, logicalOperator: "OR" },
      ],
    },
  },
  {
    id: "dca-ma-trend",
    name: "MA Trend Follower",
    description: "Enters when price is above MA20 with bullish MACD. Follows the trend with momentum confirmation.",
    tag: "DCA",
    tagColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
    difficulty: "Intermediate",
    expectedFrequency: "1–3 trades/day",
    preset: {
      name: "MA Trend Follower",
      strategyType: "DCA",
      tradingPair: "BTCUSDT",
      timeframe: "1h",
      stopLossPercentage: 4,
      takeProfitPercentage: 3,
      maxPositionSizePercentage: 30,
      entryConditions: [
        { indicatorName: "RSI_14", operator: ">", comparisonValue: 45, logicalOperator: "AND" },
        { indicatorName: "RSI_14", operator: "<", comparisonValue: 65, logicalOperator: "AND" },
        { indicatorName: "MACD_HISTOGRAM", operator: ">", comparisonValue: 0, logicalOperator: "AND" },
      ],
      exitConditions: [
        { indicatorName: "MACD_HISTOGRAM", operator: "<", comparisonValue: 0, logicalOperator: "OR" },
        { indicatorName: "RSI_14", operator: ">", comparisonValue: 70, logicalOperator: "OR" },
      ],
    },
  },
  {
    id: "scalp-fast",
    name: "Quick Scalper",
    description: "Fast in-and-out trades using RSI extremes. Targets small profits with tight stops. High frequency.",
    tag: "SCALPING",
    tagColor: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    icon: <Zap className="w-5 h-5 text-orange-500" />,
    difficulty: "Intermediate",
    expectedFrequency: "5–15 trades/day",
    preset: {
      name: "Quick Scalper",
      strategyType: "SCALPING",
      tradingPair: "ETHUSDT",
      timeframe: "5m",
      stopLossPercentage: 1,
      takeProfitPercentage: 0.8,
      maxPositionSizePercentage: 50,
      entryConditions: [
        { indicatorName: "RSI_14", operator: "<", comparisonValue: 45, logicalOperator: "AND" },
        { indicatorName: "MACD_HISTOGRAM", operator: ">", comparisonValue: 0, logicalOperator: "AND" },
      ],
      exitConditions: [
        { indicatorName: "RSI_14", operator: ">", comparisonValue: 60, logicalOperator: "OR" },
      ],
    },
  },
  {
    id: "scalp-bb",
    name: "Bollinger Bouncer",
    description: "Buys near the lower Bollinger Band and exits near the middle. Mean reversion scalping.",
    tag: "SCALPING",
    tagColor: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    icon: <Zap className="w-5 h-5 text-orange-500" />,
    difficulty: "Advanced",
    expectedFrequency: "3–8 trades/day",
    preset: {
      name: "Bollinger Bouncer",
      strategyType: "SCALPING",
      tradingPair: "BTCUSDT",
      timeframe: "15m",
      stopLossPercentage: 1.5,
      takeProfitPercentage: 1,
      maxPositionSizePercentage: 40,
      entryConditions: [
        { indicatorName: "RSI_14", operator: "<", comparisonValue: 35, logicalOperator: "AND" },
        { indicatorName: "MACD_HISTOGRAM", operator: ">", comparisonValue: -200, logicalOperator: "AND" },
      ],
      exitConditions: [
        { indicatorName: "RSI_14", operator: ">", comparisonValue: 55, logicalOperator: "OR" },
      ],
    },
  },
  {
    id: "grid-ranging",
    name: "Grid Range Trader",
    description: "Places buy orders at grid levels below market price. Best in sideways, ranging markets.",
    tag: "GRID",
    tagColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    icon: <Layers className="w-5 h-5 text-purple-500" />,
    difficulty: "Intermediate",
    expectedFrequency: "Varies with market",
    preset: {
      name: "Grid Range Trader",
      strategyType: "GRID",
      tradingPair: "BTCUSDT",
      timeframe: "30m",
      stopLossPercentage: 8,
      takeProfitPercentage: 5,
      maxPositionSizePercentage: 20,
      entryConditions: [
        { indicatorName: "RSI_14", operator: ">", comparisonValue: 30, logicalOperator: "AND" },
        { indicatorName: "RSI_14", operator: "<", comparisonValue: 70, logicalOperator: "AND" },
      ],
      exitConditions: [],
    },
  },
  {
    id: "custom",
    name: "Custom Setup",
    description: "Start from scratch and configure every parameter manually. Full control over your strategy.",
    tag: "CUSTOM",
    tagColor: "text-gray-500 bg-gray-500/10 border-gray-500/20",
    icon: <Shield className="w-5 h-5 text-gray-500" />,
    difficulty: "Advanced",
    expectedFrequency: "Depends on config",
    preset: {},
  },
]

const DIFFICULTY_COLORS = {
  Beginner: "text-green-600 bg-green-500/10",
  Intermediate: "text-yellow-600 bg-yellow-500/10",
  Advanced: "text-red-600 bg-red-500/10",
}

// ─── Constants ─────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL
const TIMEFRAMES = ["5m", "15m", "30m", "1h", "4h", "1d"]
const INDICATORS = ["RSI_14", "RSI_7", "MACD", "MACD_HISTOGRAM", "MA_20", "MA_50", "MA_200", "EMA_12", "BB_UPPER", "BB_LOWER", "CLOSE_PRICE"]
const OPERATORS = [
  { value: ">", label: "Greater than (>)" }, { value: "<", label: "Less than (<)" },
  { value: ">=", label: "Greater or equal (>=)" }, { value: "<=", label: "Less or equal (<=)" },
  { value: "crosses_above", label: "Crosses above" }, { value: "crosses_below", label: "Crosses below" },
]
const STRATEGY_INFO = {
  DCA: { icon: <Coins className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", desc: "Dollar Cost Averaging — buy at regular intervals based on indicators", cost: "1 pt / trade" },
  GRID: { icon: <Layers className="w-5 h-5" />, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20", desc: "Grid Trading — place buy/sell orders at fixed price intervals", cost: "2 pts / trade" },
  SCALPING: { icon: <Zap className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", desc: "Scalping — fast in-and-out trades capturing small price moves", cost: "3 pts / trade" },
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function authHeader() {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
}
function statusConfig(status: BotResponse["status"]) {
  switch (status) {
    case "SIMULATING": return { label: "Running", dot: "bg-green-500 animate-pulse", badge: "bg-green-500/10 text-green-600 border-green-500/20" }
    case "PAUSED": return { label: "Paused", dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" }
    case "STOPPED": return { label: "Stopped", dot: "bg-gray-400", badge: "bg-gray-500/10 text-gray-500 border-gray-500/20" }
    case "CREATED": return { label: "Ready", dot: "bg-blue-500", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20" }
    default: return { label: status, dot: "bg-gray-400", badge: "bg-gray-500/10 text-gray-500 border-gray-500/20" }
  }
}
function fmt(n: number, decimals = 2) {
  return n?.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) ?? "0.00"
}

// ─── Default form ──────────────────────────────────────────────────────────

const defaultForm: CreateBotForm = {
  name: "", description: "", strategyType: "DCA", tradingPair: "BTCUSDT", timeframe: "5m",
  initialBalance: 1000, stopLossPercentage: 5, takeProfitPercentage: 10,
  maxPositionSizePercentage: 20, pointsPerDay: 1, entryConditions: [], exitConditions: [],
}

// ─── Create Bot Modal ──────────────────────────────────────────────────────

function CreateBotModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [step, setStep] = useState(0) // 0 = suggestions, 1-4 = config steps
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateBotForm>(defaultForm)
  const [pairs, setPairs] = useState<string[]>([])
  const [loadingPairs, setLoadingPairs] = useState(true)
  const [pairOpen, setPairOpen] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)

  const totalConfigSteps = 4

  useEffect(() => {
    fetch(`${API}api/market-data/pairs`)
      .then(r => r.json()).then(data => setPairs(data.pairs ?? []))
      .catch(() => setPairs(["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT"]))
      .finally(() => setLoadingPairs(false))
  }, [])

  function set(key: keyof CreateBotForm, value: unknown) { setForm(prev => ({ ...prev, [key]: value })) }
  function addCondition(type: "entryConditions" | "exitConditions") { set(type, [...form[type], { indicatorName: "RSI_14", operator: "<", comparisonValue: 30, logicalOperator: "AND" }]) }
  function removeCondition(type: "entryConditions" | "exitConditions", idx: number) { set(type, form[type].filter((_, i) => i !== idx)) }
  function updateCondition(type: "entryConditions" | "exitConditions", idx: number, key: keyof ConditionForm, value: unknown) { set(type, form[type].map((c, i) => i === idx ? { ...c, [key]: value } : c)) }

  function selectPreset(config: SuggestedConfig) {
    setSelectedPresetId(config.id)
    if (config.id === "custom") {
      setForm(defaultForm)
    } else {
      setForm(prev => ({ ...defaultForm, ...prev, ...config.preset, initialBalance: prev.initialBalance }))
    }
    setStep(1)
  }

  async function handleCreate() {
    if (!form.name.trim()) { toast.error("Bot name is required"); return }
    setLoading(true)
    try {
      const payload = {
        name: form.name, description: form.description || undefined,
        strategyType: form.strategyType, tradingPair: form.tradingPair, timeframe: form.timeframe,
        initialBalance: form.initialBalance, stopLossPercentage: form.stopLossPercentage,
        takeProfitPercentage: form.takeProfitPercentage, maxPositionSizePercentage: form.maxPositionSizePercentage,
        pointsPerDay: form.pointsPerDay,
        entryConditions: form.entryConditions.map((c, i) => ({ ...c, conditionOrder: i })),
        exitConditions: form.exitConditions.map((c, i) => ({ ...c, conditionOrder: i })),
      }
      const res = await fetch(`${API}api/bots`, { method: "POST", headers: authHeader(), body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create bot")
      toast.success(`Bot "${form.name}" created!`)
      onCreated(); onClose()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to create bot")
    } finally { setLoading(false) }
  }

  const stepLabel = step === 0 ? "Choose a template" : `Step ${step} of ${totalConfigSteps}`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <Card className="w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[92vh] overflow-y-auto border-0 sm:border border-border bg-background shadow-2xl rounded-t-2xl sm:rounded-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Create New Bot</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{stepLabel}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1"><X className="w-5 h-5" /></button>
        </div>

        {/* Progress — only show during config steps */}
        {step > 0 && (
          <div className="px-4 sm:px-6 pt-4">
            <div className="flex gap-1.5">
              {Array.from({ length: totalConfigSteps }).map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i + 1 <= step ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-5">

          {/* ── Step 0: Suggested configs ── */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Suggested Configurations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Pick a template to pre-fill your bot settings, or start from scratch.
              </p>

              <div className="space-y-2.5">
                {SUGGESTED_CONFIGS.map(config => (
                  <button
                    key={config.id}
                    onClick={() => selectPreset(config)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:border-primary/60 hover:bg-muted/30 ${selectedPresetId === config.id ? "border-primary bg-primary/5" : "border-border"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border flex-shrink-0 ${config.id === "custom" ? "bg-muted border-border" : config.tagColor
                        }`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-sm">{config.name}</span>
                          {config.id !== "custom" && (
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.tagColor}`}>
                              {config.tag}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[config.difficulty]}`}>
                            {config.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1.5">{config.description}</p>
                        {config.id !== "custom" && (
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{config.preset.timeframe}</span>
                            <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" />{config.expectedFrequency}</span>
                            {config.preset.entryConditions && config.preset.entryConditions.length > 0 && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Check className="w-3 h-3" />{config.preset.entryConditions.length} entry condition{config.preset.entryConditions.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 1: Strategy ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Choose Strategy</h3>
              {selectedPresetId && selectedPresetId !== "custom" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                  <Star className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Pre-filled from <span className="font-medium text-foreground">{SUGGESTED_CONFIGS.find(c => c.id === selectedPresetId)?.name}</span> template</span>
                </div>
              )}
              <div className="space-y-3">
                {(["DCA", "GRID", "SCALPING"] as const).map(s => (
                  <button key={s} onClick={() => set("strategyType", s)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${form.strategyType === s ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${STRATEGY_INFO[s].bg} ${STRATEGY_INFO[s].color}`}>{STRATEGY_INFO[s].icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{s}</span>
                          <span className="text-xs text-muted-foreground">{STRATEGY_INFO[s].cost}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{STRATEGY_INFO[s].desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Basic Config ── */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Basic Configuration</h3>
              <div className="space-y-3">
                <div>
                  <Label>Bot Name *</Label>
                  <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. BTC RSI Scalper" className="mt-1.5" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input value={form.description} onChange={e => set("description", e.target.value)} placeholder="Optional" className="mt-1.5" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Trading Pair</Label>
                    <div className="mt-1.5">
                      <Popover open={pairOpen} onOpenChange={setPairOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                            {loadingPairs
                              ? <span className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />Loading...</span>
                              : (form.tradingPair || "Select pair...")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                          <Command>
                            <CommandInput placeholder="Search pair... e.g. BTC, ETH" />
                            <CommandEmpty>No pair found.</CommandEmpty>
                            <CommandList className="max-h-60">
                              <CommandGroup>
                                {pairs.map(p => (
                                  <CommandItem key={p} value={p} onSelect={val => { set("tradingPair", val.toUpperCase()); setPairOpen(false) }}>
                                    <Check className={cn("mr-2 h-4 w-4", form.tradingPair === p ? "opacity-100" : "opacity-0")} />{p}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <Label>Timeframe</Label>
                    <select value={form.timeframe} onChange={e => set("timeframe", e.target.value)}
                      className="mt-1.5 w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-sm">
                      {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Initial Balance ($)</Label>
                  <Input type="number" value={form.initialBalance} onChange={e => set("initialBalance", Number(e.target.value))} min={100} className="mt-1.5" />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Risk Settings ── */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Risk Settings</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Stop Loss (%)</Label>
                  <Input type="number" value={form.stopLossPercentage} onChange={e => set("stopLossPercentage", Number(e.target.value))} step={0.1} min={0.1} max={50} className="mt-1.5" />
                </div>
                <div>
                  <Label>Take Profit (%)</Label>
                  <Input type="number" value={form.takeProfitPercentage} onChange={e => set("takeProfitPercentage", Number(e.target.value))} step={0.1} min={0.1} max={1000} className="mt-1.5" />
                </div>
                <div>
                  <Label>Max Position Size (%)</Label>
                  <Input type="number" value={form.maxPositionSizePercentage} onChange={e => set("maxPositionSizePercentage", Number(e.target.value))} step={1} min={1} max={100} className="mt-1.5" />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
                <Shield className="w-4 h-4 inline mr-1.5 mb-0.5" />
                Stop loss and take profit are checked on every execution cycle.
              </div>
            </div>
          )}

          {/* ── Step 4: Indicator Conditions ── */}
          {step === 4 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-lg">Indicator Conditions</h3>
              <p className="text-sm text-muted-foreground">Leave empty to use the strategy's built-in default logic.</p>

              {/* Summary of pre-filled conditions if from a preset */}
              {selectedPresetId && selectedPresetId !== "custom" && (form.entryConditions.length > 0 || form.exitConditions.length > 0) && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Conditions pre-filled from template. You can modify them below.</span>
                </div>
              )}

              {(["entryConditions", "exitConditions"] as const).map(type => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className={type === "entryConditions" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                      {type === "entryConditions" ? "Entry Conditions" : "Exit Conditions"}
                    </Label>
                    <Button size="sm" variant="outline" onClick={() => addCondition(type)}>
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  {form[type].length === 0 && (
                    <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/40 border border-border">
                      {type === "entryConditions" ? "No conditions — using default strategy logic" : "No conditions — using stop loss / take profit only"}
                    </p>
                  )}
                  {form[type].map((cond, idx) => (
                    <div key={idx} className="flex flex-wrap gap-1.5 items-center p-2.5 rounded-lg border border-border bg-muted/20 mb-2">
                      {idx > 0 && (
                        <select value={cond.logicalOperator} onChange={e => updateCondition(type, idx, "logicalOperator", e.target.value)}
                          className="w-16 px-1 py-1.5 text-xs rounded bg-input border border-border text-foreground">
                          <option value="AND">AND</option><option value="OR">OR</option>
                        </select>
                      )}
                      <select value={cond.indicatorName} onChange={e => updateCondition(type, idx, "indicatorName", e.target.value)}
                        className="flex-1 min-w-[90px] px-2 py-1.5 text-xs rounded bg-input border border-border text-foreground">
                        {INDICATORS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                      <select value={cond.operator} onChange={e => updateCondition(type, idx, "operator", e.target.value)}
                        className="w-28 px-2 py-1.5 text-xs rounded bg-input border border-border text-foreground">
                        {OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <Input type="number" value={cond.comparisonValue} onChange={e => updateCondition(type, idx, "comparisonValue", Number(e.target.value))} className="w-20 h-8 text-xs" />
                      <button onClick={() => removeCondition(type, idx)} className="text-muted-foreground hover:text-destructive p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between px-4 sm:px-6 py-4 border-t border-border bg-background/95 backdrop-blur-sm">
          <Button variant="outline" onClick={() => step > 0 ? setStep(s => s - 1) : onClose()} disabled={loading}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            {step === 0 ? "Cancel" : step === 1 ? "Templates" : "Back"}
          </Button>

          {step === 0 ? (
            // On suggestions step show skip option
            <Button variant="ghost" onClick={() => { setSelectedPresetId("custom"); setForm(defaultForm); setStep(1) }} className="text-muted-foreground">
              Skip — configure manually <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : step < totalConfigSteps ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={step === 2 && !form.name.trim()}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={loading} className="bg-primary text-primary-foreground">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Create Bot
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function BotsPage() {
  const router = useRouter()
  const [bots, setBots] = useState<BotResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState<"ALL" | "SIMULATING" | "PAUSED" | "STOPPED" | "CREATED">("ALL")
  const [pointsBalance, setPointsBalance] = useState<number | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) router.push("/login")
  }, [router])

  const fetchBots = useCallback(async () => {
    try {
      const res = await fetch(`${API}api/bots`, { headers: authHeader() })
      if (res.status === 401) { router.push("/login"); return }
      const data = await res.json()
      setBots(data.bots ?? [])
    } catch { toast.error("Failed to load bots") }
    finally { setLoading(false) }
  }, [router])

  const fetchPoints = useCallback(async () => {
    try {
      const res = await fetch(`${API}api/points/balance`, { headers: authHeader() })
      if (res.ok) { const data = await res.json(); setPointsBalance(data.points ?? 0) }
    } catch { }
  }, [])

  useEffect(() => { fetchBots(); fetchPoints() }, [fetchBots, fetchPoints])
  useEffect(() => {
    const interval = setInterval(() => { fetchBots(); fetchPoints() }, 30000)
    return () => clearInterval(interval)
  }, [fetchBots, fetchPoints])

  async function botAction(id: string, action: "start" | "pause" | "stop") {
    setActionLoading(id + action)
    try {
      const res = await fetch(`${API}api/bots/${id}/${action}`, { method: "PUT", headers: authHeader() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)

      // ✅ Update bot status immediately from response — no race condition
      if (data.bot) {
        setBots(prev => prev.map(b => b.id === id ? { ...b, ...data.bot } : b))
      }

      // Refetch after 1s to confirm DB state
      setTimeout(fetchBots, 1000)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Action failed")
    } finally { setActionLoading(null) }
  }

  const filtered = filter === "ALL" ? bots : bots.filter(b => b.status === filter)
  const activeBots = bots.filter(b => b.status === "SIMULATING").length

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* Page Header */}
        <div className="flex items-start justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Bot Management</h1>
            <p className="text-muted-foreground text-sm">Create and manage your simulation trading bots</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
            {pointsBalance !== null && (
              <Link href="/dashboard">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{pointsBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
              </Link>
            )}
            <Button variant="outline" size="sm" onClick={() => { fetchBots(); fetchPoints() }} className="gap-1.5">
              <RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button onClick={() => setShowCreate(true)} className="gap-1.5">
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Create Bot</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-5 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm text-muted-foreground">Total Bots</span>
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{bots.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{activeBots} running</p>
          </Card>

          <Card className="p-4 sm:p-5 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm text-muted-foreground">Total Trades</span>
              <BarChart2 className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{bots.reduce((acc, b) => acc + b.totalTrades, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </Card>

          <Card className="p-4 sm:p-5 border border-border col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm text-muted-foreground">Open Positions</span>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{bots.reduce((acc, b) => acc + b.openPositions, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1">
          {(["ALL", "SIMULATING", "PAUSED", "STOPPED", "CREATED"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex-shrink-0 ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}>
              {f === "ALL" ? `All (${bots.length})` :
                f === "SIMULATING" ? `Running (${bots.filter(b => b.status === "SIMULATING").length})` :
                  f === "PAUSED" ? `Paused (${bots.filter(b => b.status === "PAUSED").length})` :
                    f === "STOPPED" ? `Stopped (${bots.filter(b => b.status === "STOPPED").length})` :
                      `Ready (${bots.filter(b => b.status === "CREATED").length})`}
            </button>
          ))}
        </div>

        {/* Bot List */}
        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 border border-dashed border-border text-center">
            <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No bots yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Create your first simulation bot to start trading automatically</p>
            <Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-2" /> Create Your First Bot</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(bot => {
              const sc = statusConfig(bot.status)
              const si = STRATEGY_INFO[bot.strategyType]
              const pnlPos = (bot.totalPnl ?? 0) >= 0

              return (
                <Card key={bot.id} className="p-4 sm:p-5 border border-border hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-2.5 rounded-xl border ${si.bg} ${si.color} flex-shrink-0 mt-0.5`}>{si.icon}</div>
                    <div className="flex-1 min-w-0">

                      {/* Name + status + actions */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <h3 className="font-bold text-base truncate">{bot.name}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${sc.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                          </span>
                        </div>

                        {/* Desktop action buttons */}
                        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                          <Link href={`/bots/${bot.id}`}>
                            <Button variant="outline" size="sm" className="h-8 gap-1.5"><Eye className="w-3.5 h-3.5" />View</Button>
                          </Link>
                          {(bot.status === "CREATED" || bot.status === "PAUSED") && (
                            <Button size="sm" onClick={() => botAction(bot.id, "start")} disabled={!!actionLoading} className="h-8 bg-green-600 hover:bg-green-700 text-white gap-1.5">
                              {actionLoading === bot.id + "start" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}Start
                            </Button>
                          )}
                          {bot.status === "SIMULATING" && (
                            <Button size="sm" variant="outline" onClick={() => botAction(bot.id, "pause")} disabled={!!actionLoading} className="h-8 gap-1.5 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/10">
                              {actionLoading === bot.id + "pause" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pause className="w-3.5 h-3.5" />}Pause
                            </Button>
                          )}
                          {(bot.status === "SIMULATING" || bot.status === "PAUSED") && (
                            <Button size="sm" variant="outline" onClick={() => botAction(bot.id, "stop")} disabled={!!actionLoading} className="h-8 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
                              {actionLoading === bot.id + "stop" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}Stop
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                        <span className={`font-medium ${si.color}`}>{bot.strategyType}</span>
                        <span>•</span><span>{bot.tradingPair}</span>
                        <span>•</span><span>{bot.timeframe}</span>
                        {bot.lastExecutionTime && (
                          <><span>•</span><span className="flex items-center gap-1 hidden sm:flex"><Clock className="w-3 h-3" />Last run: {new Date(bot.lastExecutionTime).toLocaleTimeString()}</span></>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        <div><p className="text-xs text-muted-foreground">Balance</p><p className="font-semibold text-sm">${fmt(bot.currentBalance)}</p></div>
                        <div>
                          <p className="text-xs text-muted-foreground">P&L</p>
                          <p className={`font-semibold text-sm ${pnlPos ? "text-green-500" : "text-destructive"}`}>
                            {pnlPos ? "+" : ""}${fmt(bot.totalPnl)}<span className="text-xs ml-1">({pnlPos ? "+" : ""}{fmt(bot.totalPnlPercentage)}%)</span>
                          </p>
                        </div>
                        <div><p className="text-xs text-muted-foreground">Trades</p><p className="font-semibold text-sm">{bot.totalTrades}</p></div>
                        <div><p className="text-xs text-muted-foreground">Open Pos.</p><p className="font-semibold text-sm">{bot.openPositions}</p></div>
                      </div>

                      {/* Mobile action buttons */}
                      <div className="flex sm:hidden items-center gap-1.5 mt-3 pt-3 border-t border-border">
                        <Link href={`/bots/${bot.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full h-8 gap-1.5"><Eye className="w-3.5 h-3.5" />View</Button>
                        </Link>
                        {(bot.status === "CREATED" || bot.status === "PAUSED") && (
                          <Button size="sm" onClick={() => botAction(bot.id, "start")} disabled={!!actionLoading} className="flex-1 h-8 bg-green-600 hover:bg-green-700 text-white">
                            {actionLoading === bot.id + "start" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                          </Button>
                        )}
                        {bot.status === "SIMULATING" && (
                          <Button size="sm" variant="outline" onClick={() => botAction(bot.id, "pause")} disabled={!!actionLoading} className="flex-1 h-8 text-yellow-600 border-yellow-500/30">
                            {actionLoading === bot.id + "pause" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pause className="w-3.5 h-3.5" />}
                          </Button>
                        )}
                        {(bot.status === "SIMULATING" || bot.status === "PAUSED") && (
                          <Button size="sm" variant="outline" onClick={() => botAction(bot.id, "stop")} disabled={!!actionLoading} className="flex-1 h-8 text-destructive border-destructive/30">
                            {actionLoading === bot.id + "stop" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {showCreate && <CreateBotModal onClose={() => setShowCreate(false)} onCreated={fetchBots} />}
    </div>
  )
}