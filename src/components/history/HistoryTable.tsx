'use client'

import React from 'react'
import { TradeEvent } from '@/lib/api'
import { parsePositionId, formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

interface HistoryTableProps {
  trades?: TradeEvent[]
  onTradeClick?: (trade: TradeEvent) => void
}

export function HistoryTable({ trades, onTradeClick }: HistoryTableProps) {
  const displayTrades = trades || [];

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden sm:block flex-1 overflow-x-auto custom-scrollbar">
        <div className="grid grid-cols-12 gap-2 px-4 sm:px-6 py-3 border-b border-border bg-card text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex-shrink-0 sticky top-0 z-10">
          <div className="col-span-2 whitespace-nowrap">TIMESTAMP</div>
          <div className="col-span-2 whitespace-nowrap">MARKET</div>
          <div className="col-span-1 whitespace-nowrap">SIDE</div>
          <div className="col-span-2 text-right whitespace-nowrap">PRICE</div>
          <div className="col-span-2 text-right whitespace-nowrap">SIZE</div>
          <div className="hidden md:block col-span-1 text-right whitespace-nowrap">FEE</div>
          <div className="col-span-1 text-center whitespace-nowrap">TYPE</div>
          <div className="hidden lg:block col-span-1 text-right whitespace-nowrap">SIGNATURE</div>
        </div>

        <motion.div 
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {displayTrades.map((trade) => {
            // Use nested position data if available, fallback to parsing ID
            const market = trade.position?.market || parsePositionId(trade.positionId).market;
            const side = trade.position?.side || parsePositionId(trade.positionId).side;
            
            return (
            <div
              key={trade.id}
              onClick={() => onTradeClick?.(trade)}
              className="grid grid-cols-12 gap-2 px-4 sm:px-6 py-3 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors text-xs font-mono group"
            >
              <div className="col-span-2 text-muted-foreground whitespace-nowrap text-[10px] flex items-center tracking-tighter sm:tracking-normal">{formatDate(trade.timestamp)}</div>
              <div className="col-span-2 text-foreground font-bold">{market}</div>
              <div
                className={`col-span-1 font-bold ${
                  side === 'LONG' ? 'text-pnl-gain' : 'text-accent-pink'
                }`}
              >
                {side}
              </div>
              <div className="col-span-2 text-right text-foreground">{trade.price.toFixed(2)}</div>
              <div className="col-span-2 text-right text-muted-foreground">{trade.size.toFixed(4)}</div>
              <div className="hidden md:block col-span-1 text-right text-muted-foreground">{trade.fee.toFixed(4)}</div>
              <div className="col-span-1 text-center">
                <span className={`text-[10px] border px-1 py-0.5 rounded ${trade.tradeType === 'SPOT' ? 'text-blue-400 border-blue-400/30' : 'text-purple-400 border-purple-400/30'}`}>
                  {trade.tradeType}
                </span>
              </div>
              <div className="hidden lg:block col-span-1 text-right text-pnl-gain underline decoration-dotted underline-offset-4 cursor-pointer hover:text-foreground truncate">
                {trade.signature}
              </div>
            </div>
          )})}
        </motion.div>
      </div>

      {/* Mobile Card View */}
      <motion.div 
        className="sm:hidden flex-1 overflow-y-auto custom-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-2 px-2 py-2">
          {displayTrades.map((trade) => {
             const market = trade.position?.market || parsePositionId(trade.positionId).market;
             const side = trade.position?.side || parsePositionId(trade.positionId).side;

            return (
            <div
              key={trade.id}
              onClick={() => onTradeClick?.(trade)}
              className="border border-border bg-card p-3 rounded hover:bg-muted/50 cursor-pointer transition-colors"
            >
              {/* Header with timestamp and type */}
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] text-muted-foreground">{new Date(trade.timestamp).toLocaleTimeString()}</div>
                <span className={`text-[9px] border px-1.5 py-0.5 rounded ${trade.tradeType === 'SPOT' ? 'text-blue-400 border-blue-400/30' : 'text-purple-400 border-purple-400/30'}`}>
                  {trade.tradeType}
                </span>
              </div>

              {/* Market and Side */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <div className="text-foreground font-bold text-sm">{market}</div>
                </div>
                <span
                  className={`font-bold text-sm ${
                    side === 'LONG' ? 'text-pnl-gain' : 'text-accent-pink'
                  }`}
                >
                  {side}
                </span>
              </div>

              {/* Price and Size */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div>
                  <div className="text-muted-foreground text-[9px] mb-1">PRICE</div>
                  <div className="text-foreground font-bold">{trade.price.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground text-[9px] mb-1">SIZE</div>
                  <div className="text-muted-foreground font-bold">{trade.size.toFixed(4)}</div>
                </div>
              </div>

              {/* Fee and Signature */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="text-muted-foreground text-[9px] mb-1">FEE</div>
                  <div className="text-muted-foreground">{trade.fee.toFixed(4)}</div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground text-[9px] mb-1">SIGNATURE</div>
                  <div className="text-pnl-gain text-[9px] underline decoration-dotted cursor-pointer hover:text-foreground">
                    {trade.signature.slice(0, 8)}...
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </motion.div>
    </>
  )
}
