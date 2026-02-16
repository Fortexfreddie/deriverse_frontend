'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PageLoader } from '@/components/PageLoader'
import { Brain, Edit2, Plus, X } from 'lucide-react'

export default function JournalPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <DashboardLayout title="JOURNAL // ANALYSIS">
      {/* Dashboard Grid - 3 Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 min-h-0 h-full overflow-hidden">
        
        {/* COLUMN 1: Position Dossier & Heatmap (50%) */}
        <div className="flex-1 lg:basis-1/2 flex flex-col bg-background border-r border-border overflow-y-auto custom-scrollbar min-h-0 text-foreground">
          
          {/* Calendar Heatmap Section (Retained) */}
          <div className={`p-4 border-b border-border bg-card/50 transition-all duration-700 ease-out ${
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
              {Array.from({ length: 28 }).map((_, i) => {
                const day = i + 1
                const isGreen = [2, 5, 8, 9, 12, 13, 15, 16, 20, 22, 23, 26, 27].includes(day)
                const isRed = [3, 6, 10, 17, 24].includes(day)
                const isToday = day === 15
                
                let bgClass = 'bg-muted/20'
                if (isGreen) bgClass = 'bg-primary/20 border-primary/40 text-primary'
                if (isRed) bgClass = 'bg-pink/20 border-pink/40 text-pink'
                if (isToday) bgClass += ' ring-1 ring-foreground'

                return (
                  <div key={i} className={`aspect-square border border-transparent rounded-sm flex items-center justify-center text-[10px] sm:text-xs font-mono cursor-pointer hover:opacity-80 transition-all relative group ${bgClass}`}>
                    {day}
                    {isGreen && <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-primary rounded-full"></span>}
                    {isRed && <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-pink rounded-full"></span>}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-max">
                      <div className="bg-popover border border-border text-popover-foreground text-[9px] px-2 py-1 rounded shadow-lg">
                        {isGreen ? '+$420.50 (4 Trades)' : isRed ? '-$150.20 (2 Trades)' : 'No Activity'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Position Dossier */}
          <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-muted/10 border border-border text-xs font-bold text-foreground">SOL-USDC</span>
                  <span className="text-xs text-muted-foreground">PERPETUAL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">AI_SCORE</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-4 bg-primary"></div>
                    <div className="w-2 h-4 bg-primary"></div>
                    <div className="w-2 h-4 bg-primary"></div>
                    <div className="w-2 h-4 bg-card border border-border"></div>
                    <div className="w-2 h-4 bg-card border border-border"></div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="material-icons text-primary">folder_open</span>
                  POSITION_DOSSIER
                </h2>
                <div className="bg-card border border-border p-6 mb-6 relative group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-pink"></div>
                  <div className="flex justify-between mb-4">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-widest">Entry Logic</span>
                    <span className="text-[10px] uppercase text-pink tracking-widest border border-pink/30 px-2 py-0.5 bg-pink/10">Emotion: ANXIOUS</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed font-mono">
                    I entered this SOL trade because the 4H support looked strong at 138.5, but I hesitated on the initial wick. FOMO kicked in when it reclaimed 140, so I market bought. Feeling uneasy about the leverage size given the volatility.
                  </p>
                  <div className="mt-4 pt-4 border-t border-border flex gap-4 text-xs text-muted-foreground">
                    <span>Timestamp: 14:02 UTC</span>
                    <span>Size: 400 SOL</span>
                    <span>Lev: 5x</span>
                  </div>
                </div>

                <div className="bg-card border border-border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-primary flex items-center gap-2">
                      <span className="material-icons text-sm">psychology_alt</span>
                      WHAT_IF_MODULE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-border p-3 bg-muted/20">
                      <div className="text-[10px] text-muted-foreground uppercase mb-1">Current Exit Plan</div>
                      <div className="text-lg text-foreground">148.00</div>
                      <div className="text-[10px] text-primary mt-1">Est. PnL: +$3,200</div>
                    </div>
                    <div className="border border-pink/30 p-3 bg-pink/5 relative overflow-hidden">
                      <div className="text-[10px] text-pink uppercase mb-1">Hypothetical Panic Exit</div>
                      <div className="text-lg text-foreground">125.50</div>
                      <div className="text-[10px] text-pink mt-1">Est. Loss: -$5,800</div>
                      <div className="absolute -right-2 -bottom-2 text-pink/10 text-6xl font-bold select-none">?</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-xs uppercase text-muted-foreground tracking-widest mb-4">Chart Snapshot</h3>
                <div className="w-full h-48 bg-card border border-border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                  <svg className="w-full h-full p-4" viewBox="0 0 400 150">
                    <path d="M0,100 L40,90 L80,110 L120,60 L160,80 L200,40 L240,50 L280,30 L320,70 L360,20 L400,40" fill="none" stroke="#00FFC2" strokeWidth="2"></path>
                    <circle cx="160" cy="80" fill="#FF2079" r="3"></circle>
                    <line stroke="#333" strokeDasharray="4" x1="0" x2="400" y1="80" y2="80"></line>
                  </svg>
                  <div className="absolute top-2 right-2 text-[10px] text-primary bg-primary/10 px-1 border border-primary/20">ENTRY: 140.00</div>
                </div>
              </div>
          </div>
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
                <img alt="Profile" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOpupxhTAtsNVs-dIy56toqGiQxTF6BDlJ1ogI9JtEW2DRlKKd_Qe4wojijVpQgZRpATLeQ1wP-7JFKa_AFJ4WWya1oK2KxjbgnfeoNbK3ZxPCTHYaVVhMgS6DYFpwcbIe7qGhN5A_34b58uLxsAoSY37Ci5ovm71bBuhy9dGFb2xgcCcYSEC50SIExuhBhvs9T3yydGQOJTtgPeN6Lv4TArosf_X8mCHB1YnlebKNXzPWHojZbNWcCy9FCLvCuYE7WJ8Buk_N-Eg"/>
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
