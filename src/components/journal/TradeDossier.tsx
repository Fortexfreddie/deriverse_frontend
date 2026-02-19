'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ArrowLeft, Save, Edit2 } from 'lucide-react'
import { useJournalSubmission } from '@/hooks/use-journal-submission'
import type { HeatmapTrade } from './JournalHeatmap'
import type { JournalAnalysis } from '@/lib/api'
import { ObjectViewer } from '@/components/ui/object-viewer'

interface TradeDossierProps {
    trade: HeatmapTrade
    isDemo: boolean
    onBack: () => void
    onAnalysisReceived: (result: JournalAnalysis) => void
}

const EMOTIONS = ['Fearful', 'Anxious', 'Neutral', 'Calm', 'Greedy'] as const

export function TradeDossier({ trade, isDemo, onBack, onAnalysisReceived }: TradeDossierProps) {
    // keep a mutable copy so we can merge patch responses
    const [tradeData, setTradeData] = useState<HeatmapTrade>(trade)

    const [formData, setFormData] = useState({
        notes: '',
        emotion: 'Neutral' as typeof EMOTIONS[number],
        rating: 0,
        hypotheticalExitPrice: 0,
    })

    // keep local tradeData in sync with prop
    useEffect(() => {
        // avoid synchronous setState inside effect
        setTimeout(() => setTradeData(trade))
        // populate the form based on incoming trade
        setTimeout(() => {
            setFormData({
                notes: trade.position?.notes || '',
                emotion: (trade.position?.emotion as typeof EMOTIONS[number]) || 'Neutral',
                rating: trade.position?.rating || 0,
                hypotheticalExitPrice: trade.position?.hypotheticalExitPrice || 0,
            })
        })
    }, [trade])

    const positionId = tradeData.positionId || tradeData.position?.id || tradeData.id
    const { mutate: submitJournal, isPending: isSubmitting } = useJournalSubmission(positionId, isDemo)

    const handleSave = () => {
        const payload = {
            notes: formData.notes,
            emotion: formData.emotion,
            rating: formData.rating,
            hypotheticalExitPrice: formData.hypotheticalExitPrice || undefined,
        }

        // Auto-pad notes in demo mode if too short for validation
        if (isDemo && payload.notes.length < 10) {
            payload.notes = 'Demo trade entry: ' + payload.notes
        }

        submitJournal(payload, {
            onSuccess: (response) => {
                // merge updated position data into local trade copy
                const updated = response.data || {}
                setTradeData(prev => ({
                    ...prev,
                    ...updated,
                    position: { ...prev.position, ...updated }
                }))
                onAnalysisReceived(response.analysis)
            },
        })
    }

    const pnl = trade.pnl || 0
    const isProfit = pnl >= 0

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-14 md:h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-muted/5 shrink-0">
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-black">
                        TRADE_DOSSIER // <span className="text-foreground">{trade.symbol}</span>
                    </h3>
                </div>
                <span className={`text-base md:text-lg font-mono font-black ${isProfit ? 'text-primary' : 'text-pink'}`}>
                    {isProfit ? '+' : ''}${pnl.toFixed(2)}
                </span>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
                    {/* Execution Log */}
                    <div className="bg-card border border-border p-5 md:p-6 relative overflow-hidden rounded-sm shadow-sm">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${isProfit ? 'bg-primary' : 'bg-pink'}`} />

                        <h4 className="text-xs font-bold text-foreground flex items-center gap-2 mb-5">
                            <Edit2 size={14} className="text-primary" /> EXECUTION_LOG
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground mb-1">Market</div>
                                <div className="text-sm font-mono font-bold">{tradeData.symbol}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground mb-1">Side</div>
                                <div className={`text-sm font-mono font-bold ${tradeData.side === 'LONG' ? 'text-primary' : 'text-pink'}`}>
                                    {tradeData.side}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground mb-1">Size</div>
                                <div className="text-sm font-mono font-bold">{tradeData.size}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground mb-1">Price</div>
                                <div className="text-sm font-mono font-bold">{tradeData.price ?? '—'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground mb-1">Fee</div>
                                <div className="text-sm font-mono font-bold">{tradeData.fee ?? '—'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground mb-1">Order type</div>
                                <div className="text-sm font-mono font-bold">{tradeData.orderType ?? '—'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-muted-foreground mb-1">Time</div>
                                <div className="text-sm font-mono font-bold">
                                    {format(new Date(tradeData.timestamp), 'MMM d yyyy HH:mm:ss')}
                                </div>
                            </div>
                        </div>

                        {/* additional details */}
                        {tradeData.rawData && (
                          <div className="mb-6">
                            <div className="text-[10px] text-muted-foreground uppercase mb-1">Raw data</div>
                            <ObjectViewer obj={tradeData.rawData} />
                          </div>
                        )}
                        {tradeData.metadata && (
                          <div className="mb-6">
                            <div className="text-[10px] text-muted-foreground uppercase mb-1">Metadata</div>
                            <ObjectViewer obj={tradeData.metadata} />
                          </div>
                        )}
                        {tradeData.position && (
                          <div className="mb-6">
                            <div className="text-[10px] text-muted-foreground uppercase mb-1">Position details</div>
                            <ObjectViewer obj={tradeData.position} />
                          </div>
                        )}

                        {/* Form Fields */}
                        <div className="space-y-5">
                            {/* Notes */}
                            <div>
                                <label className="text-[10px] uppercase text-muted-foreground block mb-2 font-bold">Notes</label>
                                <textarea
                                    className="w-full bg-background border border-border rounded-sm p-3 text-xs font-mono focus:ring-1 focus:ring-primary/30 focus:border-primary/50 outline-none min-h-25 md:min-h-30 transition-all resize-none"
                                    placeholder="What was your thesis? What did you learn?"
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                />
                            </div>

                            {/* Emotion */}
                            <div>
                                <label className="text-[10px] uppercase text-muted-foreground block mb-2 font-bold">Emotion</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {EMOTIONS.map(emotion => (
                                        <button
                                            key={emotion}
                                            onClick={() => setFormData(prev => ({ ...prev, emotion }))}
                                            className={`px-3 py-1.5 text-[9px] border rounded-sm transition-colors uppercase font-bold ${formData.emotion === emotion
                                                    ? 'bg-primary/20 border-primary text-primary'
                                                    : 'bg-muted/10 border-border text-muted-foreground hover:bg-muted/30'
                                                }`}
                                        >
                                            {emotion}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="text-[10px] uppercase text-muted-foreground block mb-2 font-bold">Rating</label>
                                <div className="flex gap-2 text-2xl">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                            className={`transition-transform ${star <= formData.rating ? 'text-yellow-500 scale-110' : 'text-muted-foreground/20'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Hypothetical Exit */}
                            <div>
                                <label className="text-[10px] uppercase text-muted-foreground block mb-2 font-bold">
                                    Hypothetical Exit Price <span className="text-muted-foreground/50">(optional)</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full max-w-50 bg-background border border-border rounded-sm p-3 text-xs font-mono focus:ring-1 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all"
                                    placeholder="0.00"
                                    value={formData.hypotheticalExitPrice || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hypotheticalExitPrice: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="w-full bg-primary text-black font-black text-xs py-4 flex items-center justify-center gap-2 rounded-sm active:scale-[0.98] transition-transform disabled:opacity-50 shadow-[0_4px_14px_rgba(var(--primary),0.3)]"
                    >
                        <Save size={16} />
                        {isSubmitting ? 'ANALYZING...' : 'COMMIT_EXECUTION_DATA'}
                    </button>
                </div>
            </div>
        </div>
    )
}
