'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { KPICards } from '@/components/dashboard/KPICards'
import { PositionsTable } from '@/components/dashboard/PositionsTable'
import { PnLChart } from '@/components/dashboard/PnLChart'
import { SessionPerformance } from '@/components/dashboard/SessionPerformance'
import { EngineLog } from '@/components/dashboard/EngineLog'
import { useAnalytics } from '@/hooks/use-analytics'

export default function Dashboard() {
  const { 
    dashboardData, 
    analyticsData, 
    isLoading: isAnalyticsLoading 
  } = useAnalytics()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Transform Analytics Data for KPICards
  const kpiData = analyticsData ? {
    unrealizedPnl: `$${analyticsData.totalPnl.unrealized.toFixed(2)}`,
    realizedPnl: `$${analyticsData.totalPnl.realized.toFixed(2)}`,
    marginUsage: '42.5%', // Mock per design
    accountHealth: 85,    // Mock per design
  } : undefined

  // Transform Dashboard Data for PositionsTable
  const positionsData = dashboardData.map(pos => ({
    id: pos.positionId,
    instrument: pos.market,
    side: pos.side,
    size: pos.size,
    entryPrice: pos.entry,
    markPrice: pos.current,
    pnl: pos.unrealized
  }))

  return (
    <DashboardLayout title="DASHBOARD // POSITIONS">
      
      {/* Mobile Structure */}
      <div className="flex flex-col md:hidden min-h-0 h-full overflow-y-auto custom-scrollbar pb-20">
        
        {/* KPI Grid (2x2) */}
        <div className="grid grid-cols-2 gap-px bg-border border-b border-border">
            <div className="bg-card p-3 flex flex-col justify-center border-r border-b border-border">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">TOTAL UNREALIZED</span>
                <span className={`text-lg font-bold ${Number(analyticsData?.totalPnl.unrealized || 0) >= 0 ? "text-primary" : "text-accent-pink"}`}>
                    {Number(analyticsData?.totalPnl.unrealized || 0) >= 0 ? "+" : ""}{analyticsData?.totalPnl.unrealized.toFixed(2) || "0.00"}
                </span>
            </div>
            <div className="bg-card p-3 flex flex-col justify-center border-b border-border">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">REALIZED (24H)</span>
                <span className={`text-lg font-bold ${Number(analyticsData?.totalPnl.realized || 0) >= 0 ? "text-foreground" : "text-accent-pink"}`}>
                    {Number(analyticsData?.totalPnl.realized || 0) >= 0 ? "+" : ""}{analyticsData?.totalPnl.realized.toFixed(2) || "0.00"}
                </span>
            </div>
            <div className="bg-card p-3 flex flex-col justify-center border-r border-border">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">MARGIN USAGE</span>
                <span className="text-lg text-foreground font-bold">42.5%</span>
            </div>
            <div className="bg-card p-3 flex flex-col justify-center">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">HEALTH</span>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex-1">
                        <div className="h-full bg-primary w-[85%]"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Active Positions Header */}
        <div className="mt-px border-t border-border sticky top-0 z-10">
            <div className="px-3 py-2 bg-card border-b border-border flex justify-between items-center">
                <h2 className="text-[11px] font-bold tracking-wider text-foreground flex items-center gap-2">
                    ACTIVE_POSITIONS
                </h2>
                <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 animate-pulse">LIVE</span>
            </div>
            {/* Table Header */}
            <div className="w-full bg-background">
                <div className="grid grid-cols-[1.5fr_1fr_1fr] px-3 py-2 border-b border-border bg-black/40 text-[9px] text-muted-foreground uppercase tracking-widest font-mono">
                    <div className="text-left">INST</div>
                    <div className="text-center">SIDE</div>
                    <div className="text-right">PNL</div>
                </div>
            </div>
        </div>

         {/* Positions List */}
        <div className="w-full bg-background">
             <div className="divide-y divide-border">
                 {positionsData.map((pos) => (
                     <div key={pos.id} className="grid grid-cols-[1.5fr_1fr_1fr] px-3 py-3 items-center active:bg-white/5 transition-colors font-mono">
                         <div className="flex items-center gap-2">
                             {/* Placeholder Icon */}
                             <div className="w-3.5 h-3.5 rounded-full bg-gray-700 flex-shrink-0"></div> 
                             <div className="flex flex-col leading-none">
                                 <span className="font-bold text-foreground text-[10px]">{pos.instrument}</span>
                                 <span className="text-[9px] text-muted-foreground mt-0.5">{pos.entryPrice} → {pos.markPrice}</span>
                             </div>
                         </div>
                         <div className="text-center">
                             <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${pos.side === 'LONG' ? 'text-primary bg-primary/10 border-primary/20' : 'text-accent-pink bg-accent-pink/10 border-accent-pink/20'}`}>
                                 {pos.side}
                             </span>
                         </div>
                         <div className={`text-right font-bold text-[11px] ${pos.pnl >= 0 ? "text-primary" : "text-accent-pink"}`}>
                             {pos.pnl >= 0 ? "+" : ""}{pos.pnl}
                         </div>
                     </div>
                 ))}
                 {positionsData.length === 0 && (
                     <div className="px-3 py-8 text-center text-[10px] text-muted-foreground font-mono">
                         NO ACTIVE POSITIONS
                     </div>
                 )}
             </div>
        </div>

        {/* Cumulative PnL Chart */}
        <div className="border-t border-border bg-background mt-2">
            <div className="px-3 py-2 border-b border-border flex justify-between items-center">
                <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">CUMULATIVE_PNL</h3>
                <span className="text-xs text-foreground font-bold">$12,450.00</span>
            </div>
            <div className="h-[120px] relative w-full overflow-hidden border-b border-border">
                 {/* Reusing PnLChart component or creating a simplified SVG based on design? 
                     Design provided SVG path. PnLChart uses Recharts.
                     Sticking to Recharts is safer for data binding, but user provided specific SVG path.
                     I will use the PnLChart component but ensure it fits the container.
                 */}
                <PnLChart />
            </div>
             <div className="grid grid-cols-2 divide-x divide-border border-b border-border text-[9px] font-mono">
                <div className="p-3 text-center">
                    <div className="text-muted-foreground uppercase mb-1">24H VOLUME</div>
                    <div className="text-foreground font-bold">142,050 SOL</div>
                </div>
                <div className="p-3 text-center">
                    <div className="text-muted-foreground uppercase mb-1">OPEN INTEREST</div>
                    <div className="text-foreground font-bold">$4.2M</div>
                </div>
            </div>
        </div>

        {/* Live Engine Logs */}
        <div className="bg-card border-t border-border mt-2 pb-2">
            <header className="h-8 flex items-center justify-between px-3 font-mono text-[9px] uppercase tracking-wider text-muted-foreground bg-background border-b border-border">
                <span>LIVE_ENGINE_LOGS</span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            </header>
            <div className="p-3">
                 <EngineLog />
            </div>
        </div>
      </div>
      
      {/* Desktop Dashboard Grid (Original) */}
      <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-0 min-h-0 h-full">
        {/* Left Content Area - Full width on mobile */}
        <div className="flex-1 flex flex-col bg-background w-full overflow-y-auto custom-scrollbar min-h-0">
          {/* KPI Cards */}
          <div className={`transition-all duration-700 ease-out ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <KPICards data={kpiData} />
          </div>

          {/* Positions Table */}
          <div className={`transition-all duration-700 ease-out delay-100 ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <PositionsTable positions={positionsData} />
          </div>

          {/* PnL Chart */}
          <div className={`transition-all duration-700 ease-out delay-200 ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <PnLChart />
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile/tablet, visible on lg+ */}
        <div className={`hidden lg:flex lg:flex-col lg:w-80 bg-card flex-shrink-0 border-l border-border overflow-hidden transition-all duration-700 ease-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {/* Session Performance Header */}
          <header className="h-10 flex items-center px-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/20 border-b border-border flex-shrink-0">
            SESSION_PERFORMANCE
          </header>

          {/* Session Performance - Flex for scrolling */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <SessionPerformance />
          </div>

          {/* Live Engine Logs - Flex for scrolling */}
          <div className="flex-1 overflow-y-auto custom-scrollbar border-t border-border">
            <EngineLog />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
