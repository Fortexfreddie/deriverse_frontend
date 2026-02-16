'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Trade {
  id: string
  timestamp: string
  market: string
  side: 'LONG' | 'SHORT'
  price: string
  size: string
  fee: string
  type: 'PERP' | 'SPOT'
  signature: string
}

interface TradeDetailSidebarProps {
  trade: Trade | null
  isOpen: boolean
  onClose: () => void
}

export function TradeDetailSidebar({ trade, isOpen, onClose }: TradeDetailSidebarProps) {
  const [notes, setNotes] = useState('')
  const [emotion, setEmotion] = useState('')
  const [rating, setRating] = useState(3)
  const [hypotheticalPrice, setHypotheticalPrice] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (!trade) return null

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Call API to save trade notes
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Reset form
      setNotes('')
      setEmotion('')
      setRating(3)
      setHypotheticalPrice('')
      onClose()
    } catch (error) {
      console.error('Failed to save notes:', error)
    } finally {
      setIsSaving(false)
    }
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
        <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background flex-shrink-0 sticky top-0 z-10">
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
          <div className="space-y-2 border-b border-border-dark pb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[9px] text-muted-foreground uppercase mb-1">Market</div>
                <div className="text-sm font-bold text-foreground">{trade.market}</div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground uppercase mb-1">Side</div>
                <div
                  className={`text-sm font-bold ${
                    trade.side === 'LONG' ? 'text-pnl-gain' : 'text-accent-pink'
                  }`}
                >
                  {trade.side}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <div className="text-[9px] text-muted-foreground uppercase mb-1">Price</div>
                <div className="text-xs text-muted-foreground">{trade.price}</div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground uppercase mb-1">Size</div>
                <div className="text-xs text-muted-foreground">{trade.size}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <div>
                <div className="text-[9px] text-muted-foreground uppercase mb-1">Fee</div>
                <div className="text-xs text-muted-foreground">{trade.fee}</div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground uppercase mb-1">Type</div>
                <div className="text-xs text-muted-foreground">{trade.type}</div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground uppercase mb-1">Time</div>
                <div className="text-xs text-muted-foreground truncate">{trade.timestamp}</div>
              </div>
            </div>
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
              <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-foreground focus:border-pnl-gain focus:outline-none"
              >
                <option value="">Select emotion...</option>
                <option value="CALM">Calm</option>
                <option value="CONFIDENT">Confident</option>
                <option value="ANXIOUS">Anxious</option>
                <option value="FEARFUL">Fearful</option>
                <option value="GREEDY">Greedy</option>
                <option value="FOMO">FOMO</option>
              </select>
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
              disabled={isSaving}
              className="flex-1 px-4 py-2 rounded bg-pnl-gain text-black hover:bg-pnl-gain-dim transition text-xs font-bold uppercase disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
