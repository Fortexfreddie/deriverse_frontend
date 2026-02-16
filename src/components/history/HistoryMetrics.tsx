'use client'

import React from 'react'

interface Trade {
  id: string
  timestamp: string
  market: string
  side: 'LONG' | 'SHORT'
  price: string
  size: string
  fee: string
  type: 'PERP' | 'SPOT'
  signature: string
}

interface HistoryMetricsProps {
  trades: Trade[]
}

export function HistoryMetrics({ trades }: HistoryMetricsProps) {
  const totalTrades = trades.length
  const totalFees = trades.reduce((sum, trade) => sum + parseFloat(trade.fee), 0)
  const spotCount = trades.filter((t) => t.type === 'SPOT').length
  const perpCount = trades.filter((t) => t.type === 'PERP').length
  const spotPercent = totalTrades > 0 ? Math.round((spotCount / totalTrades) * 100) : 0
  const perpPercent = totalTrades > 0 ? Math.round((perpCount / totalTrades) * 100) : 0

  return (
    <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Trades */}
        <div className="border border-border bg-card p-3 relative group">
          <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Total Trades</div>
          <div className="text-xl text-foreground font-bold">{totalTrades}</div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-pnl-gain opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Total Fees */}
        <div className="border border-border bg-card p-3 relative group">
          <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Total Fees</div>
          <div className="text-xl text-foreground font-bold">${totalFees.toFixed(2)}</div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-pink opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Net Volume */}
        <div className="border border-border bg-card p-3 col-span-2 relative group">
          <div className="flex justify-between items-start">
            <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Net Volume (24h)</div>
            <div className="text-[9px] text-pnl-gain">+12.4%</div>
          </div>
          <div className="text-xl text-foreground font-bold">$1,240,502</div>
        </div>
      </div>

      {/* Trade Distribution */}
      <div className="border border-border bg-card p-4">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4">Trade Distribution</div>

        {/* SPOT */}
        <div className="flex items-center gap-2 mb-2 text-xs">
          <span className="w-2 h-2 bg-pnl-gain"></span>
          <span className="text-muted-foreground">SPOT</span>
          <span className="ml-auto font-bold text-foreground">{spotPercent}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted mb-4 flex rounded overflow-hidden">
          <div className="h-full bg-pnl-gain" style={{ width: `${spotPercent}%` }}></div>
          <div className="h-full bg-accent-pink" style={{ width: `${perpPercent}%` }}></div>
        </div>

        {/* PERP */}
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 bg-accent-pink"></span>
          <span className="text-muted-foreground">PERP</span>
          <span className="ml-auto font-bold text-foreground">{perpPercent}%</span>
        </div>
      </div>
    </div>
  )
}
