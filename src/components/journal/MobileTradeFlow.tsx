'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { HeatmapTrade } from './JournalHeatmap'
import type { JournalAnalysis } from '@/lib/api'
import { TradeDossier } from './TradeDossier'
import { AnalysisResult } from './AnalysisResult'

interface MobileTradeFlowProps {
    date: Date
    trades: HeatmapTrade[]
    isDemo: boolean
    onBack: () => void
    onDateChange: (date: Date) => void
}

export function MobileTradeFlow({ date, trades, isDemo, onBack, onDateChange }: MobileTradeFlowProps) {
    const [selectedTrade, setSelectedTrade] = useState<HeatmapTrade | null>(null)
    const [analysisResult, setAnalysisResult] = useState<JournalAnalysis | null>(null)

    const dailyPnl = trades.reduce((acc, t) => acc + (t.pnl || 0), 0)

    // Navigate to adjacent day
    const goToDay = (offset: number) => {
        const next = new Date(date)
        next.setDate(next.getDate() + offset)
        setSelectedTrade(null)
        setAnalysisResult(null)
        onDateChange(next)
    }

    // Full-screen analysis result
    if (analysisResult) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="mobile-analysis"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full bg-background"
                >
                    <AnalysisResult
                        analysis={analysisResult}
                        onClose={() => {
                            setAnalysisResult(null)
                            setSelectedTrade(null)
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        )
    }

    // Full-screen trade dossier
    if (selectedTrade) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="mobile-dossier"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="flex flex-col h-full bg-background"
                >
                    <TradeDossier
                        trade={selectedTrade}
                        isDemo={isDemo}
                        onBack={() => setSelectedTrade(null)}
                        onAnalysisReceived={(result) => setAnalysisResult(result)}
                    />
                </motion.div>
            </AnimatePresence>
        )
    }

    // Trade list for the day
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="mobile-trade-list"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="flex flex-col h-full bg-background"
            >
                {/* Header */}
                <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-muted/5">
                    <button onClick={onBack} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <button onClick={() => goToDay(-1)} className="p-1.5 hover:bg-muted rounded-sm transition-colors">
                            <ChevronLeft size={14} />
                        </button>
                        <div className="text-center">
                            <div className="text-sm font-black font-mono">{format(date, 'MMM dd')}</div>
                            <div className="text-[9px] text-muted-foreground">{format(date, 'EEEE')}</div>
                        </div>
                        <button onClick={() => goToDay(1)} className="p-1.5 hover:bg-muted rounded-sm transition-colors">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                    <span className={`text-sm font-mono font-black ${dailyPnl >= 0 ? 'text-primary' : 'text-pink'}`}>
                        {dailyPnl >= 0 ? '+' : ''}${dailyPnl.toFixed(2)}
                    </span>
                </div>

                {/* Trade List */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-2">
                        {trades.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground text-xs opacity-50 font-mono">
                                No trades on this day.
                            </div>
                        ) : (
                            trades.map(trade => (
                                <button
                                    key={trade.id}
                                    onClick={() => setSelectedTrade(trade)}
                                    className="w-full border border-border bg-card hover:bg-muted/10 transition-colors p-4 rounded-sm flex items-center justify-between text-left active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1 h-10 rounded-full ${(trade.pnl || 0) >= 0 ? 'bg-primary' : 'bg-pink'}`} />
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-bold text-sm">{trade.symbol}</span>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${trade.side === 'LONG'
                                                    ? 'bg-primary/10 border-primary/20 text-primary'
                                                    : 'bg-pink/10 border-pink/20 text-pink'
                                                    }`}>
                                                    {trade.side}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground font-mono">
                                                {format(trade.timestamp, 'HH:mm:ss')} • {trade.size}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`font-mono font-bold ${(trade.pnl || 0) >= 0 ? 'text-primary' : 'text-pink'}`}>
                                        {(trade.pnl || 0) >= 0 ? '+' : ''}${(trade.pnl || 0).toFixed(2)}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </motion.div>
        </AnimatePresence>
    )
}
