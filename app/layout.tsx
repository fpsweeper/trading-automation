import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/header"
import { Providers } from "@/components/Providers"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Harvest 3 - Trading Automation Platform",
  description:
    "Build, test, and deploy trading strategies with AI-powered automation. Start free, no credit card required.",
  generator: "fpsweeper",
  metadataBase: new URL("https://harvest3.com"), // Replace with your domain
  keywords: ["trading", "automation", "crypto", "bot", "AI trading", "algorithmic trading"],
  authors: [{ name: "fpsweeper" }],
  openGraph: {
    title: "Harvest 3 - Trading Automation Platform",
    description: "Build, test, and deploy trading strategies with AI-powered automation.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Harvest 3 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harvest 3 - Trading Automation Platform",
    description: "Build, test, and deploy trading strategies with AI-powered automation.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon.svg", color: "#008793", type: "image/svg" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icon.svg",
        color: "#008793",
      },
    ],
  },
  manifest: "/manifest.json", // For PWA (optional)
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", content: "#008793" }, // Updated to your brand color
    { media: "(prefers-color-scheme: dark)", content: "#051937" }, // Updated to your dark color
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional meta tags if needed */}
      </head>
      <body className={`font-sans antialiased`}>
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}