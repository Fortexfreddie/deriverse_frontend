'use client'

import React from 'react'

const auditLogs = [
  { id: 1, type: 'INFO', message: 'Syncing block 240592...' },
  { id: 2, type: 'INFO', message: 'Wallet connected (Phantom)' },
  { id: 3, type: 'WARN', message: 'High slippage detected on trade #13' },
  { id: 4, type: 'INFO', message: 'Order filled: 142.50 USDC' },
  { id: 5, type: 'SYS', message: 'Keep-alive ping sent' },
]

export function AuditStream() {
  const getLogColor = (type: string) => {
    switch (type) {
      case 'INFO':
        return 'text-pnl-gain'
      case 'WARN':
        return 'text-accent-pink'
      case 'SYS':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="border-t border-border bg-card p-3 flex-1 min-h-[200px] flex flex-col">
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 border-b border-border pb-2">
        System Audit Stream
      </div>
      <div className="flex-1 font-mono text-[9px] flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {auditLogs.map((log) => (
          <div key={log.id} className="text-muted-foreground">
            <span className={getLogColor(log.type)}>[{log.type}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  )
}
