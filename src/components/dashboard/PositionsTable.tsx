'use client'

import React from 'react'
import { TableProperties } from 'lucide-react'

interface Position {
  id: string
  instrument: string
  side: 'LONG' | 'SHORT'
  size: number
  entryPrice: number
  markPrice: number
  pnl: number
  icon?: string
}

interface PositionsTableProps {
  positions?: Position[]
}

export function PositionsTable({ positions }: PositionsTableProps) {
  const defaultPositions: Position[] = [
    {
      id: '1',
      instrument: 'SOL-USDC',
      side: 'LONG',
      size: 15.0,
      entryPrice: 84.52,
      markPrice: 87.77,
      pnl: 8.13,
    },
    {
      id: '2',
      instrument: 'SOL-USDC',
      side: 'LONG',
      size: 10.5,
      entryPrice: 84.73,
      markPrice: 87.77,
      pnl: 6.55,
    },
    {
      id: '3',
      instrument: 'SOL-USDC',
      side: 'LONG',
      size: 5.0,
      entryPrice: 85.88,
      markPrice: 87.77,
      pnl: 4.16,
    },
    {
      id: '4',
      instrument: 'SOL-USDC',
      side: 'SHORT',
      size: 8.25,
      entryPrice: 84.96,
      markPrice: 87.77,
      pnl: -0.56,
    },
  ]

  const displayPositions = positions || defaultPositions

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
      <div className="hidden sm:block w-full border border-border rounded bg-card overflow-hidden overflow-x-auto">
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
            {displayPositions.map((position) => (
              <tr
                key={position.id}
                className="group hover:bg-muted/50 transition-colors border-l-2 border-transparent hover:border-pnl-gain"
              >
                <td className="p-2 sm:p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-700 flex-shrink-0"></div>
                    <span className="font-bold text-foreground text-xs sm:text-sm">{position.instrument}</span>
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
                <td className="hidden md:table-cell p-2 sm:p-4 text-right text-muted-foreground text-xs">{position.entryPrice.toFixed(2)}</td>
                <td className="p-2 sm:p-4 text-right text-foreground text-xs">{position.markPrice.toFixed(2)}</td>
                <td
                  className={`p-2 sm:p-4 text-right font-bold text-xs ${
                    position.pnl >= 0 ? 'text-pnl-gain' : 'text-accent-pink'
                  }`}
                >
                  {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
                </td>
                <td className="hidden sm:table-cell p-2 sm:p-4 text-center">
                  <button className="text-[8px] sm:text-[10px] border border-border hover:bg-muted hover:border-foreground/30 text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition whitespace-nowrap">
                    CLOSE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden flex flex-col gap-2">
        {displayPositions.map((position) => (
          <div
            key={position.id}
            className="border border-border bg-card p-3 rounded hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                <span className="font-bold text-sm text-foreground">{position.instrument}</span>
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
                <div className="text-foreground font-bold">{position.markPrice.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-[9px] mb-1">PnL (USDC)</div>
                <div
                  className={`font-bold text-sm ${
                    position.pnl >= 0 ? 'text-pnl-gain' : 'text-accent-pink'
                  }`}
                >
                  {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
                </div>
              </div>
              <button className="text-[9px] border border-border hover:bg-muted hover:border-foreground/30 text-muted-foreground px-2 py-1 rounded transition">
                CLOSE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
