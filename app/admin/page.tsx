"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
    Users, Coins, CreditCard, Bot, Bell, Package,
    Search, RefreshCw, Loader2, X, Check, AlertCircle,
    TrendingUp, TrendingDown, Activity, ExternalLink,
    ChevronLeft, ChevronRight, Plus, Minus, Edit2, Send,
    Shield, Eye, EyeOff, BarChart2, Zap, Layers,
    CheckCircle2, XCircle, Clock, Ban, DollarSign, ScrollText, Trash2,
} from "lucide-react"

// ─── Constants ──────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL

function adminHeader() {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
}

function fmt(n?: number, d = 2) {
    if (n == null) return "—"
    return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })
}
function fmtDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
}
function shortDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdminUser {
    id: string; email: string; authProvider: string; createdAt: string
    emailVerified: boolean; enabled: boolean; pointsBalance: number
    totalBots: number; totalDeposits: number; simulationCreditLimit?: number
}
interface AdminDeposit {
    id: string; userId: string; userEmail: string; transactionHash: string
    chain: string; amountUsd: number; exactAmountUsd: number; pointsIssued: number
    status: string; submittedAt: string; confirmedAt?: string; failureReason?: string
}
interface AdminBot {
    id: string; userId: string; userEmail: string; name: string
    strategyType: string; tradingPair: string; timeframe: string
    status: string; totalTrades: number; totalPnl: number; currentBalance: number
    initialBalance: number; createdAt: string; startedAt?: string
}
interface AdminNotification {
    id: string; userId: string; type: string; title: string; message: string
    isRead: boolean; createdAt: string
}
interface PointsPackage {
    id: string; name: string; description: string; points: number
    priceUsd: number; popular: boolean; sortOrder: number
}
interface PlatformStats {
    totalUsers: number; totalBots: number; totalDepositsUsd: number
    totalPointsIssued: number; activeBotsCount: number; pendingDepositsCount: number
    confirmedDepositsCount: number; totalTradesExecuted: number
}

// ─── Tab config ───────────────────────────────────────────────────────────────

type Tab = "overview" | "users" | "deposits" | "bots" | "notifications" | "packages" | "logs"
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "deposits", label: "Deposits", icon: <CreditCard className="w-4 h-4" /> },
    { id: "bots", label: "Bots", icon: <Bot className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "packages", label: "Packages", icon: <Package className="w-4 h-4" /> },
    { id: "logs", label: "Logs", icon: <ScrollText className="w-4 h-4" /> },
]

// ─── Status badges ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        CONFIRMED: "bg-green-500/10 text-green-600 border-green-500/20",
        SIMULATING: "bg-green-500/10 text-green-600 border-green-500/20",
        PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        PAUSED: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        FAILED: "bg-red-500/10 text-red-500 border-red-500/20",
        STOPPED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
        CREATED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        DELETED: "bg-red-500/10 text-red-400 border-red-500/20",
    }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}>
            {status}
        </span>
    )
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-lg border border-border bg-background shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5">{children}</div>
            </Card>
        </div>
    )
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────

