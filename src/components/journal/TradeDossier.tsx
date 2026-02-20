'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ArrowLeft, Save, Edit2 } from 'lucide-react'
import { useJournalSubmission } from '@/hooks/use-journal-submission'
import type { HeatmapTrade } from './JournalHeatmap'
import type { JournalAnalysis, JournalEntryUpdate } from '@/lib/api'
import { ObjectViewer } from '@/components/ui/object-viewer'
import { toast } from 'sonner'

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
    const [notesError, setNotesError] = useState<string | null>(null)
    const [lastResponse, setLastResponse] = useState<any | null>(null)

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
    const submissionMutation = useJournalSubmission(positionId, isDemo)
    const submitJournal = submissionMutation.mutate
    const isSubmitting = submissionMutation.isPending

    const handleSave = () => {
        // client-side notes validation
        if (formData.notes && formData.notes.length > 0 && formData.notes.length < 10) {
            setNotesError('Minimum 10 characters')
            toast.error('Note too short')
            return
        }

        // build a partial payload; don't send empty strings or zero values
        const payload: Partial<JournalEntryUpdate> = {
            notes: formData.notes || undefined,
            emotion: formData.emotion || undefined,
            rating: formData.rating || undefined,
            hypotheticalExitPrice: formData.hypotheticalExitPrice || undefined,
        }

        // Auto-pad notes in demo mode if too short for validation
        if (isDemo && payload.notes && payload.notes.length < 10) {
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
                // always surface analysis to parent (parent can decide how to render)
                onAnalysisReceived(response.analysis)
                // store last response for inline display
                setLastResponse(response)
                setNotesError(null)
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
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm md:text-base font-black font-mono tracking-tight text-foreground">
                            {tradeData.symbol || tradeData.position?.market || '—'}
                        </h3>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${tradeData.side === 'LONG'
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-pink/10 border-pink/30 text-pink'
                            }`}>
                            {tradeData.side}
                        </span>
                        {tradeData.position?.status && (
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${tradeData.position.status === 'OPEN'
                                ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10'
                                : 'border-muted-foreground/30 text-muted-foreground bg-muted/20'
                                }`}>
                                {tradeData.position.status}
                            </span>
                        )}
                    </div>
                </div>
                <span className={`text-base md:text-lg font-mono font-black ${isProfit ? 'text-primary' : 'text-pink'}`}>
                    {isProfit ? '+' : ''}${pnl.toFixed(2)}
                </span>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-5 md:space-y-6">
                    {/* Position Overview Card */}
                    {tradeData.position && (
                        <div className="bg-card border border-border rounded-sm relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${isProfit ? 'bg-primary' : 'bg-pink'}`} />
                            <div className="p-5 md:p-6 pl-6 md:pl-7">
                                <div className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold mb-4">Position Summary</div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                                    <div>
                                        <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Avg Entry</div>
                                        <div className="text-sm font-mono font-bold">${typeof tradeData.position.avgEntryPrice === 'number' ? tradeData.position.avgEntryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : tradeData.position.avgEntryPrice ?? '—'}</div>
                                    </div>
                                    {tradeData.position.avgExitPrice && (
                                        <div>
                                            <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Avg Exit</div>
                                            <div className="text-sm font-mono font-bold">${tradeData.position.avgExitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Total Size</div>
                                        <div className="text-sm font-mono font-bold">{tradeData.position.totalSize ?? tradeData.size}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Total Fees</div>
                                        <div className="text-sm font-mono font-bold">${tradeData.position.totalFees?.toFixed(6) ?? '—'}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Realized PnL</div>
                                        <div className={`text-lg font-mono font-black ${(tradeData.position.realizedPnl || 0) > 0 ? 'text-primary' : (tradeData.position.realizedPnl || 0) < 0 ? 'text-pink' : 'text-foreground'
                                            }`}>
                                            {(tradeData.position.realizedPnl || 0) > 0 ? '+' : ''}{tradeData.position.realizedPnl != null ? `$${tradeData.position.realizedPnl.toFixed(6)}` : '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fills Table */}
                    {tradeData.position?.fills && tradeData.position.fills.length > 0 && (
                        <div className="bg-card border border-border rounded-sm overflow-hidden">
                            <div className="bg-muted/20 px-4 md:px-5 py-2.5 border-b border-border">
                                <span className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">
                                    Fills ({tradeData.position.fills.length})
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-border/50 text-[9px] uppercase text-muted-foreground tracking-wider">
                                            <th className="text-left px-4 py-2.5 font-bold">Time</th>
                                            <th className="text-right px-4 py-2.5 font-bold">Price</th>
                                            <th className="text-right px-4 py-2.5 font-bold">Size</th>
                                            <th className="text-right px-4 py-2.5 font-bold">Fee</th>
                                            <th className="text-center px-4 py-2.5 font-bold">Type</th>
                                            <th className="text-center px-4 py-2.5 font-bold">Side</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tradeData.position.fills.map((fill: any, i: number) => (
                                            <tr key={fill.id || i} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                                                <td className="px-4 py-2.5 font-mono text-muted-foreground">
                                                    {format(new Date(fill.timestamp), 'MMM d HH:mm:ss')}
                                                </td>
                                                <td className="px-4 py-2.5 font-mono font-bold text-right">
                                                    ${typeof fill.price === 'number' ? fill.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : fill.price}
                                                </td>
                                                <td className="px-4 py-2.5 font-mono font-bold text-right">{fill.size}</td>
                                                <td className="px-4 py-2.5 font-mono text-muted-foreground text-right">${fill.fee?.toFixed(6) ?? '—'}</td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <span className={`text-[9px] font-bold uppercase ${fill.tradeType === 'PERP' ? 'text-blue-400' : 'text-muted-foreground'}`}>
                                                        {fill.tradeType || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${fill.isEntry ? 'bg-primary/10 text-primary' : 'bg-pink/10 text-pink'
                                                        }`}>
                                                        {fill.isEntry ? 'Entry' : 'Exit'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Single Fill Metrics (when no fills array, treat as individual trade) */}
                    {(!tradeData.position?.fills || tradeData.position.fills.length === 0) && (
                        <div className="bg-card border border-border rounded-sm p-5 md:p-6 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${isProfit ? 'bg-primary' : 'bg-pink'}`} />
                            <h4 className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold mb-4 flex items-center gap-2">
                                <Edit2 size={12} className="text-primary" /> Execution Details
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                <div>
                                    <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Price</div>
                                    <div className="text-sm font-mono font-bold">${tradeData.price ?? '—'}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Size</div>
                                    <div className="text-sm font-mono font-bold">{tradeData.size}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Fee</div>
                                    <div className="text-sm font-mono font-bold">${tradeData.fee ?? '—'}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Order Type</div>
                                    <div className="text-sm font-mono font-bold">{tradeData.orderType ?? '—'}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Time</div>
                                    <div className="text-sm font-mono font-bold">
                                        {format(new Date(tradeData.timestamp), 'MMM d yyyy HH:mm:ss')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Insights Card */}
                    {tradeData.position && (tradeData.position.aiReview || tradeData.position.aiInsight) && (
                        <div className="bg-card border border-border rounded-sm overflow-hidden">
                            <div className="bg-muted/20 px-4 md:px-5 py-2.5 border-b border-border flex items-center justify-between">
                                <span className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">AI Analysis</span>
                                {tradeData.position.aiScore != null && (
                                    <span className="text-xs font-mono font-bold text-primary">{tradeData.position.aiScore}/10</span>
                                )}
                            </div>
                            <div className="p-4 md:p-5 space-y-3">
                                {tradeData.position.aiReview && (
                                    <p className="text-xs text-foreground/90 leading-relaxed">{tradeData.position.aiReview}</p>
                                )}
                                {tradeData.position.aiBias && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] uppercase text-muted-foreground">Bias:</span>
                                        <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">{tradeData.position.aiBias}</span>
                                    </div>
                                )}
                                {tradeData.position.aiNextAction && (
                                    <div className="text-[11px] text-muted-foreground/80 bg-muted/10 p-3 rounded border border-border/50 italic">
                                        💡 {tradeData.position.aiNextAction}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Market Context Card */}
                    {tradeData.position && (tradeData.position.marketSentiment || tradeData.position.macroContext) && (
                        <div className="bg-card border border-border rounded-sm p-4 md:p-5 space-y-2.5">
                            <div className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Market Context</div>
                            <div className="flex flex-wrap items-center gap-3">
                                {tradeData.position.marketSentiment && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] uppercase text-muted-foreground">Sentiment:</span>
                                        <span className="text-xs font-bold">{tradeData.position.marketSentiment}</span>
                                    </div>
                                )}
                                {tradeData.position.traderProfile && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] uppercase text-muted-foreground">Profile:</span>
                                        <span className="text-xs font-bold">{tradeData.position.traderProfile}</span>
                                    </div>
                                )}
                            </div>
                            {tradeData.position.macroContext && (
                                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{tradeData.position.macroContext}</p>
                            )}
                            {tradeData.position.lastNudge && (
                                <div className="text-[11px] font-bold text-foreground/70 italic">"{tradeData.position.lastNudge}"</div>
                            )}
                        </div>
                    )}

                    {/* Journal Form Card */}
                    <div className="bg-card border border-border p-5 md:p-6 rounded-sm">
                        <h4 className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold mb-5 flex items-center gap-2">
                            <Edit2 size={12} className="text-primary" /> Journal Entry
                        </h4>

                        <div className="space-y-5">
                            {/* Notes */}
                            <div>
                                <label className="text-[10px] uppercase text-muted-foreground block mb-2 font-bold">Notes</label>
                                <textarea
                                    className="w-full bg-background border border-border rounded-sm p-3 text-xs font-mono focus:ring-1 focus:ring-primary/30 focus:border-primary/50 outline-none min-h-25 md:min-h-30 transition-all resize-none"
                                    placeholder="What was your thesis? What did you learn?"
                                    value={formData.notes}
                                    onChange={(e) => {
                                        const v = e.target.value
                                        setFormData(prev => ({ ...prev, notes: v }))
                                        if (v.length === 0 || v.length >= 10) setNotesError(null)
                                        else setNotesError('Minimum 10 characters')
                                    }}
                                />
                                {notesError && <div className="text-xs text-pink mt-2 font-bold">{notesError}</div>}
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

                    {/* Collapsible Debug */}
                    <details className="text-xs group">
                        <summary className="cursor-pointer text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5 py-1">
                            <span className="transition-transform group-open:rotate-90">▸</span> Debug Info
                        </summary>
                        <div className="mt-3 space-y-3 pl-1">
                            {tradeData.rawData && (
                                <div>
                                    <div className="text-[9px] uppercase text-muted-foreground mb-1">Raw Data</div>
                                    <ObjectViewer obj={tradeData.rawData} />
                                </div>
                            )}
                            {tradeData.metadata && (
                                <div>
                                    <div className="text-[9px] uppercase text-muted-foreground mb-1">Metadata</div>
                                    <ObjectViewer obj={tradeData.metadata} />
                                </div>
                            )}
                        </div>
                    </details>

                    {/* Submission Result */}
                    {lastResponse && (
                        <div className="space-y-3">
                            <div className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Submission Result</div>

                            {/* AI Analysis Card */}
                            {(lastResponse.data?.aiReview || lastResponse.analysis?.aiAnalysis) && (
                                <div className="bg-card border border-border rounded-sm overflow-hidden">
                                    <div className="bg-muted/20 px-4 md:px-5 py-2.5 border-b border-border flex items-center justify-between">
                                        <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-bold">AI Analysis</span>
                                        <span className="text-xs font-mono font-bold text-primary">
                                            {lastResponse.data?.aiScore ?? lastResponse.analysis?.aiAnalysis?.score ?? '—'}/10
                                        </span>
                                    </div>
                                    <div className="p-4 md:p-5 space-y-2.5">
                                        {(lastResponse.data?.aiReview || lastResponse.analysis?.aiAnalysis?.insight) && (
                                            <p className="text-xs text-foreground/90 leading-relaxed">
                                                {lastResponse.data?.aiReview || lastResponse.analysis?.aiAnalysis?.insight}
                                            </p>
                                        )}
                                        {(lastResponse.data?.aiBias || lastResponse.analysis?.aiAnalysis?.bias) && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] uppercase text-muted-foreground">Bias:</span>
                                                <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">
                                                    {lastResponse.data?.aiBias || lastResponse.analysis?.aiAnalysis?.bias}
                                                </span>
                                            </div>
                                        )}
                                        {(lastResponse.data?.aiNextAction || lastResponse.analysis?.aiAnalysis?.next_action) && (
                                            <div className="text-[11px] text-muted-foreground/80 bg-muted/10 p-3 rounded border border-border/50 italic">
                                                💡 {lastResponse.data?.aiNextAction || lastResponse.analysis?.aiAnalysis?.next_action}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Trader Profile Card */}
                            {lastResponse.analysis?.traderProfile && (
                                <div className="bg-card border border-border rounded-sm overflow-hidden">
                                    <div className="bg-muted/20 px-4 md:px-5 py-2.5 border-b border-border">
                                        <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-bold">Trader Profile</span>
                                    </div>
                                    <div className="p-4 md:p-5">
                                        <div className="text-sm font-bold text-foreground mb-2.5">
                                            {lastResponse.analysis.traderProfile.profile}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                                            {lastResponse.analysis.traderProfile.strength && (
                                                <div>
                                                    <span className="text-muted-foreground text-[9px] uppercase">Strength: </span>
                                                    <span className="text-primary font-bold">{lastResponse.analysis.traderProfile.strength}</span>
                                                </div>
                                            )}
                                            {lastResponse.analysis.traderProfile.weakness && (
                                                <div>
                                                    <span className="text-muted-foreground text-[9px] uppercase">Weakness: </span>
                                                    <span className="text-pink font-bold">{lastResponse.analysis.traderProfile.weakness}</span>
                                                </div>
                                            )}
                                            {lastResponse.analysis.traderProfile.winRate != null && (
                                                <div>
                                                    <span className="text-muted-foreground text-[9px] uppercase">Win Rate: </span>
                                                    <span className="font-mono font-bold">{(lastResponse.analysis.traderProfile.winRate * 100).toFixed(0)}%</span>
                                                </div>
                                            )}
                                            {lastResponse.analysis.traderProfile.avgHoldTime != null && lastResponse.analysis.traderProfile.avgHoldTime > 0 && (
                                                <div>
                                                    <span className="text-muted-foreground text-[9px] uppercase">Avg Hold: </span>
                                                    <span className="font-mono font-bold">{lastResponse.analysis.traderProfile.avgHoldTime}h</span>
                                                </div>
                                            )}
                                        </div>
                                        {lastResponse.analysis.traderProfile.nudge && (
                                            <div className="text-[11px] text-foreground/70 italic mt-2.5">"{lastResponse.analysis.traderProfile.nudge}"</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Market Context Card */}
                            {lastResponse.analysis?.macroContext && (
                                <div className="bg-card border border-border rounded-sm overflow-hidden">
                                    <div className="bg-muted/20 px-4 md:px-5 py-2.5 border-b border-border flex items-center justify-between">
                                        <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-bold">Market Context</span>
                                        {lastResponse.analysis.macroContext.sentiment && (
                                            <span className="text-[10px] font-bold">{lastResponse.analysis.macroContext.sentiment}</span>
                                        )}
                                    </div>
                                    <div className="p-4 md:p-5 space-y-2.5">
                                        {lastResponse.analysis.macroContext.macroContext && (
                                            <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{lastResponse.analysis.macroContext.macroContext}</p>
                                        )}
                                        {lastResponse.analysis.macroContext.headlines && lastResponse.analysis.macroContext.headlines.length > 0 && (
                                            <details className="text-[11px]">
                                                <summary className="cursor-pointer text-muted-foreground text-[10px] uppercase font-bold">
                                                    Headlines ({lastResponse.analysis.macroContext.headlines.length})
                                                </summary>
                                                <ul className="mt-2 space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                                                    {lastResponse.analysis.macroContext.headlines.slice(0, 10).map((h: string, i: number) => (
                                                        <li key={i} className="text-[10px] text-muted-foreground/70 leading-snug pl-2.5 border-l-2 border-border/50">
                                                            {h}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* What-If Analysis */}
                            {lastResponse.analysis?.whatIfAnalysis?.opportunityCost != null && (
                                <div className="bg-card border border-border rounded-sm p-4 md:p-5">
                                    <div className="text-[10px] uppercase text-muted-foreground tracking-wider font-bold mb-1.5">What-If Analysis</div>
                                    <div className={`text-base font-mono font-bold ${(lastResponse.analysis.whatIfAnalysis.opportunityCost || 0) > 0 ? 'text-primary' : 'text-pink'}`}>
                                        Opportunity Cost: {(lastResponse.analysis.whatIfAnalysis.opportunityCost || 0) > 0 ? '+' : ''}${lastResponse.analysis.whatIfAnalysis.opportunityCost?.toFixed(2)}
                                    </div>
                                    {lastResponse.analysis.whatIfAnalysis.opportunityCostNote && (
                                        <p className="text-[11px] text-muted-foreground/80 mt-1.5">{lastResponse.analysis.whatIfAnalysis.opportunityCostNote}</p>
                                    )}
                                </div>
                            )}



                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 pb-4">
                        <button
                            onClick={onBack}
                            className="flex-1 px-4 py-3 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition text-xs font-bold uppercase"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 rounded bg-primary text-black hover:bg-primary/90 transition text-xs font-bold uppercase disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Notes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
