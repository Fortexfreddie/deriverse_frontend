'use client'

import React from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import { HistoricalPnlData, DrawdownPoint } from '@/lib/api'

// Mock Data matching DrawdownPoint interface
const mockData: DrawdownPoint[] = [
    { timestamp: '2026-02-01', pnl: 0, drawdown: 5.2, peak: 0 },
    { timestamp: '2026-02-02', pnl: 0, drawdown: 8.5, peak: 0 },
    { timestamp: '2026-02-03', pnl: 0, drawdown: 12.4, peak: 0 },
    { timestamp: '2026-02-04', pnl: 0, drawdown: 15.4, peak: 0 }, // Peak drawdown
    { timestamp: '2026-02-05', pnl: 0, drawdown: 10.2, peak: 0 },
    { timestamp: '2026-02-06', pnl: 0, drawdown: 8.1, peak: 0 },
    { timestamp: '2026-02-07', pnl: 0, drawdown: 4.5, peak: 0 },
    { timestamp: '2026-02-08', pnl: 0, drawdown: 2.1, peak: 0 },
    { timestamp: '2026-02-09', pnl: 0, drawdown: 0.5, peak: 0 },
]

interface DrawdownChartProps {
    data?: DrawdownPoint[]
}

export function DrawdownChart({ data }: DrawdownChartProps) {
  const chartData = data || mockData;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--loss-pink)" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="var(--loss-pink)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
            labelStyle={{ display: 'none' }}
            formatter={(value?: number) => [`${value?.toFixed(1) ?? '0.0'}%`, 'Drawdown']}
          />
          <Area 
            type="monotone" 
            dataKey="drawdown" 
            stroke="var(--loss-pink)" 
            fillOpacity={1} 
            fill="url(#drawdownGradient)" 
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