function OverviewTab() {
    const [stats, setStats] = useState<PlatformStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API}api/admin/stats`, { headers: adminHeader() })
            .then(r => r.json()).then(setStats).catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const cards = stats ? [
        { label: "Total Users", value: stats.totalUsers, icon: <Users className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Bots", value: stats.totalBots, icon: <Bot className="w-5 h-5" />, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Active Bots", value: stats.activeBotsCount, icon: <Activity className="w-5 h-5" />, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Trades Executed", value: stats.totalTradesExecuted, icon: <TrendingUp className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Total Deposits (USD)", value: `$${fmt(stats.totalDepositsUsd)}`, icon: <DollarSign className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10", raw: true },
        { label: "Points Issued", value: stats.totalPointsIssued, icon: <Coins className="w-5 h-5" />, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { label: "Confirmed Deposits", value: stats.confirmedDepositsCount, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Pending Deposits", value: stats.pendingDepositsCount, icon: <Clock className="w-5 h-5" />, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    ] : []

    return (
        <div>
            <h2 className="text-xl font-bold mb-6">Platform Overview</h2>
            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : !stats ? (
                <div className="text-center py-20 text-muted-foreground">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                    <p>Could not load stats. Make sure the <code className="bg-muted px-1 rounded text-xs">GET /api/admin/stats</code> endpoint exists.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map(c => (
                        <Card key={c.label} className="p-5 border border-border">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-muted-foreground">{c.label}</span>
                                <div className={`p-1.5 rounded-lg ${c.bg}`}><span className={c.color}>{c.icon}</span></div>
                            </div>
                            <p className="text-2xl font-bold font-mono">
                                {(c as any).raw ? c.value : Number(c.value).toLocaleString()}
                            </p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── USERS TAB ────────────────────────────────────────────────────────────────

function UsersTab() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [selected, setSelected] = useState<AdminUser | null>(null)
    const [modalType, setModalType] = useState<"points" | "view" | "credit" | null>(null)
    const [pointsAmount, setPointsAmount] = useState("")
    const [pointsOp, setPointsOp] = useState<"add" | "deduct">("add")
    const [creditLimit, setCreditLimit] = useState("")
    const [actionLoading, setActionLoading] = useState(false)

    const fetch_ = useCallback(async () => {
        setLoading(true)
        try {
            const q = new URLSearchParams({ page: String(page), size: "20", ...(search ? { search } : {}) })
            const res = await fetch(`${API}api/admin/users?${q}`, { headers: adminHeader() })
            if (res.ok) {
                const data = await res.json()
                setUsers(data.users ?? data.content ?? [])
                setTotalPages(data.totalPages ?? 1)
            }
        } catch { } finally { setLoading(false) }
    }, [page, search])

    useEffect(() => { fetch_() }, [fetch_])

    const handlePoints = async () => {
        if (!selected || !pointsAmount) return
        setActionLoading(true)
        try {
            const res = await fetch(`${API}api/admin/users/${selected.id}/points`, {
                method: "POST", headers: adminHeader(),
                body: JSON.stringify({ operation: pointsOp, amount: Number(pointsAmount) }),
            })
            if (res.ok) {
                toast.success(`Points ${pointsOp === "add" ? "added" : "deducted"} successfully`)
                setModalType(null); setPointsAmount(""); fetch_()
            } else {
                const d = await res.json(); toast.error(d.error || "Failed")
            }
        } catch { toast.error("Error") } finally { setActionLoading(false) }
    }

    const toggleUser = async (user: AdminUser) => {
        try {
            const res = await fetch(`${API}api/admin/users/${user.id}/${user.enabled ? "disable" : "enable"}`, {
                method: "PUT", headers: adminHeader(),
            })
            if (res.ok) { toast.success(`User ${user.enabled ? "disabled" : "enabled"}`); fetch_() }
            else toast.error("Failed")
        } catch { toast.error("Error") }
    }

    const handleCredit = async () => {
        if (!selected || !creditLimit) return
        setActionLoading(true)
        try {
            const res = await fetch(`${API}api/admin/users/${selected.id}/simulation-credit`, {
                method: "PUT", headers: adminHeader(),
                body: JSON.stringify({ limit: Number(creditLimit) }),
            })
            const d = await res.json()
            if (res.ok) {
                toast.success(`Credit limit for ${selected.email} set to $${creditLimit}`)
                setModalType(null); setCreditLimit(""); fetch_()
            } else { toast.error(d.error || "Failed") }
        } catch { toast.error("Error") } finally { setActionLoading(false) }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                <h2 className="text-xl font-bold">User Management</h2>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search by email..." value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
                            className="pl-9 w-64" />
                    </div>
                    <Button variant="outline" size="sm" onClick={fetch_}><RefreshCw className="w-4 h-4" /></Button>
                </div>
            </div>

            {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
                <>
                    <div className="border border-border rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        {["Email", "Provider", "Points", "Sim. Credit", "Bots", "Deposits", "Joined", "Status", "Actions"].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">No users found</td></tr>
                                    ) : users.map(u => (
                                        <tr key={u.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-medium">{u.email}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 8)}…</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${u.authProvider === "GOOGLE" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-muted text-muted-foreground border-border"}`}>
                                                    {u.authProvider}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-sm font-semibold">{fmt(u.pointsBalance, 2)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${(u.simulationCreditLimit ?? 1000) > 1000 ? "bg-violet-500/10 text-violet-500 border-violet-500/20" : "bg-muted text-muted-foreground border-border"}`}>
                                                    ${(u.simulationCreditLimit ?? 1000).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{u.totalBots}</td>
                                            <td className="px-4 py-3 text-sm">{u.totalDeposits}</td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{shortDate(u.createdAt)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${u.enabled ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                                                    {u.enabled ? "Active" : "Disabled"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1"
                                                        onClick={() => { setSelected(u); setModalType("view") }}>
                                                        <Eye className="w-3 h-3" /> View
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/10"
                                                        onClick={() => { setSelected(u); setPointsOp("add"); setModalType("points") }}>
                                                        <Coins className="w-3 h-3" /> Points
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-violet-500 border-violet-500/30 hover:bg-violet-500/10"
                                                        onClick={() => { setSelected(u); setCreditLimit(String(u.simulationCreditLimit ?? 1000)); setModalType("credit") }}>
                                                        <Shield className="w-3 h-3" /> Credit
                                                    </Button>
                                                    <Button size="sm" variant="outline" className={`h-7 px-2 text-xs gap-1 ${u.enabled ? "text-red-500 border-red-500/30 hover:bg-red-500/10" : "text-green-600 border-green-500/30 hover:bg-green-500/10"}`}
                                                        onClick={() => toggleUser(u)}>
                                                        {u.enabled ? <Ban className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                                        {u.enabled ? "Disable" : "Enable"}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* View User Modal */}
            {modalType === "view" && selected && (
                <Modal title="User Details" onClose={() => { setModalType(null); setSelected(null) }}>
                    <div className="space-y-3">
                        {[
                            { label: "User ID", value: selected.id },
                            { label: "Email", value: selected.email },
                            { label: "Provider", value: selected.authProvider },
                            { label: "Verified", value: selected.emailVerified ? "Yes" : "No" },
                            { label: "Status", value: selected.enabled ? "Active" : "Disabled" },
                            { label: "Points", value: fmt(selected.pointsBalance, 2) },
                            { label: "Sim. Credit", value: `$${(selected.simulationCreditLimit ?? 1000).toLocaleString()}` },
                            { label: "Total Bots", value: String(selected.totalBots) },
                            { label: "Deposits", value: String(selected.totalDeposits) },
                            { label: "Joined", value: fmtDate(selected.createdAt) },
                        ].map(row => (
                            <div key={row.label} className="flex items-start justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                                <span className="text-sm text-muted-foreground flex-shrink-0">{row.label}</span>
                                <span className="text-sm font-medium text-right break-all">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}

            {/* Points Modal */}
            {modalType === "points" && selected && (
                <Modal title={`Manage Points — ${selected.email}`} onClose={() => { setModalType(null); setSelected(null); setPointsAmount("") }}>
                    <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-muted/40 border border-border">
                            <p className="text-xs text-muted-foreground">Current Balance</p>
                            <p className="text-2xl font-bold font-mono">{fmt(selected.pointsBalance, 2)} pts</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setPointsOp("add")}
                                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${pointsOp === "add" ? "bg-green-500/10 border-green-500/30 text-green-600" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                                <Plus className="w-4 h-4 inline mr-1" /> Add
                            </button>
                            <button onClick={() => setPointsOp("deduct")}
                                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${pointsOp === "deduct" ? "bg-red-500/10 border-red-500/30 text-red-500" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                                <Minus className="w-4 h-4 inline mr-1" /> Deduct
                            </button>
                        </div>
                        <div>
                            <Label>Amount</Label>
                            <Input type="number" value={pointsAmount} onChange={e => setPointsAmount(e.target.value)}
                                placeholder="e.g. 100" className="mt-1.5" min={1} />
                        </div>
                        <Button onClick={handlePoints} disabled={actionLoading || !pointsAmount}
                            className={`w-full ${pointsOp === "add" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white`}>
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {pointsOp === "add" ? "Add" : "Deduct"} {pointsAmount || "—"} points
                        </Button>
                    </div>
                </Modal>
            )}

            {/* Simulation Credit Modal */}
            {modalType === "credit" && selected && (
                <Modal title={`Simulation Credit — ${selected.email}`} onClose={() => { setModalType(null); setSelected(null); setCreditLimit("") }}>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                            <p className="text-xs text-muted-foreground mb-1">Current Limit</p>
                            <p className="text-3xl font-bold font-mono text-violet-500">
                                ${(selected.simulationCreditLimit ?? 1000).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Default platform limit is $1,000
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[1000, 2500, 5000, 10000, 25000, 50000].map(v => (
                                <button key={v} onClick={() => setCreditLimit(String(v))}
                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${creditLimit === String(v) ? "bg-violet-500/10 border-violet-500/30 text-violet-500" : "border-border text-muted-foreground hover:border-violet-500/30"}`}>
                                    ${v.toLocaleString()}
                                </button>
                            ))}
                        </div>
                        <div>
                            <Label>Custom Amount ($)</Label>
                            <Input type="number" value={creditLimit} onChange={e => setCreditLimit(e.target.value)}
                                placeholder="e.g. 5000" className="mt-1.5" min={100} max={100000} />
                            <p className="text-xs text-muted-foreground mt-1">Min $100 — Max $100,000</p>
                        </div>
                        <Button onClick={handleCredit} disabled={actionLoading || !creditLimit}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2">
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                            Set Limit to ${Number(creditLimit || 0).toLocaleString()}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    )
}

// ─── DEPOSITS TAB ─────────────────────────────────────────────────────────────

function DepositsTab() {
    const [deposits, setDeposits] = useState<AdminDeposit[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selected, setSelected] = useState<AdminDeposit | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    const fetch_ = useCallback(async () => {
        setLoading(true)
        try {
            const q = new URLSearchParams({ page: String(page), size: "20", ...(statusFilter !== "ALL" ? { status: statusFilter } : {}) })
            const res = await fetch(`${API}api/admin/deposits?${q}`, { headers: adminHeader() })
            if (res.ok) {
                const data = await res.json()
                setDeposits(data.deposits ?? data.content ?? [])
                setTotalPages(data.totalPages ?? 1)
            }
        } catch { } finally { setLoading(false) }
    }, [page, statusFilter])

    useEffect(() => { fetch_() }, [fetch_])

    const manualConfirm = async (deposit: AdminDeposit) => {
        setActionLoading(true)
        try {
            const res = await fetch(`${API}api/admin/deposits/${deposit.id}/confirm`, {
                method: "POST", headers: adminHeader(),
            })
            if (res.ok) { toast.success("Deposit confirmed and points credited"); setSelected(null); fetch_() }
            else { const d = await res.json(); toast.error(d.error || "Failed to confirm") }
        } catch { toast.error("Error") } finally { setActionLoading(false) }
    }

    const markFailed = async (deposit: AdminDeposit, reason: string) => {
        setActionLoading(true)
        try {
            const res = await fetch(`${API}api/admin/deposits/${deposit.id}/fail`, {
                method: "POST", headers: adminHeader(),
                body: JSON.stringify({ reason }),
            })
            if (res.ok) { toast.success("Deposit marked as failed"); setSelected(null); fetch_() }
            else toast.error("Failed")
        } catch { toast.error("Error") } finally { setActionLoading(false) }
    }

    const getChainColor = (chain: string) => {
        const m: Record<string, string> = { SOLANA: "text-purple-500", BEP20: "text-yellow-500", TRC20: "text-red-500" }
        return m[chain] ?? "text-muted-foreground"
    }

    const explorerUrl = (chain: string, tx: string) => {
        const m: Record<string, string> = { SOLANA: `https://solscan.io/tx/${tx}`, BEP20: `https://bscscan.com/tx/${tx}`, TRC20: `https://tronscan.org/#/transaction/${tx}` }
        return m[chain] ?? "#"
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                <h2 className="text-xl font-bold">Deposit Monitor</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex gap-1">
                        {["ALL", "PENDING", "CONFIRMED", "FAILED"].map(s => (
                            <button key={s} onClick={() => { setStatusFilter(s); setPage(0) }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={fetch_}><RefreshCw className="w-4 h-4" /></Button>
                </div>
            </div>

            {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
                <>
                    <div className="border border-border rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        {["User", "Chain", "Amount", "Points", "Status", "Date", "TX Hash", "Actions"].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {deposits.length === 0 ? (
                                        <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No deposits found</td></tr>
                                    ) : deposits.map(d => (
                                        <tr key={d.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3 text-sm max-w-[140px] truncate" title={d.userEmail}>{d.userEmail}</td>
                                            <td className="px-4 py-3"><span className={`text-xs font-semibold ${getChainColor(d.chain)}`}>{d.chain}</span></td>
                                            <td className="px-4 py-3 text-sm font-mono">
                                                <div>${fmt(d.exactAmountUsd ?? d.amountUsd)}</div>
                                                {d.exactAmountUsd !== d.amountUsd && <div className="text-xs text-muted-foreground">base: ${fmt(d.amountUsd)}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-semibold">{d.pointsIssued}</td>
                                            <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{shortDate(d.submittedAt)}</td>
                                            <td className="px-4 py-3">
                                                <a href={explorerUrl(d.chain, d.transactionHash)} target="_blank" rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline flex items-center gap-1">
                                                    {d.transactionHash.slice(0, 8)}… <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Button size="sm" variant="outline" className="h-7 px-2 text-xs"
                                                    onClick={() => setSelected(d)}>
                                                    <Eye className="w-3 h-3 mr-1" /> Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Deposit Detail Modal */}
            {selected && (
                <Modal title="Deposit Details" onClose={() => setSelected(null)}>
                    <div className="space-y-3 mb-5">
                        {[
                            { label: "Deposit ID", value: selected.id },
                            { label: "User", value: selected.userEmail },
                            { label: "Chain", value: selected.chain },
                            { label: "Base Amount", value: `$${fmt(selected.amountUsd)}` },
                            { label: "Exact Amount", value: `$${fmt(selected.exactAmountUsd)}` },
                            { label: "Points", value: String(selected.pointsIssued) },
                            { label: "Status", value: selected.status },
                            { label: "Submitted", value: fmtDate(selected.submittedAt) },
                            ...(selected.confirmedAt ? [{ label: "Confirmed", value: fmtDate(selected.confirmedAt) }] : []),
                            ...(selected.failureReason ? [{ label: "Failure Reason", value: selected.failureReason }] : []),
                        ].map(row => (
                            <div key={row.label} className="flex items-start justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                                <span className="text-sm text-muted-foreground flex-shrink-0">{row.label}</span>
                                <span className="text-sm font-medium text-right break-all">{row.value}</span>
                            </div>
                        ))}
                        <div className="pt-1">
                            <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
                            <div className="flex items-center gap-2">
                                <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 break-all">{selected.transactionHash}</code>
                                <a href={explorerUrl(selected.chain, selected.transactionHash)} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="h-7 px-2"><ExternalLink className="w-3 h-3" /></Button>
                                </a>
                            </div>
                        </div>
                    </div>
                    {selected.status === "PENDING" && (
                        <div className="flex gap-2 pt-2 border-t border-border">
                            <Button onClick={() => manualConfirm(selected)} disabled={actionLoading}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1.5">
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Manually Confirm
                            </Button>
                            <Button onClick={() => markFailed(selected, "Manual rejection by admin")} disabled={actionLoading}
                                variant="outline" className="flex-1 text-red-500 border-red-500/30 hover:bg-red-500/10 gap-1.5">
                                <XCircle className="w-4 h-4" /> Mark Failed
                            </Button>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    )
}

// ─── BOTS TAB ─────────────────────────────────────────────────────────────────

function BotsTab() {
    const [bots, setBots] = useState<AdminBot[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [search, setSearch] = useState("")
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetch_ = useCallback(async () => {
        setLoading(true)
        try {
            const q = new URLSearchParams({
                page: String(page), size: "20",
                ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
                ...(search ? { search } : {}),
            })
            const res = await fetch(`${API}api/admin/bots?${q}`, { headers: adminHeader() })
            if (res.ok) {
                const data = await res.json()
                setBots(data.bots ?? data.content ?? [])
                setTotalPages(data.totalPages ?? 1)
            }
        } catch { } finally { setLoading(false) }
    }, [page, statusFilter, search])

    useEffect(() => { fetch_() }, [fetch_])

    const forceStop = async (bot: AdminBot) => {
        setActionLoading(bot.id)
        try {
            const res = await fetch(`${API}api/admin/bots/${bot.id}/stop`, { method: "PUT", headers: adminHeader() })
            if (res.ok) { toast.success(`Bot "${bot.name}" force-stopped`); fetch_() }
            else toast.error("Failed to stop bot")
        } catch { toast.error("Error") } finally { setActionLoading(null) }
    }

    const strategyIcon = (s: string) => {
        if (s === "SCALPING") return <Zap className="w-3.5 h-3.5 text-orange-500" />
        if (s === "GRID") return <Layers className="w-3.5 h-3.5 text-purple-500" />
        return <Coins className="w-3.5 h-3.5 text-blue-500" />
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                <h2 className="text-xl font-bold">Bot Monitor</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search by name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(0) }} className="pl-9 w-56" />
                    </div>
                    <div className="flex gap-1">
                        {["ALL", "SIMULATING", "PAUSED", "STOPPED", "CREATED"].map(s => (
                            <button key={s} onClick={() => { setStatusFilter(s); setPage(0) }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                                {s === "ALL" ? "All" : s === "SIMULATING" ? "Running" : s.charAt(0) + s.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={fetch_}><RefreshCw className="w-4 h-4" /></Button>
                </div>
            </div>

            {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
                <>
                    <div className="border border-border rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        {["Bot", "Owner", "Strategy", "Pair", "Balance", "P&L", "Trades", "Status", "Actions"].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {bots.length === 0 ? (
                                        <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">No bots found</td></tr>
                                    ) : bots.map(b => {
                                        const pnlPos = (b.totalPnl ?? 0) >= 0
                                        return (
                                            <tr key={b.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-medium">{b.name}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{b.id.slice(0, 8)}…</p>
                                                </td>
                                                <td className="px-4 py-3 text-sm max-w-[140px] truncate" title={b.userEmail}>{b.userEmail}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">{strategyIcon(b.strategyType)}<span className="text-xs font-medium">{b.strategyType}</span></div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{b.tradingPair} <span className="text-muted-foreground">{b.timeframe}</span></td>
                                                <td className="px-4 py-3 text-sm font-mono">${fmt(b.currentBalance)}</td>
                                                <td className="px-4 py-3 text-sm font-mono">
                                                    <span className={pnlPos ? "text-green-500" : "text-destructive"}>
                                                        {pnlPos ? "+" : ""}${fmt(b.totalPnl)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{b.totalTrades}</td>
                                                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                                <td className="px-4 py-3">
                                                    {b.status === "SIMULATING" && (
                                                        <Button size="sm" variant="outline"
                                                            className="h-7 px-2 text-xs gap-1 text-red-500 border-red-500/30 hover:bg-red-500/10"
                                                            disabled={actionLoading === b.id}
                                                            onClick={() => forceStop(b)}>
                                                            {actionLoading === b.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3" />}
                                                            Force Stop
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

// ─── NOTIFICATIONS TAB ────────────────────────────────────────────────────────

function NotificationsTab() {
    const [broadcastTitle, setBroadcastTitle] = useState("")
    const [broadcastMessage, setBroadcastMessage] = useState("")
    const [broadcastType, setBroadcastType] = useState("INFO")
    const [sending, setSending] = useState(false)
    const [recentNotifs, setRecentNotifs] = useState<AdminNotification[]>([])
    const [loadingNotifs, setLoadingNotifs] = useState(true)
    const [targetUserId, setTargetUserId] = useState("")

    useEffect(() => {
        fetch(`${API}api/admin/notifications/recent?size=20`, { headers: adminHeader() })
            .then(r => r.json()).then(data => setRecentNotifs(data.notifications ?? data.content ?? []))
            .catch(() => { }).finally(() => setLoadingNotifs(false))
    }, [])

    const sendBroadcast = async () => {
        if (!broadcastTitle.trim() || !broadcastMessage.trim()) { toast.error("Title and message are required"); return }
        setSending(true)
        try {
            const endpoint = targetUserId.trim()
                ? `${API}api/admin/notifications/user/${targetUserId.trim()}`
                : `${API}api/admin/notifications/broadcast`
            const res = await fetch(endpoint, {
                method: "POST", headers: adminHeader(),
                body: JSON.stringify({ type: broadcastType, title: broadcastTitle, message: broadcastMessage }),
            })
            if (res.ok) {
                toast.success(targetUserId.trim() ? "Notification sent to user" : "Broadcast sent to all users")
                setBroadcastTitle(""); setBroadcastMessage(""); setTargetUserId("")
            } else {
                const d = await res.json(); toast.error(d.error || "Failed to send")
            }
        } catch { toast.error("Error sending notification") } finally { setSending(false) }
    }

    const typeOptions = [
        { value: "INFO", label: "Info", color: "text-blue-500" },
        { value: "WARNING", label: "Warning", color: "text-yellow-500" },
        { value: "SUCCESS", label: "Success", color: "text-green-500" },
        { value: "POINTS_LOW", label: "Points Low", color: "text-orange-500" },
        { value: "BOT_PAUSED", label: "Bot Paused", color: "text-yellow-500" },
        { value: "DEPOSIT_CONFIRMED", label: "Deposit Confirmed", color: "text-green-500" },
    ]

    return (
        <div className="space-y-8">
            {/* Send Notification */}
            <div>
                <h2 className="text-xl font-bold mb-6">Send Notification</h2>
                <Card className="p-6 border border-border">
                    <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Label>Type</Label>
                                <select value={broadcastType} onChange={e => setBroadcastType(e.target.value)}
                                    className="mt-1.5 w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-sm">
                                    {typeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Target User ID <span className="text-muted-foreground font-normal">(leave empty to broadcast)</span></Label>
                                <Input placeholder="User UUID or leave empty for all users" value={targetUserId}
                                    onChange={e => setTargetUserId(e.target.value)} className="mt-1.5" />
                            </div>
                        </div>
                        <div>
                            <Label>Title</Label>
                            <Input placeholder="e.g. Scheduled maintenance tonight" value={broadcastTitle}
                                onChange={e => setBroadcastTitle(e.target.value)} className="mt-1.5" />
                        </div>
                        <div>
                            <Label>Message</Label>
                            <textarea
                                placeholder="Full notification message..."
                                value={broadcastMessage}
                                onChange={e => setBroadcastMessage(e.target.value)}
                                rows={3}
                                className="mt-1.5 w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={sendBroadcast} disabled={sending || !broadcastTitle.trim() || !broadcastMessage.trim()} className="gap-2">
                                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {targetUserId.trim() ? "Send to User" : "Broadcast to All Users"}
                            </Button>
                            {!targetUserId.trim() && (
                                <p className="text-xs text-yellow-600 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> This will send to ALL users
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Notifications */}
            <div>
                <h2 className="text-xl font-bold mb-6">Recent Platform Notifications</h2>
                {loadingNotifs ? (
                    <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : recentNotifs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No notifications sent yet.</p>
                ) : (
                    <div className="border border-border rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        {["User", "Type", "Title", "Message", "Read", "Sent"].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentNotifs.map(n => (
                                        <tr key={n.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3 text-sm max-w-[120px] truncate font-mono text-xs text-muted-foreground">{n.userId.slice(0, 8)}…</td>
                                            <td className="px-4 py-3"><span className="text-xs bg-muted px-2 py-0.5 rounded-full border border-border">{n.type}</span></td>
                                            <td className="px-4 py-3 text-sm font-medium">{n.title}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{n.message}</td>
                                            <td className="px-4 py-3">{n.isRead ? <Check className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-muted-foreground" />}</td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(n.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── PACKAGES TAB ─────────────────────────────────────────────────────────────

function PackagesTab() {
    const [packages, setPackages] = useState<PointsPackage[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<PointsPackage | null>(null)
    const [creating, setCreating] = useState(false)
    const [form, setForm] = useState({ name: "", description: "", points: "", priceUsd: "", popular: false, sortOrder: "1" })
    const [saving, setSaving] = useState(false)

    const fetch_ = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}api/points/packages`, { headers: adminHeader() })
            if (res.ok) { const data = await res.json(); setPackages(data.packages ?? []) }
        } catch { } finally { setLoading(false) }
    }

    useEffect(() => { fetch_() }, [])

    const openEdit = (pkg: PointsPackage) => {
        setEditing(pkg)
        setForm({ name: pkg.name, description: pkg.description, points: String(pkg.points), priceUsd: String(pkg.priceUsd), popular: pkg.popular, sortOrder: String(pkg.sortOrder) })
    }

    const openCreate = () => {
        setCreating(true)
        setForm({ name: "", description: "", points: "", priceUsd: "", popular: false, sortOrder: String(packages.length + 1) })
    }

    const save = async () => {
        if (!form.name || !form.points || !form.priceUsd) { toast.error("Name, points, and price are required"); return }
        setSaving(true)
        try {
            const payload = { name: form.name, description: form.description, points: Number(form.points), priceUsd: Number(form.priceUsd), popular: form.popular, sortOrder: Number(form.sortOrder) }
            const url = editing ? `${API}api/admin/packages/${editing.id}` : `${API}api/admin/packages`
            const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: adminHeader(), body: JSON.stringify(payload) })
            if (res.ok) {
                toast.success(editing ? "Package updated" : "Package created")
                setEditing(null); setCreating(false); fetch_()
            } else { const d = await res.json(); toast.error(d.error || "Failed") }
        } catch { toast.error("Error") } finally { setSaving(false) }
    }

    const deletePackage = async (pkg: PointsPackage) => {
        if (!confirm(`Delete "${pkg.name}"? This cannot be undone.`)) return
        try {
            const res = await fetch(`${API}api/admin/packages/${pkg.id}`, { method: "DELETE", headers: adminHeader() })
            if (res.ok) { toast.success("Package deleted"); fetch_() }
            else toast.error("Failed to delete")
        } catch { toast.error("Error") }
    }

    const togglePopular = async (pkg: PointsPackage) => {
        try {
            const res = await fetch(`${API}api/admin/packages/${pkg.id}`, {
                method: "PUT", headers: adminHeader(),
                body: JSON.stringify({ ...pkg, popular: !pkg.popular }),
            })
            if (res.ok) { toast.success("Updated"); fetch_() } else toast.error("Failed")
        } catch { toast.error("Error") }
    }

    const formModal = (
        <Modal title={editing ? `Edit Package — ${editing.name}` : "Create New Package"} onClose={() => { setEditing(null); setCreating(false) }}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Starter" className="mt-1.5" /></div>
                    <div><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} className="mt-1.5" /></div>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description" className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-3">
                    <div><Label>Points *</Label><Input type="number" value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))} placeholder="e.g. 200" className="mt-1.5" /></div>
                    <div><Label>Price (USD) *</Label><Input type="number" value={form.priceUsd} onChange={e => setForm(f => ({ ...f, priceUsd: e.target.value }))} placeholder="e.g. 50" className="mt-1.5" /></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setForm(f => ({ ...f, popular: !f.popular }))}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${form.popular ? "bg-primary border-primary" : "border-border"}`}>
                        {form.popular && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div>
                        <p className="text-sm font-medium">Mark as Popular</p>
                        <p className="text-xs text-muted-foreground">Shows a "Popular" badge on this package</p>
                    </div>
                </div>
                <Button onClick={save} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {editing ? "Save Changes" : "Create Package"}
                </Button>
            </div>
        </Modal>
    )

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Points Packages</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetch_}><RefreshCw className="w-4 h-4" /></Button>
                    <Button size="sm" onClick={openCreate} className="gap-1.5"><Plus className="w-4 h-4" /> New Package</Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {packages.sort((a, b) => a.sortOrder - b.sortOrder).map(pkg => (
                        <Card key={pkg.id} className={`p-5 border relative ${pkg.popular ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                            {pkg.popular && (
                                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold whitespace-nowrap">
                                    Popular
                                </span>
                            )}
                            <p className="text-2xl font-bold">${pkg.priceUsd}</p>
                            <p className="text-sm font-semibold text-primary">{pkg.points.toLocaleString()} pts</p>
                            <p className="text-lg font-semibold mt-1">{pkg.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 mb-4">{pkg.description}</p>
                            <div className="flex flex-col gap-1.5">
                                <Button size="sm" variant="outline" className="w-full gap-1.5 h-8" onClick={() => openEdit(pkg)}>
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </Button>
                                <Button size="sm" variant="outline"
                                    className={`w-full gap-1.5 h-8 ${pkg.popular ? "text-muted-foreground" : "text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/10"}`}
                                    onClick={() => togglePopular(pkg)}>
                                    {pkg.popular ? "Remove Popular" : "Set Popular"}
                                </Button>
                                <Button size="sm" variant="outline"
                                    className="w-full gap-1.5 h-8 text-red-500 border-red-500/30 hover:bg-red-500/10"
                                    onClick={() => deletePackage(pkg)}>
                                    <X className="w-3.5 h-3.5" /> Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {(editing || creating) && formModal}
        </div>
    )
}

// ─── LOGS TAB ─────────────────────────────────────────────────────────────────

interface AppLog {
    id: string; level: string; loggerName: string; message: string
    stackTrace?: string; threadName?: string; createdAt: string
}
interface LogSummary { errors: number; warns: number; infos: number; debugs: number; recent: number }

function LogsTab() {
    const [logs, setLogs] = useState<AppLog[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [level, setLevel] = useState("ALL")
    const [since, setSince] = useState("last1h")
    const [search, setSearch] = useState("")
    const [summary, setSummary] = useState<LogSummary | null>(null)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [purging, setPurging] = useState(false)

    const fetch_ = useCallback(async () => {
        setLoading(true)
        try {
            const q = new URLSearchParams({
                page: String(page), size: "50",
                level, since,
                ...(search ? { search } : {})
            })
            const res = await fetch(`${API}api/admin/logs?${q}`, { headers: adminHeader() })
            if (res.ok) {
                const data = await res.json()
                setLogs(data.logs ?? [])
                setTotalPages(data.totalPages ?? 1)
                setTotalElements(data.totalElements ?? 0)
                setSummary(data.summary ?? null)
            }
        } catch { } finally { setLoading(false) }
    }, [page, level, since, search])

    useEffect(() => { fetch_() }, [fetch_])

    const purgeLogs = async (olderThan: string) => {
        if (!confirm(`Delete logs older than ${olderThan}? This cannot be undone.`)) return
        setPurging(true)
        try {
            const res = await fetch(`${API}api/admin/logs?olderThan=${olderThan}`, {
                method: "DELETE", headers: adminHeader()
            })
            const d = await res.json()
            if (res.ok) { toast.success(d.message); fetch_() }
            else toast.error(d.error || "Failed")
        } catch { toast.error("Error") } finally { setPurging(false) }
    }

    const levelColor = (l: string) => {
        switch (l) {
            case "ERROR": return "bg-red-500/10 text-red-500 border-red-500/20"
            case "WARN": return "bg-amber-500/10 text-amber-600 border-amber-500/20"
            case "INFO": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case "DEBUG": return "bg-gray-500/10 text-gray-500 border-gray-500/20"
            default: return "bg-muted text-muted-foreground border-border"
        }
    }

    const fmtLog = (iso: string) =>
        new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold">Application Logs</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={fetch_}><RefreshCw className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => purgeLogs("30d")} disabled={purging}
                        className="text-red-500 border-red-500/30 hover:bg-red-500/10 gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" /> Purge 30d+
                    </Button>
                </div>
            </div>

            {/* Summary badges */}
            {summary && (
                <div className="flex flex-wrap gap-2">
                    {[
                        { label: "Errors", count: summary.errors, color: "bg-red-500/10 text-red-500 border-red-500/20" },
                        { label: "Warnings", count: summary.warns, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
                        { label: "Info", count: summary.infos, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
                        { label: "Debug", count: summary.debugs, color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
                        { label: "Errors 24h", count: summary.recent, color: "bg-red-500/10 text-red-500 border-red-500/20" },
                    ].map(b => (
                        <span key={b.label} className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${b.color}`}>
                            {b.label}: {b.count.toLocaleString()}
                        </span>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                {/* Level filter */}
                <div className="flex gap-1">
                    {["ALL", "ERROR", "WARN", "INFO", "DEBUG"].map(l => (
                        <button key={l} onClick={() => { setLevel(l); setPage(0) }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${level === l ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                            {l}
                        </button>
                    ))}
                </div>
                {/* Time filter */}
                <div className="flex gap-1">
                    {[
                        { value: "last15m", label: "15m" },
                        { value: "last1h", label: "1h" },
                        { value: "last6h", label: "6h" },
                        { value: "last24h", label: "24h" },
                        { value: "all", label: "All" },
                    ].map(s => (
                        <button key={s.value} onClick={() => { setSince(s.value); setPage(0) }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${since === s.value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                            {s.label}
                        </button>
                    ))}
                </div>
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search message or logger..." value={search}
                        onChange={e => { setSearch(e.target.value); setPage(0) }}
                        className="pl-9 h-8 text-sm" />
                </div>
                <span className="text-xs text-muted-foreground">{totalElements.toLocaleString()} entries</span>
            </div>

            {/* Log table */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : logs.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <ScrollText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No logs found for the selected filters</p>
                </div>
            ) : (
                <div className="border border-border rounded-xl overflow-hidden font-mono text-xs">
                    {logs.map(log => (
                        <div key={log.id}
                            className={`border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors ${log.level === "ERROR" ? "bg-red-500/3" : log.level === "WARN" ? "bg-amber-500/3" : ""}`}>
                            <div className="flex items-start gap-3 px-4 py-2.5 cursor-pointer"
                                onClick={() => setExpanded(expanded === log.id ? null : log.id)}>
                                <span className="text-muted-foreground whitespace-nowrap flex-shrink-0 pt-0.5">{fmtLog(log.createdAt)}</span>
                                <span className={`px-1.5 py-0.5 rounded border font-bold flex-shrink-0 text-[10px] ${levelColor(log.level)}`}>{log.level}</span>
                                <span className="text-primary/70 flex-shrink-0 hidden sm:block">[{log.loggerName}]</span>
                                <span className="text-foreground flex-1 min-w-0 truncate">{log.message}</span>
                                {log.stackTrace && (
                                    <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform ${expanded === log.id ? "rotate-90" : ""}`} />
                                )}
                            </div>
                            {expanded === log.id && log.stackTrace && (
                                <div className="px-4 pb-3">
                                    <pre className="bg-muted/40 border border-border rounded-lg p-3 text-[11px] overflow-x-auto whitespace-pre-wrap text-destructive max-h-60 overflow-y-auto">
                                        {log.stackTrace}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────

export default function AdminPage() {
    const router = useRouter()
    const [tab, setTab] = useState<Tab>("overview")
    const [authed, setAuthed] = useState(false)
    const [checking, setChecking] = useState(true)
    const [adminPassword, setAdminPassword] = useState("")
    const [showPw, setShowPw] = useState(false)
    const [pwError, setPwError] = useState(false)

    // Gate: verify the user has an admin role via the API
    useEffect(() => {
        const token = localStorage.getItem("auth_token")
        if (!token) { router.push("/login"); return }
        fetch(`${API}api/admin/verify`, { headers: adminHeader() })
            .then(r => { if (r.ok) setAuthed(true); else setAuthed(false) })
            .catch(() => setAuthed(false))
            .finally(() => setChecking(false))
    }, [router])

    // Optional secondary PIN check (can be removed if backend role check is enough)
    const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? ""
    const [pinPassed, setPinPassed] = useState(!ADMIN_PIN)

    const checkPin = () => {
        if (adminPassword === ADMIN_PIN || !ADMIN_PIN) { setPinPassed(true); setPwError(false) }
        else { setPwError(true) }
    }

    if (checking) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    )

    if (!authed) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-sm p-8 border border-border text-center">
                <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                <p className="text-sm text-muted-foreground mb-5">This area requires admin privileges.</p>
                <Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full">Back to Dashboard</Button>
            </Card>
        </div>
    )

    if (!pinPassed) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-sm p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
                    <div><h2 className="font-bold text-lg">Admin Panel</h2><p className="text-xs text-muted-foreground">Enter your admin PIN</p></div>
                </div>
                <div className="space-y-3">
                    <div className="relative">
                        <Input type={showPw ? "text" : "password"} placeholder="Admin PIN" value={adminPassword}
                            onChange={e => { setAdminPassword(e.target.value); setPwError(false) }}
                            onKeyDown={e => e.key === "Enter" && checkPin()}
                            className={pwError ? "border-red-500" : ""} />
                        <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {pwError && <p className="text-xs text-red-500">Incorrect PIN</p>}
                    <Button onClick={checkPin} className="w-full">Enter</Button>
                </div>
            </Card>
        </div>
    )

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-background/95 sticky top-0 z-30 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center"><Shield className="w-4 h-4 text-primary" /></div>
                            <span className="font-bold text-sm">Admin Panel</span>
                            <span className="text-muted-foreground text-sm">· Harvest 3</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")} className="text-xs">
                            ← Back to App
                        </Button>
                    </div>
                    {/* Tab bar */}
                    <div className="flex gap-1 -mb-px overflow-x-auto pb-0">
                        {TABS.map(t => (
                            <button key={t.id} onClick={() => setTab(t.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {tab === "overview" && <OverviewTab />}
                {tab === "users" && <UsersTab />}
                {tab === "deposits" && <DepositsTab />}
                {tab === "bots" && <BotsTab />}
                {tab === "notifications" && <NotificationsTab />}
                {tab === "packages" && <PackagesTab />}
                {tab === "logs" && <LogsTab />}
            </div>
        </div>
    )
}