'use client'

import React from 'react'

interface Session {
  name: string
  status: 'ACTIVE' | 'CLOSED'
  pnl: string
  return: string
}

interface SessionPerformanceProps {
  sessions?: Session[]
}

export function SessionPerformance({ sessions }: SessionPerformanceProps) {
  const defaultSessions: Session[] = [
    {
      name: 'NY SESSION',
      status: 'ACTIVE',
      pnl: '$3,420.00',
      return: '+11.5%',
    },
    {
      name: 'LONDON SESSION',
      status: 'CLOSED',
      pnl: '$892.50',
      return: '+2.1%',
    },
  ]

  const displaySessions = sessions || defaultSessions

  return (
    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 border-b border-border">
      {displaySessions.map((session, idx) => (
        <div
          key={idx}
          className={`border border-border rounded bg-card p-2 sm:p-3 relative overflow-hidden ${
            session.status === 'CLOSED' ? 'opacity-60' : ''
          }`}
        >
          {session.status === 'ACTIVE' && (
            <div className="absolute right-0 top-0 p-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pnl-gain animate-pulse inline-block"></span>
            </div>
          )}

          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] sm:text-[10px] font-mono text-foreground font-bold">{session.name}</span>
            <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground">
              {session.status}
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div className="text-lg sm:text-xl font-mono text-foreground">{session.pnl}</div>
            <div className="text-[9px] sm:text-xs font-mono text-pnl-gain bg-pnl-gain/10 px-1 sm:px-1.5 py-0.5 rounded border border-pnl-gain/20">
              {session.return}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
