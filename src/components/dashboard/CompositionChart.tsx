'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface CompositionData {
  name: string
  value: number
  color: string
}

const mockData: CompositionData[] = [
  { name: 'SOL-PERP', value: 65, color: 'var(--primary)' },
  { name: 'BTC-PERP', value: 20, color: '#3b82f6' }, // Blue
  { name: 'ETH-PERP', value: 10, color: '#8b5cf6' }, // Purple
  { name: 'JUP-PERP', value: 5, color: 'var(--accent-pink)' },
]

export function CompositionChart() {
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
              data={mockData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={450}
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
            <span className="text-2xl font-bold font-mono text-foreground">4</span>
            <span className="text-[10px] text-muted-foreground font-mono uppercase">ASSETS</span>
        </div>
      </div>
    </div>
  )
}
