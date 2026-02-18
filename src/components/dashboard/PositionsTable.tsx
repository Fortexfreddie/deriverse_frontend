'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TableProperties } from 'lucide-react'
import { DashboardPosition } from '@/lib/api'

interface PositionsTableProps {
  positions: DashboardPosition[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

// Helper component for the Flash Effect
const PnlCell = ({ value }: { value: number }) => {
    const [flash, setFlash] = useState<'green' | 'red' | null>(null)
    const prevValueRef = useRef(value)

    useEffect(() => {
        if (value !== prevValueRef.current) {
            if (value > prevValueRef.current) setFlash('green')
            else if (value < prevValueRef.current) setFlash('red')
            
            const timer = setTimeout(() => setFlash(null), 1000)
            prevValueRef.current = value
            return () => clearTimeout(timer)
        }
    }, [value])

    const isPositive = value >= 0
    const textColor = isPositive ? 'text-pnl-gain' : 'text-accent-pink'
    
    // Flash classes
    const flashClass = flash === 'green' ? 'animate-flash-green' : flash === 'red' ? 'animate-flash-red' : ''

    return (
        <span className={`font-bold transition-colors duration-300 ${textColor} ${flashClass}`}>
            {isPositive ? '+' : ''}{value.toFixed(2)}
        </span>
    )
}

export function PositionsTable({ positions, isLoading, isError, onRetry }: PositionsTableProps) {
  if (isError) {
       return (
        <div className="p-6 flex flex-col items-center justify-center border border-border bg-card rounded m-6 border-dashed">
             <p className="text-muted-foreground text-sm mb-4">Error loading positions</p>
             <button 
                onClick={onRetry}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold rounded border border-border"
             >
                 RETRY CONNECTION
             </button>
        </div>
      )
  }
  if (isLoading) {
      return (
        <div className="p-2 sm:p-6 flex flex-col space-y-4">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-12 w-full bg-muted/50 animate-pulse rounded" />)}
            </div>
        </div>
      )
  }

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <div className="p-2 sm:p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
        <h2 className="text-xs sm:text-sm font-bold tracking-wider text-foreground flex items-center gap-2">
          <TableProperties className="text-pnl-gain" size={16} />
          <span className="hidden sm:inline">REAL-TIME POSITIONS</span>
          <span className="sm:hidden">POSITIONS</span>
        </h2>
        <div className="flex gap-2 text-[9px] sm:text-[10px]">
          <span className="text-muted-foreground bg-card px-2 py-1 rounded border border-border">
            SOL-USDC PERP
          </span>
          <span className="text-pnl-gain bg-pnl-gain/10 px-2 py-1 rounded border border-pnl-gain/20 animate-pulse">
            LIVE FEED
          </span>
        </div>
      </div>

      {/* Desktop Table */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden sm:block w-full border border-border rounded bg-card overflow-hidden overflow-x-auto"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">
              <th className="p-2 sm:p-4 font-normal whitespace-nowrap">Instrument</th>
              <th className="p-2 sm:p-4 font-normal text-right">Side</th>
              <th className="p-2 sm:p-4 font-normal text-right whitespace-nowrap">Size (SOL)</th>
              <th className="hidden md:table-cell p-2 sm:p-4 font-normal text-right whitespace-nowrap">Entry Price</th>
              <th className="p-2 sm:p-4 font-normal text-right whitespace-nowrap">Mark Price</th>
              <th className="p-2 sm:p-4 font-normal text-right whitespace-nowrap">PnL (USDC)</th>
              <th className="hidden sm:table-cell p-2 sm:p-4 font-normal text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono divide-y divide-border">
            {positions.map((position) => (
              <tr
                key={position.positionId}
                className="group hover:bg-muted/50 transition-colors border-l-2 border-transparent hover:border-pnl-gain"
              >
                <td className="p-2 sm:p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-700 flex-shrink-0"></div>
                    <span className="font-bold text-foreground text-xs sm:text-sm">{position.market}</span>
                  </div>
                </td>
                <td className="p-2 sm:p-4 text-right">
                  <span
                    className={`${
                      position.side === 'LONG'
                        ? 'text-pnl-gain bg-pnl-gain/10 border-pnl-gain/20'
                        : 'text-accent-pink bg-accent-pink/10 border-accent-pink/20'
                    } px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] border`}
                  >
                    {position.side}
                  </span>
                </td>
                <td className="p-2 sm:p-4 text-right text-muted-foreground text-xs">{position.size.toFixed(2)}</td>
                <td className="hidden md:table-cell p-2 sm:p-4 text-right text-muted-foreground text-xs">{position.entry.toFixed(2)}</td>
                <td className="p-2 sm:p-4 text-right text-foreground text-xs">{position.current.toFixed(2)}</td>
                <td className="p-2 sm:p-4 text-right text-xs">
                  <PnlCell value={position.unrealized} />
                </td>
                <td className="hidden sm:table-cell p-2 sm:p-4 text-center">
                  <button className="text-[8px] sm:text-[10px] border border-border hover:bg-muted hover:border-foreground/30 text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition whitespace-nowrap">
                    CLOSE
                  </button>
                </td>
              </tr>
            ))}
             {positions.length === 0 && (
                <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">No active positions</td>
                </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Mobile Card View */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="sm:hidden flex flex-col gap-2"
      >
        {positions.map((position) => (
          <motion.div
            variants={item}
            key={position.positionId}
            className="border border-border bg-card p-3 rounded hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                <span className="font-bold text-sm text-foreground">{position.market}</span>
              </div>
              <span
                className={`${
                  position.side === 'LONG'
                    ? 'text-pnl-gain bg-pnl-gain/10 border-pnl-gain/20'
                    : 'text-accent-pink bg-accent-pink/10 border-accent-pink/20'
                } px-1.5 py-0.5 rounded text-[9px] border font-bold`}
              >
                {position.side}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <div className="text-muted-foreground text-[9px] mb-1">SIZE (SOL)</div>
                <div className="text-foreground font-bold">{position.size.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-[9px] mb-1">MARK PRICE</div>
                <div className="text-foreground font-bold">{position.current.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-[9px] mb-1">PnL (USDC)</div>
                <div className="text-sm">
                    <PnlCell value={position.unrealized} />
                </div>
              </div>
              <button className="text-[9px] border border-border hover:bg-muted hover:border-foreground/30 text-muted-foreground px-2 py-1 rounded transition">
                CLOSE
              </button>
            </div>
          </motion.div>
        ))}
         {positions.length === 0 && (
            <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded">No active positions</div>
        )}
      </motion.div>
    </div>
  )
}
