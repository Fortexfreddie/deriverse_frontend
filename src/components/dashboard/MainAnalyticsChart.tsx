'use client'

import React from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts'

const mockData = [
  { time: '00:00', value: 300 },
  { time: '02:00', value: 240 },
  { time: '04:00', value: 220 },
  { time: '06:00', value: 230 },
  { time: '08:00', value: 180 },
  { time: '10:00', value: 190 },
  { time: '12:00', value: 150 },
  { time: '14:00', value: 160 },
  { time: '16:00', value: 120 },
  { time: '18:00', value: 130 },
  { time: '20:00', value: 100 },
  { time: '22:00', value: 110 },
  { time: '24:00', value: 80 },
]

export function MainAnalyticsChart() {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData}>
          <defs>
            <linearGradient id="mainAnalyticsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--gain-mint)" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="var(--gain-mint)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
            labelStyle={{ display: 'none' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
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
