'use client'

import React from 'react'
import { TradeSummary } from '@/lib/api'
import { motion } from 'framer-motion'

interface HistoryMetricsProps {
  summary?: TradeSummary | null
}

export function HistoryMetrics({ summary }: HistoryMetricsProps) {
  // Use summary data if available, otherwise 0/empty
  const totalTrades = summary?.totalTrades || 0
  const totalFees = summary?.totalFees || 0
  const netVolume = summary?.netVolume24h || 0
  const volumeChange = summary?.volumeChange24h || 0
  
  const spotPercent = summary?.distribution.spot || 0
  const perpPercent = summary?.distribution.perp || 0

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <motion.div 
      className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Trades */}
        <motion.div variants={item} className="border border-border bg-card p-3 relative group">
          <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Total Trades</div>
          <div className="text-xl text-foreground font-bold">{totalTrades}</div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-pnl-gain opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>

        {/* Total Fees */}
        <motion.div variants={item} className="border border-border bg-card p-3 relative group">
          <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Total Fees</div>
          <div className="text-xl text-foreground font-bold">${totalFees.toFixed(3)}</div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-pink opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>

        {/* Net Volume */}
        <motion.div variants={item} className="border border-border bg-card p-3 col-span-2 relative group">
          <div className="flex justify-between items-start">
            <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Net Volume (24h)</div>
            <div className={`text-[9px] ${volumeChange >= 0 ? 'text-pnl-gain' : 'text-accent-pink'}`}>
              {volumeChange >= 0 ? '+' : ''}{volumeChange.toFixed(1)}%
            </div>
          </div>
          <div className="text-xl text-foreground font-bold">${netVolume.toLocaleString()}</div>
        </motion.div>
      </div>

      {/* Trade Distribution */}
      <motion.div variants={item} className="border border-border bg-card p-4">
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
      </motion.div>
    </motion.div>
  )
}
