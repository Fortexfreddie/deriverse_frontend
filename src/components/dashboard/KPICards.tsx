'use client'

import React from 'react'

interface KPIData {
  unrealizedPnl: string
  realizedPnl: string
  marginUsage: string
  accountHealth: number
}

interface KPICardsProps {
  data?: KPIData
}

export function KPICards({ data }: KPICardsProps) {
  const defaultData: KPIData = {
    unrealizedPnl: '+$18.28',
    realizedPnl: '+$124.50',
    marginUsage: '42.5%',
    accountHealth: 85,
  }

  const displayData = data || defaultData

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border-b border-border">
      {/* Total Unrealized PnL */}
      <div className="bg-card p-2 sm:p-4 flex flex-col justify-center">
        <span className="text-[8px] sm:text-xs uppercase tracking-widest text-muted-foreground mb-1">Unrealized PNL</span>
        <span className="text-base sm:text-xl text-pnl-gain font-bold">{displayData.unrealizedPnl}</span>
      </div>

      {/* Realized PnL 24H */}
      <div className="bg-card p-2 sm:p-4 flex flex-col justify-center">
        <span className="text-[8px] sm:text-xs uppercase tracking-widest text-muted-foreground mb-1">Realized PNL (24H)</span>
        <span className="text-base sm:text-xl text-foreground font-bold">{displayData.realizedPnl}</span>
      </div>

      {/* Margin Usage */}
      <div className="bg-card p-2 sm:p-4 flex flex-col justify-center hidden sm:flex">
        <span className="text-[8px] sm:text-xs uppercase tracking-widest text-muted-foreground mb-1">Margin Usage</span>
        <span className="text-base sm:text-xl text-foreground font-bold">{displayData.marginUsage}</span>
      </div>

      {/* Account Health */}
      <div className="bg-card p-2 sm:p-4 flex flex-col justify-center hidden sm:flex">
        <span className="text-[8px] sm:text-xs uppercase tracking-widest text-muted-foreground mb-1">Account Health</span>
        <div className="flex items-center gap-2">
          <div className="w-16 sm:w-24 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-pnl-gain transition-all duration-300"
              style={{ width: `${displayData.accountHealth}%` }}
            ></div>
          </div>
          <span className="text-pnl-gain font-bold text-xs">GOOD</span>
        </div>
      </div>
    </div>
  )
}
