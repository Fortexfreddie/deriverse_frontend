'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { TradeEvent, JournalAnalysis } from '@/lib/api'
import { parsePositionId } from '@/lib/utils'
import { useJournalSubmission } from '@/hooks/use-journal-submission'
import { AnalysisResult } from '@/components/journal/AnalysisResult'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { ObjectViewer } from '@/components/ui/object-viewer'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface TradeDetailSidebarProps {
  trade: TradeEvent | null
  isOpen: boolean
  onClose: () => void
  onUpdated?: (response: { data: any; analysis: JournalAnalysis | null }) => void
}

export function TradeDetailSidebar({ trade, isOpen, onClose, onUpdated }: TradeDetailSidebarProps) {
  const { publicKey, connected } = useWallet();
  const wallet = publicKey?.toString();
  const isDemo = !connected || !wallet;

  const [notes, setNotes] = useState('')
  const [notesError, setNotesError] = useState<string | null>(null)
  const [emotion, setEmotion] = useState<import('@/lib/api').JournalEntryUpdate['emotion'] | ''>('')
  const [rating, setRating] = useState(3)
  const [hypotheticalPrice, setHypotheticalPrice] = useState('')
  const [analysisResult, setAnalysisResult] = useState<JournalAnalysis | null>(null)
  const [lastResponse, setLastResponse] = useState<{ data: any; analysis: JournalAnalysis | null } | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  // hook for submitting journal entries against a position id
  const submissionMutation = useJournalSubmission(
    trade?.positionId || '',
    isDemo
  )
  const submitJournal = submissionMutation.mutate
  const isSubmitting = submissionMutation.isPending

  // populate form fields with incoming trade data
  useEffect(() => {
    if (!trade) return;
    // clear stale submission results from a previously-selected trade
    setLastResponse(null)
    setAnalysisResult(null)
    // delay updates to avoid React warning about sync setState in effect
    setTimeout(() => {
      setNotes(trade.position?.notes || '')
      setEmotion(((trade.position?.emotion as string)?.toUpperCase() as import('@/lib/api').JournalEntryUpdate['emotion']) || '')
      setRating(trade.position?.rating ?? 3)
      setHypotheticalPrice(
        trade.position?.hypotheticalExitPrice !== undefined && trade.position?.hypotheticalExitPrice !== null
          ? String(trade.position.hypotheticalExitPrice)
          : ''
      )
    })
  }, [trade])

  if (!trade) return null

  // if we have an AI analysis to show, render it full‑screen over the sidebar
  if (analysisResult) {
    return (
      <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center">
        <AnalysisResult analysis={analysisResult} onClose={() => setAnalysisResult(null)} />
      </div>
    )
  }

  const { market, side } = trade.position
    ? { market: trade.position.market, side: trade.position.side }
    : parsePositionId(trade.positionId)


  const handleSave = () => {
    if (!trade) return;
    // Client-side validation: enforce note length when provided
    if (notes && notes.length > 0 && notes.length < 10) {
      toast.error('Your note must be at least 10 characters to generate an AI review.')
      return
    }

    // Map emotion values (UI uses upper-case codes) to schema expected casing
    const mapEmotion = (e: string | ''): import('@/lib/api').JournalEntryUpdate['emotion'] | undefined => {
      if (!e) return undefined
      const norm = e.toLowerCase()
      switch (norm) {
        case 'fearful':
        case 'fear':
          return 'Fearful'
        case 'greedy':
          return 'Greedy'
        case 'calm':
          return 'Calm'
        case 'anxious':
        case 'anxiety':
          return 'Anxious'
        case 'neutral':
          return 'Neutral'
        case 'confident':
          return 'Calm'
        case 'fomo':
          return 'Greedy'
        default:
          return undefined
      }
    }

    const payload: Partial<import('@/lib/api').JournalEntryUpdate> = {
      notes: notes || undefined,
      emotion: mapEmotion(emotion as string) || undefined,
      rating: rating || undefined,
      hypotheticalExitPrice: hypotheticalPrice ? parseFloat(hypotheticalPrice) : undefined,
    }

    submitJournal(payload, {
      onSuccess: (response) => {
        // store last response and bubble up to parent
        setLastResponse(response)
        if (typeof onUpdated === 'function') onUpdated(response)

        // show AI analysis modal when it contains meaningful opportunity data
        if (response.analysis && response.analysis.whatIfAnalysis && response.analysis.whatIfAnalysis.opportunityCost != null) {
          setAnalysisResult(response.analysis)
        }

        setNotesError(null)

        // auto-scroll to submission result
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    })
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-card border-l border-border z-50 transform transition-transform duration-300 overflow-y-auto custom-scrollbar ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background shrink-0 sticky top-0 z-10">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Trade Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5">
          {/* Hero: Market + Side + Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-black font-mono tracking-tight text-foreground">{market}</span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${side === 'LONG'
                  ? 'bg-pnl-gain/10 border-pnl-gain/30 text-pnl-gain'
                  : 'bg-accent-pink/10 border-accent-pink/30 text-accent-pink'
                  }`}
              >
                {side}
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${trade.isEntry ? 'bg-pnl-gain/15 text-pnl-gain' : 'bg-accent-pink/15 text-accent-pink'
                  }`}
              >
                {trade.isEntry ? 'Entry' : 'Exit'}
              </span>
            </div>
            {trade.position && (
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${trade.position.status === 'OPEN'
                ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10'
                : 'border-muted-foreground/30 text-muted-foreground bg-muted/20'
                }`}>
                {trade.position.status}
              </span>
            )}
          </div>

          {/* Timestamp row */}
          <div className="text-[11px] font-mono text-muted-foreground">
            {format(new Date(trade.timestamp), 'MMM d, yyyy · HH:mm:ss')}
            <span className="mx-1.5 opacity-40">•</span>
            <span className="uppercase">{trade.orderType}</span>
            <span className="mx-1.5 opacity-40">•</span>
            <span className={`uppercase ${trade.tradeType === 'PERP' ? 'text-blue-400' : 'text-muted-foreground'}`}>{trade.tradeType}</span>
          </div>

          {/* Fill Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/10 border border-border/50 rounded-sm p-3">
              <div className="text-[9px] uppercase text-muted-foreground tracking-wider mb-1">Price</div>
              <div className="text-sm font-mono font-bold text-foreground">${typeof trade.price === 'number' ? trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : trade.price}</div>
            </div>
            <div className="bg-muted/10 border border-border/50 rounded-sm p-3">
              <div className="text-[9px] uppercase text-muted-foreground tracking-wider mb-1">Size</div>
              <div className="text-sm font-mono font-bold text-foreground">{trade.size}</div>
            </div>
            <div className="bg-muted/10 border border-border/50 rounded-sm p-3">
              <div className="text-[9px] uppercase text-muted-foreground tracking-wider mb-1">Fee</div>
              <div className="text-sm font-mono font-bold text-foreground">${typeof trade.fee === 'number' ? trade.fee.toFixed(6) : trade.fee}</div>
            </div>
            <div className="bg-muted/10 border border-border/50 rounded-sm p-3">
              <div className="text-[9px] uppercase text-muted-foreground tracking-wider mb-1">Notional</div>
              <div className="text-sm font-mono font-bold text-foreground">${(trade.price * trade.size).toFixed(2)}</div>
            </div>
          </div>

          {/* Position Summary Card */}
          {trade.position && (
            <div className="bg-card border border-border rounded-sm relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${(trade.position.realizedPnl || 0) >= 0 ? 'bg-pnl-gain' : 'bg-accent-pink'
                }`} />
              <div className="p-4 pl-5">
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold mb-3">Position Summary</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Avg Entry</div>
                    <div className="text-sm font-mono font-bold">${typeof trade.position.avgEntryPrice === 'number' ? trade.position.avgEntryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : trade.position.avgEntryPrice ?? '—'}</div>
                  </div>
                  {trade.position.avgExitPrice && (
                    <div>
                      <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Avg Exit</div>
                      <div className="text-sm font-mono font-bold">${trade.position.avgExitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Total Size</div>
                    <div className="text-sm font-mono font-bold">{trade.position.totalSize}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Total Fees</div>
                    <div className="text-sm font-mono font-bold">${trade.position.totalFees?.toFixed(6) ?? '—'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Realized PnL</div>
                    <div className={`text-base font-mono font-black ${(trade.position.realizedPnl || 0) > 0 ? 'text-pnl-gain' : (trade.position.realizedPnl || 0) < 0 ? 'text-accent-pink' : 'text-foreground'
                      }`}>
                      {(trade.position.realizedPnl || 0) > 0 ? '+' : ''}{trade.position.realizedPnl != null ? `$${trade.position.realizedPnl.toFixed(6)}` : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Insights Card */}
          {trade.position && (trade.position.aiReview || trade.position.aiInsight) && (
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="bg-muted/20 px-4 py-2.5 border-b border-border flex items-center justify-between">
                <span className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">AI Analysis</span>
                {trade.position.aiScore != null && (
                  <span className="text-xs font-mono font-bold text-pnl-gain">{trade.position.aiScore}/10</span>
                )}
              </div>
              <div className="p-4 space-y-3">
                {trade.position.aiReview && (
                  <p className="text-xs text-foreground/90 leading-relaxed">{trade.position.aiReview}</p>
                )}
                {trade.position.aiBias && (
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase text-muted-foreground">Bias:</span>
                    <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">{trade.position.aiBias}</span>
                  </div>
                )}
                {trade.position.aiNextAction && (
                  <div className="text-[11px] text-muted-foreground/80 bg-muted/10 p-2.5 rounded border border-border/50 italic">
                    💡 {trade.position.aiNextAction}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Market Context Card */}
          {trade.position && (trade.position.marketSentiment || trade.position.macroContext) && (
            <div className="bg-card border border-border rounded-sm p-4 space-y-2.5">
              <div className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Market Context</div>
              {trade.position.marketSentiment && (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase text-muted-foreground">Sentiment:</span>
                  <span className="text-xs font-bold">{trade.position.marketSentiment}</span>
                </div>
              )}
              {trade.position.traderProfile && (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase text-muted-foreground">Profile:</span>
                  <span className="text-xs font-bold">{trade.position.traderProfile}</span>
                </div>
              )}
              {trade.position.macroContext && (
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{trade.position.macroContext}</p>
              )}
              {trade.position.lastNudge && (
                <div className="text-[11px] font-bold text-foreground/70 italic">"{trade.position.lastNudge}"</div>
              )}
            </div>
          )}

          {/* IDs & Debug */}
          <details className="text-xs group">
            <summary className="cursor-pointer text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5 py-1">
              <span className="transition-transform group-open:rotate-90">▸</span> Identifiers & Debug
            </summary>
            <div className="mt-3 space-y-3 pl-1">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Trade ID</div>
                  <div className="text-[11px] font-mono text-foreground/70 break-all select-all">{trade.id}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase text-muted-foreground mb-0.5">Signature</div>
                  <a
                    href={`https://solscan.io/tx/${trade.signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-primary/80 hover:text-primary break-all underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors"
                  >
                    {trade.signature} ↗
                  </a>
                </div>
              </div>
              {trade.rawData && (
                <div>
                  <div className="text-[9px] uppercase text-muted-foreground mb-1">Raw Data</div>
                  <ObjectViewer obj={trade.rawData} />
                </div>
              )}
              {trade.metadata && (
                <div>
                  <div className="text-[9px] uppercase text-muted-foreground mb-1">Metadata</div>
                  <ObjectViewer obj={trade.metadata} />
                </div>
              )}
            </div>
          </details>

          <div className="border-b border-border" />

          {/* Trade Analysis Form */}
          <div className="space-y-4">
            {/* Notes */}
            <div>
              <label className="text-[9px] text-muted-foreground uppercase font-bold mb-2 block">Trade Notes</label>
              <textarea
                value={notes}
                onChange={(e) => {
                  const v = e.target.value
                  setNotes(v)
                  if (v.length === 0 || v.length >= 10) setNotesError(null)
                  else setNotesError('Minimum 10 characters')
                }}
                placeholder="Enter your trade entry reason, strategy, and observations..."
                className="w-full h-24 bg-background border border-border rounded px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:border-pnl-gain focus:outline-none resize-none"
              />
              {notesError && <div className="text-xs text-pink mt-2 font-bold">{notesError}</div>}
            </div>

            {/* Emotion */}
            <div>
              <label className="text-[9px] text-muted-foreground uppercase font-bold mb-2 block">Emotion During Trade</label>
              <Select
                value={emotion}
                onValueChange={(v) => setEmotion(v as import('@/lib/api').JournalEntryUpdate['emotion'])}
              >
                <SelectTrigger className="w-full h-8 text-[10px] bg-background border-border font-bold">
                  <SelectValue placeholder="Select emotion..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border font-mono">
                  <SelectItem value="CALM" className="text-[10px]">Calm</SelectItem>
                  <SelectItem value="CONFIDENT" className="text-[10px]">Confident</SelectItem>
                  <SelectItem value="ANXIOUS" className="text-[10px]">Anxious</SelectItem>
                  <SelectItem value="FEARFUL" className="text-[10px]">Fearful</SelectItem>
                  <SelectItem value="GREEDY" className="text-[10px]">Greedy</SelectItem>
                  <SelectItem value="FOMO" className="text-[10px]">FOMO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[9px] text-muted-foreground uppercase font-bold">Trade Quality Rating</label>
                <span className="text-xs text-pnl-gain font-bold">{rating}/5</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${rating === num
                      ? 'bg-pnl-gain text-black'
                      : 'bg-border text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Hypothetical Exit Price */}
            <div>
              <label className="text-[9px] text-muted-foreground uppercase font-bold mb-2 block">Hypothetical Exit Price</label>
              <input
                type="number"
                value={hypotheticalPrice}
                onChange={(e) => setHypotheticalPrice(e.target.value)}
                placeholder="What should have been your target price?"
                className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:border-pnl-gain focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-border sticky bottom-0 bg-card pb-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || isDemo}
              className="flex-1 px-4 py-2 rounded bg-pnl-gain text-black hover:bg-pnl-gain-dim transition text-xs font-bold uppercase disabled:opacity-50"
              title={isDemo ? 'Connect wallet to save notes' : undefined}
            >
              {isSubmitting ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
          {/* Submission Result */}
          {lastResponse && (
            <div ref={resultRef} className="space-y-3 pt-2">
              <div className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Submission Result</div>

              {/* AI Analysis Card */}
              {(lastResponse.data?.aiReview || lastResponse.analysis?.aiAnalysis) && (
                <div className="bg-card border border-border rounded-sm overflow-hidden">
                  <div className="bg-muted/20 px-4 py-2 border-b border-border flex items-center justify-between">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-bold">AI Analysis</span>
                    <span className="text-xs font-mono font-bold text-pnl-gain">
                      {lastResponse.data?.aiScore ?? lastResponse.analysis?.aiAnalysis?.score ?? '—'}/10
                    </span>
                  </div>
                  <div className="p-3.5 space-y-2.5">
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
                      <div className="text-[11px] text-muted-foreground/80 bg-muted/10 p-2.5 rounded border border-border/50 italic">
                        💡 {lastResponse.data?.aiNextAction || lastResponse.analysis?.aiAnalysis?.next_action}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Trader Profile Card */}
              {lastResponse.analysis?.traderProfile && (
                <div className="bg-card border border-border rounded-sm overflow-hidden">
                  <div className="bg-muted/20 px-4 py-2 border-b border-border">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-bold">Trader Profile</span>
                  </div>
                  <div className="p-3.5">
                    <div className="text-sm font-bold text-foreground mb-2">
                      {lastResponse.analysis.traderProfile.profile}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {lastResponse.analysis.traderProfile.strength && (
                        <div>
                          <span className="text-muted-foreground text-[9px] uppercase">Strength: </span>
                          <span className="text-pnl-gain font-bold">{lastResponse.analysis.traderProfile.strength}</span>
                        </div>
                      )}
                      {lastResponse.analysis.traderProfile.weakness && (
                        <div>
                          <span className="text-muted-foreground text-[9px] uppercase">Weakness: </span>
                          <span className="text-accent-pink font-bold">{lastResponse.analysis.traderProfile.weakness}</span>
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
                      <div className="text-[11px] text-foreground/70 italic mt-2">"{lastResponse.analysis.traderProfile.nudge}"</div>
                    )}
                  </div>
                </div>
              )}

              {/* Market Context Card */}
              {lastResponse.analysis?.macroContext && (
                <div className="bg-card border border-border rounded-sm overflow-hidden">
                  <div className="bg-muted/20 px-4 py-2 border-b border-border flex items-center justify-between">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-bold">Market Context</span>
                    {lastResponse.analysis.macroContext.sentiment && (
                      <span className="text-[10px] font-bold">{lastResponse.analysis.macroContext.sentiment}</span>
                    )}
                  </div>
                  <div className="p-3.5 space-y-2">
                    {lastResponse.analysis.macroContext.macroContext && (
                      <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{lastResponse.analysis.macroContext.macroContext}</p>
                    )}
                    {lastResponse.analysis.macroContext.headlines && lastResponse.analysis.macroContext.headlines.length > 0 && (
                      <details className="text-[11px]">
                        <summary className="cursor-pointer text-muted-foreground text-[10px] uppercase font-bold">
                          Headlines ({lastResponse.analysis.macroContext.headlines.length})
                        </summary>
                        <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                          {lastResponse.analysis.macroContext.headlines.slice(0, 10).map((h: string, i: number) => (
                            <li key={i} className="text-[10px] text-muted-foreground/70 leading-snug pl-2 border-l border-border/50">
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
                <div className="bg-card border border-border rounded-sm p-3.5">
                  <div className="text-[10px] uppercase text-muted-foreground tracking-wider font-bold mb-1">What-If Analysis</div>
                  <div className={`text-sm font-mono font-bold ${(lastResponse.analysis.whatIfAnalysis.opportunityCost || 0) > 0 ? 'text-pnl-gain' : 'text-accent-pink'}`}>
                    Opportunity Cost: {(lastResponse.analysis.whatIfAnalysis.opportunityCost || 0) > 0 ? '+' : ''}${lastResponse.analysis.whatIfAnalysis.opportunityCost?.toFixed(2)}
                  </div>
                  {lastResponse.analysis.whatIfAnalysis.opportunityCostNote && (
                    <p className="text-[11px] text-muted-foreground/80 mt-1">{lastResponse.analysis.whatIfAnalysis.opportunityCostNote}</p>
                  )}
                </div>
              )}


            </div>
          )}
        </div>
      </div>
    </>
  )
}
