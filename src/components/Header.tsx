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
    return `${address.slice(0, 5)}...${address.slice(-4)}`
  }

  if (!mounted) return (
    <header className="h-12 border-b border-border bg-background flex items-center justify-between px-3 z-30 flex-shrink-0 w-full">
       {/* Skeleton or empty state to prevent hydration mismatch */}
    </header>
  )

  return (
    <header className="h-12 border-b border-border bg-background flex items-center justify-between px-3 z-30 flex-shrink-0 w-full transition-colors duration-300">
      {/* Mobile / Tablet Left Content */}
      <div className="flex flex-col justify-center">
        <h1 className="text-foreground font-bold tracking-widest text-[11px] leading-tight">
          {title}
        </h1>
        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-pulse"></span>
          <span>DUMBO_MODE: <span className="text-accent-pink font-bold animate-pulse">ACTIVE</span></span>
        </div>
      </div>

      {/* Right Content (Wallet Only on Mobile, Theme + Wallet on Desktop) */}
      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="flex md:flex items-center gap-2 px-3 py-1.5 mr-2 rounded border border-border hover:border-foreground/50 transition text-muted-foreground hover:text-foreground group"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        
        <button 
          onClick={handleWalletClick}
          className={`flex items-center gap-1.5 px-2 py-1 rounded transition border ${
            connected || wallet
              ? "bg-primary/10 border-primary/50 text-primary" 
              : "bg-muted/10 border-muted/50 text-muted-foreground"
          }`}
        >
          <Wallet size={12} />
          <span className="font-bold tracking-wide text-[10px]">
            {(connected && publicKey) ? truncateWallet(publicKey.toBase58()) : (wallet ? truncateWallet(wallet) : "CONNECT")}
          </span>
        </button>
      </div>
    </header>
  )
}
