'use client'

import React from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts'
import { HistoricalPnlData } from '@/lib/api'

// Mock Data matching HistoricalPnlData interface
const mockData: HistoricalPnlData[] = [
  { date: '2026-02-01', realizedPnl: 0, unrealizedPnl: 0, totalPnl: 0, cumulativePnl: 0, drawdown: 0 },
  { date: '2026-02-02', realizedPnl: 50, unrealizedPnl: 10, totalPnl: 60, cumulativePnl: 60, drawdown: 0 },
  { date: '2026-02-03', realizedPnl: 20, unrealizedPnl: -5, totalPnl: 15, cumulativePnl: 75, drawdown: 0 },
  { date: '2026-02-04', realizedPnl: -30, unrealizedPnl: -10, totalPnl: -40, cumulativePnl: 35, drawdown: 53.3 },
  { date: '2026-02-05', realizedPnl: 100, unrealizedPnl: 20, totalPnl: 120, cumulativePnl: 155, drawdown: 0 },
  { date: '2026-02-06', realizedPnl: 50, unrealizedPnl: 50, totalPnl: 100, cumulativePnl: 255, drawdown: 0 },
  { date: '2026-02-07', realizedPnl: -80, unrealizedPnl: -20, totalPnl: -100, cumulativePnl: 155, drawdown: 39.2 },
  { date: '2026-02-08', realizedPnl: 20, unrealizedPnl: 10, totalPnl: 30, cumulativePnl: 185, drawdown: 27.4 },
  { date: '2026-02-09', realizedPnl: 40, unrealizedPnl: 5, totalPnl: 45, cumulativePnl: 230, drawdown: 9.8 },
]

interface MainAnalyticsChartProps {
    data?: HistoricalPnlData[]
}

export function MainAnalyticsChart({ data }: MainAnalyticsChartProps) {
  const chartData = data || mockData;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="mainAnalyticsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--gain-mint)" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="var(--gain-mint)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
            labelStyle={{ display: 'none' }}
            formatter={(value?: number) => [`$${value?.toFixed(2) ?? '0.00'}`, 'Cumulative PnL']}
          />
          <Area 
            type="monotone" 
            dataKey="cumulativePnl" 
            stroke="var(--gain-mint)" 
            fillOpacity={1} 
            fill="url(#mainAnalyticsGradient)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
