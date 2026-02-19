'use client'

import React from 'react'

interface ObjectViewerProps {
  obj: any
  className?: string
}

export function ObjectViewer({ obj, className = '' }: ObjectViewerProps) {
  if (obj === null || obj === undefined) {
    return <span className={className}>—</span>
  }

  if (typeof obj !== 'object' || Array.isArray(obj)) {
    // arrays / primitives just stringify
    return <span className={className}>{String(obj)}</span>
  }

  return (
    <div className={`space-y-1 ${className}`}>      
      {Object.entries(obj).map(([key, value]) => (
        <div key={key} className="flex justify-between text-xs">
          <span className="font-mono text-muted-foreground truncate">{key}</span>
          <span className="font-mono truncate">
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </span>
        </div>
      ))}
    </div>
  )
}
