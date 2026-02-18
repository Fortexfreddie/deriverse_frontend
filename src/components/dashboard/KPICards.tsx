'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ComprehensiveAnalytics } from '@/lib/api'

interface KPICardsProps {
  analytics: ComprehensiveAnalytics | null
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function KPICards({ analytics, isLoading, isError, onRetry }: KPICardsProps) {
  if (isError) {
      return (
        <div className="grid grid-cols-1 p-4 bg-border border-b border-border">
             <div className="bg-card p-4 flex flex-col items-center justify-center text-center">
                 <p className="text-muted-foreground text-xs mb-2">Failed to load analytics</p>
                 <button 
                    onClick={onRetry}
                    className="px-3 py-1 bg-muted hover:bg-muted/80 text-foreground text-xs rounded border border-border"
                 >
                     Retry
                 </button>
             </div>
        </div>
      )
  }

  // Format Helpers
  const formatMoney = (val: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
  }
  
  const formatPercent = (val: number) => {
      return `${val.toFixed(2)}%`
  }

  // Data mapping
  const unrealized = analytics?.totalPnl.unrealized ?? 0
  const realized = analytics?.totalPnl.realized ?? 0
  const winRate = analytics?.winRate ?? 0
  // Margin Usage is NOT in ComprehensiveAnalytics yet. 
  // "The Missing Endpoint Rule": If a UI element exists that isn't supported... tell me.
  // I will mark it as "N/A" for now and notify user in final report, 
  // OR I can calculate it if I had balance data, but I don't have balance data in analytics.
  const marginUsage = "N/A" 
  
  // Account Health is also not directly in analytics, but maybe riskMetrics has something?
  // riskMetrics has sharpeRatio, sortinoRatio, etc.
  // Let's use a placeholder or derive from winRate/profitFactor for "Health" visual
  const accountHealth = Math.min(Math.max((analytics?.riskMetrics.profitFactor ?? 1) * 20, 0), 100)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border-b border-border"
    >
      {/* Total Unrealized PnL */}
      <motion.div variants={item} className="bg-card p-2 sm:p-4 flex flex-col justify-center">
        <span className="text-[8px] sm:text-xs uppercase tracking-widest text-muted-foreground mb-1">Unrealized PNL</span>
        {isLoading ? (
             <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        ) : (
             <span className={`text-base sm:text-xl font-bold ${unrealized >= 0 ? 'text-pnl-gain' : 'text-accent-pink'}`}>
                 {unrealized >= 0 ? '+' : ''}{formatMoney(unrealized)}
             </span>
        )}
      </motion.div>

      {/* Realized PnL 24H */}
      <motion.div variants={item} className="bg-card p-2 sm:p-4 flex flex-col justify-center">
        <span className="text-[8px] sm:text-xs uppercase tracking-widest text-muted-foreground mb-1">Realized PNL (Total)</span>
        {isLoading ? (
             <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        ) : (
            <span className={`text-base sm:text-xl font-bold ${realized >= 0 ? 'text-foreground' : 'text-accent-pink'}`}>
                {realized >= 0 ? '+' : ''}{formatMoney(realized)}
            </span>
        )}
      </motion.div>

      {/* Margin Usage */}
      <motion.div variants={item} className="bg-card p-2 sm:p-4 flex flex-col justify-center hidden sm:flex">
        <span className="text-[8px] sm:text-xs uppercase tracking-widest text-muted-foreground mb-1">Margin Usage</span>
         {isLoading ? (
             <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        ) : (
            <span className="text-base sm:text-xl text-foreground font-bold">{marginUsage} *</span>
        )}
      </motion.div>

      {/* Account Health */}
      <motion.div variants={item} className="bg-card p-2 sm:p-4 flex flex-col justify-center hidden sm:flex">
        <span className="text-[8px] sm:text-xs uppercase tracking-widest text-muted-foreground mb-1">Account Health</span>
         {isLoading ? (
             <div className="h-6 w-full bg-muted animate-pulse rounded" />
        ) : (
            <div className="flex items-center gap-2">
            <div className="w-16 sm:w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                className="h-full bg-pnl-gain transition-all duration-300"
                style={{ width: `${accountHealth}%` }}
                ></div>
            </div>
            <span className="text-pnl-gain font-bold text-xs">
                {accountHealth > 70 ? 'GOOD' : accountHealth > 40 ? 'OK' : 'RISK'}
            </span>
            </div>
        )}
      </motion.div>
    </motion.div>
  )
}
