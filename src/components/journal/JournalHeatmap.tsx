'use client'

import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export interface HeatmapTrade {
    id: string
    positionId?: string
    signature?: string
    price?: number
    fee?: number
    isEntry?: boolean
    orderType?: string
    tradeType?: string
    notes?: string | null
    metadata?: Record<string, any> | null
    rawData?: Record<string, any> | null
    symbol: string
    side: 'LONG' | 'SHORT'
    size: number
    pnl: number
    timestamp: Date
    position: any
}

interface JournalHeatmapProps {
    journalData: Record<string, HeatmapTrade[]>
    currentMonth: Date
    onMonthChange: (date: Date) => void
    onDayClick: (date: Date, trades: HeatmapTrade[]) => void
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03
        }
    }
}

const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
}

export function JournalHeatmap({ journalData, currentMonth, onMonthChange, onDayClick }: JournalHeatmapProps) {
    const days = useMemo(() => {
        const start = startOfMonth(currentMonth)
        const end = endOfMonth(start)
        return eachDayOfInterval({ start, end })
    }, [currentMonth])

    const startDay = getDay(days[0])
    const emptyDays = startDay === 0 ? 6 : startDay - 1

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

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="flex justify-between items-end mb-6 md:mb-8 shrink-0 px-4 md:px-6 pt-4 md:pt-6">
                <div>
                    <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] mb-1 opacity-60">
                        Performance Heatmap
                    </h2>
                    <div className="text-xl md:text-3xl font-black font-mono tracking-tighter text-foreground uppercase">
                        {format(currentMonth, 'MMMM yyyy')}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="w-8 h-8 border border-border hover:bg-muted transition-colors rounded-sm flex items-center justify-center opacity-50 hover:opacity-100"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="w-8 h-8 border border-border hover:bg-muted transition-colors rounded-sm flex items-center justify-center opacity-50 hover:opacity-100"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </header>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto flex items-start justify-center px-4 md:px-6 pb-4">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    key={currentMonth.toISOString()} // Force re-render on month change
                    className="w-full max-w-150 grid grid-cols-7 gap-1 md:gap-1.5"
                >
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                        <motion.div variants={item} key={day} className="text-[8px] md:text-[9px] text-center text-muted-foreground font-bold mb-1 opacity-40">
                            {day}
                        </motion.div>
                    ))}

                    {Array.from({ length: emptyDays }).map((_, i) => (
                        <motion.div variants={item} key={`empty-${i}`} className="aspect-square opacity-5 border border-dashed border-border/20" />
                    ))}

                    {days.map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd')
                        const trades = journalData[dateStr] || []
                        const count = trades.length
                        const pnl = trades.reduce((acc, t) => acc + (t.pnl || 0), 0)

                        const isGreen = pnl > 0
                        const isRed = pnl < 0
                        const isToday = isSameDay(day, new Date())

                        let bgClass = 'bg-muted/5 border-border/5 opacity-40 hover:opacity-80'
                        if (count > 0) {
                            bgClass = isGreen
                                ? 'bg-primary/10 border-primary/30 text-primary opacity-100 hover:bg-primary/20'
                                : isRed
                                    ? 'bg-pink/10 border-pink/30 text-pink opacity-100 hover:bg-pink/20'
                                    : 'bg-muted/20 border-border/20 text-foreground opacity-100 hover:bg-muted/30'
                        }

                        if (isToday) bgClass += ' ring-1 ring-white/30'

                        return (
                            <motion.button
                                variants={item}
                                key={dateStr}
                                onClick={() => count > 0 && onDayClick(day, trades)}
                                whileHover={count > 0 ? { scale: 1.05, zIndex: 10 } : undefined}
                                whileTap={count > 0 ? { scale: 0.95 } : undefined}
                                className={cn(
                                    'aspect-square border rounded-sm flex flex-col items-center justify-center text-[10px] md:text-xs font-mono transition-all relative group',
                                    bgClass,
                                    count > 0 && 'cursor-pointer'
                                )}
                            >
                                <span className="z-10 relative">{format(day, 'd')}</span>

                                {/* Glow effect */}
                                {count > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                        <div className={cn(
                                            'w-1/2 h-1/2 rounded-full blur-xl',
                                            isGreen ? 'bg-primary' : isRed ? 'bg-pink' : 'bg-muted'
                                        )} />
                                    </div>
                                )}

                                {/* Activity dot */}
                                {count > 0 && (
                                    <span className={cn(
                                        'absolute bottom-1 w-1 h-1 rounded-full',
                                        isGreen
                                            ? 'bg-primary shadow-[0_0_5px_rgba(var(--primary),0.5)]'
                                            : isRed
                                                ? 'bg-pink shadow-[0_0_5px_rgba(var(--pink),0.5)]'
                                                : 'bg-muted'
                                    )} />
                                )}

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-max pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                                    <div className="bg-popover border border-border text-popover-foreground text-[10px] px-3 py-1.5 rounded shadow-2xl backdrop-blur-md">
                                        {count > 0 ? (
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className={cn('font-black', isGreen ? 'text-primary' : isRed ? 'text-pink' : 'text-foreground')}>
                                                    {isGreen ? '+' : ''}${pnl.toFixed(2)}
                                                </span>
                                                <span className="text-[8px] opacity-60 uppercase font-bold tracking-widest">{count} Trade{count !== 1 ? 's' : ''}</span>
                                            </div>
                                        ) : (
                                            <span className="opacity-60">No activity</span>
                                        )}
                                    </div>
                                </div>

                                {/* Trade count badge on hover */}
                                {count > 0 && (
                                    <div className="absolute -top-1 -right-1 z-20 bg-foreground text-background text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform shadow-lg border border-background">
                                        {count}
                                    </div>
                                )}
                            </motion.button>
                        )
                    })}
                </motion.div>
            </div>

            {/* Footer hint */}
            <div className="text-[9px] text-center text-muted-foreground py-3 italic opacity-50 shrink-0">
                Click a day to view trades &amp; journal
            </div>
        </div>
    )
}
