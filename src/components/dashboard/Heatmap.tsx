'use client'

import React, { useMemo } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { HeatmapData } from '@/lib/api'

interface HeatmapProps {
  data?: HeatmapData // date string (YYYY-MM-DD) -> { pnl, count, trades }
  currentMonth: Date
  onMonthChange: (date: Date) => void
  className?: string
}

export function Heatmap({ data = {}, currentMonth, onMonthChange, className }: HeatmapProps) {
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(start)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const prevMonth = () => {
    const d = new Date(currentMonth)
    d.setMonth(d.getMonth() - 1)
    onMonthChange(d)
  }

  const nextMonth = () => {
    const d = new Date(currentMonth)
    d.setMonth(d.getMonth() + 1)
    onMonthChange(d)
  }

  // Generate blank days for start of month alignment (0 = Sunday, 1 = Monday, etc.)
  // We want Monday start? Commonly yes for trading.
  // Let's assume Monday start (ISO).
  const startDay = getDay(days[0]) // 0 is Sunday
  const emptyDays = startDay === 0 ? 6 : startDay - 1

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-muted rounded-full transition-colors opacity-50 hover:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-muted rounded-full transition-colors opacity-50 hover:opacity-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            HEATMAP <span className="text-primary font-bold">{format(currentMonth, 'MMM yyyy').toUpperCase()}</span>
          </h2>
        </div>
        {/* <div className="flex gap-1">
          <div className="flex items-center gap-1 mr-2 px-2 py-0.5 bg-muted/10 border border-border rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="text-[9px] text-muted-foreground">PROFIT</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-muted/10 border border-border rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-pink/50"></span>
            <span className="text-[9px] text-muted-foreground">LOSS</span>
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
          <div key={day} className="text-[8px] sm:text-[10px] text-center text-muted-foreground/50 font-mono mb-1">{day}</div>
        ))}

        {Array.from({ length: emptyDays }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayData = data[dateStr]
          const pnl = dayData?.pnl
          const dayNum = format(day, 'd')

          let bgClass = 'bg-muted/10 border-transparent text-muted-foreground'

          if (pnl !== undefined && pnl > 0) {
            const opacity = Math.min(Math.abs(pnl) / 100, 1) * 0.5 + 0.1 // Simple scale
            bgClass = 'bg-primary/20 border-primary/30 text-primary shadow-[0_0_10px_rgba(0,255,196,0.1)]'
          } else if (pnl !== undefined && pnl < 0) {
            bgClass = 'bg-pink/20 border-pink/30 text-pink'
          }

          const isToday = isSameDay(day, new Date())
          if (isToday) {
            bgClass += ' ring-1 ring-white/50'
          }

          return (
            <div
              key={dateStr}
              className={cn(
                "aspect-square border rounded-sm flex flex-col items-center justify-center relative group cursor-pointer hover:opacity-80 transition-all",
                bgClass
              )}
            >
              <span className="text-[9px] sm:text-xs font-mono font-bold z-10 relative">{dayNum}</span>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-max pointer-events-none">
                <div className="bg-popover border border-border text-popover-foreground text-[9px] px-2 py-1.5 rounded shadow-xl flex flex-col items-center gap-0.5">
                  <span className="text-muted-foreground">{dateStr}</span>
                  {pnl !== undefined ? (
                    <span className={cn("font-bold text-xs", pnl > 0 ? "text-primary" : "text-pink")}>
                      {pnl > 0 ? '+' : ''}${pnl.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">No Activity</span>
                  )}
                  {dayData?.count && (
                    <span className="text-[8px] text-muted-foreground/80">{dayData.count} trades</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
