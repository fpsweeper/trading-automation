"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import {
  ArrowLeft, Play, Pause, Square, Activity, Loader2, RefreshCw, BarChart2,
  Shield, ChevronLeft, ChevronRight, AlertCircle, Settings2, Pencil,
  Check, ChevronsUpDown, Plus, X, MoreVertical
} from "lucide-react"

// ─── Types ─────────────────────────────────────────────────────────────────

interface BotResponse {
  id: string; name: string; strategyType: "DCA" | "GRID" | "SCALPING"
  tradingPair: string; timeframe: string
  status: "CREATED" | "SIMULATING" | "PAUSED" | "STOPPED" | "DELETED"
  initialBalance: number; currentBalance: number; totalPnl: number; totalPnlPercentage: number
  stopLossPercentage?: number; takeProfitPercentage?: number; maxPositionSizePercentage: number
  totalTrades: number; openPositions: number; createdAt: string; startedAt?: string
  lastExecutionTime?: string; nextExecutionTime?: string; pointsPerDay?: number
  configuration: Record<string, unknown>
}
interface BotTrade {
  id: string; tradeType: "BUY" | "SELL"; symbol: string; amount: number; price: number
  totalValue: number; fees: number; slippage: number; profitLoss?: number
  profitLossPercentage?: number; status: string; executedAt: string
  indicatorValues?: Record<string, number>
}
interface BotPosition {
  id: string; symbol: string; quantity: number; entryPrice: number; entryValue: number
  currentPrice?: number; currentValue?: number; unrealizedPnl?: number
  unrealizedPnlPercentage?: number; status: "OPEN" | "CLOSED"; openedAt: string
}
interface PerformanceSnapshot {
  id: string; snapshotTime: string; balance: number; totalPnl: number
  totalPnlPercentage: number; totalTrades: number; winRate?: number; openPositionsCount: number
}
interface BotStats {
  totalTrades: number; winningTrades: number; losingTrades: number; winRate: number
  totalRealizedPnl: number; totalUnrealizedPnl: number; averageWin?: number; averageLoss?: number
  largestWin?: number; largestLoss?: number; openPositions: number; openPositionsValue: number
}
interface CandleData {
  time: string; rawTime?: string; open: number; high: number; low: number; close: number; volume: number
}
interface EditBotForm {
  name: string; description: string; tradingPair: string; timeframe: string
  stopLossPercentage: number; takeProfitPercentage: number; maxPositionSizePercentage: number
  pointsPerDay: number; entryConditions: ConditionForm[]; exitConditions: ConditionForm[]
}
interface ConditionForm {
  indicatorName: string; operator: string; comparisonValue: number; logicalOperator: "AND" | "OR"
}

