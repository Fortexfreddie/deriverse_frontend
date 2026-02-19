'use client'

import { useState, useCallback, useMemo } from 'react'
import { format } from 'date-fns'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PageLoader } from '@/components/PageLoader'
import { useJournalData } from '@/hooks/use-journal-data'
import { JournalHeatmap, type HeatmapTrade } from '@/components/journal/JournalHeatmap'
import { TradeListDialog } from '@/components/journal/TradeListDialog'
import { MobileTradeFlow } from '@/components/journal/MobileTradeFlow'
import { motion } from 'framer-motion'
import { FileText, Terminal, Fingerprint, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function JournalPage() {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 1))
    const { data: journalData, isLoading: isDataLoading, isDemo } = useJournalData(currentMonth)

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedTrades, setSelectedTrades] = useState<HeatmapTrade[]>([])

    const [mobileDate, setMobileDate] = useState<Date | null>(null)
    const [mobileTrades, setMobileTrades] = useState<HeatmapTrade[]>([])

    const handleDesktopDayClick = useCallback((date: Date, trades: HeatmapTrade[]) => {
        setSelectedDate(date)
        setSelectedTrades(trades)
        setIsDialogOpen(true)
    }, [])

    const handleMobileDayClick = useCallback((date: Date, trades: HeatmapTrade[]) => {
        setMobileDate(date)
        setMobileTrades(trades)
    }, [])

    const handleMobileDateChange = useCallback((date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        const dayData = (journalData || {})[dateStr] || []
        setMobileDate(date)
        setMobileTrades(dayData as HeatmapTrade[])
    }, [journalData])

    // --- Professional Audit Snippets ---
    const auditStream = useMemo(() => [
        { tag: "PSYCHE_TAG", msg: "PATIENCE_DEVIATION", color: "text-pink" },
        { tag: "ANALYSIS", msg: "LIQUIDITY_SWEEP_DETECTED", color: "text-primary" },
        { tag: "BIAS_ENGINE", msg: "RECENCY_BIAS_DETECTED", color: "text-amber-500" },
        { tag: "STRATEGY", msg: "MEAN_REVERSION_ENTRY", color: "text-primary" },
        { tag: "EXECUTION", msg: "SLIPPAGE_TOLERANCE_MET", color: "text-muted-foreground" },
    ], [])

    if (isDataLoading) return <PageLoader />

    return (
        <DashboardLayout title="JOURNAL">
            {/* ── Desktop (md+) ─────────────────────────────────────────── */}
            <div className="hidden md:flex flex-1 flex-col h-full overflow-hidden bg-background">
                <JournalHeatmap
                    journalData={journalData || {}}
                    currentMonth={currentMonth}
                    onMonthChange={setCurrentMonth}
                    onDayClick={handleDesktopDayClick}
                />
                <TradeListDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    selectedDate={selectedDate}
                    trades={selectedTrades}
                    isDemo={isDemo}
                />
            </div>

            {/* ── Mobile (<md) ───────────────────────────────────────────── */}
            <div className="flex flex-col md:hidden flex-1 bg-background relative overflow-hidden font-mono">
                {mobileDate && mobileTrades.length > 0 ? (
                    <MobileTradeFlow
                        date={mobileDate}
                        trades={mobileTrades}
                        isDemo={isDemo}
                        onBack={() => {
                            setMobileDate(null)
                            setMobileTrades([])
                        }}
                        onDateChange={handleMobileDateChange}
                    />
                ) : (
                    <div className="flex-1 flex flex-col h-full">
                        {/* Heatmap Section */}
                        <div className="shrink-0 p-4">
                            <JournalHeatmap
                                journalData={journalData || {}}
                                currentMonth={currentMonth}
                                onMonthChange={setCurrentMonth}
                                onDayClick={handleMobileDayClick}
                            />
                        </div>

                        {/* CREATIVE AUDIT STREAM: Collects empty vertical space */}
                        <div className="grow relative flex flex-col border-t border-border/40 mt-2 bg-black/40 overflow-hidden">

                            {/* Watermark Logo */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <Fingerprint size={280} />
                            </div>

                            <div className="p-6 relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-foreground font-black">
                                            JOURNAL_AUDIT_STREAM
                                        </span>
                                    </div>
                                    <Database size={12} className="text-muted-foreground opacity-40" />
                                </div>

                                <div className="space-y-6 flex-1">
                                    {auditStream.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 0.6, y: 0 }}
                                            transition={{
                                                delay: i * 0.2,
                                                duration: 1,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                repeatDelay: 0.5
                                            }}
                                            className="space-y-1.5"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={cn("text-[8px] font-black px-1 border border-current bg-background/50", item.color)}>
                                                    {item.tag}
                                                </span>
                                                <div className="h-px flex-1 bg-border/20" />
                                            </div>
                                            <div className="text-[10px] font-bold text-foreground/80 tracking-tight pl-1">
                                                &gt; {item.msg}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Scrolling Terminal Footprint */}
                                <div className="mt-auto pt-8 opacity-20 h-32 overflow-hidden pointer-events-none">
                                    <motion.div
                                        animate={{ y: [0, -100] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="text-[7px] text-primary space-y-1"
                                    >
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <div key={i} className="truncate">
                                                {`[${new Date().toISOString()}] AUDIT_LOG_${i} :: SIG_0x${Math.random().toString(16).slice(2, 10).toUpperCase()} :: STATUS_VERIFIED`}
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Professional Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none z-20" />

                            <div className="absolute bottom-6 left-0 right-0 text-center z-30">
                                <span className="text-[9px] text-muted-foreground font-mono italic opacity-40">
                                    Click a terminal sector to review execution data
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}