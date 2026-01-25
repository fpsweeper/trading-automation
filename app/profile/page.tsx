"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  LogOut,
  User,
  Wallet,
  WalletCards,
  CheckCircle,
  AlertCircle,
  Copy,
  ArrowUpRight,
  Settings,
  Link as LinkIcon,
  Unlink,
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [topupAmount, setTopupAmount] = useState("")
  const [showTopupSuccess, setShowTopupSuccess] = useState(false)
  const [linkedAccounts, setLinkedAccounts] = useState({
    solana: false,
    twitter: false,
    discord: false,
  })

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

  const handleTopup = () => {
    if (topupAmount && parseFloat(topupAmount) > 0) {
      setShowTopupSuccess(true)
      setTopupAmount("")
      setTimeout(() => setShowTopupSuccess(false), 3000)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleLinkAccount = (service: "solana" | "twitter" | "discord") => {
    setLinkedAccounts((prev) => ({
      ...prev,
      [service]: !prev[service],
    }))
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

  // Mock user and wallet data
  const userData = {
    email: "admin@gmail.com",
    username: username,
    joinDate: "January 15, 2024",
    totalTrades: 245,
    winRate: 68.5,
  }

  const walletData = {
    address: "5eMt8aP2bVxS8gKxMjVqZhPzNwzR7LkMpQ8vTx9nRz3m",
    balance: 12450.75,
    status: "active",
    createdAt: "January 20, 2024",
  }

  const accountStatus = {
    emailVerified: true,
    twoFAEnabled: false,
    apiKeysActive: 2,
    lastLogin: "Today at 2:34 PM",
  }

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
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-transparent"
              onClick={() => router.push("/dashboard")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Dashboard
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
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Profile</h1>
          <p className="text-muted-foreground">Manage your account, wallet, and security settings</p>
        </div>

        {/* User Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - User Info and Account Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">User Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Username</p>
                    <p className="text-lg font-medium text-foreground">{userData.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="text-lg font-medium text-foreground">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                    <p className="text-lg font-medium text-foreground">{userData.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
                    <p className="text-lg font-medium text-foreground">{userData.totalTrades}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-lg font-bold text-green-500">{userData.winRate}%</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${userData.winRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Wallet Creation & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Creation */}
              <Card className="p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <WalletCards className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Wallet Creation</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Wallet Address</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-secondary/50 px-3 py-2 rounded font-mono text-foreground flex-1 truncate">
                        {walletData.address}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(walletData.address)}
                        className="text-primary hover:bg-primary/10"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Created</p>
                    <p className="text-foreground">{walletData.createdAt}</p>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Generate New Wallet
                  </Button>
                </div>
              </Card>

              {/* Wallet Status */}
              <Card className="p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <Wallet className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Wallet Status</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-green-600 capitalize">{walletData.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-lg font-bold text-foreground">${walletData.balance.toFixed(2)}</p>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Last Updated: Just now</p>
                    <Button variant="outline" className="w-full border-border bg-transparent">
                      Refresh Balance
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Wallet Top-up */}
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <ArrowUpRight className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Wallet Top-up</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Amount (USD)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      className="bg-secondary border-border text-foreground"
                    />
                    <Button
                      onClick={handleTopup}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Top-up
                    </Button>
                  </div>
                </div>

                {showTopupSuccess && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <p className="text-sm text-green-700">Top-up request submitted successfully!</p>
                  </div>
                )}

                <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Quick Add</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 5000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        className="border-border bg-background hover:bg-primary/10 text-foreground"
                        onClick={() => setTopupAmount(amount.toString())}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Social & Wallet Linking */}
            <Card className="p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <LinkIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Connected Accounts</h3>
              </div>

              <div className="space-y-3">
                {/* Solana Wallet Linking */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19.573 3.651A1.734 1.734 0 0 0 17.998 3H6.002a1.734 1.734 0 0 0-1.575.651l5.785 5.785 5.785-5.785zm-16.146.651A1.734 1.734 0 0 0 2.427 3.651l5.785 5.785-5.785 5.785a1.734 1.734 0 0 0 1.575 2.785h11.996a1.734 1.734 0 0 0 1.575-2.785l-5.785-5.785 5.785-5.785z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Solana Wallet</p>
                      <p className="text-xs text-muted-foreground">
                        {linkedAccounts.solana ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${
                      linkedAccounts.solana
                        ? "border-red-500/30 text-red-500 hover:bg-red-500/10"
                        : "border-green-500/30 text-green-500 hover:bg-green-500/10"
                    } bg-transparent`}
                    onClick={() => handleLinkAccount("solana")}
                  >
                    {linkedAccounts.solana ? (
                      <>
                        <Unlink className="w-4 h-4 mr-2" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>

                {/* Twitter Linking */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-7 9-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">X (Twitter)</p>
                      <p className="text-xs text-muted-foreground">
                        {linkedAccounts.twitter ? "@harvest_trading" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${
                      linkedAccounts.twitter
                        ? "border-red-500/30 text-red-500 hover:bg-red-500/10"
                        : "border-green-500/30 text-green-500 hover:bg-green-500/10"
                    } bg-transparent`}
                    onClick={() => handleLinkAccount("twitter")}
                  >
                    {linkedAccounts.twitter ? (
                      <>
                        <Unlink className="w-4 h-4 mr-2" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>

                {/* Discord Linking */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-indigo-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.317 4.492c-1.53-.742-3.149-1.277-4.884-1.515a.06.06 0 0 0-.063.03c-.211.38-.445.88-.607 1.27a18.27 18.27 0 0 0-5.487 0c-.165-.39-.395-.89-.607-1.27a.064.064 0 0 0-.064-.03c-1.735.238-3.354.773-4.883 1.515a.062.062 0 0 0-.031.021C1.47 8.72.73 12.82 1.613 16.77c.057.098.12.19.184.277a.06.06 0 0 0 .052.027c1.63.476 3.21.922 4.76 1.247a.064.064 0 0 0 .069-.022c.461-.597.873-1.23 1.225-1.896a.06.06 0 0 0-.033-.084 12.471 12.471 0 0 1-1.738-.848.061.061 0 0 1-.006-.1l.437-.33a.06.06 0 0 1 .063-.007c3.644 1.713 7.59 1.713 11.185 0a.06.06 0 0 1 .063.007l.437.33a.061.061 0 0 1-.006.1 11.71 11.71 0 0 1-1.738.847.06.06 0 0 0-.034.085c.36.665.773 1.298 1.225 1.895a.06.06 0 0 0 .07.021c1.55-.324 3.13-.77 4.76-1.247a.06.06 0 0 0 .053-.027c1.016-3.687 1.614-7.776-.74-11.597a.052.052 0 0 0-.031-.021zM8.02 13.231c-1.048 0-1.910-.962-1.910-2.139 0-1.177.851-2.139 1.91-2.139 1.065 0 1.93.962 1.91 2.139 0 1.177-.851 2.139-1.91 2.139zm7.975 0c-1.049 0-1.910-.962-1.910-2.139 0-1.177.851-2.139 1.91-2.139 1.065 0 1.93.962 1.91 2.139-.02 1.177-.851 2.139-1.91 2.139z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Discord</p>
                      <p className="text-xs text-muted-foreground">
                        {linkedAccounts.discord ? "harvest3_bot" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${
                      linkedAccounts.discord
                        ? "border-red-500/30 text-red-500 hover:bg-red-500/10"
                        : "border-green-500/30 text-green-500 hover:bg-green-500/10"
                    } bg-transparent`}
                    onClick={() => handleLinkAccount("discord")}
                  >
                    {linkedAccounts.discord ? (
                      <>
                        <Unlink className="w-4 h-4 mr-2" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-700">
                  Connected accounts allow you to authenticate using OAuth providers and link your trading notifications to social platforms.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column - Account Status */}
          <div>
            <Card className="p-6 border border-border sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Account Status</h3>
              </div>

              <div className="space-y-4">
                {/* Email Verification */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {accountStatus.emailVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Email Verified</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {accountStatus.emailVerified ? "Your email is verified" : "Verify your email"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Two-Factor Authentication */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {accountStatus.twoFAEnabled ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Two-Factor Auth</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {accountStatus.twoFAEnabled ? "2FA is enabled" : "Enable 2FA for security"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* API Keys */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">API Keys</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {accountStatus.apiKeysActive} active key(s)
                    </p>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Last Login */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Last Login</p>
                    <p className="text-xs text-muted-foreground mt-1">{accountStatus.lastLogin}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <Link href="/preferences" className="block">
                    <Button variant="outline" className="w-full border-border bg-transparent">
                      <Settings className="w-4 h-4 mr-2" />
                      Preferences
                    </Button>
                  </Link>
                  <Link href="/change-password" className="block">
                    <Button variant="outline" className="w-full border-border bg-transparent">
                      Change Password
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full border-border bg-transparent">
                    Security Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