// ─── Constants ─────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL
const TIMEFRAMES = ["5m", "15m", "30m", "1h", "4h", "1d"]
const INDICATORS = ["RSI_14", "RSI_7", "MACD", "MACD_HISTOGRAM", "MA_20", "MA_50", "MA_200", "EMA_12", "BB_UPPER", "BB_LOWER", "CLOSE_PRICE"]
const OPERATORS = [
  { value: ">", label: ">" }, { value: "<", label: "<" },
  { value: ">=", label: ">=" }, { value: "<=", label: "<=" },
  { value: "crosses_above", label: "↑ Cross" }, { value: "crosses_below", label: "↓ Cross" },
]
const INDICATOR_LABELS: Record<string, string> = {
  CLOSE_PRICE: "Price", RSI_14: "RSI 14", RSI_7: "RSI 7", MACD: "MACD",
  MACD_SIGNAL: "Signal", MACD_HISTOGRAM: "MACD Hist", MA_20: "MA 20", MA_50: "MA 50",
  MA_200: "MA 200", EMA_12: "EMA 12", EMA_26: "EMA 26",
  BB_UPPER: "BB Upper", BB_MIDDLE: "BB Mid", BB_LOWER: "BB Lower", VOLUME: "Volume",
}
const STRATEGY_COLORS: Record<string, string> = {
  DCA: "text-blue-500", GRID: "text-purple-500", SCALPING: "text-orange-500"
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function authHeader() {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
}
function fmt(n?: number, d = 2) {
  if (n == null) return "—"
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}
function statusConfig(status: BotResponse["status"]) {
  const map: Record<string, { label: string; dot: string; badge: string }> = {
    SIMULATING: { label: "Running", dot: "bg-green-500 animate-pulse", badge: "bg-green-500/10 text-green-600 border-green-500/20" },
    PAUSED: { label: "Paused", dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    STOPPED: { label: "Stopped", dot: "bg-gray-400", badge: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
    CREATED: { label: "Ready", dot: "bg-blue-500", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  }
  return map[status] ?? { label: status, dot: "bg-gray-400", badge: "bg-gray-500/10 text-gray-500 border-gray-500/20" }
}

// ─── Candlestick Chart (lightweight-charts v5) ────────────────────────────

function CandlestickChart({ candles, trades, symbol }: { candles: CandleData[]; trades: BotTrade[]; symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<unknown>(null)
  const last = candles[candles.length - 1]
  const first = candles[0]
  const change = last && first ? last.close - first.close : 0
  const changePct = first?.close ? (change / first.close) * 100 : 0
  const pos = change >= 0

  useEffect(() => {
    if (!containerRef.current || !candles.length) return
    import("lightweight-charts").then((lwc) => {
      if (!containerRef.current) return
      if (chartRef.current) { (chartRef.current as { remove: () => void }).remove(); chartRef.current = null }
      const dark = document.documentElement.classList.contains("dark")
      const bc = dark ? "#1e293b" : "#e2e8f0"
      const tc = dark ? "#94a3b8" : "#64748b"
      const chart = lwc.createChart(containerRef.current!, {
        width: containerRef.current!.clientWidth, height: 280,
        layout: { background: { type: lwc.ColorType.Solid, color: "transparent" }, textColor: tc, fontSize: 10 },
        grid: { vertLines: { color: bc }, horzLines: { color: bc } },
        crosshair: { mode: lwc.CrosshairMode.Normal },
        rightPriceScale: { borderColor: bc, scaleMargins: { top: 0.1, bottom: 0.3 } },
        timeScale: { borderColor: bc, timeVisible: true, secondsVisible: false, fixLeftEdge: true, fixRightEdge: true },
      })
      chartRef.current = chart
      const cs = chart.addSeries(lwc.CandlestickSeries, {
        upColor: "#22c55e", downColor: "#ef4444",
        borderUpColor: "#22c55e", borderDownColor: "#ef4444",
        wickUpColor: "#22c55e", wickDownColor: "#ef4444", borderVisible: true,
      })
      type T = number & { readonly __t: unique symbol }
      const toT = (iso: string): T => Math.floor(new Date(iso).getTime() / 1000) as unknown as T
      const sorted = [...candles].sort((a, b) => new Date(a.rawTime ?? a.time).getTime() - new Date(b.rawTime ?? b.time).getTime())
      cs.setData(sorted.map(c => ({ time: toT(c.rawTime ?? c.time), open: c.open, high: c.high, low: c.low, close: c.close })))
      const vs = chart.addSeries(lwc.HistogramSeries, { color: "#3b82f6", priceFormat: { type: "volume" as const }, priceScaleId: "vol" })
      chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })
      vs.setData(sorted.map(c => ({ time: toT(c.rawTime ?? c.time), value: c.volume, color: c.close >= c.open ? "#22c55e50" : "#ef444450" })))
      if (trades.length > 0) {
        const markers = trades.filter(t => t.executedAt).map(t => ({
          time: toT(t.executedAt),
          position: (t.tradeType === "BUY" ? "belowBar" : "aboveBar") as "belowBar" | "aboveBar",
          color: t.tradeType === "BUY" ? "#22c55e" : "#ef4444",
          shape: (t.tradeType === "BUY" ? "arrowUp" : "arrowDown") as "arrowUp" | "arrowDown",
          text: t.tradeType === "BUY" ? `B $${t.price?.toFixed(0)}` : `S $${t.price?.toFixed(0)}`,
          size: 1,
        })).sort((a, b) => (a.time as unknown as number) - (b.time as unknown as number))
        lwc.createSeriesMarkers(cs, markers as never)
      }
      chart.timeScale().fitContent()
      const ro = new ResizeObserver(es => {
        if (es[0] && chartRef.current) (chartRef.current as { applyOptions: (o: object) => void }).applyOptions({ width: es[0].contentRect.width })
      })
      ro.observe(containerRef.current!)
      return () => ro.disconnect()
    })
    return () => { if (chartRef.current) { (chartRef.current as { remove: () => void }).remove(); chartRef.current = null } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles, trades])

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xl sm:text-2xl font-bold font-mono">{last ? `$${fmt(last.close)}` : "—"}</span>
        {last && first && <span className={`text-sm font-medium ${pos ? "text-green-500" : "text-red-500"}`}>{pos ? "+" : ""}{fmt(change)} ({pos ? "+" : ""}{changePct.toFixed(2)}%)</span>}
        <span className="text-xs text-muted-foreground ml-auto">{candles.length} · {symbol}</span>
      </div>
      {candles.length === 0
        ? <div className="flex items-center justify-center h-56 text-muted-foreground text-sm gap-2"><AlertCircle className="w-4 h-4" />No price data</div>
        : <div ref={containerRef} className="w-full rounded-lg overflow-hidden" />}
      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />Bull</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />Bear</span>
        <span className="flex items-center gap-1"><span className="text-green-500 font-bold">▲</span>Buy</span>
        <span className="flex items-center gap-1"><span className="text-red-500 font-bold">▼</span>Sell</span>
      </div>
    </div>
  )
}

// ─── Equity Chart ─────────────────────────────────────────────────────────

function EquityChart({ data, initialBalance }: { data: PerformanceSnapshot[]; initialBalance: number }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm gap-2">
      <AlertCircle className="w-4 h-4" /> No snapshots yet — taken hourly
    </div>
  )
  const chartData = [...data].reverse().map(s => ({
    time: new Date(s.snapshotTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    balance: s.balance,
  }))
  const lastBal = chartData[chartData.length - 1]?.balance ?? initialBalance
  const pos = lastBal >= initialBalance
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={pos ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
            <stop offset="95%" stopColor={pos ? "#22c55e" : "#ef4444"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
        <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} width={42} />
        <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`$${fmt(v)}`, "Balance"]} />
        <ReferenceLine y={initialBalance} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" strokeOpacity={0.6} />
        <Area type="monotone" dataKey="balance" stroke={pos ? "#22c55e" : "#ef4444"} strokeWidth={2} fill="url(#eg)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Trades Table ─────────────────────────────────────────────────────────

function TradesTable({ trades, tradePage, totalTradePage, onPrev, onNext }: {
  trades: BotTrade[]; tradePage: number; totalTradePage: number; onPrev: () => void; onNext: () => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (trades.length === 0) return (
    <Card className="border border-border">
      <div className="p-12 text-center"><BarChart2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No trades yet</p></div>
    </Card>
  )

  return (
    <Card className="border border-border overflow-hidden">

      {/* ── Mobile card list ── */}
      <div className="block sm:hidden divide-y divide-border">
        {trades.map(t => {
          const exp = expandedId === t.id
          const hasInd = t.indicatorValues && Object.keys(t.indicatorValues).length > 0
          const pp = (t.profitLoss ?? 0) >= 0
          return (
            <div key={t.id}>
              <div
                className={`p-4 ${hasInd ? "cursor-pointer" : ""} ${exp ? "bg-muted/20" : ""}`}
                onClick={() => hasInd && setExpandedId(exp ? null : t.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${t.tradeType === "BUY" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>
                      {t.tradeType === "BUY" ? "▲" : "▼"} {t.tradeType}
                    </span>
                    <span className="text-sm font-medium">{t.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.profitLoss != null && (
                      <span className={`text-sm font-semibold font-mono ${pp ? "text-green-500" : "text-destructive"}`}>
                        {pp ? "+" : ""}${fmt(t.profitLoss)}
                      </span>
                    )}
                    {hasInd && <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${exp ? "rotate-90" : ""}`} />}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div><span className="block text-foreground font-mono">{fmt(t.amount, 6)}</span>Amount</div>
                  <div><span className="block text-foreground font-mono">${fmt(t.price)}</span>Price</div>
                  <div><span className="block text-foreground font-mono">${fmt(t.totalValue)}</span>Total</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{fmtTime(t.executedAt)}</p>
              </div>
              {exp && hasInd && (
                <div className="px-4 pb-4 bg-muted/10 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider my-2">Indicators at execution</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.entries(t.indicatorValues!).map(([k, v]) => (
                      <div key={k} className="p-1.5 rounded-lg bg-background border border-border">
                        <p className="text-xs text-muted-foreground">{INDICATOR_LABELS[k] ?? k}</p>
                        <p className="text-xs font-mono font-semibold">{k === "VOLUME" ? v.toLocaleString("en-US", { maximumFractionDigits: 0 }) : v.toFixed(3)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-3 w-8" />
              {["Type", "Symbol", "Amount", "Price", "Total", "Fees", "P&L", "Time"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map(t => {
              const exp = expandedId === t.id
              const hasInd = t.indicatorValues && Object.keys(t.indicatorValues).length > 0
              return (
                <>
                  <tr key={t.id} className={`border-b border-border transition-colors ${hasInd ? "cursor-pointer hover:bg-muted/20" : ""} ${exp ? "bg-muted/20" : ""}`}
                    onClick={() => hasInd && setExpandedId(exp ? null : t.id)}>
                    <td className="px-3 py-3">{hasInd && <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${exp ? "rotate-90" : ""}`} />}</td>
                    <td className="px-3 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${t.tradeType === "BUY" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>{t.tradeType === "BUY" ? "▲" : "▼"} {t.tradeType}</span></td>
                    <td className="px-3 py-3 text-sm font-medium">{t.symbol}</td>
                    <td className="px-3 py-3 text-sm font-mono">{fmt(t.amount, 6)}</td>
                    <td className="px-3 py-3 text-sm font-mono">${fmt(t.price)}</td>
                    <td className="px-3 py-3 text-sm font-mono">${fmt(t.totalValue)}</td>
                    <td className="px-3 py-3 text-sm font-mono text-muted-foreground">${fmt(t.fees, 4)}</td>
                    <td className="px-3 py-3 text-sm font-mono">
                      {t.profitLoss != null
                        ? <span className={t.profitLoss >= 0 ? "text-green-500" : "text-destructive"}>{t.profitLoss >= 0 ? "+" : ""}${fmt(t.profitLoss)}<span className="text-xs ml-1">({t.profitLoss >= 0 ? "+" : ""}{fmt(t.profitLossPercentage)}%)</span></span>
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{fmtTime(t.executedAt)}</td>
                  </tr>
                  {exp && hasInd && (
                    <tr key={`${t.id}-ind`} className="border-b border-border bg-muted/10">
                      <td colSpan={9} className="px-4 py-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Indicator Snapshot at Trade Execution</p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                          {Object.entries(t.indicatorValues!).map(([k, v]) => (
                            <div key={k} className="p-2 rounded-lg bg-background border border-border">
                              <p className="text-xs text-muted-foreground leading-tight mb-0.5">{INDICATOR_LABELS[k] ?? k}</p>
                              <p className="text-xs font-mono font-semibold">{k === "VOLUME" ? v.toLocaleString("en-US", { maximumFractionDigits: 0 }) : v.toFixed(4)}</p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalTradePage > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Page {tradePage + 1} of {totalTradePage}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPrev} disabled={tradePage === 0}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={onNext} disabled={tradePage >= totalTradePage - 1}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// ─── Edit Bot Modal ────────────────────────────────────────────────────────

function EditBotModal({ bot, onClose, onUpdated }: { bot: BotResponse; onClose: () => void; onUpdated: () => void }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pairs, setPairs] = useState<string[]>([])
  const [loadingPairs, setLP] = useState(true)
  const [pairOpen, setPairOpen] = useState(false)
  const [form, setForm] = useState<EditBotForm>({
    name: bot.name, description: bot.description ?? "", tradingPair: bot.tradingPair, timeframe: bot.timeframe,
    stopLossPercentage: bot.stopLossPercentage ?? 5, takeProfitPercentage: bot.takeProfitPercentage ?? 10,
    maxPositionSizePercentage: bot.maxPositionSizePercentage ?? 20, pointsPerDay: bot.pointsPerDay ?? 1,
    entryConditions: [], exitConditions: [],
  })

  useEffect(() => {
    fetch(`${API}api/market-data/pairs`).then(r => r.json()).then(d => setPairs(d.pairs ?? []))
      .catch(() => setPairs(["BTCUSDT", "ETHUSDT", "BNBUSDT"])).finally(() => setLP(false))
  }, [])

  useEffect(() => {
    fetch(`${API}api/bots/${bot.id}/conditions`, { headers: authHeader() }).then(r => r.json()).then(d => {
      setForm(p => ({
        ...p,
        entryConditions: (d.entryConditions ?? []).map((c: ConditionForm) => ({ indicatorName: c.indicatorName, operator: c.operator, comparisonValue: c.comparisonValue, logicalOperator: c.logicalOperator })),
        exitConditions: (d.exitConditions ?? []).map((c: ConditionForm) => ({ indicatorName: c.indicatorName, operator: c.operator, comparisonValue: c.comparisonValue, logicalOperator: c.logicalOperator })),
      }))
    }).catch(() => { })
  }, [bot.id])

  const set = (k: keyof EditBotForm, v: unknown) => setForm(p => ({ ...p, [k]: v }))
  const addC = (t: "entryConditions" | "exitConditions") => set(t, [...form[t], { indicatorName: "RSI_14", operator: "<", comparisonValue: 30, logicalOperator: "AND" }])
  const remC = (t: "entryConditions" | "exitConditions", i: number) => set(t, form[t].filter((_, j) => j !== i))
  const updC = (t: "entryConditions" | "exitConditions", i: number, k: keyof ConditionForm, v: unknown) => set(t, form[t].map((c, j) => j === i ? { ...c, [k]: v } : c))

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Bot name required"); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}api/bots/${bot.id}`, {
        method: "PUT", headers: authHeader(),
        body: JSON.stringify({ ...form, entryConditions: form.entryConditions.map((c, i) => ({ ...c, conditionOrder: i })), exitConditions: form.exitConditions.map((c, i) => ({ ...c, conditionOrder: i })) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      toast.success("Bot updated — restart to apply"); onUpdated(); onClose()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed") }
    finally { setLoading(false) }
  }

  return (
    // Slides up from bottom on mobile, centered on desktop
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto border-0 sm:border border-border bg-background shadow-2xl rounded-t-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
          <div><h2 className="font-bold text-lg">Edit Bot</h2><p className="text-xs text-muted-foreground">Step {step} of 3</p></div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-4 sm:px-6 pt-4">
          <div className="flex gap-1.5">{[0, 1, 2].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-border"}`} />)}</div>
        </div>
        <div className="p-4 sm:p-6 space-y-4">

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Configuration</h3>
              <div><Label>Bot Name *</Label><Input value={form.name} onChange={e => set("name", e.target.value)} className="mt-1.5" /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={e => set("description", e.target.value)} placeholder="Optional" className="mt-1.5" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Trading Pair</Label>
                  <Popover open={pairOpen} onOpenChange={setPairOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between font-normal mt-1.5">
                        {loadingPairs ? <span className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />Loading...</span> : (form.tradingPair || "Select pair...")}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                      <Command><CommandInput placeholder="Search..." /><CommandEmpty>No pair found.</CommandEmpty>
                        <CommandList className="max-h-52"><CommandGroup>
                          {pairs.map(p => <CommandItem key={p} value={p} onSelect={v => { set("tradingPair", v.toUpperCase()); setPairOpen(false) }}><Check className={cn("mr-2 h-4 w-4", form.tradingPair === p ? "opacity-100" : "opacity-0")} />{p}</CommandItem>)}
                        </CommandGroup></CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Timeframe</Label>
                  <select value={form.timeframe} onChange={e => set("timeframe", e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-sm">
                    {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {form.tradingPair !== bot.tradingPair && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>Changing pair affects future trades.</span>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Risk Settings</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Stop Loss (%)</Label><Input type="number" value={form.stopLossPercentage} onChange={e => set("stopLossPercentage", Number(e.target.value))} step={0.1} min={0.1} max={50} className="mt-1.5" /></div>
                <div><Label>Take Profit (%)</Label><Input type="number" value={form.takeProfitPercentage} onChange={e => set("takeProfitPercentage", Number(e.target.value))} step={0.1} min={0.1} max={1000} className="mt-1.5" /></div>
                <div><Label>Max Position (%)</Label><Input type="number" value={form.maxPositionSizePercentage} onChange={e => set("maxPositionSizePercentage", Number(e.target.value))} step={1} min={1} max={100} className="mt-1.5" /></div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
                <Shield className="w-4 h-4 inline mr-1.5 mb-0.5" />SL/TP checked every execution cycle.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Indicator Conditions</h3>
              <p className="text-sm text-muted-foreground">Saving replaces all existing conditions.</p>
              {(["entryConditions", "exitConditions"] as const).map(type => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className={type === "entryConditions" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                      {type === "entryConditions" ? "Entry" : "Exit"} Conditions
                    </Label>
                    <Button size="sm" variant="outline" onClick={() => addC(type)}><Plus className="w-3 h-3 mr-1" />Add</Button>
                  </div>
                  {form[type].length === 0 && (
                    <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/40 border border-border">
                      {type === "entryConditions" ? "Default strategy logic" : "SL/TP only"}
                    </p>
                  )}
                  {form[type].map((cond, idx) => (
                    <div key={idx} className="flex flex-wrap gap-1.5 items-center p-2 rounded-lg border border-border bg-muted/20 mb-2">
                      {idx > 0 && <select value={cond.logicalOperator} onChange={e => updC(type, idx, "logicalOperator", e.target.value)} className="w-14 px-1 py-1.5 text-xs rounded bg-input border border-border text-foreground"><option value="AND">AND</option><option value="OR">OR</option></select>}
                      <select value={cond.indicatorName} onChange={e => updC(type, idx, "indicatorName", e.target.value)} className="flex-1 min-w-[90px] px-2 py-1.5 text-xs rounded bg-input border border-border text-foreground">{INDICATORS.map(i => <option key={i} value={i}>{i}</option>)}</select>
                      <select value={cond.operator} onChange={e => updC(type, idx, "operator", e.target.value)} className="w-20 px-2 py-1.5 text-xs rounded bg-input border border-border text-foreground">{OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                      <Input type="number" value={cond.comparisonValue} onChange={e => updC(type, idx, "comparisonValue", Number(e.target.value))} className="w-16 h-8 text-xs" />
                      <button onClick={() => remC(type, idx)} className="text-muted-foreground hover:text-destructive p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex items-center justify-between px-4 sm:px-6 py-4 border-t border-border bg-background/95 backdrop-blur-sm">
          <Button variant="outline" onClick={() => step > 1 ? setStep(s => s - 1) : onClose()} disabled={loading}>
            <ChevronLeft className="w-4 h-4 mr-1" />{step === 1 ? "Cancel" : "Back"}
          </Button>
          {step < 3
            ? <Button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !form.name.trim()}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
            : <Button onClick={handleSave} disabled={loading} className="bg-primary text-primary-foreground">{loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}Save Changes</Button>
          }
        </div>
      </Card>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function BotDetailPage() {
  const router = useRouter()
  const params = useParams()
  const botId = params.id as string

  const [bot, setBot] = useState<BotResponse | null>(null)
  const [stats, setStats] = useState<BotStats | null>(null)
  const [trades, setTrades] = useState<BotTrade[]>([])
  const [positions, setPositions] = useState<BotPosition[]>([])
  const [snapshots, setSnapshots] = useState<PerformanceSnapshot[]>([])
  const [candles, setCandles] = useState<CandleData[]>([])
  const [candleTimeframe, setCandleTimeframe] = useState("1h")
  const [conditions, setConditions] = useState<{ entryConditions: ConditionForm[]; exitConditions: ConditionForm[] }>({ entryConditions: [], exitConditions: [] })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showEdit, setShowEdit] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "trades" | "positions">("overview")
  const [tradePage, setTradePage] = useState(0)
  const [totalTradePage, setTotalTradePage] = useState(0)

  useEffect(() => { if (!localStorage.getItem("auth_token")) router.push("/login") }, [router])

  const fetchAll = useCallback(async () => {
    if (!botId) return
    try {
      const [bR, sR, tR, pR, snR, cR] = await Promise.all([
        fetch(`${API}api/bots/${botId}`, { headers: authHeader() }),
        fetch(`${API}api/bots/${botId}/stats`, { headers: authHeader() }),
        fetch(`${API}api/bots/${botId}/trades?page=${tradePage}&size=15`, { headers: authHeader() }),
        fetch(`${API}api/bots/${botId}/positions/open`, { headers: authHeader() }),
        fetch(`${API}api/bots/${botId}/performance`, { headers: authHeader() }),
        fetch(`${API}api/bots/${botId}/conditions`, { headers: authHeader() }),
      ])
      if (bR.status === 401) { router.push("/login"); return }
      if (bR.ok) { const d = await bR.json(); setBot(d.bot) }
      if (sR.ok) { const d = await sR.json(); setStats(d.stats) }
      if (tR.ok) { const d = await tR.json(); setTrades(d.trades ?? []); setTotalTradePage(d.totalPages ?? 0) }
      if (pR.ok) { const d = await pR.json(); setPositions(d.positions ?? []) }
      if (snR.ok) { const d = await snR.json(); setSnapshots(d.snapshots ?? []) }
      if (cR.ok) { const d = await cR.json(); setConditions({ entryConditions: d.entryConditions ?? [], exitConditions: d.exitConditions ?? [] }) }
    } catch { toast.error("Failed to load") }
    finally { setLoading(false) }
  }, [botId, router, tradePage])

  const fetchCandles = useCallback(async (pair: string, tf: string) => {
    try {
      const res = await fetch(`${API}api/market-data/candles/${pair}?timeframe=${tf}&limit=100`)
      if (!res.ok) return
      const data = await res.json()
      setCandles((data.candles ?? []).map((c: { openTime: string; openPrice: number; highPrice: number; lowPrice: number; closePrice: number; volume: number }) => ({
        rawTime: c.openTime,
        time: new Date(c.openTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }),
        open: c.openPrice, high: c.highPrice, low: c.lowPrice, close: c.closePrice, volume: c.volume,
      })))
    } catch { }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])
  useEffect(() => { if (bot) fetchCandles(bot.tradingPair, candleTimeframe) }, [bot, candleTimeframe, fetchCandles])
  useEffect(() => { const i = setInterval(fetchAll, 30000); return () => clearInterval(i) }, [fetchAll])

  async function botAction(action: "start" | "pause" | "stop") {
    if (!bot) return
    setActionLoading(action); setShowMenu(false)
    try {
      const res = await fetch(`${API}api/bots/${botId}/${action}`, { method: "PUT", headers: authHeader() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message); fetchAll()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed") }
    finally { setActionLoading(null) }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  if (!bot) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Bot not found</p><Link href="/bots"><Button className="mt-4">Back to Bots</Button></Link></div>
    </div>
  )

  const sc = statusConfig(bot.status)
  const pnlPos = (bot.totalPnl ?? 0) >= 0
  const TFS = ["5m", "15m", "1h", "4h", "1d"]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* ── Header ── */}
        <div className="mb-4 sm:mb-6">
          <Link href="/bots" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Bots
          </Link>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-bold truncate">{bot.name}</h1>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${sc.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                <span className={`font-medium ${STRATEGY_COLORS[bot.strategyType]}`}>{bot.strategyType}</span>
                <span>•</span><span>{bot.tradingPair}</span><span>•</span><span>{bot.timeframe}</span>
                {bot.startedAt && <><span>•</span><span className="hidden sm:inline">Started {new Date(bot.startedAt).toLocaleDateString()}</span></>}
              </div>
            </div>

            {/* Desktop action buttons */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={fetchAll} className="gap-1.5"><RefreshCw className="w-3.5 h-3.5" />Refresh</Button>
              <Button variant="outline" size="sm"
                onClick={() => { if (bot.status === "SIMULATING") { toast.error("Pause before editing"); return } setShowEdit(true) }}
                className={`gap-1.5 ${bot.status === "SIMULATING" ? "opacity-50 cursor-not-allowed" : ""}`}>
                <Pencil className="w-3.5 h-3.5" />Edit
              </Button>
              {(bot.status === "CREATED" || bot.status === "PAUSED") && (
                <Button size="sm" onClick={() => botAction("start")} disabled={!!actionLoading} className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
                  {actionLoading === "start" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}Start
                </Button>
              )}
              {bot.status === "SIMULATING" && (
                <Button size="sm" variant="outline" onClick={() => botAction("pause")} disabled={!!actionLoading} className="gap-1.5 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/10">
                  {actionLoading === "pause" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pause className="w-3.5 h-3.5" />}Pause
                </Button>
              )}
              {(bot.status === "SIMULATING" || bot.status === "PAUSED") && (
                <Button size="sm" variant="outline" onClick={() => botAction("stop")} disabled={!!actionLoading} className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
                  {actionLoading === "stop" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}Stop
                </Button>
              )}
            </div>

            {/* Mobile kebab menu */}
            <div className="flex sm:hidden items-center gap-2 flex-shrink-0">
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setShowMenu(!showMenu)} className="px-2"><MoreVertical className="w-4 h-4" /></Button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-44 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                      <button onClick={() => { setShowMenu(false); fetchAll() }} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted"><RefreshCw className="w-4 h-4" />Refresh</button>
                      <button onClick={() => { setShowMenu(false); if (bot.status === "SIMULATING") { toast.error("Pause first"); return } setShowEdit(true) }} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted"><Pencil className="w-4 h-4" />Edit Config</button>
                      {(bot.status === "CREATED" || bot.status === "PAUSED") && <button onClick={() => botAction("start")} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted text-green-600"><Play className="w-4 h-4" />Start Bot</button>}
                      {bot.status === "SIMULATING" && <button onClick={() => botAction("pause")} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted text-yellow-600"><Pause className="w-4 h-4" />Pause Bot</button>}
                      {(bot.status === "SIMULATING" || bot.status === "PAUSED") && <button onClick={() => botAction("stop")} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted text-destructive"><Square className="w-4 h-4" />Stop Bot</button>}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI Cards — 2 cols mobile, 4 cols desktop ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="p-4 sm:p-5 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            <p className="text-xl sm:text-2xl font-bold font-mono">${fmt(bot.currentBalance)}</p>
            <p className="text-xs text-muted-foreground mt-1">Init: ${fmt(bot.initialBalance)}</p>
          </Card>
          {/*<Card className={`p-4 sm:p-5 border ${pnlPos ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>
            <p className="text-xs text-muted-foreground mb-1">Total P&L</p>
            <p className={`text-xl sm:text-2xl font-bold font-mono ${pnlPos ? "text-green-500" : "text-destructive"}`}>{pnlPos ? "+" : ""}${fmt(bot.totalPnl)}</p>
            <p className={`text-xs mt-1 ${pnlPos ? "text-green-600" : "text-destructive"}`}>{pnlPos ? "+" : ""}{fmt(bot.totalPnlPercentage)}%</p>
          </Card>
          <Card className="p-4 sm:p-5 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
            <p className="text-xl sm:text-2xl font-bold">{stats?.winRate != null ? `${stats.winRate.toFixed(1)}%` : "—"}</p>
            <p className="text-xs text-muted-foreground mt-1">{stats ? `${stats.winningTrades}W/${stats.losingTrades}L` : "No trades"}</p>
          </Card>*/}
          <Card className="p-4 sm:p-5 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Trades</p>
            <p className="text-xl sm:text-2xl font-bold">{bot.totalTrades}</p>
            <p className="text-xs text-muted-foreground mt-1">{bot.openPositions} open</p>
          </Card>
        </div>

        {/* ── Tabs — horizontally scrollable on mobile ── */}
        <div className="flex mb-4 border-b border-border overflow-x-auto">
          {(["overview", "trades", "positions"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tab}
              {tab === "trades" && bot.totalTrades > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted text-xs">{bot.totalTrades}</span>}
              {tab === "positions" && bot.openPositions > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-600 text-xs">{bot.openPositions}</span>}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="space-y-4 sm:space-y-6">

            {/* Price Chart */}
            {/*<Card className="p-4 sm:p-6 border border-border">
              <div className="flex items-center justify-between mb-3 gap-2">
                <h2 className="font-semibold text-sm sm:text-base shrink-0">{bot.tradingPair}</h2>
                <div className="flex gap-1 overflow-x-auto">
                  {TFS.map(tf => (
                    <button key={tf} onClick={() => setCandleTimeframe(tf)}
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 ${candleTimeframe === tf ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <CandlestickChart candles={candles} trades={trades} symbol={bot.tradingPair} />
            </Card>*/}

            {/* Equity Curve */}
            {/*<Card className="p-4 sm:p-6 border border-border">
              <h2 className="font-semibold text-sm sm:text-base mb-1">Equity Curve</h2>
              <p className="text-xs text-muted-foreground mb-3">Hourly balance snapshots</p>
              <EquityChart data={snapshots} initialBalance={bot.initialBalance} />
            </Card> */}

            {/* Stats + Config — stacked on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-6 border border-border">
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <BarChart2 className="w-4 h-4 text-primary" /> Performance
                </h2>
                {stats ? (
                  <div className="space-y-2">
                    {[
                      { label: "Realized P&L", value: `$${fmt(stats.totalRealizedPnl)}`, color: stats.totalRealizedPnl >= 0 ? "text-green-500" : "text-destructive" },
                      { label: "Unrealized P&L", value: `$${fmt(stats.totalUnrealizedPnl)}`, color: stats.totalUnrealizedPnl >= 0 ? "text-green-500" : "text-destructive" },
                      { label: "Avg Win", value: stats.averageWin != null ? `$${fmt(stats.averageWin)}` : "—", color: "text-green-500" },
                      { label: "Avg Loss", value: stats.averageLoss != null ? `$${fmt(stats.averageLoss)}` : "—", color: "text-destructive" },
                      { label: "Best Trade", value: stats.largestWin != null ? `$${fmt(stats.largestWin)}` : "—", color: "text-green-500" },
                      { label: "Worst Trade", value: stats.largestLoss != null ? `$${fmt(stats.largestLoss)}` : "—", color: "text-destructive" },
                      { label: "Open Positions Value", value: `$${fmt(stats.openPositionsValue)}`, color: "text-foreground" },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                        <span className="text-xs sm:text-sm text-muted-foreground">{row.label}</span>
                        <span className={`text-xs sm:text-sm font-semibold font-mono ${row.color}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No stats yet</p>}
              </Card>

              <Card className="p-4 sm:p-6 border border-border">
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Settings2 className="w-4 h-4 text-primary" /> Configuration
                </h2>
                <div className="space-y-2">
                  {[
                    { label: "Strategy", value: bot.strategyType },
                    { label: "Pair", value: bot.tradingPair },
                    { label: "Timeframe", value: bot.timeframe },
                    { label: "Initial Bal", value: `$${fmt(bot.initialBalance)}` },
                    { label: "Stop Loss", value: bot.stopLossPercentage != null ? `${bot.stopLossPercentage}%` : "—" },
                    { label: "Take Profit", value: bot.takeProfitPercentage != null ? `${bot.takeProfitPercentage}%` : "—" },
                    { label: "Max Position", value: `${bot.maxPositionSizePercentage}%` },
                    { label: "Points/Trade", value: String(bot.pointsPerDay ?? "1") },
                    { label: "Last Run", value: bot.lastExecutionTime ? fmtTime(bot.lastExecutionTime) : "—" },
                    { label: "Next Run", value: bot.nextExecutionTime ? fmtTime(bot.nextExecutionTime) : "—" },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">{row.label}</span>
                      <span className="text-xs sm:text-sm font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Indicator Conditions */}
              <Card className="p-4 sm:p-6 border border-border lg:col-span-2">
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <BarChart2 className="w-4 h-4 text-primary" /> Indicator Conditions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Entry */}
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Entry Conditions</p>
                    {conditions.entryConditions.length === 0 ? (
                      <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/40 border border-border">Default strategy logic</p>
                    ) : (
                      <div className="space-y-1.5">
                        {conditions.entryConditions.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/5 border border-green-500/20 text-xs">
                            {i > 0 && <span className="text-xs font-bold text-muted-foreground">{c.logicalOperator}</span>}
                            <span className="font-medium text-foreground">{c.indicatorName}</span>
                            <span className="text-muted-foreground">{c.operator}</span>
                            <span className="font-mono font-semibold text-green-600">{c.comparisonValue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Exit */}
                  <div>
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Exit Conditions</p>
                    {conditions.exitConditions.length === 0 ? (
                      <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/40 border border-border">SL/TP only</p>
                    ) : (
                      <div className="space-y-1.5">
                        {conditions.exitConditions.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/20 text-xs">
                            {i > 0 && <span className="text-xs font-bold text-muted-foreground">{c.logicalOperator}</span>}
                            <span className="font-medium text-foreground">{c.indicatorName}</span>
                            <span className="text-muted-foreground">{c.operator}</span>
                            <span className="font-mono font-semibold text-red-500">{c.comparisonValue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── Trades Tab ── */}
        {activeTab === "trades" && (
          <TradesTable trades={trades} tradePage={tradePage} totalTradePage={totalTradePage}
            onPrev={() => setTradePage(p => p - 1)} onNext={() => setTradePage(p => p + 1)} />
        )}

        {/* ── Positions Tab ── */}
        {activeTab === "positions" && (
          <Card className="border border-border overflow-hidden">
            {positions.length === 0 ? (
              <div className="p-12 text-center"><Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No open positions</p></div>
            ) : (
              <>
                {/* Mobile positions */}
                <div className="block sm:hidden divide-y divide-border">
                  {positions.map(pos => {
                    const pp = (pos.unrealizedPnl ?? 0) >= 0
                    return (
                      <div key={pos.id} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{pos.symbol}</span>
                          {pos.unrealizedPnl != null && (
                            <span className={`text-sm font-semibold font-mono ${pp ? "text-green-500" : "text-destructive"}`}>
                              {pp ? "+" : ""}${fmt(pos.unrealizedPnl)}
                              {pos.unrealizedPnlPercentage != null && <span className="text-xs ml-1">({pp ? "+" : ""}{fmt(pos.unrealizedPnlPercentage)}%)</span>}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div><span className="block font-mono text-foreground">{fmt(pos.quantity, 6)}</span>Quantity</div>
                          <div><span className="block font-mono text-foreground">${fmt(pos.entryPrice)}</span>Entry Price</div>
                          <div><span className="block font-mono text-foreground">{pos.currentPrice ? `$${fmt(pos.currentPrice)}` : "—"}</span>Current Price</div>
                          <div><span className="block font-mono text-foreground">${fmt(pos.entryValue)}</span>Entry Value</div>
                        </div>
                        <p className="text-xs text-muted-foreground">{fmtTime(pos.openedAt)}</p>
                      </div>
                    )
                  })}
                </div>
                {/* Desktop positions table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["Symbol", "Quantity", "Entry Price", "Current Price", "Entry Value", "Current Value", "Unrealized P&L", "Opened"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map(pos => {
                        const pp = (pos.unrealizedPnl ?? 0) >= 0
                        return (
                          <tr key={pos.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-semibold">{pos.symbol}</td>
                            <td className="px-4 py-3 text-sm font-mono">{fmt(pos.quantity, 6)}</td>
                            <td className="px-4 py-3 text-sm font-mono">${fmt(pos.entryPrice)}</td>
                            <td className="px-4 py-3 text-sm font-mono">{pos.currentPrice != null ? `$${fmt(pos.currentPrice)}` : "—"}</td>
                            <td className="px-4 py-3 text-sm font-mono">${fmt(pos.entryValue)}</td>
                            <td className="px-4 py-3 text-sm font-mono">{pos.currentValue != null ? `$${fmt(pos.currentValue)}` : "—"}</td>
                            <td className="px-4 py-3 text-sm font-mono">
                              {pos.unrealizedPnl != null ? (
                                <span className={pp ? "text-green-500" : "text-destructive"}>
                                  {pp ? "+" : ""}${fmt(pos.unrealizedPnl)}
                                  {pos.unrealizedPnlPercentage != null && <span className="text-xs ml-1">({pp ? "+" : ""}{fmt(pos.unrealizedPnlPercentage)}%)</span>}
                                </span>
                              ) : "—"}
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{fmtTime(pos.openedAt)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        )}

      </main>

      {showEdit && bot && <EditBotModal bot={bot} onClose={() => setShowEdit(false)} onUpdated={fetchAll} />}
    </div>
  )
}