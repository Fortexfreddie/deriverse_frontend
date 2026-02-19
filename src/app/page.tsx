'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { KPICards } from '@/components/dashboard/KPICards'
import { PositionsTable } from '@/components/dashboard/PositionsTable'
import { PnLChart } from '@/components/dashboard/PnLChart'
import { SessionPerformance } from '@/components/dashboard/SessionPerformance'
import { useDashboardData } from '@/hooks/useDashboardData'
import { cn } from '@/lib/utils'
import { Activity, Zap, Info } from 'lucide-react'

export default function Dashboard() {
    const {
        positions: dashboardData,
        analytics: analyticsData,
        historicalPnl,
        isLoading: isPositionsLoading,
        isAnalyticsLoading,
        isError: error,
        refresh
    } = useDashboardData()

    const handleRetry = () => refresh()
    const isLoading = isPositionsLoading || isAnalyticsLoading

    // --- Strict Logic Retention & Mapping ---
    const positionsData = dashboardData.map(pos => ({
        positionId: pos.positionId,
        market: pos.market,
        side: pos.side,
        size: pos.size,
        entry: pos.entry,
        current: pos.current,
        unrealized: pos.unrealized,
        realized: pos.realized || 0,
        fees: pos.fees || 0
    }))

    const sessionData = analyticsData ? Object.entries(analyticsData.sessionPerformance).map(([name, data]) => ({
        name: name.toUpperCase() + ' SESSION',
        status: (name === 'New York' ? 'ACTIVE' : 'CLOSED') as 'ACTIVE' | 'CLOSED',
        pnl: `$${data.pnl.toFixed(2)}`,
        return: `${data.pnl >= 0 ? '+' : ''}${((data.pnl / (analyticsData.totalPnl.total || 1)) * 100).toFixed(1)}%`
    })) : undefined

    const chartMetrics = analyticsData ? {
        cumulativePnl: `$${analyticsData.totalPnl.total.toFixed(2)}`,
        volume24h: `${(analyticsData.totalVolume || 0).toLocaleString()} USD`,
        openInterest: 'N/A', // Not in current API
        fundingRate: 'N/A', // Not in current API
        nextFunding: '00:00:00',
    } : undefined

    return (
        <DashboardLayout title="DASHBOARD">

            {/* --- MOBILE VIEW: COMPACT HUB --- */}
            <div className="flex flex-col md:hidden h-[calc(100vh-3.5rem)] overflow-hidden bg-background font-mono">

                {/* Scrollable Upper Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
                    {/* Primary Stats Grid (All metrics from your old code restored) */}
                    <div className="grid grid-cols-2 gap-px bg-border border-b border-border shadow-sm">
                        <div className="bg-card p-4">
                            <span className="text-[8px] text-muted-foreground uppercase tracking-widest block mb-1">TOTAL UNREALIZED</span>
                            <span className={cn("text-xl font-black tracking-tighter",
                                Number(analyticsData?.totalPnl.unrealized || 0) >= 0 ? "text-pnl-gain" : "text-pink")}>
                                {Number(analyticsData?.totalPnl.unrealized || 0) >= 0 ? "+" : ""}{analyticsData?.totalPnl.unrealized.toFixed(2) || "0.00"}
                            </span>
                        </div>
                        <div className="bg-card p-4 border-l border-border">
                            <span className="text-[8px] text-muted-foreground uppercase tracking-widest block mb-1">REALIZED 24H</span>
                            <span className="text-xl font-black tracking-tighter">
                                {Number(analyticsData?.totalPnl.realized || 0) >= 0 ? "+" : ""}{analyticsData?.totalPnl.realized.toFixed(2) || "0.00"}
                            </span>
                        </div>
                    </div>

                    {/* Active Positions List */}
                    <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border flex justify-between items-center px-4 py-3">
                        <h2 className="text-[10px] font-black tracking-[0.2em] flex items-center gap-2">
                            <Zap size={12} className="text-primary fill-primary" /> ACTIVE POSITIONS
                        </h2>
                        <span className="text-[8px] font-bold opacity-40 uppercase tracking-tighter">{positionsData.length} RUNNING</span>
                    </div>

                    <div className="divide-y divide-border">
                        {positionsData.length > 0 ? positionsData.map((pos) => (
                            <div key={pos.positionId} className="px-4 py-4 active:bg-primary/5 transition-colors border-b border-border last:border-0 flex justify-between items-center">
                                <div className="space-y-1">
                                    <div className="text-[11px] font-black flex items-center gap-2">
                                        {pos.market}
                                        <span className={cn("text-[8px] px-1 py-0.5 rounded-xs border",
                                            pos.side === 'LONG' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-pink/10 border-pink/20 text-pink')}>
                                            {pos.side}
                                        </span>
                                    </div>
                                    <div className="text-[9px] opacity-40">{pos.entry} → {pos.current}</div>
                                </div>
                                <div className="text-right">
                                    <div className={cn("font-black text-sm", pos.unrealized >= 0 ? "text-pnl-gain" : "text-pink")}>
                                        {pos.unrealized >= 0 ? "+" : ""}{pos.unrealized.toFixed(2)}
                                    </div>
                                    <div className="text-[8px] uppercase opacity-30 font-bold tracking-widest">Unrealized</div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-12 text-center text-[10px] text-muted-foreground uppercase opacity-30">No Active Risk Logs</div>
                        )}
                    </div>
                </div>

                {/* --- PINNED ANALYTICS FOOTER: FULL STATS RESTORED --- */}
                <div className="border-t border-border flex flex-col shrink-0 z-30">
                    <div className="px-4 py-2 border-b border-border/50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Activity size={10} className="text-primary" />
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">PERFORMANCE CURVE</span>
                        </div>
                        <span className="text-[11px] text-primary font-black">{chartMetrics?.cumulativePnl || "$0.00"}</span>
                    </div>

                    <div className="h-[180px] w-full p-2">
                        <PnLChart metrics={chartMetrics} chartData={historicalPnl} />
                    </div>

                    {/* Data Bar (Restored Funding and OI from original logic) */}
                    <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-card/10 h-14 mb-20">
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[7px] text-muted-foreground uppercase mb-0.5 font-bold tracking-widest">24H_VOL</span>
                            <span className="text-[9px] font-black tracking-tighter">{chartMetrics?.volume24h.split(' ')[0] || "0"}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[7px] text-muted-foreground uppercase mb-0.5 font-bold tracking-widest">FUNDING</span>
                            <span className="text-[9px] font-black text-primary tracking-tighter">{chartMetrics?.fundingRate || "N/A"}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[7px] text-muted-foreground uppercase mb-0.5 font-bold tracking-widest">OI</span>
                            <span className="text-[9px] font-black tracking-tighter">{chartMetrics?.openInterest || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DESKTOP VIEW: NO EXCESS SPACE --- */}
            <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-0 min-h-0 h-full overflow-hidden bg-background">
                {/* Main Content (Left Column) */}
                <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar min-h-0 border-r border-border">

                    {/* KPIs Section */}
                    <div className={cn("transition-all duration-700 ease-out", isLoading ? 'opacity-0' : 'opacity-100')}>
                        <KPICards analytics={analyticsData} isLoading={isLoading} isError={!!error} onRetry={handleRetry} />
                    </div>

                    {/* Positions Section */}
                    <div className={cn("transition-all duration-700 delay-100 ease-out", isLoading ? 'opacity-0' : 'opacity-100')}>
                        <PositionsTable positions={positionsData} isLoading={isLoading} isError={!!error} onRetry={handleRetry} />
                    </div>

                    {/* Chart Section - Grows to fill exactly the remaining space */}
                    <div className={cn("flex-grow min-h-0 transition-all duration-700 delay-200 ease-out flex flex-col", isLoading ? 'opacity-0' : 'opacity-100')}>
                        <PnLChart metrics={chartMetrics} chartData={historicalPnl} />
                    </div>
                </div>

                {/* Session Sidebar (Right Column) */}
                <div className={cn("hidden lg:flex lg:flex-col lg:w-80 bg-card/20 flex-shrink-0 border-l border-border h-full overflow-hidden transition-all duration-700", isLoading ? 'opacity-0' : 'opacity-100')}>
                    <header className="h-12 flex items-center px-6 font-black text-[10px] uppercase tracking-[0.3em] text-primary border-b border-border bg-black/20">
                        <Activity size={14} className="mr-3" /> SESSION_INTELLIGENCE
                    </header>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <SessionPerformance sessions={sessionData} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}