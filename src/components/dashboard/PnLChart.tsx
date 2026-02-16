'use client'

import React from 'react'

interface PnLMetrics {
  cumulativePnl: string
  volume24h: string
  openInterest: string
  fundingRate: string
  nextFunding: string
}

interface PnLChartProps {
  metrics?: PnLMetrics
}

export function PnLChart({ metrics }: PnLChartProps) {
  const defaultMetrics: PnLMetrics = {
    cumulativePnl: '$12,450.00',
    volume24h: '142,050 SOL',
    openInterest: '$4.2M',
    fundingRate: '0.012% / 1H',
    nextFunding: '00:45:12',
  }

  const displayMetrics = metrics || defaultMetrics

  return (
    <div className="flex-1 px-2 sm:px-6 pb-4 sm:pb-6 min-h-[250px] sm:min-h-[300px] flex flex-col">
      <div className="h-8 flex items-center justify-between mb-2">
        <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          SOL-USDC PERFORMANCE
        </span>
      </div>

      <div className="flex-1 border border-border bg-card rounded relative overflow-hidden flex flex-col sm:flex-row">
        {/* Chart Area */}
        <div className="w-full sm:w-2/3 border-b sm:border-b-0 sm:border-r border-border relative min-h-[150px] sm:min-h-auto">
          <div className="absolute inset-0 p-2 sm:p-4">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 400 100"
            >
              {/* Chart Path */}
              <path
                d="M0,80 L20,75 L40,78 L60,70 L80,72 L100,60 L120,65 L140,50 L160,55 L180,45 L200,48 L220,40 L240,42 L260,35 L280,38 L300,25 L320,30 L340,20 L360,25 L380,15 L400,10"
                fill="none"
                stroke="var(--gain-mint)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              {/* Fill under curve */}
              <path
                d="M0,100 L0,80 L20,75 L40,78 L60,70 L80,72 L100,60 L120,65 L140,50 L160,55 L180,45 L200,48 L220,40 L240,42 L260,35 L280,38 L300,25 L320,30 L340,20 L360,25 L380,15 L400,10 L400,100 Z"
                fill="url(#pnlGradient)"
                stroke="none"
              />
              <defs>
                <linearGradient id="pnlGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--gain-mint)" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="var(--gain-mint)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Cumulative PnL Label */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
            <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase">CUMULATIVE PNL</div>
            <div className="text-lg sm:text-2xl text-foreground font-bold">{displayMetrics.cumulativePnl}</div>
          </div>
        </div>

        {/* Metrics Panel */}
        <div className="w-full sm:w-1/3 p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 justify-center">
          <div className="flex justify-between items-center border-b border-border pb-1 sm:pb-2 border-dashed">
            <span className="text-[8px] sm:text-[10px] text-muted-foreground whitespace-nowrap">24H VOLUME</span>
            <span className="text-[9px] sm:text-xs text-foreground text-right">{displayMetrics.volume24h}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-1 sm:pb-2 border-dashed">
            <span className="text-[8px] sm:text-[10px] text-muted-foreground whitespace-nowrap">OPEN INTEREST</span>
            <span className="text-[9px] sm:text-xs text-foreground">{displayMetrics.openInterest}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-1 sm:pb-2 border-dashed">
            <span className="text-[8px] sm:text-[10px] text-muted-foreground whitespace-nowrap">FUNDING RATE</span>
            <span className="text-[9px] sm:text-xs text-pnl-gain">{displayMetrics.fundingRate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] sm:text-[10px] text-muted-foreground whitespace-nowrap">NEXT FUNDING</span>
            <span className="text-[9px] sm:text-xs text-muted-foreground">{displayMetrics.nextFunding}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
