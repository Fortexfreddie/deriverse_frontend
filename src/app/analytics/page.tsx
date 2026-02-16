'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PageLoader } from '@/components/PageLoader'
import { RefreshCcw } from 'lucide-react'

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <DashboardLayout title="ANALYTICS // RISK_ENGINE">
      {/* Dashboard Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 min-h-0 h-[calc(100vh-64px)] overflow-hidden">
        
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
                          <div className="bg-background border border-border px-2 py-1 text-foreground font-mono">2026-02-01</div>
                          <span>END:</span>
                          <div className="bg-background border border-border px-2 py-1 text-foreground font-mono">2026-02-09</div>
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
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
                <defs>
                  <linearGradient id="drawdownGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00ffc4" stopOpacity="0.1"></stop>
                    <stop offset="100%" stopColor="#00ffc4" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,250 L50,240 L100,220 L150,230 L200,180 L250,190 L300,150 L350,160 L400,120 L450,130 L500,100 L550,110 L600,80 L650,90 L700,60 L750,70 L800,40 L850,50 L900,20 L950,30 L1000,10 L1000,300 L0,300 Z" fill="url(#drawdownGradient)" stroke="none"></path>
                <path d="M0,250 L50,240 L100,220 L150,230 L200,180 L250,190 L300,150 L350,160 L400,120 L450,130 L500,100 L550,110 L600,80 L650,90 L700,60 L750,70 L800,40 L850,50 L900,20 L950,30 L1000,10" fill="none" stroke="#00ffc4" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                <circle cx="200" cy="180" fill="#00ffc4" r="3"></circle>
                <circle cx="600" cy="80" fill="#00ffc4" r="3"></circle>
              </svg>
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

            {/* NY SESSION */}
            {/* <div className="border border-border rounded bg-background p-3 relative overflow-hidden">
              <div className="absolute right-0 top-0 p-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block"></span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-foreground font-bold">NY SESSION (ACTIVE)</span>
                <span className="text-[10px] font-mono text-muted-foreground/70">13:00 - 22:00 UTC</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-xl font-mono text-foreground">$3,420.00</div>
                <div className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">+11.5%</div>
              </div>
              <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[78%]"></div>
              </div>
            </div> */}

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