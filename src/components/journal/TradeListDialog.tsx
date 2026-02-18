'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { BookOpen } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { HeatmapTrade } from './JournalHeatmap'
import type { JournalAnalysis } from '@/lib/api'
import { TradeDossier } from './TradeDossier'
import { AnalysisResult } from './AnalysisResult'

interface TradeListDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedDate: Date
    trades: HeatmapTrade[]
    isDemo: boolean
}

export function TradeListDialog({ open, onOpenChange, selectedDate, trades, isDemo }: TradeListDialogProps) {
    const [selectedTrade, setSelectedTrade] = useState<HeatmapTrade | null>(null)
    const [analysisResult, setAnalysisResult] = useState<JournalAnalysis | null>(null)

    const dailyPnl = trades.reduce((acc, t) => acc + (t.pnl || 0), 0)

    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            setSelectedTrade(null)
            setAnalysisResult(null)
        }
        onOpenChange(isOpen)
    }

    const handleAnalysisReceived = (result: JournalAnalysis) => {
        setAnalysisResult(result)
    }

    const handleAnalysisClose = () => {
        setAnalysisResult(null)
        setSelectedTrade(null)
    }

    // Determine what to show in the right panel
    const rightPanelContent = () => {
        if (analysisResult) {
            return <AnalysisResult analysis={analysisResult} onClose={handleAnalysisClose} />
        }

        if (selectedTrade) {
            return (
                <TradeDossier
                    trade={selectedTrade}
                    isDemo={isDemo}
                    onBack={() => setSelectedTrade(null)}
                    onAnalysisReceived={handleAnalysisReceived}
                />
            )
        }

        // Default: trade list
        return (
            <>
                <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-muted/5 shrink-0">
                    <div className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">
                        Recorded Trades ({trades.length})
                    </div>
                </div>
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-2">
                        {trades.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground opacity-50 font-mono text-xs">
                                No trades recorded for this day.
                            </div>
                        ) : (
                            trades.map(trade => (
                                <button
                                    key={trade.id}
                                    onClick={() => setSelectedTrade(trade)}
                                    className="w-full group border border-border bg-card hover:bg-muted/10 transition-colors p-4 rounded-sm flex items-center justify-between cursor-pointer hover:border-primary/50 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1 h-10 rounded-full ${(trade.pnl || 0) >= 0 ? 'bg-primary' : 'bg-pink'}`} />
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm">{trade.symbol}</span>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${trade.side === 'LONG'
                                                    ? 'bg-primary/10 border-primary/20 text-primary'
                                                    : 'bg-pink/10 border-pink/20 text-pink'
                                                    }`}>
                                                    {trade.side}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground font-mono">
                                                {format(trade.timestamp, 'HH:mm:ss')} • Size: {trade.size}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-mono font-bold ${(trade.pnl || 0) >= 0 ? 'text-primary' : 'text-pink'}`}>
                                            {(trade.pnl || 0) >= 0 ? '+' : ''}${(trade.pnl || 0).toFixed(2)}
                                        </div>
                                        <div className="text-[9px] text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">
                                            View Details &gt;
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </>
        )
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-border shadow-2xl rounded-sm">
                <div className="flex h-[85vh]">
                    {/* Left: Day Summary */}
                    <div className="w-72 md:w-80 bg-muted/10 border-r border-border p-6 md:p-8 flex flex-col shrink-0">
                        <DialogHeader className="space-y-1">
                            <DialogTitle className="text-2xl md:text-3xl font-black font-mono tracking-tighter flex items-center gap-3">
                                <span className="p-2 bg-primary/20 rounded-sm text-primary">
                                    <BookOpen size={20} />
                                </span>
                                {format(selectedDate, 'MMM dd')}
                            </DialogTitle>
                            <DialogDescription className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
                                {format(selectedDate, 'EEEE, yyyy')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-8 md:mt-12 space-y-6">
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-3">Daily PnL</div>
                                <div className={`text-3xl md:text-4xl font-mono font-black ${dailyPnl >= 0 ? 'text-primary' : 'text-pink'}`}>
                                    {dailyPnl >= 0 ? '+' : ''}${dailyPnl.toFixed(2)}
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-2">Trades</div>
                                <div className="text-2xl font-mono font-black">{trades.length}</div>
                            </div>

                            <p className="text-[10px] text-muted-foreground italic leading-relaxed opacity-60">
                                Select a trade on the right to add notes, emotion, and rating.
                            </p>
                        </div>
                    </div>

                    {/* Right: Dynamic Content */}
                    <div className="flex-1 bg-background flex flex-col min-h-0 relative">
                        {rightPanelContent()}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
