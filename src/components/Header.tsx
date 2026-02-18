'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon, Wallet, ChevronRight, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'


interface HeaderProps {
  title?: string
  onMenuClick?: () => void
}

export function Header({ title = 'DASHBOARD // POSITIONS', onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { publicKey, connected, disconnect: walletDisconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
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
        <div className="flex items-center gap-2">
          <h1 className="text-foreground font-bold tracking-widest text-[11px] leading-tight">
            {title}
          </h1>
          {!connected && (
            <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-bold rounded animate-pulse">
              SIMULATION
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-primary" : "bg-amber-500 animate-pulse"}`}></span>
          <span>ENVIRONMENT: <span className={`${connected ? "text-primary" : "text-amber-500 animate-pulse"} font-bold uppercase`}>{connected ? "Mainnet-Beta" : "Simulation"}</span></span>
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
            connected
              ? "bg-primary/10 border-primary/50 text-primary" 
              : "bg-muted/10 border-muted/50 text-muted-foreground"
          }`}
        >
          <Wallet size={12} />
          <span className="font-bold tracking-wide text-[10px]">
            {connected && publicKey ? truncateWallet(publicKey.toBase58()) : "CONNECT"}
          </span>
        </button>
      </div>
    </header>
  )
}
