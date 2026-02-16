'use client'

import React from 'react'

interface Trade {
  id: string
  timestamp: string
  market: string
  side: 'LONG' | 'SHORT'
  price: string
  size: string
  fee: string
  type: 'PERP' | 'SPOT'
  signature: string
}

interface HistoryTableProps {
  trades: Trade[]
  onTradeClick?: (trade: Trade) => void
}

export function HistoryTable({ trades, onTradeClick }: HistoryTableProps) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden sm:block flex-1 overflow-x-auto custom-scrollbar">
        <div className="grid grid-cols-12 gap-2 px-4 sm:px-6 py-3 border-b border-border bg-card text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex-shrink-0 sticky top-0">
          <div className="col-span-2 whitespace-nowrap">TIMESTAMP</div>
          <div className="col-span-2 whitespace-nowrap">MARKET</div>
          <div className="col-span-1 whitespace-nowrap">SIDE</div>
          <div className="col-span-2 text-right whitespace-nowrap">PRICE</div>
          <div className="col-span-2 text-right whitespace-nowrap">SIZE</div>
          <div className="col-span-1 text-right whitespace-nowrap">FEE</div>
          <div className="col-span-1 text-center whitespace-nowrap">TYPE</div>
          <div className="col-span-1 text-right whitespace-nowrap">SIGNATURE</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {trades.map((trade) => (
            <div
              key={trade.id}
              onClick={() => onTradeClick?.(trade)}
              className="grid grid-cols-12 gap-2 px-4 sm:px-6 py-3 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors text-xs font-mono group"
            >
              <div className="col-span-2 text-muted-foreground whitespace-nowrap">{trade.timestamp}</div>
              <div className="col-span-2 text-foreground font-bold">{trade.market}</div>
              <div
                className={`col-span-1 font-bold ${
                  trade.side === 'LONG' ? 'text-pnl-gain' : 'text-accent-pink'
                }`}
              >
                {trade.side}
              </div>
              <div className="col-span-2 text-right text-foreground">{trade.price}</div>
              <div className="col-span-2 text-right text-muted-foreground">{trade.size}</div>
              <div className="col-span-1 text-right text-muted-foreground">{trade.fee}</div>
              <div className="col-span-1 text-center">
                <span className="text-muted-foreground text-[10px] border border-border inline-block px-1 py-0.5 rounded">
                  {trade.type}
                </span>
              </div>
              <div className="col-span-1 text-right text-pnl-gain underline decoration-dotted underline-offset-4 cursor-pointer hover:text-foreground truncate">
                {trade.signature}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-2 px-2 py-2">
          {trades.map((trade) => (
            <div
              key={trade.id}
              onClick={() => onTradeClick?.(trade)}
              className="border border-border bg-card p-3 rounded hover:bg-muted/50 cursor-pointer transition-colors"
            >
              {/* Header with timestamp and type */}
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] text-muted-foreground">{trade.timestamp}</div>
                <span className="text-muted-foreground text-[9px] border border-border px-1.5 py-0.5 rounded">
                  {trade.type}
                </span>
              </div>

              {/* Market and Side */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <div className="text-foreground font-bold text-sm">{trade.market}</div>
                </div>
                <span
                  className={`font-bold text-sm ${
                    trade.side === 'LONG' ? 'text-pnl-gain' : 'text-accent-pink'
                  }`}
                >
                  {trade.side}
                </span>
              </div>

              {/* Price and Size */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div>
                  <div className="text-muted-foreground text-[9px] mb-1">PRICE</div>
                  <div className="text-foreground font-bold">{trade.price}</div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground text-[9px] mb-1">SIZE</div>
                  <div className="text-muted-foreground font-bold">{trade.size}</div>
                </div>
              </div>

              {/* Fee and Signature */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="text-muted-foreground text-[9px] mb-1">FEE</div>
                  <div className="text-muted-foreground">{trade.fee}</div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground text-[9px] mb-1">SIGNATURE</div>
                  <div className="text-pnl-gain text-[9px] underline decoration-dotted cursor-pointer hover:text-foreground">
                    {trade.signature}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
