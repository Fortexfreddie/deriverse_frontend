'use client'

import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PageLoader } from '@/components/PageLoader'
import { Brain, Edit2, Plus, X, ArrowRight, Save, ArrowLeft, FileText, BookOpen } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog' 
import { ScrollArea } from '@/components/ui/scroll-area'

// --- Mock Data Extension ---
interface JournalEntry {
    notes: string
    emotion: 'Fearful' | 'Greedy' | 'Calm' | 'Anxious' | 'Neutral'
    rating: number
    hypotheticalExitPrice?: number
    aiBias?: string
    aiScore?: number
}

interface Trade {
  id: string
  symbol: string
  side: 'LONG' | 'SHORT'
  size: number
  pnl: number
  timestamp: Date
  journal?: JournalEntry
}

const MOCK_JOURNAL_DATA: Record<string, Trade[]> = {
  '2026-02-02': [
    { id: '1', symbol: 'SOL-PERP', side: 'LONG', size: 150, pnl: 420.50, timestamp: new Date('2026-02-02T14:30:00'), journal: { notes: "Good entry on support bounce.", emotion: "Calm", rating: 5, aiScore: 92, aiBias: "Balanced" } },
    { id: '2', symbol: 'BTC-PERP', side: 'SHORT', size: 0.5, pnl: -120.00, timestamp: new Date('2026-02-02T16:15:00'), journal: { notes: "Forced the short.", emotion: "Greedy", rating: 2, aiScore: 45, aiBias: "Overconfidence" } },
  ],
  '2026-02-05': [
    { id: '3', symbol: 'ETH-PERP', side: 'LONG', size: 10, pnl: 850.00, timestamp: new Date('2026-02-05T09:00:00'), journal: { notes: "Followed the plan perfectly.", emotion: "Calm", rating: 5, aiScore: 98, aiBias: "Disciplined" } },
  ],
  '2026-02-09': [
    { id: '4', symbol: 'SOL-PERP', side: 'SHORT', size: 200, pnl: 150.00, timestamp: new Date('2026-02-09T11:20:00') },
    { id: '5', symbol: 'JUP-PERP', side: 'LONG', size: 5000, pnl: -50.20, timestamp: new Date('2026-02-09T13:45:00'), journal: { notes: "Should have waited for retest.", emotion: "Anxious", rating: 3, aiScore: 60, aiBias: "Impatience" } },
    { id: '6', symbol: 'SOL-PERP', side: 'LONG', size: 100, pnl: 45.00, timestamp: new Date('2026-02-09T15:00:00') },
  ],
  '2026-02-14': [
     { id: '7', symbol: 'BTC-PERP', side: 'LONG', size: 2.5, pnl: 1200.00, timestamp: new Date('2026-02-14T10:00:00'), journal: { notes: "Valentine's Day pump!", emotion: "Greedy", rating: 4, aiScore: 80, aiBias: "Euphoria" } },
  ]
}

