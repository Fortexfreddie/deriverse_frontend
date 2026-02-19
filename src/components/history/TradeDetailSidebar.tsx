'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { TradeEvent, JournalAnalysis } from '@/lib/api'
import { parsePositionId } from '@/lib/utils'
import { useJournalSubmission } from '@/hooks/use-journal-submission'
import { AnalysisResult } from '@/components/journal/AnalysisResult'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { ObjectViewer } from '@/components/ui/object-viewer'
import { format } from 'date-fns'

interface TradeDetailSidebarProps {
  trade: TradeEvent | null
  isOpen: boolean
  onClose: () => void
}

export function TradeDetailSidebar({ trade, isOpen, onClose }: TradeDetailSidebarProps) {
  const { publicKey, connected } = useWallet();
  const wallet = publicKey?.toString();
  const isDemo = !connected || !wallet;

  const [notes, setNotes] = useState('')
  const [emotion, setEmotion] = useState<import('@/lib/api').JournalEntryUpdate['emotion'] | ''>('')
  const [rating, setRating] = useState(3)
  const [hypotheticalPrice, setHypotheticalPrice] = useState('')
  const [analysisResult, setAnalysisResult] = useState<JournalAnalysis | null>(null)

  // hook for submitting journal entries against a position id
  const { mutate: submitJournal, isPending: isSubmitting } = useJournalSubmission(
      trade?.positionId || '',
      isDemo
  )

  // populate form fields with incoming trade data
  useEffect(() => {
    if (!trade) return;
    // delay updates to avoid React warning about sync setState in effect
    setTimeout(() => {
      setNotes(trade.position?.notes || '')
      setEmotion((trade.position?.emotion as import('@/lib/api').JournalEntryUpdate['emotion']) || '')
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
    const payload: Partial<import('@/lib/api').JournalEntryUpdate> = {
      notes: notes || undefined,
      emotion: (emotion as import('@/lib/api').JournalEntryUpdate['emotion']) || undefined,
      rating: rating || undefined,
      hypotheticalExitPrice: hypotheticalPrice ? parseFloat(hypotheticalPrice) : undefined,
    }

    submitJournal(payload, {
      onSuccess: (response) => {
        setAnalysisResult(response.analysis)
      }
    })
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-card border-l border-border z-50 transform transition-transform duration-300 overflow-y-auto custom-scrollbar ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
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
        <div className="p-4 space-y-6">
          {/* Trade Info */}
          <div className="space-y-3 border-b border-border-dark pb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Market</div>
                <div className="text-sm font-bold text-foreground">{market}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Direction</div>
                <div
                  className={`text-sm font-bold ${
                    side === 'LONG' ? 'text-pnl-gain' : 'text-accent-pink'
                  }`}
                >
                  {side}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Price</div>
                <div className="text-sm font-mono text-foreground">{trade.price}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Size</div>
                <div className="text-sm font-mono text-foreground">{trade.size}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Fee</div>
                <div className="text-sm font-mono text-foreground">{trade.fee}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Type</div>
                <div className="text-sm text-foreground">{trade.tradeType}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Time</div>
                <div className="text-sm font-mono text-foreground truncate">
                  {format(new Date(trade.timestamp), 'MMM d, yyyy HH:mm:ss')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Order</div>
                <div className="text-sm text-foreground">{trade.orderType}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Entry / Exit</div>
                <div className="text-xs">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      trade.isEntry ? 'bg-pnl-gain/20 text-pnl-gain' : 'bg-accent-pink/20 text-accent-pink'
                    }`}
                  >
                    {trade.isEntry ? 'Entry' : 'Exit'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Trade ID</div>
                <div className="text-sm font-mono text-foreground break-all">{trade.id}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Signature</div>
                <div className="text-sm font-mono text-foreground break-all">{trade.signature}</div>
              </div>
            </div>

            {trade.position && (
              <div className="mt-3 space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Position Status</div>
                  <div className="text-sm text-foreground">{trade.position.status}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase mb-1">Avg Entry</div>
                    <div className="text-sm font-mono text-foreground">{trade.position.avgEntryPrice}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase mb-1">Total Size</div>
                    <div className="text-sm font-mono text-foreground">{trade.position.totalSize}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase mb-1">Realized PnL</div>
                    <div className="text-sm font-mono text-foreground">{trade.position.realizedPnl}</div>
                  </div>
                </div>
              </div>
            )}

            {(trade.rawData || trade.metadata) && (
              <details className="mt-4 text-xs">
                <summary className="cursor-pointer text-muted-foreground uppercase font-bold mb-2">Debug info</summary>
                {trade.rawData && (
                  <div className="mb-2">
                    <ObjectViewer obj={trade.rawData} />
                  </div>
                )}
                {trade.metadata && (
                  <div>
                    <ObjectViewer obj={trade.metadata} />
                  </div>
                )}
              </details>
            )}
          </div>

          {/* Trade Analysis Form */}
          <div className="space-y-4">
            {/* Notes */}
            <div>
              <label className="text-[9px] text-muted-foreground uppercase font-bold mb-2 block">Trade Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your trade entry reason, strategy, and observations..."
                className="w-full h-24 bg-background border border-border rounded px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:border-pnl-gain focus:outline-none resize-none"
              />
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
                    className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
                      rating === num
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
        </div>
      </div>
    </>
  )
}
