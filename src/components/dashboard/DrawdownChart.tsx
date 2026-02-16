'use client'

import React from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis, Tooltip } from 'recharts'

const mockData = [
  { time: '0', value: 10 },
  { time: '1', value: 12 },
  { time: '2', value: 25 },
  { time: '3', value: 22 },
  { time: '4', value: 35 },
  { time: '5', value: 30 },
  { time: '6', value: 42 },
  { time: '7', value: 38 },
  { time: '8', value: 45 },
  { time: '9', value: 40 },
  { time: '10', value: 20 },
  { time: '11', value: 50 },
  { time: '12', value: 50 },
]

export function DrawdownChart() {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData}>
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
          />
          <Area 
            type="monotone" 
            dataKey="value" 
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
