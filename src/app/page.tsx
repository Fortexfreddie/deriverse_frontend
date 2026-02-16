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
    marginUsage: '45.2%', // Mock or calc if available
    accountHealth: 92,    // Mock or calc if available
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
      {/* Dashboard Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 min-h-0 h-full">
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
