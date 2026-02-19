'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon, Wallet, Terminal } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string
  onMenuClick?: () => void
}

export function Header({ title = 'DASHBOARD' }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { publicKey, connected, disconnect: walletDisconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleWalletClick = () => {
    if (connected) {
      walletDisconnect()
    } else {
      setVisible(true)
    }
  }

  const truncateWallet = (address: string) => {
    return `${address.slice(0, 4)}..${address.slice(-4)}`
  }

  // Prevent Layout Shift & Hydration Errors
  if (!mounted) {
    return <header className="h-14 border-b border-border bg-background/80 w-full" />
  }

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 z-40 flex-shrink-0 w-full font-mono transition-all duration-300">

      {/* --- LEFT SECTION: IDENTITY & STATUS --- */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <Terminal size={12} className="text-primary shrink-0 hidden sm:block" />
          <h1 className="text-foreground font-black tracking-tighter text-[11px] md:text-xs truncate uppercase italic">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] mt-0.5">
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            connected ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" : "bg-amber-500 animate-pulse"
          )} />
          <span className="text-muted-foreground font-bold tracking-widest uppercase flex items-center gap-1">
            <span className="hidden xs:inline">ENVIRONMENT:</span>
            <span className={cn(
              "font-black transition-colors",
              connected ? "text-primary" : "text-amber-500"
            )}>
              {connected ? "Mainnet-Beta" : "Simulation-Mode"}
            </span>
          </span>
        </div>
      </div>

      {/* --- RIGHT SECTION: SYSTEM ACTIONS --- */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="h-8 w-8 flex items-center justify-center rounded-sm border border-border hover:border-foreground/50 transition-all text-muted-foreground hover:text-foreground bg-muted/5 active:scale-95"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Wallet Connection */}
        <button
          onClick={handleWalletClick}
          className={cn(
            "h-8 flex items-center gap-2 px-3 rounded-sm transition-all border font-black tracking-widest text-[9px] md:text-[10px] active:scale-95",
            connected
              ? "bg-primary/5 border-primary/40 text-primary hover:bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
              : "bg-foreground text-background border-foreground hover:bg-foreground/90"
          )}
        >
          <Wallet size={12} className={cn(connected ? "text-primary" : "text-background")} />
          <span>
            {connected && publicKey ? truncateWallet(publicKey.toBase58()) : "CONNECT_WALLET"}
          </span>
        </button>
      </div>
    </header>
  )
}