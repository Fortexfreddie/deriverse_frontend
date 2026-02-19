'use client'

import React from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts'

interface PnLMetrics {
  cumulativePnl: string
  volume24h: string
  openInterest: string
  fundingRate: string
  nextFunding: string
}

interface PnLChartProps {
  metrics?: PnLMetrics
  chartData?: any[]
}

const mockData = [
  { time: '00:00', value: 10 },
  { time: '04:00', value: 15 },
  { time: '08:00', value: 12 },
  { time: '12:00', value: 25 },
  { time: '16:00', value: 20 },
  { time: '20:00', value: 35 },
  { time: '23:59', value: 30 },
]

export function PnLChart({ metrics, chartData }: PnLChartProps) {
  const defaultMetrics: PnLMetrics = {
    cumulativePnl: '$12,450.00',
    volume24h: '142,050 SOL',
    openInterest: '$4.2M',
    fundingRate: '0.012% / 1H',
    nextFunding: '00:45:12',
  }

  const displayMetrics = metrics || defaultMetrics
  const displayData = chartData || mockData

  // Map API historical data to chart format if needed
  const finalData = displayData.map(item => ({
    time: item.time || item.date || '',
    value: item.value || item.cumulativePnl || 0
  }))

  return (
    <div className="flex-1 px-2 sm:px-6 pb-4 sm:pb-6 min-h-62.5 sm:min-h-75 flex flex-col bg-secondary">
      <div className="h-8 flex items-center justify-between mb-2">
        <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          PERFORMANCE_CHART
        </span>
      </div>

      <div className="flex-1 border border-border bg-card rounded relative overflow-hidden flex flex-col sm:flex-row">
        {/* Chart Area */}
        <div className="w-full sm:w-2/3 border-b sm:border-b-0 sm:border-r border-border relative min-h-37.5 sm:min-h-auto">
          <div className="absolute inset-0 p-2 sm:p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={finalData}>
                <defs>
                  <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gain-mint)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--gain-mint)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  labelStyle={{ display: 'none' }}
                  formatter={(value: any) => [`$${value}`, 'PnL']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--gain-mint)"
                  fillOpacity={1}
                  fill="url(#pnlGradient)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
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
            <span className="text-[8px] sm:text-[10px] text-muted-foreground whitespace-nowrap uppercase">24h Vol</span>
            <span className="text-[9px] sm:text-xs text-foreground text-right font-mono">{displayMetrics.volume24h}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-1 sm:pb-2 border-dashed">
            <span className="text-[8px] sm:text-[10px] text-muted-foreground whitespace-nowrap uppercase">Open Int</span>
            <span className="text-[9px] sm:text-xs text-foreground font-mono">{displayMetrics.openInterest}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-1 sm:pb-2 border-dashed">
            <span className="text-[8px] sm:text-[10px] text-muted-foreground whitespace-nowrap uppercase">Funding</span>
            <span className="text-[9px] sm:text-xs text-pnl-gain font-mono">{displayMetrics.fundingRate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] sm:text-[10px] text-muted-foreground whitespace-nowrap uppercase">Next</span>
            <span className="text-[9px] sm:text-xs text-muted-foreground font-mono">{displayMetrics.nextFunding}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
