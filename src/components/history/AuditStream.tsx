'use client'

import React from 'react'
import { motion } from 'framer-motion'

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3 // Delay to account for other components loading
      }
    }
  }

  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <motion.div 
        className="border-t border-border bg-card p-3 flex-1 min-h-[200px] flex flex-col"
        variants={container}
        initial="hidden"
        animate="show"
    >
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 border-b border-border pb-2">
        System Audit Stream
      </div>
      <div className="flex-1 font-mono text-[9px] flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {auditLogs.map((log) => (
          <motion.div key={log.id} variants={item} className="text-muted-foreground">
            <span className={getLogColor(log.type)}>[{log.type}]</span> {log.message}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
