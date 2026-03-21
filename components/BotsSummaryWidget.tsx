// ─── Add this component anywhere in your dashboard/page.tsx ───────────────
// It fetches the user's bots and shows a compact summary with a link to /bots
// Paste this ABOVE the DashboardPage export default function
// Then add <BotsSummaryWidget /> inside the JSX wherever you want it to appear

"use client" // already on your dashboard page

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Bot, TrendingUp, TrendingDown, Activity,
    Play, Pause, ChevronRight, Zap, Layers, Coins, AlertCircle
} from "lucide-react"

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

const API = process.env.NEXT_PUBLIC_API_URL

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

export function BotsSummaryWidget() {
    const [bots, setBots] = useState<BotSummary[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API}api/bots`, { headers: authHeader() })
            .then(r => r.json())
            .then(data => setBots((data.bots ?? []).slice(0, 4))) // show max 4
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const activeBots = bots.filter(b => b.status === "SIMULATING").length
    const totalPnl = bots.reduce((acc, b) => acc + (b.totalPnl ?? 0), 0)
    const pnlPos = totalPnl >= 0

    return (
        <Card className="p-6 border border-border">
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

            {/* Combined P&L */}
            {!loading && bots.length > 0 && (
                <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${pnlPos ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                    {pnlPos
                        ? <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                        : <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0" />}
                    <div>
                        <p className="text-xs text-muted-foreground">Combined P&L</p>
                        <p className={`text-lg font-bold font-mono ${pnlPos ? "text-green-500" : "text-destructive"}`}>
                            {pnlPos ? "+" : ""}${totalPnl.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            )}

            {/* Bot list */}
            {loading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 rounded-lg bg-muted/40 animate-pulse" />
                    ))}
                </div>
            ) : bots.length === 0 ? (
                <div className="text-center py-6">
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
                    {bots.map(bot => {
                        const pnlPos = (bot.totalPnl ?? 0) >= 0
                        return (
                            <Link key={bot.id} href={`/bots/${bot.id}`}>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer">
                                    {/* Status dot */}
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot(bot.status)}`} />

                                    {/* Strategy icon */}
                                    <div className="flex-shrink-0">{strategyIcon(bot.strategyType)}</div>

                                    {/* Name + pair */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{bot.name}</p>
                                        <p className="text-xs text-muted-foreground">{bot.tradingPair} · {bot.strategyType}</p>
                                    </div>

                                    {/* P&L */}
                                    <div className="text-right flex-shrink-0">
                                        <p className={`text-sm font-semibold font-mono ${pnlPos ? "text-green-500" : "text-destructive"}`}>
                                            {pnlPos ? "+" : ""}${Math.abs(bot.totalPnl).toFixed(2)}
                                        </p>
                                        <p className={`text-xs ${pnlPos ? "text-green-600" : "text-destructive"}`}>
                                            {pnlPos ? "+" : ""}{bot.totalPnlPercentage.toFixed(2)}%
                                        </p>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                </div>
                            </Link>
                        )
                    })}

                    {/* View all link if more than 4 bots */}
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