'use client'

import React, { useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

export function WalletConnectButton() {
  const { publicKey, connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(id)
  }, [])

  const handleClick = () => {
    if (connected) {
      disconnect()
    } else {
      setVisible(true)
    }
  }

  const truncateWallet = (address: string) => {
    return `${address.slice(0, 5)}...${address.slice(-4)}`
  }

  if (!mounted) return (
    <button className="flex items-center gap-1.5 px-3 py-2 rounded bg-muted/10 border border-muted/50 text-muted-foreground text-xs font-bold tracking-wide">
        LOADING...
    </button>
  )

  return (
    <button 
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded transition border text-xs font-bold tracking-wide ${
        connected
          ? "bg-primary/10 border-primary/50 text-primary" 
          : "bg-muted/10 border-muted/50 text-muted-foreground hover:bg-muted/20 hover:text-foreground"
      }`}
    >
      <Wallet size={14} />
      <span>
        {connected && publicKey ? truncateWallet(publicKey.toBase58()) : "CONNECT WALLET"}
      </span>
    </button>
  )
}
