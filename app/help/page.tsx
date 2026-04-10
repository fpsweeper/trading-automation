"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import GlowLine from "@/components/ui/glowline"
import { useLanguage } from "@/contexts/LanguageContext"
import {
  ChevronDown, ChevronRight, Bot, Coins, Zap, Layers, BookOpen,
  Shield, BarChart2, Activity, Wallet, AlertCircle,
  CheckCircle2, Info, TrendingUp, Settings2, Play,
  Pause, Square, RefreshCw, Mail,
} from "lucide-react"

// ─── Types ─────────────────────────────────────────────────────────────────

type SectionId =
  | "getting-started"
  | "points-deposits"
  | "strategies"
  | "creating-a-bot"
  | "managing-bots"
  | "indicators"
  | "reading-results"
  | "troubleshooting"

interface NavItem { id: SectionId; label: string; icon: React.ReactNode }
interface FaqItem { q: string; a: string }

// ─── Nav ───────────────────────────────────────────────────────────────────

const NAV: NavItem[] = [
  { id: "getting-started", label: "Getting Started", icon: <BookOpen className="w-4 h-4" /> },
  { id: "points-deposits", label: "Points & Deposits", icon: <Coins className="w-4 h-4" /> },
  { id: "strategies", label: "Strategies", icon: <TrendingUp className="w-4 h-4" /> },
  { id: "creating-a-bot", label: "Creating a Bot", icon: <Bot className="w-4 h-4" /> },
  { id: "managing-bots", label: "Managing Bots", icon: <Settings2 className="w-4 h-4" /> },
  { id: "indicators", label: "Indicators", icon: <BarChart2 className="w-4 h-4" /> },
  { id: "reading-results", label: "Reading Results", icon: <Activity className="w-4 h-4" /> },
  { id: "troubleshooting", label: "Troubleshooting", icon: <AlertCircle className="w-4 h-4" /> },
]

// ─── Reusable helpers ──────────────────────────────────────────────────────

