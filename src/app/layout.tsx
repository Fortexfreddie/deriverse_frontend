import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from "@/components/theme-provider"
import { SolanaWalletProvider } from "@/providers/solana-provider"

import { BootLoaderWrapper } from '@/components/BootLoaderWrapper'
import { QueryProvider } from "@/providers/query-provider"
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: "Deriverse | Institutional Trading Analytics",
    template: "%s | Deriverse",
  },
  description:
    "Next-gen, fully on-chain decentralized trading ecosystem on Solana. Professional analytics, trade journaling, and AI-powered performance insights.",
  keywords: [
    "Solana",
    "Trading Analytics",
    "DeFi",
    "Deriverse",
    "On-chain Trading",
    "Crypto Journal",
    "PnL Tracking",
  ],
  authors: [{ name: "Freddie" }],
  creator: "Freddie",
  openGraph: {
    type: "website",
    locale: "en_US",
    // url: "https://your-bounty-link.vercel.app", // Update with your actual deployment
    title: "Deriverse | Trading Analytics Dashboard",
    description: "Master your on-chain performance with AI-driven insights and professional portfolio analysis.",
    siteName: "Deriverse Analytics",
    images: [
      {
        url: "/og-image.png", // Ensure you add a badass screenshot of your dashboard here
        width: 1200,
        height: 630,
        alt: "Deriverse Analytics Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deriverse | Trading Analytics Dashboard",
    description: "Institutional-grade on-chain trading analytics and AI coaching for Solana traders.",
    images: ["/og-image.png"],
    // creator: "@your_twitter_handle", // Essential for the bounty submission
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Fixes the "no extra space" feel on mobile
  userScalable: false, // Ensures the UI feels like a native app
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="font-sans antialiased selection:bg-[#00ffc4] selection:text-black">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SolanaWalletProvider>
                <BootLoaderWrapper>
                  {children}
                </BootLoaderWrapper>
            </SolanaWalletProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
