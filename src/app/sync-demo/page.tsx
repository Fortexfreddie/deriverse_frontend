'use client'

import { useState, useEffect } from 'react'
import { WalletSyncLoader } from '@/components/WalletSyncLoader'

export default function SyncDemoPage() {
  const [data, setData] = useState<{ positionsUpdated: number, fillsProcessed: number } | null>(null)
  
  // Simulate data arrival
  useEffect(() => {
    const timer = setTimeout(() => {
        setData({
            positionsUpdated: 14,
            fillsProcessed: 1240
        })
    }, 6000) // 6 seconds in
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xs font-mono">
            Launching Sync Protocol...
        </div>
        <WalletSyncLoader 
            data={data} 
            onComplete={() => alert('Redirecting to Dashboard...')} 
        />
    </div>
  )
}