export default function JournalPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 1)) // Start Feb 2026
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 1, 15))
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  // Calendar Logic
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(start)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])
  
  const startDay = getDay(days[0]) // 0 is Sunday
  const emptyDays = startDay === 0 ? 6 : startDay - 1

  // Selected Data
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const selectedTrades = MOCK_JOURNAL_DATA[selectedDateStr] || []
  const dailyPnl = selectedTrades.reduce((acc, t) => acc + t.pnl, 0)


  if (isLoading) {
    return <PageLoader />
  }

  return (
    <DashboardLayout title="JOURNAL // ANALYSIS">
      
      {/* Mobile Structure (Interactive Dossier Hub) */}
      <div className="flex flex-col md:hidden min-h-0 h-full overflow-hidden bg-background font-mono relative">
        
        {/* Mobile View State Switcher */}
        {selectedTrade ? (
            /* MOBILE: TRADES DOSSIER VIEW (Full Screen Overlay) */
            <div className="absolute inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/5">
                    <button onClick={() => setSelectedTrade(null)} className="p-1 hover:bg-muted rounded-full">
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground">TRADE DOSSIER</h3>
                        <div className="font-bold text-sm">{selectedTrade.symbol}</div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                     <div className="space-y-6">
                          {/* Execution Log */}
                          <div className="bg-card border border-border p-4 relative overflow-hidden rounded-sm">
                              <div className={`absolute top-0 left-0 w-1 h-full ${selectedTrade.pnl >= 0 ? 'bg-primary' : 'bg-pink'}`}></div>
                              <h4 className="text-xs font-bold text-foreground flex items-center gap-2 mb-4">
                                  <Edit2 size={14} className="text-primary" /> EXECUTION_LOG
                              </h4>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                      <div className="text-[9px] uppercase text-muted-foreground mb-1">Entry</div>
                                      <div className="text-sm font-mono">140.00</div>
                                  </div>
                                  <div>
                                      <div className="text-[9px] uppercase text-muted-foreground mb-1">Exit</div>
                                      <div className="text-sm font-mono">142.10</div>
                                  </div>
                                  <div>
                                      <div className="text-[9px] uppercase text-muted-foreground mb-1">PnL</div>
                                      <div className={`text-sm font-mono font-bold ${selectedTrade.pnl >= 0 ? 'text-primary' : 'text-pink'}`}>
                                          {selectedTrade.pnl >= 0 ? '+' : ''}${selectedTrade.pnl}
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="space-y-3">
                                  <div>
                                      <label className="text-[10px] uppercase text-muted-foreground block mb-1.5">Notes</label>
                                      <textarea 
                                          className="w-full bg-background border border-border rounded p-2 text-xs font-mono focus:outline-none focus:border-primary/50 min-h-[80px]"
                                          placeholder="Trade thoughts..."
                                          defaultValue={selectedTrade.journal?.notes || ''}
                                      />
                                  </div>
                                  <div>
                                      <label className="text-[10px] uppercase text-muted-foreground block mb-1.5">Rating</label>
                                      <div className="flex gap-1 text-yellow-500">★★★★☆</div>
                                  </div>
                              </div>
                          </div>

                          <button className="w-full bg-primary text-black font-bold text-xs py-3 flex items-center justify-center gap-2 rounded-sm">
                              <Save size={14} /> SAVE_ENTRY
                          </button>
                     </div>
                </div>
            </div>
        ) : selectedDate && selectedTrades.length > 0 ? (
            /* MOBILE: DAILY TRADES LIST (Overlay or Section) */
             <div className="flex flex-col h-full animate-in slide-in-from-bottom duration-300 bg-background z-40 relative">
                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/5">
                    <button onClick={() => setSelectedDate(new Date()) /* Reset or Close logic could be better, currently just resets to today or needs a 'close' state */} className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest"
                       // For now, clicking generic "Back" area in header or add a specific X button
                    >
                       <ArrowLeft size={14} /> Back to Hub
                    </button>
                    <div className="text-sm font-bold font-mono">{format(selectedDate, 'MMM dd')}</div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                     <div className="mb-4">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Daily Reflection</div>
                        <textarea 
                            className="w-full bg-card border border-border rounded p-3 text-xs font-mono focus:outline-none min-h-[60px]"
                            placeholder="How was the session?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                     </div>
                     
                     <div className="space-y-2">


                      <div className="space-y-2">
                        {selectedTrades.map(trade => (
                            <div key={trade.id} onClick={() => setSelectedTrade(trade)} className="bg-card border border-border p-3 rounded-sm flex flex-col gap-2 active:bg-muted/10 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1 h-8 rounded-full ${trade.pnl >= 0 ? 'bg-primary' : 'bg-pink'}`}></div>
                                        <div>
                                            <div className="font-bold text-sm flex items-center gap-2">
                                                {trade.symbol}
                                                <span className={`text-[9px] px-1 py-0.5 rounded border ${
                                                    trade.side === 'LONG' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-pink/10 border-pink/20 text-pink'
                                                }`}>{trade.side}</span>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                                {format(trade.timestamp, 'HH:mm:ss')} • {trade.size}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-mono font-bold ${trade.pnl >= 0 ? 'text-primary' : 'text-pink'}`}>
                                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">Entry: 140.0</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                     </div>
                </div>
                
                {/* Minimized Heatmap Access to switch days */}
                <div className="border-t border-border bg-background">
                     <div className="flex overflow-x-auto gap-2 p-3 scrollbar-hide snap-x items-center">
                        {eachDayOfInterval({ start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) }).map(day => (
                            <button 
                                key={day.toISOString()}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "min-w-[36px] h-10 flex flex-col items-center justify-center text-[10px] font-mono border rounded-sm snap-center transition-all",
                                    isSameDay(day, selectedDate) 
                                        ? "bg-primary text-black border-primary font-bold shadow-[0_0_10px_rgba(var(--primary),0.3)] scale-105" 
                                        : "bg-card border-border text-muted-foreground hover:bg-muted/10 hover:border-primary/30"
                                )}
                            >
                                <span className="text-[8px] opacity-60 leading-none">{format(day, 'E')}</span>
                                <span className="text-sm leading-none">{format(day, 'd')}</span>
                            </button>
                        ))}
                     </div>
                </div>
             </div>
        ) : (
             /* MOBILE: MAIN HUB (Default View) */
             <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                {/* Position Context */}
                <section className="border-b border-border p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white/10 border border-white/20 text-xs font-bold text-foreground">SOL-USDC</span>
                            <span className="text-[10px] text-muted-foreground">PERPETUAL</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">AI_SCORE</span>
                            <div className="flex gap-0.5">
                                <div className="w-1.5 h-3 bg-primary"></div>
                                <div className="w-1.5 h-3 bg-primary"></div>
                                <div className="w-1.5 h-3 bg-primary"></div>
                                <div className="w-1.5 h-3 bg-card border border-border"></div>
                                <div className="w-1.5 h-3 bg-card border border-border"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Dossier Card */}
                    <div className="bg-card border border-border p-4 relative group mb-2">
                        <div className="absolute top-0 left-0 w-1 h-full bg-accent-pink"></div>
                        <div className="flex justify-between mb-3 items-start">
                            <h2 className="text-xs font-bold text-foreground flex items-center gap-1">
                                <FileText className="text-primary" size={14} />
                                POSITION_DOSSIER
                            </h2>
                            <span className="text-[9px] uppercase text-accent-pink tracking-widest border border-accent-pink/30 px-1.5 py-0.5 bg-accent-pink/10">ANXIOUS</span>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed font-mono">
                            I entered this SOL trade because the 4H support looked strong at 138.5. FOMO kicked in when it reclaimed 140.
                        </p>
                    </div>
                </section>

                {/* Coach Intel */}
                <section className="border-b border-border bg-card">
                    <div className="h-8 border-b border-border flex items-center px-4 bg-background justify-between">
                        <span className="text-[10px] uppercase text-primary tracking-widest font-bold">COACH_INTEL // TERMINAL</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    </div>
                    <div className="p-4 bg-black/40">
                        <div className="font-mono text-xs text-primary leading-5">
                            &gt; DETECTED PATTERN: FOMO_ENTRY<br/>
                            &gt; BIAS: <span className="bg-primary text-black font-bold px-1">DENIAL</span><br/>
                            &gt; INSIGHT: Misrepresenting trade status.
                        </div>
                    </div>
                </section>

                 {/* Calendar Heatmap Section (Touch Interactive) */}
                 <div className="p-4 border-t border-border bg-card/50">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Performance Heatmap <span className="text-primary font-bold ml-2">FEB 2026</span></h2>
                    </div>
                    
                    {/* Heatmap Grid */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                        <div key={day} className="text-[8px] sm:text-[10px] text-center text-muted-foreground mb-1">{day}</div>
                      ))}
                      {eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }).map((date, i) => {
                        // Data Sync
                        const dateStr = format(date, 'yyyy-MM-dd')
                        const trades = MOCK_JOURNAL_DATA[dateStr] || []
                        const dailyPnl = trades.reduce((acc, t) => acc + t.pnl, 0)
                        
                        const isGreen = dailyPnl > 0
                        const isRed = dailyPnl < 0
                        const isSelected = isSameDay(date, selectedDate)
                         
                        let bgClass = 'bg-muted/20'
                        if (isGreen) bgClass = 'bg-primary/20 border-primary/40 text-primary'
                        if (isRed) bgClass = 'bg-pink/20 border-pink/40 text-pink'
                        if (isSelected) bgClass += ' ring-1 ring-foreground bg-accent'

                        return (
                          <div 
                            key={date.toISOString()} 
                            onClick={() => setSelectedDate(date)}
                            className={`aspect-square border border-transparent rounded-sm flex items-center justify-center text-[10px] sm:text-xs font-mono cursor-pointer hover:opacity-80 transition-all relative group ${bgClass}`}
                          >
                            {format(date, 'd')}
                          </div>
                        )
                      })}
                    </div>
                    <div className="text-[9px] text-center text-muted-foreground mt-4 italic">
                        Tap a day to view trades & journal.
                    </div>
                  </div>
             </div>
        )}
      </div>

      {/* Desktop Dashboard Grid (Original) */}
      <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-0 min-h-0 h-full overflow-hidden">
        
        {/* COLUMN 1: Position Dossier & Heatmap (50%) */}
        <div className="flex-1 lg:basis-1/2 flex flex-col bg-background border-r border-border overflow-hidden min-h-0 text-foreground">
          
          {/* Calendar Heatmap Section (Retained) */}
          <div className={`p-4 border-b border-border bg-card/50 transition-all duration-700 ease-out shrink-0 ${
            isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Performance Heatmap <span className="text-primary font-bold ml-2">FEB 2026</span></h2>
              <div className="flex gap-2">
                <button className="text-[10px] px-2 py-1 border border-border rounded hover:bg-muted text-muted-foreground transition">&lt;</button>
                <button className="text-[10px] px-2 py-1 border border-border rounded hover:bg-muted text-muted-foreground transition">&gt;</button>
              </div>
            </div>
            
            {/* Heatmap Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                <div key={day} className="text-[8px] sm:text-[10px] text-center text-muted-foreground mb-1">{day}</div>
              ))}
              {Array.from({ length: emptyDays }).map((_, i) => (
                 <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              {days.map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd')
                  const trades = MOCK_JOURNAL_DATA[dateStr] || []
                  const count = trades.length
                  const pnl = trades.reduce((acc, t) => acc + t.pnl, 0)
                  
                  const isGreen = pnl > 0
                  const isRed = pnl < 0
                  const isSelected = isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, new Date())

                  let bgClass = 'bg-muted/10 border-transparent text-muted-foreground'
                  if (count > 0) {
                      if (isGreen) bgClass = 'bg-primary/20 border-primary/40 text-primary'
                      if (isRed) bgClass = 'bg-pink/20 border-pink/40 text-pink'
                  }

                  if (isToday && !isSelected) bgClass += ' ring-1 ring-white/50'
                  if (isSelected) bgClass += ' ring-2 ring-primary ring-offset-2 ring-offset-background z-10'

                  return (
                    <div 
                        key={dateStr}
                        onClick={() => { setSelectedDate(day); setIsDialogOpen(true); }}
                        className={cn(
                            "aspect-square border rounded-sm flex items-center justify-center text-[10px] sm:text-xs font-mono cursor-pointer hover:opacity-80 transition-all relative group",
                            bgClass
                        )}
                    >
                      {format(day, 'd')}
                      {isGreen && <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-primary rounded-full"></span>}
                      {isRed && <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-pink rounded-full"></span>}
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-max pointer-events-none">
                        <div className="bg-popover border border-border text-popover-foreground text-[9px] px-2 py-1 rounded shadow-lg">
                          {count > 0 ? (
                              <span className={isGreen ? 'text-primary' : 'text-pink'}>
                                  {isGreen ? '+' : ''}${pnl.toFixed(2)} ({count} Trades)
                              </span>
                          ) : 'No Activity'}
                        </div>
                      </div>
                    </div>
                  )
              })}
            </div>
          </div>

{/* Interactive Left Content Area (Now a Dialog) */}
          <Dialog open={!!selectedDate && isDialogOpen} onOpenChange={(open) => !open && setIsDialogOpen(false)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border">
                <div className="flex h-[80vh]">
                    {/* Left: Summary & Notes (Always Visible or Collapsed on Dossier?) */}
                    {/* Let's keep the split view for daily overview, and replace the Right Panel with Trade Dossier if selected */}
                    
                    <div className="w-1/3 bg-muted/5 border-r border-border p-6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-mono font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="p-1.5 bg-primary/10 rounded-sm text-primary"><BookOpen size={16}/></span>
                                {selectedDate ? format(selectedDate, 'MMM dd') : ''}
                            </DialogTitle>
                            <DialogDescription className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                                {selectedDate ? format(selectedDate, 'EEEE, yyyy') : ''}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6 flex-1 flex flex-col gap-6">
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Daily PnL</div>
                                <div className={`text-3xl font-mono font-bold ${dailyPnl >= 0 ? 'text-primary' : 'text-pink'}`}>
                                    {dailyPnl >= 0 ? '+' : ''}${dailyPnl.toFixed(2)}
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Edit2 size={12} /> Daily Reflection
                                </div>
                                <textarea 
                                    className="w-full h-full bg-card border border-border rounded-sm p-3 text-xs font-mono text-foreground focus:outline-none focus:border-primary/50 resize-none"
                                    placeholder="Journal your day..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Content Area (Trade List OR Trade Dossier) */}
                    <div className="flex-1 bg-background flex flex-col min-h-0 relative">
                        {selectedTrade ? (
                             <div className="absolute inset-0 z-10 bg-background flex flex-col animate-in slide-in-from-right duration-300">
                                 <div className="h-12 border-b border-border flex items-center gap-3 px-6 bg-muted/5 shrink-0">
                                     <button onClick={() => setSelectedTrade(null)} className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                                         <ArrowLeft size={16} />
                                     </button>
                                     <div className="flex items-center gap-4">
                                         <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">TRADE_DOSSIER // {selectedTrade.symbol}</h3>
                                         <span className={`text-xs font-mono font-bold ${selectedTrade.pnl >= 0 ? 'text-primary' : 'text-pink'}`}>
                                            {selectedTrade.pnl >= 0 ? '+' : ''}${selectedTrade.pnl.toFixed(2)}
                                         </span>
                                     </div>
                                 </div>
                                 <ScrollArea className="flex-1 p-6">
                                     <div className="max-w-2xl mx-auto space-y-6">
                                          {/* Execution Log */}
                                          <div className="bg-card border border-border p-6 relative overflow-hidden rounded-sm">
                                              <div className={`absolute top-0 left-0 w-1 h-full ${selectedTrade.pnl >= 0 ? 'bg-primary' : 'bg-pink'}`}></div>
                                              <div className="grid grid-cols-3 gap-6 mb-6">
                                                  <div>
                                                      <div className="text-[10px] uppercase text-muted-foreground mb-1">Entry</div>
                                                      <div className="text-base font-mono font-bold">140.00</div>
                                                  </div>
                                                  <div>
                                                      <div className="text-[10px] uppercase text-muted-foreground mb-1">Exit</div>
                                                      <div className="text-base font-mono font-bold">142.10</div>
                                                  </div>
                                                  <div>
                                                      <div className="text-[10px] uppercase text-muted-foreground mb-1">Size</div>
                                                      <div className="text-base font-mono font-bold">{selectedTrade.size}</div>
                                                  </div>
                                              </div>
                                              
                                              <div className="space-y-4">
                                                  <div>
                                                      <label className="text-[10px] uppercase text-muted-foreground block mb-2">Notes</label>
                                                      <textarea 
                                                          className="w-full bg-background border border-border rounded p-3 text-sm font-mono focus:outline-none focus:border-primary/50 min-h-[100px]"
                                                          placeholder="Trade analysis..."
                                                          defaultValue={selectedTrade.journal?.notes || ''}
                                                      />
                                                  </div>
                                                  <div className="flex gap-4">
                                                       <div>
                                                            <label className="text-[10px] uppercase text-muted-foreground block mb-2">Emotion</label>
                                                            <div className="flex flex-wrap gap-1">
                                                                {['Fearful', 'Anxious', 'Neutral', 'Calm', 'Greedy'].map(emotion => (
                                                                    <button 
                                                                        key={emotion}
                                                                        className={cn(
                                                                            "px-2 py-1 text-[9px] border rounded transition-colors uppercase",
                                                                            (selectedTrade.journal?.emotion || 'Anxious') === emotion 
                                                                                ? "bg-primary/20 border-primary text-primary" 
                                                                                : "bg-muted/10 border-border text-muted-foreground hover:bg-muted/30"
                                                                        )}
                                                                    >
                                                                        {emotion}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                       </div>
                                                       <div>
                                                           <label className="text-[10px] uppercase text-muted-foreground block mb-2">Rating</label>
                                                           <div className="flex gap-1 text-yellow-500 text-lg">★★★★☆</div>
                                                       </div>
                                                  </div>
                                              </div>
                                          </div>

                                          {/* AI Analysis Mock */}
                                          <div className="bg-black/20 border border-primary/20 p-4 rounded-sm">
                                              <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                                  <BookOpen size={14} /> AI_COACH_ANALYSIS
                                              </h4>
                                              <div className="space-y-2 font-mono text-[10px] text-muted-foreground">
                                                  <div className="flex gap-2">
                                                      <span className="text-primary min-w-[60px]">&gt; BIAS:</span>
                                                      <span className="text-foreground">{selectedTrade.journal?.aiBias || 'ANALYZING...'}</span>
                                                  </div>
                                                  <div className="flex gap-2">
                                                      <span className="text-primary min-w-[60px]">&gt; SCORE:</span>
                                                      <span className="text-foreground">{selectedTrade.journal?.aiScore || 0}/100</span>
                                                  </div>
                                                  <div className="flex gap-2">
                                                      <span className="text-primary min-w-[60px] top-0 relative">&gt; INSIGHT:</span>
                                                      <span className="text-foreground leading-relaxed">
                                                         "Perfect entry. You nailed the timing."
                                                      </span>
                                                  </div>
                                              </div>
                                          </div>

                                          <div className="flex justify-end pt-4">
                                              <button className="bg-primary text-black font-bold text-xs px-6 py-2.5 rounded-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                                                  <Save size={14} /> SAVE_ENTRY
                                              </button>
                                          </div>
                                     </div>
                                 </ScrollArea>
                             </div>
                        ) : (
                             /* Trade List View */
                             <>
                                 <div className="h-12 border-b border-border flex items-center justify-between px-6 bg-muted/5 shrink-0">
                                     <div className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Recorded Trades ({selectedTrades.length})</div>
                                 </div>
                                 <ScrollArea className="flex-1 p-6">
                                     <div className="space-y-2">
                                        {selectedTrades.length === 0 ? (
                                            <div className="text-center py-20 text-muted-foreground opacity-50 font-mono text-xs">
                                                No trades recorded for this day.
                                            </div>
                                        ) : selectedTrades.map(trade => (
                                            <div key={trade.id} onClick={() => setSelectedTrade(trade)} className="group border border-border bg-card hover:bg-muted/10 transition-colors p-4 rounded-sm flex items-center justify-between cursor-pointer hover:border-primary/50">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-1 h-10 rounded-full ${trade.pnl >= 0 ? 'bg-primary' : 'bg-pink'}`}></div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-sm">{trade.symbol}</span>
                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                                                                trade.side === 'LONG' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-pink/10 border-pink/20 text-pink'
                                                            }`}>{trade.side}</span>
                                                            <span className="text-[9px] border border-border px-1.5 py-0.5 rounded text-muted-foreground">PERP</span>
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground font-mono">
                                                            {format(trade.timestamp, 'HH:mm:ss')} • Size: {trade.size} • Entry: 140.00
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`font-mono font-bold ${trade.pnl >= 0 ? 'text-primary' : 'text-pink'}`}>
                                                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                                                    </div>
                                                    <div className="text-[9px] text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">
                                                        View Details &gt;
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                     </div>
                                 </ScrollArea>
                             </>
                        )}
                    </div>
                </div>
            </DialogContent>
          </Dialog>


        </div>

        {/* COLUMN 2: Coach Intel (33%) */}
        <div className="flex-1 lg:basis-1/3 flex flex-col bg-card border-r border-border overflow-hidden">
          <header className="h-10 border-b border-border flex items-center px-4 bg-muted/10 justify-between flex-shrink-0">
            <span className="text-[10px] uppercase text-primary tracking-widest font-bold">COACH_INTEL // TERMINAL</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </header>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
            <div className="border border-primary/20 bg-primary/5 p-4 rounded-sm">
              <div className="font-mono text-sm text-primary leading-6">
                &gt; ANALYZING TRADE BEHAVIOR...<br/>
                &gt; DETECTED PATTERN: FOMO_ENTRY<br/>
                &gt; BIAS: <span className="bg-primary text-black font-bold px-1">DENIAL</span><br/>
                &gt; INSIGHT: You are misrepresenting the trade status to avoid realizing the risk of the leverage size. Support was weak.
              </div>
            </div>

            <div className="border border-border bg-background mt-4">
              <div className="p-2 border-b border-border flex justify-between items-center bg-muted/10">
                <span className="text-[10px] uppercase text-muted-foreground">MACRO_RADAR</span>
                <span className="text-[10px] text-muted-foreground">SENTIMENT: <span className="text-foreground">NEUTRAL</span></span>
              </div>
              <ul className="text-xs divide-y divide-border">
                <li className="p-3 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between mb-1">
                    <span className="text-foreground group-hover:text-primary">Solana ETF Approvals</span>
                    <span className="text-[10px] text-muted-foreground">2m ago</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">SEC delays decision again, market shrugs...</div>
                </li>
                <li className="p-3 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between mb-1">
                    <span className="text-foreground group-hover:text-primary">Kamino Venture Round</span>
                    <span className="text-[10px] text-muted-foreground">1h ago</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">$10M raised to boost liquidity protocols...</div>
                </li>
                <li className="p-3 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between mb-1">
                    <span className="text-foreground group-hover:text-primary">BTC Resistance Test</span>
                    <span className="text-[10px] text-muted-foreground">3h ago</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">Rejection at 68k, alts bleeding slightly...</div>
                </li>
              </ul>
            </div>

            <div className="mt-auto border border-border bg-background p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons text-xs text-pink">warning</span>
                <span className="text-[10px] text-pink uppercase font-bold">Risk Alert</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Volatility expected in 15 mins due to FOMC minutes release. Tighten stops.
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Trader Psyche (Fixed 280px) */}
        <div className="hidden lg:flex lg:flex-col w-[280px] bg-background flex-shrink-0 border-l border-border overflow-hidden">
          <header className="h-10 border-b border-border flex items-center px-4 bg-card justify-center flex-shrink-0">
            <span className="text-[10px] uppercase text-muted-foreground tracking-widest">TRADER_PSYCHE</span>
          </header>
          
          <div className="p-6 flex flex-col items-center border-b border-border">
            <div className="w-20 h-20 rounded-full border-2 border-border p-1 mb-4 relative">
              <div className="w-full h-full rounded-full bg-card overflow-hidden grayscale">
                {/* Placeholder Avatar */}
                <div className="w-full h-full bg-muted-foreground/20"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center">
                <span className="material-icons text-[10px] text-primary">verified</span>
              </div>
            </div>
            <h3 className="text-foreground font-bold text-sm mb-1">THE DIP CHASER</h3>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Archetype</span>
          </div>

          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="mb-6">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Psychological Stats</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground">Discipline</span>
                    <span className="text-primary">65%</span>
                  </div>
                  <div className="w-full h-1 bg-card border border-border">
                    <div className="h-full bg-primary w-[65%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground">Patience</span>
                    <span className="text-pink">30%</span>
                  </div>
                  <div className="w-full h-1 bg-card border border-border">
                    <div className="h-full bg-pink w-[30%]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-dashed border-border p-4 bg-card relative">
              <div className="absolute -top-2 left-3 bg-background px-1 text-[10px] text-primary border border-primary/20">LAST NUDGE</div>
              <p className="text-xs text-muted-foreground font-mono italic text-center pt-2">
                "Wait for the floor. You tend to buy the first red candle. Stop it."
              </p>
            </div>
            
            <div className="mt-6">
              <button className="w-full py-3 border border-border hover:bg-white/5 transition-colors text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2">
                <span className="material-icons text-sm">history_edu</span>
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
