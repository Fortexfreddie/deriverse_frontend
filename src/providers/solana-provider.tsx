"use client"

import React, { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"

// Default wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css"

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("mainnet-beta")

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  // Wallets array — empty means auto-detect via Wallet Standard
  // Phantom, Solflare, Backpack, etc. register themselves automatically
  const wallets = useMemo(() => [], [])

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
