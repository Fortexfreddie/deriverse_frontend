'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { PortfolioCompositionItem } from '@/lib/api'

// Mock Data matching API
const mockData: PortfolioCompositionItem[] = [
  { market: 'SOL-PERP', value: 65, percentage: 65.0 },
  { market: 'BTC-PERP', value: 20, percentage: 20.0 },
  { market: 'ETH-PERP', value: 10, percentage: 10.0 },
  { market: 'JUP-PERP', value: 5, percentage: 5.0 },
]

// Colors for the pie chart
const COLORS = [
    'var(--primary)',
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    'var(--accent-pink)',
    '#f59e0b', // Amber
    '#10b981' // Emerald
];

interface CompositionChartProps {
    data?: PortfolioCompositionItem[]
}

export function CompositionChart({ data }: CompositionChartProps) {
  const chartData = data || mockData;

  return (
    <div className="w-full h-full min-h-[250px] flex flex-col">
       <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">PORTFOLIO_COMPOSITION</span>
            <span className="text-[10px] text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">LIVE</span>
       </div>
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="market"
              stroke="none"
              startAngle={90}
              endAngle={450}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: 'var(--foreground)'
              }}
              itemStyle={{ color: 'var(--foreground)' }}
              formatter={(value?: number, name?: string) => [`${value?.toFixed(1) ?? '0.0'}%`, name]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value, entry: any) => (
                <span className="text-[10px] font-mono text-muted-foreground ml-1 uppercase">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
            <span className="text-2xl font-bold font-mono text-foreground">{chartData.length}</span>
            <span className="text-[10px] text-muted-foreground font-mono uppercase">ASSETS</span>
        </div>
      </div>
    </div>
  )
}
