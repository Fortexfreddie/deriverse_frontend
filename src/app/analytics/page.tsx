'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PageLoader } from '@/components/PageLoader'
import { DrawdownChart } from '@/components/dashboard/DrawdownChart'
import { MainAnalyticsChart } from '@/components/dashboard/MainAnalyticsChart'
import { RefreshCcw } from 'lucide-react'

import { DatePicker } from '@/components/ui/date-picker'
import { CompositionChart } from '@/components/dashboard/CompositionChart'
import { Heatmap } from '@/components/dashboard/Heatmap'
import { Leaderboard } from '@/components/dashboard/Leaderboard'

// Mock Data for Heatmap
const mockHeatmapData = {
    '2026-02-02': 120.5,
    '2026-02-03': -50.2,
    '2026-02-05': 200.0,
    '2026-02-08': 45.0,
    '2026-02-09': 150.0,
    '2026-02-12': -80.0,
    '2026-02-14': 300.0,
    '2026-02-15': -20.0,
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date('2026-02-01'))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date('2026-02-09'))

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <DashboardLayout title="ANALYTICS // RISK_ENGINE">
      
      {/* Mobile Structure (Mobile Risk Engine) */}
      <div className="flex flex-col md:hidden min-h-0 h-full overflow-y-auto custom-scrollbar pb-20 bg-background font-mono">
        
        {/* KPI Grid (3 cols) */}
        <div className="p-2 grid grid-cols-3 gap-2">
            <div className="bg-card border border-border p-2 rounded flex flex-col justify-between h-20 relative overflow-hidden group text-foreground">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">PF</div>
                <div className="text-xl text-primary font-bold">1.8</div>
                <div className="text-[9px] text-muted-foreground">▲ 0.2</div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary/10 blur-xl"></div>
            </div>
            <div className="bg-card border border-border p-2 rounded flex flex-col justify-between h-20 relative overflow-hidden group text-foreground">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">EXP</div>
                <div className="text-xl text-foreground font-bold">0.35</div>
                <div className="text-[9px] text-accent-pink">Risk: Hi</div>
            </div>
            <div className="bg-card border border-border p-2 rounded flex flex-col justify-between h-20 relative overflow-hidden group text-foreground">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">WIN%</div>
                <div className="text-xl text-foreground font-bold">62%</div>
                <div className="w-full h-1 bg-muted rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary w-[62%]"></div>
                </div>
            </div>
        </div>

        {/* Composition Chart (Mobile) */}
         <div className="px-2 pb-2">
            <div className="bg-card border border-border rounded p-3 h-64">
                <CompositionChart />
            </div>
         </div>
         
         {/* Heatmap (Mobile) */}
         <div className="px-2 pb-2">
            <div className="bg-card border border-border rounded p-3">
                <Heatmap data={mockHeatmapData} />
            </div>
         </div>

         {/* Leaderboard (Mobile) */}
         <div className="px-2 pb-2">
            <div className="bg-card border border-border rounded p-3 h-64">
                <Leaderboard />
            </div>
         </div>

        {/* Drawdown Chart */}
        <div className="px-2 pb-2">
            <div className="bg-card border border-border rounded p-3 relative h-40 flex flex-col">
                <div className="flex justify-between items-start mb-2 z-10">
                    <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">MAX_DRAWDOWN</div>
                        <div className="text-2xl text-accent-pink font-bold leading-none mt-1">15.4%</div>
                    </div>
                    <div className="text-[9px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded border border-white/10">1D View</div>
                </div>
                <div className="absolute inset-x-0 bottom-0 top-8 px-2 pb-2">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 px-2 pb-2 pt-4">
                        <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
                        <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
                        <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
                    </div>
                    {/* Drawdown Chart Component */}
                    <DrawdownChart />
                </div>
            </div>
        </div>

        {/* SOL-PERP Metrics Grid */}
        <div className="px-2 pb-2">
            <div className="border border-border rounded bg-card overflow-hidden">
                <div className="h-8 border-b border-border flex items-center justify-between px-3 bg-black/20">
                    <div className="flex items-center gap-2">
                        {/* Placeholder Icon */}
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span className="text-[10px] text-foreground font-bold tracking-widest">SOL-PERP METRICS</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-border">
                    <div className="p-3">
                        <div className="text-[10px] text-muted-foreground mb-0.5">REALIZED PNL</div>
                        <div className="text-sm text-primary font-bold">+$3,240.50</div>
                    </div>
                    <div className="p-3">
                        <div className="text-[10px] text-muted-foreground mb-0.5">VOLUME (SOL)</div>
                        <div className="text-sm text-foreground">42,050</div>
                    </div>
                    <div className="p-3">
                        <div className="text-[10px] text-muted-foreground mb-0.5">AVG ENTRY</div>
                        <div className="text-sm text-foreground">$141.20</div>
                    </div>
                    <div className="p-3">
                        <div className="text-[10px] text-muted-foreground mb-0.5">FEES PAID</div>
                        <div className="text-sm text-accent-pink">-$124.80</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Session Performance Bars */}
        <div className="px-2 pb-2">
            <div className="border border-border rounded bg-card p-3">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">SESSION_PERFORMANCE</div>
                <div className="flex flex-col gap-3">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-muted-foreground">ASIAN</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-primary font-bold">+$1,204</span>
                                <span className="text-[9px] text-muted-foreground/80">4.2%</span>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary/60 w-[45%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-muted-foreground">LONDON</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-foreground font-bold">+$892</span>
                                <span className="text-[9px] text-muted-foreground/80">2.1%</span>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary/40 w-[30%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-foreground font-bold flex items-center gap-1">
                                NY SESSION <span className="w-1 h-1 bg-primary rounded-full animate-pulse"></span>
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-primary font-bold">+$3,420</span>
                                <span className="text-[9px] text-muted-foreground/80">11.5%</span>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[78%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Live Engine Logs (Mobile) */}
        <div className="px-2 pb-4">
            <div className="border border-border rounded bg-black p-3 font-mono text-[10px] h-32 overflow-y-auto custom-scrollbar">
                <div className="sticky top-0 bg-black pb-2 border-b border-border mb-2 flex justify-between items-center">
                    <span className="text-muted-foreground uppercase tracking-widest">&gt; LIVE_ENGINE_LOGS</span>
                     <span className="w-1.5 h-1.5 bg-primary rounded-sm animate-pulse"></span>
                </div>
                <div className="flex flex-col gap-2 font-mono">
                    <div className="text-muted-foreground">
                        <span className="text-primary">[GET]</span> /api/analytics/sol_wallet_84f
                        <div className="text-muted-foreground/60 pl-2 mt-0.5">Status: 200 OK (12ms)</div>
                    </div>
                     <div className="text-muted-foreground">
                        <span className="text-primary">[WSS]</span> wss://feed.deriverse.io/risk
                        <div className="text-muted-foreground/60 pl-2 mt-0.5">Subscription: CONFIRMED</div>
                    </div>
                     <div className="text-muted-foreground">
                        <span className="text-accent-pink">[POST]</span> /api/risk/update_leverage
                        <div className="text-muted-foreground/60 pl-2 mt-0.5">Payload: {"{ \"max\": \"5x\" }"}</div>
                    </div>
                     <div className="text-muted-foreground">
                        <span className="text-primary">[GET]</span> /api/pnl/realized
                        <div className="text-muted-foreground/60 pl-2 mt-0.5">Syncing...</div>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Desktop Dashboard Grid (Original) */}
      <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-0 min-h-0 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Content Area */}
        <div className="flex-1 flex flex-col bg-background w-full overflow-y-auto custom-scrollbar min-h-0">
          
          {/* KPI Cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border-b border-border p-2 sm:p-4 shrink-0 transition-all duration-700 ease-out ${
            isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {/* Profit Factor */}
            <div className="bg-card p-4 rounded relative overflow-hidden group hover:border-primary/30 transition-colors border border-transparent">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Profit Factor</div>
              <div className="text-4xl font-mono text-primary font-bold">1.8</div>
              <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                <span className="text-primary">▲ 0.2</span> vs last session
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/5 blur-xl group-hover:bg-primary/10 transition"></div>
            </div>

            {/* Expectancy */}
            <div className="bg-card p-4 rounded relative overflow-hidden group hover:border-primary/30 transition-colors border border-transparent">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Expectancy (R)</div>
              <div className="text-4xl font-mono text-foreground font-bold">0.35</div>
              <div className="text-[10px] text-muted-foreground mt-2">
                Avg Win: <span className="text-primary">$420</span> / Avg Loss: <span className="text-pink">$150</span>
              </div>
            </div>

            {/* Win Rate */}
            <div className="bg-card p-4 rounded relative overflow-hidden group hover:border-primary/30 transition-colors border border-transparent">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Win Rate</div>
              <div className="text-4xl font-mono text-foreground font-bold">62%</div>
              <div className="w-full h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/80 w-[62%]"></div>
              </div>
            </div>
          </div>

          {/* Max Drawdown Chart - Fixed Height to enable scrolling */}
          {/* Main Chart Section */}
          <div className={`bg-card border border-border p-4 rounded m-4 mb-2 shrink-0 flex flex-col relative transition-all duration-700 ease-out delay-100 ${
            isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {/* Chart Filters & Header */}
            <div className="flex flex-col gap-6 mb-6">
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-background/50 p-2 border border-border rounded-sm">
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-primary">
                          <span className="material-icons text-sm">tune</span> 
                          {/* Note: using material key name if available or lucide equivalent if configured, keeping mimic of screenshot */}
                          <span className="text-[10px] font-mono font-bold tracking-widest">CHART_FILTERS</span>
                      </div>
                      <div className="h-4 w-px bg-border"></div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                          <span>START:</span>
                          <DatePicker date={startDate} setDate={setStartDate} />
                          <span>END:</span>
                          <DatePicker date={endDate} setDate={setEndDate} />
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                      <div className="flex border border-border rounded-sm overflow-hidden">
                          <button className="px-3 py-1 text-[10px] font-mono text-muted-foreground hover:bg-muted/10 transition hover:text-foreground">REALIZED</button>
                          <div className="w-px bg-border"></div>
                          <button className="px-3 py-1 text-[10px] font-mono text-muted-foreground hover:bg-muted/10 transition hover:text-foreground">UNREALIZED</button>
                          <div className="w-px bg-border"></div>
                          <button className="px-3 py-1 text-[10px] font-mono bg-primary/20 text-primary font-bold shadow-[0_0_10px_rgba(0,255,196,0.1)]">TOTAL</button>
                      </div>
                      
                      <div className="h-4 w-px bg-border"></div>
                      
                      <div className="flex border border-border rounded-sm overflow-hidden">
                         <button className="px-2 py-1 text-[10px] font-mono text-muted-foreground hover:bg-muted/10 hover:text-foreground">15M</button>
                         <div className="w-px bg-border"></div>
                         <button className="px-2 py-1 text-[10px] font-mono text-muted-foreground hover:bg-muted/10 hover:text-foreground">1H</button>
                         <div className="w-px bg-border"></div>
                         <button className="px-2 py-1 text-[10px] font-mono bg-muted/20 text-foreground font-bold">1D</button>
                      </div>
                  </div>
              </div>

              {/* Big PnL Display */}
              <div className="px-2">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">CUMULATIVE_PNL</div>
                  <div className="text-4xl sm:text-5xl font-mono text-primary font-bold tracking-tight shadow-primary/20 drop-shadow-sm">$12.50</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-2">Date: 2026-02-09</div>
              </div>
            </div>

            {/* Chart Graphic */}
            <div className="w-full h-[300px] relative mt-2 border-t border-border/50 pt-6">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 pt-6">
                <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
                <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
                <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
                <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
              </div>
              <MainAnalyticsChart />
            </div>
          </div>

          {/* NEW ROW: Heatmap & Composition & Leaderboard */}
          <div className={`mx-4 mb-4 grid grid-cols-1 lg:grid-cols-12 gap-2 shrink-0 transition-all duration-700 ease-out delay-200 ${
             isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
             {/* Heatmap (4 Cols) */}
             <div className="lg:col-span-4 bg-card border border-border rounded p-4 h-[300px]">
                 <Heatmap data={mockHeatmapData} />
             </div>
             
             {/* Composition (4 Cols) */}
             <div className="lg:col-span-4 bg-card border border-border rounded p-4 h-[300px]">
                 <CompositionChart />
             </div>

             {/* Leaderboard (4 Cols) - Increased from 3 */}
             <div className="lg:col-span-4 bg-card border border-border rounded p-4 h-[300px]">
                 <Leaderboard />
             </div>
          </div>

          {/* SOL-PERP Metrics */}
          <div className={`mx-4 mb-10 border border-border rounded bg-card shrink-0 overflow-hidden transition-all duration-700 ease-out delay-200 ${
            isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <div className="h-10 border-b border-border flex items-center justify-between px-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-foreground font-bold tracking-widest">SOL-PERP METRICS</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">24H PERFORMANCE</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              <div className="p-4">
                <div className="text-[10px] font-mono text-muted-foreground mb-1">REALIZED PNL</div>
                <div className="text-lg font-mono text-primary font-bold">+$3,240.50</div>
              </div>
              <div className="p-4">
                <div className="text-[10px] font-mono text-muted-foreground mb-1">TOTAL VOLUME</div>
                <div className="text-lg font-mono text-foreground">42,050 SOL</div>
              </div>
              <div className="p-4">
                <div className="text-[10px] font-mono text-muted-foreground mb-1">AVG ENTRY</div>
                <div className="text-lg font-mono text-foreground">$141.20</div>
              </div>
              <div className="p-4">
                <div className="text-[10px] font-mono text-muted-foreground mb-1">FEES PAID</div>
                <div className="text-lg font-mono text-pink">-$124.80</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Session Performance & Logs */}
        <div className={`hidden lg:flex lg:flex-col lg:w-80 bg-card flex-shrink-0 border-l border-border transition-all duration-700 ease-out h-full overflow-hidden ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}>
          <header className="h-12 border-b border-border flex items-center px-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/10 shrink-0">
              SESSION_PERFORMANCE
          </header>
          
          {/* SCROLLABLE BODY (This is what fixes the "chopped off" issue) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
            {/* ASIAN SESSION */}
            <div className="border border-border rounded bg-background p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-muted-foreground">ASIAN SESSION</span>
                <span className="text-[10px] font-mono text-muted-foreground/70">00:00 - 08:00 UTC</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-xl font-mono text-foreground">$1,204.00</div>
                <div className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">+4.2%</div>
              </div>
              <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary/60 w-[45%]"></div>
              </div>
            </div>

            {/* LONDON SESSION */}
            <div className="border border-border rounded bg-background p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-muted-foreground">LONDON SESSION</span>
                <span className="text-[10px] font-mono text-muted-foreground/70">07:00 - 16:00 UTC</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-xl font-mono text-foreground">$892.50</div>
                <div className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">+2.1%</div>
              </div>
              <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 w-[30%]"></div>
              </div>
            </div>

            <div className="my-2 border-t border-border border-dashed"></div>

            {/* ENGINE LOGS */}
            <div className="font-mono text-[10px]">
              <div className="text-muted-foreground mb-2 uppercase tracking-widest">Live Engine Logs</div>
              <div className="flex flex-col gap-2">
                <div className="text-muted-foreground">
                  <span className="text-primary">GET</span> /api/analytics/sol_wallet_...
                  <br/><span className="text-muted-foreground/60 pl-4">Status: 200 OK (12ms)</span>
                </div>
                <div className="text-muted-foreground">
                  <span className="text-primary">WS</span> wss://feed.deriverse.io/risk
                  <br/><span className="text-muted-foreground/60 pl-4">Subscription: CONFIRMED</span>
                </div>
              </div>
            </div>
          </div>

          {/* FIXED FOOTER (Always visible at the bottom) */}
          <div className="p-4 border-t border-border bg-card shrink-0">
            <button className="w-full bg-foreground hover:bg-muted-foreground text-background font-mono font-bold text-xs py-3 rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              <RefreshCcw size={14} />
              REFRESH_ANALYTICS
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}