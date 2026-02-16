'use client'

import React, { useState } from 'react'

interface LogEntry {
  timestamp: string
  type: 'RPC' | 'WS' | 'RISK' | 'SYS'
  action: string
  message: string
  highlight?: 'primary' | 'pink' | 'none'
}

interface EngineLogProps {
  logs?: LogEntry[]
}

export function EngineLog({ logs }: EngineLogProps) {
  const [command, setCommand] = useState('')

  const defaultLogs: LogEntry[] = [
    {
      timestamp: '14:02:44.201',
      type: 'RPC',
      action: 'UPDATE_POSITION',
      message: 'SOL-USDC\nPnL: +8.13 (Mark: 87.77)',
      highlight: 'primary',
    },
    {
      timestamp: '14:02:43.150',
      type: 'WS',
      action: 'ORDER_BOOK',
      message: 'Snapshot\nBids: 142.5 / Asks: 120.2',
      highlight: 'none',
    },
    {
      timestamp: '14:02:41.800',
      type: 'RISK',
      action: 'MARGIN_CHECK',
      message: 'PASS\nHealth: 85% > Threshold 20%',
      highlight: 'pink',
    },
    {
      timestamp: '14:02:40.005',
      type: 'SYS',
      action: 'PING',
      message: '12ms',
      highlight: 'none',
    },
    {
      timestamp: '14:02:38.201',
      type: 'RPC',
      action: 'UPDATE_POSITION',
      message: 'SOL-USDC\nPnL: +6.55 (Mark: 87.77)',
      highlight: 'primary',
    },
  ]

  const displayLogs = logs || defaultLogs

  const getLogClasses = (highlight?: string) => {
    const base = 'text-muted-foreground border-l-2 pl-2 py-0.5'
    switch (highlight) {
      case 'primary':
        return `${base} border-pnl-gain bg-pnl-gain/5`
      case 'pink':
        return `${base} border-accent-pink bg-accent-pink/5`
      default:
        return `${base} border-border hover:bg-muted/50 transition-colors`
    }
  }

  const getActionColor = (highlight?: string) => {
    switch (highlight) {
      case 'primary':
        return 'text-pnl-gain'
      case 'pink':
        return 'text-accent-pink'
      default:
        return 'text-foreground'
    }
  }

  return (
    <div className="flex flex-col bg-card/50 p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] min-h-0">
      {/* Header */}
      <div className="text-muted-foreground mb-2 sm:mb-3 uppercase tracking-widest flex justify-between items-center flex-shrink-0">
        <span className="hidden sm:inline">LIVE ENGINE LOGS</span>
        <span className="sm:hidden">LOGS</span>
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-blink"></span>
      </div>

      {/* Logs Container */}
      <div className="flex flex-col gap-1 sm:gap-2 font-mono">
        {displayLogs.map((log, idx) => (
          <div key={idx} className={getLogClasses(log.highlight)}>
            <div className="flex justify-between text-muted-foreground text-[8px] sm:text-[9px] mb-0.5 gap-1">
              <span className="truncate">{log.timestamp}</span>
              <span className="flex-shrink-0">{log.type}</span>
            </div>
            <span className={getActionColor(log.highlight)}>{log.action}</span>
            {log.message && (
              <>
                {log.message.split('\n').map((line, lineIdx) => (
                  <div key={lineIdx} className="text-muted-foreground ml-2 truncate text-[8px] sm:text-[9px]">
                    {line}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Command Input */}
      <div className="mt-2 border-t border-border pt-2 flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <span className="text-pnl-gain font-bold flex-shrink-0">&gt;</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="cmd..."
          className="bg-transparent border-none outline-none text-foreground w-full placeholder-muted-foreground text-[8px] sm:text-[10px] p-0 focus:ring-0 truncate"
        />
      </div>
    </div>
  )
}
