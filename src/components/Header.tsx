'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon, Wallet, ChevronRight, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useAnalytics } from '@/hooks/use-analytics'

interface HeaderProps {
  title?: string
  onMenuClick?: () => void
}

export function Header({ title = 'DASHBOARD // POSITIONS', onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { publicKey, connected, disconnect: walletDisconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { wallet, updateWallet, disconnect } = useAnalytics()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync wallet adapter → useAnalytics
  useEffect(() => {
    if (connected && publicKey) {
      updateWallet(publicKey.toBase58())
    }
  }, [connected, publicKey, updateWallet])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleWalletClick = () => {
    if (connected || wallet) {
      walletDisconnect()
      disconnect()
    } else {
      setVisible(true)
    }
  }

  // Helper to truncate wallet address
  const truncateWallet = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!mounted) return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6 font-mono text-xs z-20 flex-shrink-0">
       {/* Skeleton or empty state to prevent hydration mismatch */}
    </header>
  )

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6 font-mono text-xs z-20 flex-shrink-0 transition-colors duration-300">
      {/* Left Content */}
      <div className="flex items-center gap-2 sm:gap-6 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="sm:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition"
          >
            <Menu size={18} />
          </button>
        )}
        <h1 className="text-foreground font-bold tracking-widest text-[10px] sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h1>
        <div className="hidden sm:block h-4 w-px bg-border"></div>
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse"></span>
          <span className="text-[9px] sm:text-xs">
            DUMBO_MODE: <span className="text-accent-pink font-bold">ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded border border-border hover:border-foreground/50 transition text-muted-foreground hover:text-foreground group"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span className="hidden md:inline text-[10px] uppercase">
            {theme === 'dark' ? 'LIGHT' : 'DARK'}
          </span>
        </button>
        
        <button 
          onClick={handleWalletClick}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 rounded transition shadow-[0_0_10px_rgba(0,255,196,0.1)] text-[9px] sm:text-xs border ${
            connected || wallet
              ? "bg-pnl-gain/10 border-pnl-gain/50 hover:bg-pnl-gain/20 text-pnl-gain" 
              : "bg-accent-blue/10 border-accent-blue/50 hover:bg-accent-blue/20 text-accent-blue"
          }`}
        >
          <Wallet size={14} />
          <span className="font-bold tracking-wide hidden sm:inline">
            {(connected && publicKey) ? truncateWallet(publicKey.toBase58()) : (wallet ? truncateWallet(wallet) : "CONNECT WALLET")}
          </span>
          <ChevronRight size={14} className="sm:hidden" />
        </button>
      </div>
    </header>
  )
}
