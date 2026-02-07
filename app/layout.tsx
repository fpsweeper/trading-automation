import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/header"
import { Providers } from "@/components/Providers"
import { Lato } from "next/font/google"

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
  variable: "--font-lato", // optional but recommended
})

export const metadata: Metadata = {
  title: "Harvest 3 - Trading Automation Platform",
  description:
    "Automate your trading strategies with Harvest 3 bots.",
  generator: "fpsweeper",
  metadataBase: new URL("https://harvest3.com"), // Replace with your domain
  keywords: ["trading", "automation", "crypto", "bot", "AI trading", "algorithmic trading"],
  authors: [{ name: "fpsweeper" }],
  openGraph: {
    title: "Harvest 3 - Trading Automation Platform",
    description: "Automate your trading strategies with Harvest 3 bots.",
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
    description: "Automate your trading strategies with Harvest 3 bots.",
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
  manifest: "/manifest.json",
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
    <html lang="en" suppressHydrationWarning className={lato.variable}>
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