function Callout({ type, children }: { type: "info" | "warning" | "success"; children: React.ReactNode }) {
  const cfg = {
    info: { cls: "bg-blue-500/5 border-blue-500/20", icon: <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" /> },
    warning: { cls: "bg-yellow-500/5 border-yellow-500/20", icon: <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" /> },
    success: { cls: "bg-green-500/5 border-green-500/20", icon: <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> },
  }[type]
  return (
    <div className={`flex gap-3 p-4 rounded-xl border text-sm ${cfg.cls}`}>
      {cfg.icon}
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">{n}</div>
      <div className="flex-1 pb-7">
        <p className="font-semibold text-foreground mb-1">{title}</p>
        <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      {children}
    </span>
  )
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="text-2xl font-bold text-foreground mb-6 scroll-mt-24">{children}</h2>
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-foreground mb-3 mt-7 first:mt-0">{children}</h3>
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2">
      {items.map((f, i) => (
        <div
          key={i}
          className="border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className="flex items-center justify-between p-4 gap-3">
            <p className="font-medium text-sm flex-1">{f.q}</p>
            <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </div>
          {open === i && (
            <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
              {f.a}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function HelpPage() {
  const { language } = useLanguage()
  const [activeSection, setActiveSection] = useState<SectionId>("getting-started")

  const scrollTo = (id: SectionId) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <div className="bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <span>Harvest 3</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Help & Documentation</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Everything you need to know about creating, configuring, and running trading bots on Harvest 3.
          </p>
        </div>
      </div>
      <div className="relative w-full"><GlowLine orientation="horizontal" position="50%" color="lightgreen" /></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Sidebar ── */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-3">
                On this page
              </p>
              {NAV.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${activeSection === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-border">
                <a href="mailto:support@harvest3.com"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                  <Mail className="w-4 h-4" /> Contact Support
                </a>
              </div>
            </div>
          </aside>

          {/* ── Content ── */}
          <main className="flex-1 min-w-0 space-y-16">

            {/* ════════════════════════════════════════ */}
            {/*  GETTING STARTED                         */}
            {/* ════════════════════════════════════════ */}
            <section>
              <SectionTitle id="getting-started">Getting Started</SectionTitle>

              <p className="text-muted-foreground mb-5">
                Harvest 3 is a trading bot automation platform. Bots run in{" "}
                <strong className="text-foreground">simulation mode</strong> using real Binance market data
                and real-time prices, but with virtual balances — no real funds are ever at risk.
              </p>

              <Callout type="success">
                <strong className="text-foreground">Quick start:</strong> Register → Deposit points → Create a bot → Start it.
              </Callout>

              <SubTitle>Step-by-step setup</SubTitle>
              <div className="ml-4 mt-2">
                <Step n={1} title="Create your account">
                  Register at{" "}
                  <Link href="/register" className="text-primary hover:underline">harvest3.com/register</Link>{" "}
                  with your email and password, or sign in with Google. Verify your email to activate your account.
                </Step>
                <Step n={2} title="Add points to your balance">
                  Go to the{" "}
                  <Link href="/dashboard" className="text-primary hover:underline">Dashboard</Link>{" "}
                  and deposit points using USDT on Solana, BEP20, or TRC20. Each trade your bot executes costs 1 point.
                </Step>
                <Step n={3} title="Create your first bot">
                  Navigate to{" "}
                  <Link href="/bots" className="text-primary hover:underline">Bots</Link>{" "}
                  and click <strong className="text-foreground">Create Bot</strong>. Choose a pre-built template or configure a custom strategy from scratch.
                </Step>
                <Step n={4} title="Start the bot">
                  Once created, your bot is in{" "}
                  <Badge color="bg-blue-500/10 text-blue-600 border-blue-500/20">Ready</Badge>{" "}
                  state. Click <strong className="text-foreground">Start</strong> to begin simulation trading.
                </Step>
              </div>

              <Callout type="info">
                Bots run on a scheduled execution cycle. The cycle interval matches your chosen timeframe —
                a 5m bot checks for signals every 5 minutes.
              </Callout>
            </section>

            {/* ════════════════════════════════════════ */}
            {/*  POINTS & DEPOSITS                       */}
            {/* ════════════════════════════════════════ */}
            <section>
              <SectionTitle id="points-deposits">Points & Deposits</SectionTitle>

              <p className="text-muted-foreground mb-5">
                Points are the fuel that powers your bots. Every successful trade deducts exactly{" "}
                <strong className="text-foreground">1 point</strong> from your balance, regardless of strategy type or trade size. Points never expire.
              </p>

              <SubTitle>Points packages</SubTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { name: "Starter", pts: 30, price: "$10" },
                  { name: "Trader", pts: 200, price: "$50", popular: true },
                  { name: "Pro", pts: 900, price: "$200" },
                  { name: "Unlimited", pts: 2000, price: "$400" },
                ].map(p => (
                  <div key={p.name} className={`relative p-4 rounded-xl border text-center ${p.popular ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                    {p.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold whitespace-nowrap">
                        Popular
                      </span>
                    )}
                    <p className="text-2xl font-bold">{p.price}</p>
                    <p className="text-sm font-semibold text-primary mt-0.5">{p.pts} pts</p>
                    <p className="text-xs text-muted-foreground">{p.name}</p>
                  </div>
                ))}
              </div>

              <Callout type="info">
                Package prices are managed from the database and may change. The Dashboard always shows the current prices.
              </Callout>

              <SubTitle>How to deposit</SubTitle>
              <div className="ml-4 mt-2">
                <Step n={1} title="Select a network">
                  Choose between <strong className="text-foreground">Solana</strong>,{" "}
                  <strong className="text-foreground">BEP20 (BSC)</strong>, or{" "}
                  <strong className="text-foreground">TRC20 (Tron)</strong>. All accept USDT.
                </Step>
                <Step n={2} title="Select a package">
                  Pick the points package that suits your trading volume.
                </Step>
                <Step n={3} title="Send the exact amount">
                  You'll see a total that includes a small <strong className="text-foreground">security amount</strong> (e.g. $10.47 instead of $10.00).
                  You <strong className="text-foreground">must send this exact number</strong> — it's how the system identifies your transaction uniquely.
                </Step>
                <Step n={4} title="Submit your transaction hash">
                  After sending, paste the TX hash from your wallet and click Submit. The system verifies it
                  on-chain (usually 30–60 seconds) and credits your points automatically.
                </Step>
              </div>

              <Callout type="warning">
                Always send the <strong>exact</strong> USDT amount shown including the security amount.
                Sending the wrong amount will delay or prevent confirmation. Pending deposits expire after 24 hours.
              </Callout>

              <SubTitle>Supported networks</SubTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: "Solana", token: "SPL USDT", note: "Fast & low fees" },
                  { name: "BEP20", token: "BSC USDT", note: "Binance Smart Chain" },
                  { name: "TRC20", token: "TRC20 USDT", note: "Tron network" },
                ].map(n => (
                  <div key={n.name} className="p-4 rounded-xl border border-border">
                    <p className="font-semibold text-sm">{n.name}</p>
                    <p className="text-xs text-primary">{n.token}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.note}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ════════════════════════════════════════ */}
            {/*  STRATEGIES                              */}
            {/* ════════════════════════════════════════ */}
            <section>
              <SectionTitle id="strategies">Strategies</SectionTitle>

              <p className="text-muted-foreground mb-5">
                Harvest 3 supports three strategy types. All cost the same (1 point per trade)
                and can be combined with custom indicator conditions, stop loss, and take profit.
              </p>

              {/* DCA */}
              <Card className="p-6 border border-blue-500/20 bg-blue-500/5 mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                    <Coins className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold">DCA — Dollar Cost Averaging</h3>
                      <Badge color="bg-green-500/10 text-green-600 border-green-500/20">Beginner-friendly</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Best for: trending markets, patient traders</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  DCA buys into a position when your entry conditions are met, averaging down over time.
                  It exits when exit conditions fire or Stop Loss / Take Profit is hit.
                  Good for riding medium-term trends with measured risk.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground">Typical timeframe: </span>
                    <span className="font-medium">15m – 1h</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground">Trade frequency: </span>
                    <span className="font-medium">1–5 / day</span>
                  </div>
                </div>
              </Card>

              {/* GRID */}
              <Card className="p-6 border border-purple-500/20 bg-purple-500/5 mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 flex-shrink-0">
                    <Layers className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold">Grid Trading</h3>
                      <Badge color="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Intermediate</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Best for: sideways / ranging markets</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Grid places buy orders at price levels below the current price. As price oscillates within a range,
                  the bot repeatedly buys low and sells high. Works best in consolidating markets without strong directional trends.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground">Typical timeframe: </span>
                    <span className="font-medium">30m – 4h</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground">Trade frequency: </span>
                    <span className="font-medium">Varies with market</span>
                  </div>
                </div>
              </Card>

              {/* SCALPING */}
              <Card className="p-6 border border-orange-500/20 bg-orange-500/5 mb-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 flex-shrink-0">
                    <Zap className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold">Scalping</h3>
                      <Badge color="bg-red-500/10 text-red-600 border-red-500/20">Advanced</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Best for: volatile markets, short-term signals</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Scalping captures small, frequent price movements with tight stop losses and take profits.
                  High trade frequency means points are consumed faster — make sure your balance is sufficient before running a scalper long-term.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground">Typical timeframe: </span>
                    <span className="font-medium">5m – 15m</span>
                  </div>
                  <div className="p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground">Trade frequency: </span>
                    <span className="font-medium">5–15+ / day</span>
                  </div>
                </div>
              </Card>

              <Callout type="info">
                All three strategies respect your <strong className="text-foreground">Stop Loss</strong> and{" "}
                <strong className="text-foreground">Take Profit</strong> settings, which are checked on every execution cycle.
              </Callout>
            </section>

            {/* ════════════════════════════════════════ */}
            {/*  CREATING A BOT                          */}
            {/* ════════════════════════════════════════ */}
            <section>
              <SectionTitle id="creating-a-bot">Creating a Bot</SectionTitle>

              <p className="text-muted-foreground mb-5">
                The bot creation wizard walks through 4 steps after an optional template selection.
                You can always edit a bot later while it's paused.
              </p>

              <SubTitle>Step 0 — Choose a template (optional)</SubTitle>
              <p className="text-sm text-muted-foreground mb-3">
                Templates pre-fill all settings including indicator conditions. Available templates:
              </p>
              <div className="grid sm:grid-cols-2 gap-2 mb-5">
                {[
                  { name: "RSI Dip Buyer", type: "DCA", note: "RSI < 40 entry, RSI > 60 exit" },
                  { name: "MA Trend Follower", type: "DCA", note: "MACD + RSI momentum filter" },
                  { name: "Quick Scalper", type: "SCALPING", note: "RSI extremes on ETHUSDT 5m" },
                  { name: "Bollinger Bouncer", type: "SCALPING", note: "Mean reversion near BB Lower" },
                  { name: "Grid Range Trader", type: "GRID", note: "RSI 30–70 range filter" },
                  { name: "Custom Setup", type: "CUSTOM", note: "Configure everything manually" },
                ].map(t => (
                  <div key={t.name} className="flex items-center gap-3 p-3 rounded-lg border border-border text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.note}</p>
                    </div>
                    <Badge color={
                      t.type === "DCA" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                        t.type === "SCALPING" ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                          t.type === "GRID" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                            "bg-gray-500/10 text-gray-600 border-gray-500/20"
                    }>{t.type}</Badge>
                  </div>
                ))}
              </div>

              <SubTitle>Step 1 — Choose strategy</SubTitle>
              <p className="text-sm text-muted-foreground mb-5">
                Select DCA, Grid, or Scalping. All cost 1 point per trade.
                See the <button onClick={() => scrollTo("strategies")} className="text-primary hover:underline">Strategies section</button> for details.
              </p>

              <SubTitle>Step 2 — Basic configuration</SubTitle>
              <div className="overflow-x-auto mb-5">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-6 text-muted-foreground font-medium">Field</th>
                      <th className="text-left py-2 pr-6 text-muted-foreground font-medium">Description</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2.5 pr-6 font-medium">Bot Name</td><td className="py-2.5 pr-6 text-muted-foreground">A label to identify your bot</td><td className="py-2.5 text-muted-foreground">BTC RSI Scalper</td></tr>
                    <tr><td className="py-2.5 pr-6 font-medium">Trading Pair</td><td className="py-2.5 pr-6 text-muted-foreground">Which market to trade</td><td className="py-2.5 text-muted-foreground">BTCUSDT, ETHUSDT</td></tr>
                    <tr><td className="py-2.5 pr-6 font-medium">Timeframe</td><td className="py-2.5 pr-6 text-muted-foreground">Candle interval / execution frequency</td><td className="py-2.5 text-muted-foreground">5m, 15m, 1h</td></tr>
                    <tr><td className="py-2.5 pr-6 font-medium">Initial Balance</td><td className="py-2.5 pr-6 text-muted-foreground">Virtual USDT to trade with</td><td className="py-2.5 text-muted-foreground">$1,000</td></tr>
                  </tbody>
                </table>
              </div>

              <SubTitle>Step 3 — Risk settings</SubTitle>
              <div className="overflow-x-auto mb-5">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-6 text-muted-foreground font-medium">Field</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2.5 pr-6 font-medium">Stop Loss %</td><td className="py-2.5 text-muted-foreground">Auto-close a position if price drops this % below entry. Checked every cycle.</td></tr>
                    <tr><td className="py-2.5 pr-6 font-medium">Take Profit %</td><td className="py-2.5 text-muted-foreground">Auto-close a position if price rises this % above entry. Checked every cycle.</td></tr>
                    <tr><td className="py-2.5 pr-6 font-medium">Max Position Size %</td><td className="py-2.5 text-muted-foreground">Max % of your virtual balance per position. 25% of $1,000 = $250 max per trade.</td></tr>
                  </tbody>
                </table>
              </div>

              <SubTitle>Step 4 — Indicator conditions</SubTitle>
              <p className="text-sm text-muted-foreground mb-3">
                Conditions control when the bot enters and exits trades. Leave empty to use the strategy's built-in default logic.
                Each condition is: <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">INDICATOR  OPERATOR  VALUE</code>, joined by AND/OR.
              </p>
              <div className="bg-muted/30 border border-border rounded-xl p-4 mb-4 font-mono text-xs space-y-1">
                <p className="text-green-600 font-semibold">// Entry: buy when RSI is oversold and MACD is recovering</p>
                <p>RSI_14 <span className="text-primary">&lt;</span> 40 <span className="text-muted-foreground">AND</span></p>
                <p>MACD_HISTOGRAM <span className="text-primary">&gt;</span> -100</p>
                <p className="text-red-500 font-semibold mt-3">// Exit: sell when RSI reaches overbought</p>
                <p>RSI_14 <span className="text-primary">&gt;</span> 60</p>
              </div>
              <Callout type="info">
                Entry conditions are evaluated at the start of each cycle. Exit conditions are evaluated while a position is open on every cycle.
              </Callout>
            </section>

            {/* ════════════════════════════════════════ */}
            {/*  MANAGING BOTS                           */}
            {/* ════════════════════════════════════════ */}
            <section>
              <SectionTitle id="managing-bots">Managing Bots</SectionTitle>

              <SubTitle>Bot states</SubTitle>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Ready", dot: "bg-blue-500", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20", desc: "Bot is configured but not yet started." },
                  { label: "Running", dot: "bg-green-500 animate-pulse", badge: "bg-green-500/10 text-green-600 border-green-500/20", desc: "Actively executing and checking signals every cycle." },
                  { label: "Paused", dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", desc: "Temporarily halted. Positions remain open. Can be resumed." },
                  { label: "Stopped", dot: "bg-gray-400", badge: "bg-gray-500/10 text-gray-500 border-gray-500/20", desc: "Fully stopped. No new trades. Must be restarted." },
                ].map(s => (
                  <div key={s.label} className="flex gap-3 p-4 rounded-xl border border-border items-start">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${s.dot}`} />
                    <div>
                      <p className="font-semibold text-sm mb-1">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <SubTitle>Actions</SubTitle>
              <div className="space-y-2 mb-6">
                {[
                  { icon: <Play className="w-4 h-4 text-green-500" />, action: "Start", desc: "Activates a Ready or Paused bot. Begins executing on the next scheduled cycle." },
                  { icon: <Pause className="w-4 h-4 text-yellow-500" />, action: "Pause", desc: "Suspends execution without closing positions. Open trades remain active." },
                  { icon: <Square className="w-4 h-4 text-red-500" />, action: "Stop", desc: "Fully stops the bot. Open positions are left open but no new trades will execute." },
                  { icon: <RefreshCw className="w-4 h-4 text-primary" />, action: "Refresh", desc: "Manually fetch the latest stats, trades, and positions from the server." },
                ].map(a => (
                  <div key={a.action} className="flex items-start gap-3 p-3 rounded-lg border border-border text-sm">
                    <div className="mt-0.5 flex-shrink-0">{a.icon}</div>
                    <div><span className="font-medium">{a.action}</span> — <span className="text-muted-foreground">{a.desc}</span></div>
                  </div>
                ))}
              </div>

              <Callout type="warning">
                You must <strong>pause</strong> a running bot before editing its configuration. The Edit button is disabled while the bot is Running.
              </Callout>

              <SubTitle>Auto-pause on low points</SubTitle>
              <p className="text-sm text-muted-foreground">
                When your points balance reaches zero, all running bots are automatically paused and you'll receive a notification.
                Top up your balance on the Dashboard, then restart your bots.
              </p>
            </section>

            {/* ════════════════════════════════════════ */}
            {/*  INDICATORS                              */}
            {/* ════════════════════════════════════════ */}
            <section>
              <SectionTitle id="indicators">Indicators Reference</SectionTitle>

              <p className="text-muted-foreground mb-5">
                Technical indicators available for entry and exit conditions.
                Values are computed using the most recent closed candle for your bot's timeframe.
              </p>

              <div className="overflow-x-auto mb-7">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 pr-6 text-muted-foreground font-medium">Indicator</th>
                      <th className="text-left py-3 pr-6 text-muted-foreground font-medium">Range</th>
                      <th className="text-left py-3 text-muted-foreground font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">RSI_14</td><td className="py-3 pr-6 text-muted-foreground">0 – 100</td><td className="py-3 text-muted-foreground">14-period RSI. Below 30 = oversold, above 70 = overbought.</td></tr>
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">RSI_7</td><td className="py-3 pr-6 text-muted-foreground">0 – 100</td><td className="py-3 text-muted-foreground">7-period RSI. More sensitive, reacts faster to price moves.</td></tr>
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">MACD</td><td className="py-3 pr-6 text-muted-foreground">Unbounded</td><td className="py-3 text-muted-foreground">MACD line (12 EMA − 26 EMA). Positive = bullish momentum.</td></tr>
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">MACD_HISTOGRAM</td><td className="py-3 pr-6 text-muted-foreground">Unbounded</td><td className="py-3 text-muted-foreground">MACD minus Signal line. Positive = accelerating upward momentum.</td></tr>
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">MA_20</td><td className="py-3 pr-6 text-muted-foreground">Price units</td><td className="py-3 text-muted-foreground">20-period Simple Moving Average. Short-term trend direction.</td></tr>
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">MA_50</td><td className="py-3 pr-6 text-muted-foreground">Price units</td><td className="py-3 text-muted-foreground">50-period SMA. Medium-term trend.</td></tr>
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">MA_200</td><td className="py-3 pr-6 text-muted-foreground">Price units</td><td className="py-3 text-muted-foreground">200-period SMA. Long-term trend. Classic bull/bear market filter.</td></tr>
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">EMA_12</td><td className="py-3 pr-6 text-muted-foreground">Price units</td><td className="py-3 text-muted-foreground">12-period Exponential Moving Average. Reacts faster than SMA.</td></tr>
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">BB_UPPER</td><td className="py-3 pr-6 text-muted-foreground">Price units</td><td className="py-3 text-muted-foreground">Upper Bollinger Band. Price near here may signal overbought.</td></tr>
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">BB_LOWER</td><td className="py-3 pr-6 text-muted-foreground">Price units</td><td className="py-3 text-muted-foreground">Lower Bollinger Band. Price near here may signal oversold.</td></tr>
                    <tr><td className="py-3 pr-6 font-mono font-semibold text-primary text-xs">CLOSE_PRICE</td><td className="py-3 pr-6 text-muted-foreground">Price units</td><td className="py-3 text-muted-foreground">Closing price of the most recent candle. Use for price-level conditions.</td></tr>
                  </tbody>
                </table>
              </div>

              <SubTitle>Operators</SubTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { op: ">", desc: "Greater than" },
                  { op: "<", desc: "Less than" },
                  { op: ">=", desc: "Greater or equal" },
                  { op: "<=", desc: "Less or equal" },
                  { op: "crosses_above", desc: "Crossed above this cycle" },
                  { op: "crosses_below", desc: "Crossed below this cycle" },
                ].map(o => (
                  <div key={o.op} className="p-3 rounded-lg border border-border">
                    <code className="font-mono text-primary text-xs">{o.op}</code>
                    <p className="text-xs text-muted-foreground mt-1">{o.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ════════════════════════════════════════ */}
            {/*  READING RESULTS                         */}
            {/* ════════════════════════════════════════ */}
            <section>
              <SectionTitle id="reading-results">Reading Your Results</SectionTitle>

              <SubTitle>KPI cards</SubTitle>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Balance", desc: "Current virtual balance. Starts at your initial balance and updates with each trade." },
                  { label: "Total P&L", desc: "Net profit/loss across all closed trades plus unrealized gains/losses on open positions." },
                  { label: "Win Rate", desc: "Percentage of closed trades that were profitable (exit price > entry price after fees)." },
                  { label: "Trades", desc: "Total completed buy/sell cycles. Each cycle consumes 1 point from your balance." },
                ].map(k => (
                  <div key={k.label} className="p-4 rounded-xl border border-border">
                    <p className="font-semibold text-sm">{k.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{k.desc}</p>
                  </div>
                ))}
              </div>

              <SubTitle>Equity curve</SubTitle>
              <p className="text-sm text-muted-foreground mb-5">
                Shows your virtual balance over time in hourly snapshots. The dashed reference line marks your initial balance —
                anything above it is profit, below is loss.
              </p>

              <SubTitle>Candlestick chart</SubTitle>
              <p className="text-sm text-muted-foreground mb-5">
                Real OHLCV candle data for your trading pair with volume bars.
                Green <strong className="text-green-500">▲</strong> markers = buy trades;
                red <strong className="text-red-500">▼</strong> markers = sell trades.
                Switch timeframes (5m / 15m / 1h / 4h / 1d) with the buttons above the chart.
              </p>

              <SubTitle>Trade history</SubTitle>
              <p className="text-sm text-muted-foreground mb-3">
                The <strong className="text-foreground">Trades</strong> tab lists every executed order.
                Click any row to expand the <strong className="text-foreground">indicator snapshot</strong> —
                the exact indicator values at the moment the trade was triggered. Useful for understanding why a signal fired.
              </p>
              <Callout type="info">
                Indicator snapshots are stored for every trade. If a row doesn't expand, that trade predates the snapshot feature.
              </Callout>

              <SubTitle>Performance stats</SubTitle>
              <p className="text-sm text-muted-foreground">
                The Overview tab's Performance card breaks down:{" "}
                <strong className="text-foreground">Realized P&L</strong> (closed trades),{" "}
                <strong className="text-foreground">Unrealized P&L</strong> (open positions),{" "}
                average win, average loss, best and worst individual trades, and total open positions value.
              </p>
            </section>

            {/* ════════════════════════════════════════ */}
            {/*  TROUBLESHOOTING                         */}
            {/* ════════════════════════════════════════ */}
            <section>
              <SectionTitle id="troubleshooting">Troubleshooting</SectionTitle>

              <FaqAccordion items={[
                {
                  q: "My bot was created but isn't trading — why?",
                  a: "Check that your entry conditions are actually being met. If you set RSI_14 < 30, the bot only trades when RSI is genuinely below 30. Try looser conditions (e.g. RSI_14 < 45), use a pre-built template, or remove conditions entirely to use default strategy logic. Also verify the bot is in Running state and you have enough points."
                },
                {
                  q: "My deposit isn't being confirmed.",
                  a: "First confirm you sent the exact USDT amount shown (including the security fee). Network confirmation times: Solana is usually under 1 minute; BEP20 and TRC20 can take 1–5 minutes. If it's been over 10 minutes since submitting your TX hash with no credit, contact support with your wallet address and transaction hash."
                },
                {
                  q: "My bot was automatically paused.",
                  a: "The most common reason is a zero points balance. Check your Dashboard balance and top up. If your balance is fine, open the notifications panel (bell icon in the header) to see if there's a specific error message from the bot execution system."
                },
                {
                  q: "Why is my P&L negative even though some trades were profitable?",
                  a: "Total P&L is the net of all closed trades plus unrealized losses on any currently open positions. Trading fees and slippage are deducted from each trade. A few losing trades or a large open position moving against you can outweigh individual profitable trades."
                },
                {
                  q: "I can't edit my bot — the Edit button is greyed out.",
                  a: "The bot must be Paused or Stopped before editing. Click the Pause button first, wait for the status to change to Paused, then click Edit. Changes take effect after you restart the bot."
                },
                {
                  q: "I sent USDT but submitted the wrong transaction hash.",
                  a: "Contact support at support@harvest3.com with: your wallet address, the network used (Solana/BEP20/TRC20), the amount sent, and the correct transaction hash. We'll manually verify on-chain and credit your points."
                },
                {
                  q: "The candlestick chart shows no data.",
                  a: "Try switching the timeframe selector (e.g. click 1h instead of 5m) or refresh the page. Market data is fetched fresh on each request. If the pair is very new or low-volume, some timeframes may have limited history."
                },
                {
                  q: "My Stop Loss triggered at a worse price than I set.",
                  a: "Stop Loss is evaluated at the start of each execution cycle, not tick-by-tick. On a fast-moving market, price may gap past your SL level before the next cycle runs. This is expected behavior in simulation mode — the bot closes the position at the next available price after the SL condition is detected."
                },
                {
                  q: "Can I run multiple bots at the same time?",
                  a: "Yes. Each bot is independent and runs on its own execution cycle. Points are deducted per trade across all running bots. Make sure your points balance is large enough to sustain your combined bot activity — especially if running multiple scalpers."
                },
              ]} />

              {/* Contact card */}
              <div className="mt-10 p-6 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Still need help?</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Our support team typically responds within 24 hours.</p>
                </div>
                <a href="mailto:support@harvest3.com" className="flex-shrink-0">
                  <Button className="gap-2">
                    <Mail className="w-4 h-4" /> support@harvest3.com
                  </Button>
                </a>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}