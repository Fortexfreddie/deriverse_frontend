'use client'

import { useState, useEffect } from 'react'
import { startOfMonth, endOfMonth } from 'date-fns'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PageLoader } from '@/components/PageLoader'
import { DrawdownChart } from '@/components/dashboard/DrawdownChart'
import { MainAnalyticsChart } from '@/components/dashboard/MainAnalyticsChart'
import { RefreshCcw } from 'lucide-react'

import { DatePicker } from '@/components/ui/date-picker'
import { CompositionChart } from '@/components/dashboard/CompositionChart'
import { Heatmap } from '@/components/dashboard/Heatmap'
import { Leaderboard } from '@/components/dashboard/Leaderboard'
import { SessionPerformance } from '@/components/dashboard/SessionPerformance'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useAnalytics } from '@/hooks/use-analytics'
import { MARKET_MAP } from '@/lib/constants'



const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function AnalyticsPage() {
  const [filterMarket, setFilterMarket] = useState('ALL_MARKETS')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date('2026-02-01'))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date('2026-02-09'))

  // Use the hook to fetch real data
  const {
    data: analyticsData,
    heatmapData,
    leaderboardData,
    compositionData,
    historicalPnlData,
    drawdownData,
    isLoading,
    refetch,
    isDemo
  } = useAnalytics({
    market: filterMarket === 'ALL_MARKETS' ? undefined : filterMarket,
    startDate,
    endDate
  })

  // Transform Session Performance for right sidebar
  const sessionData = analyticsData ? Object.entries(analyticsData.sessionPerformance).map(([name, data]) => ({
    name: name.toUpperCase() + ' SESSION',
    status: (name === 'New York' ? 'ACTIVE' : 'CLOSED') as 'ACTIVE' | 'CLOSED',
    pnl: `$${data.pnl.toFixed(2)}`,
    return: `${data.pnl >= 0 ? '+' : ''}${((data.pnl / (analyticsData.totalPnl.total || 1)) * 100).toFixed(1)}%`
  })) : undefined

  // Min loader time for UX consistency
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!isLoading) {
      timer = setTimeout(() => setShowLoader(false), 1200)
    } else {
      // ensure state update occurs asynchronously to satisfy lint rule
      timer = setTimeout(() => setShowLoader(true), 0)
    }
    return () => clearTimeout(timer)
  }, [isLoading])

  if (showLoader) {
    return <PageLoader />
  }

  // Helper to safely access market data, ensuring fallback if data is missing or structure changes
  const solData = analyticsData?.marketPerformance?.['SOL-USDC'] || { pnl: 0, volume: 0, winRate: 0, tradeCount: 0 }

  return (
    <DashboardLayout title="ANALYTICS">

      {/* Mobile Structure (Mobile Risk Engine) */}
      <div className="flex flex-col md:hidden h-[calc(100vh-3.5rem)] overflow-y-auto bg-background font-mono relative">

        {/* KPI Grid (3 cols) */}
        <div className="p-2 grid grid-cols-3 gap-2">
          <div className="bg-card border border-border p-2 rounded flex flex-col justify-between h-20 relative overflow-hidden group text-foreground">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">PF</div>
            <div className="text-xl text-primary font-bold">{analyticsData?.riskMetrics?.profitFactor?.toFixed(2) || '0.00'}</div>
            <div className="text-[9px] text-muted-foreground">▲ 0.2</div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary/10 blur-xl"></div>
          </div>
          <div className="bg-card border border-border p-2 rounded flex flex-col justify-between h-20 relative overflow-hidden group text-foreground">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">EXP</div>
            <div className="text-xl text-foreground font-bold">{analyticsData?.riskMetrics?.expectancy?.toFixed(2) || '0.00'}</div>
            <div className="text-[9px] text-accent-pink">Risk: Hi</div>
          </div>
          <div className="bg-card border border-border p-2 rounded flex flex-col justify-between h-20 relative overflow-hidden group text-foreground">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">WIN%</div>
            <div className="text-xl text-foreground font-bold">{analyticsData?.winRate || 0}%</div>
            <div className="w-full h-1 bg-muted rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${analyticsData?.winRate || 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Composition Chart (Mobile) */}
        <div className="px-2 pb-2">
          <div className="bg-card border border-border rounded p-3 h-64">
            <CompositionChart data={compositionData} />
          </div>
        </div>

        {/* Heatmap (Mobile) */}
        <div className="px-2 pb-2">
          <div className="bg-card border border-border rounded p-3">
            <Heatmap
              data={heatmapData}
              currentMonth={startDate || new Date()}
              onMonthChange={(date) => {
                setStartDate(startOfMonth(date))
                setEndDate(endOfMonth(date))
              }}
            />
          </div>
        </div>

        {/* Leaderboard (Mobile) */}
        <div className="px-2 pb-2">
          <div className="bg-card border border-border rounded p-3 h-64">
            <Leaderboard data={leaderboardData} />
          </div>
        </div>

        {/* Drawdown Chart */}
        <div className="px-2 pb-2">
          <div className="bg-card border border-border rounded p-3 relative h-64 flex flex-col overflow-hidden">
            <div className="flex justify-between items-start mb-2 z-10">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">MAX_DRAWDOWN</div>
                <div className="text-2xl text-accent-pink font-bold leading-none mt-1">
                  {analyticsData?.riskMetrics?.maxDrawdown || 0}%
                </div>
              </div>
              <div className="text-[9px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded border border-white/10 font-bold uppercase tracking-widest">
                1D View
              </div>
            </div>

            {/* Chart Area - top-12 provides clear space for the header text */}
            <div className="absolute inset-x-0 bottom-0 top-12 px-2 pb-2">
              {/* Background Grid Lines - Scaled for higher density */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 px-2 pb-6 pt-4">
                <div className="w-full h-px border-t border-dashed border-muted-foreground"></div>
                <div className="w-full h-px border-t border-dashed border-muted-foreground"></div>
                <div className="w-full h-px border-t border-dashed border-muted-foreground"></div>
                <div className="w-full h-px border-t border-dashed border-muted-foreground"></div>
                <div className="w-full h-px border-t border-dashed border-muted-foreground"></div>
              </div>

              {/* Drawdown Chart Component */}
              <DrawdownChart data={drawdownData} />
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
                <div className="text-sm text-primary font-bold">{solData?.pnl ? `+$${solData.pnl.toLocaleString()}` : '$0.00'}</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-muted-foreground mb-0.5">VOLUME (SOL)</div>
                <div className="text-sm text-foreground">{solData.volume.toLocaleString()}</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-muted-foreground mb-0.5">AVG ENTRY</div>
                <div className="text-sm text-foreground">$141.20</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-muted-foreground mb-0.5">FEES PAID</div>
                <div className="text-sm text-accent-pink">-${analyticsData.totalFees.toFixed(2)}</div>
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
                    <span className="text-[10px] text-primary font-bold">${analyticsData?.sessionPerformance?.['Asian']?.pnl || 0}</span>
                    <span className="text-[9px] text-muted-foreground/80">0%</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 w-[0%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground">LONDON</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-foreground font-bold">${analyticsData?.sessionPerformance?.['London']?.pnl || 0}</span>
                    <span className="text-[9px] text-muted-foreground/80">0%</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary/40 w-[0%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-foreground font-bold flex items-center gap-1">
                    NY SESSION <span className="w-1 h-1 bg-primary rounded-full animate-pulse"></span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-primary font-bold">${analyticsData?.sessionPerformance?.['New York']?.pnl || 0}</span>
                    <span className="text-[9px] text-muted-foreground/80">0%</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[0%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-4"></div>

      </div>

      {/* Desktop Dashboard Grid (Original) */}
      <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-0 min-h-0 h-[calc(100vh-64px)] overflow-hidden">

        {/* Left Content Area */}
        <div className="flex-1 flex flex-col bg-background w-full overflow-y-auto custom-scrollbar min-h-0">

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col"
          >

            {/* KPI Cards */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border-b border-border p-2 sm:p-4 shrink-0">
              {/* Profit Factor */}
              <div className="bg-card p-4 rounded relative overflow-hidden group hover:border-primary/30 transition-colors border border-transparent">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Profit Factor</div>
                <div className="text-4xl font-mono text-primary font-bold">{analyticsData?.riskMetrics?.profitFactor?.toFixed(2) || '0.00'}</div>
                <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                  <span className="text-primary">▲ 0.2</span> vs last session
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/5 blur-xl group-hover:bg-primary/10 transition"></div>
              </div>

              {/* Expectancy */}
              <div className="bg-card p-4 rounded relative overflow-hidden group hover:border-primary/30 transition-colors border border-transparent">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Expectancy (R)</div>
                <div className="text-4xl font-mono text-foreground font-bold">{analyticsData?.riskMetrics?.expectancy?.toFixed(2) || '0.00'}</div>
                <div className="text-[10px] text-muted-foreground mt-2">
                  Avg Win: <span className="text-primary">${analyticsData?.avgWin?.toFixed(2) || '0.00'}</span> / Avg Loss: <span className="text-pink">${Math.abs(analyticsData?.avgLoss || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Win Rate */}
              <div className="bg-card p-4 rounded relative overflow-hidden group hover:border-primary/30 transition-colors border border-transparent">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Win Rate</div>
                <div className="text-4xl font-mono text-foreground font-bold">{analyticsData?.winRate || 0}%</div>
                <div className="w-full h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-linear-to-r from-primary to-primary/80" style={{ width: `${analyticsData?.winRate || 0}%` }}></div>
                </div>
              </div>
            </motion.div>

            {/* Max Drawdown Chart - Fixed Height to enable scrolling */}
            {/* Main Chart Section */}
            <motion.div variants={item} className="bg-card border border-border p-4 rounded m-4 mb-2 shrink-0 flex flex-col relative">
              {/* Chart Filters & Header */}
              <div className="flex flex-col gap-6 mb-6">
                {/* Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-background/50 p-2 border border-border rounded-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-icons text-sm">tune</span>
                      <span className="text-[10px] font-mono font-bold tracking-widest">CHART_FILTERS</span>
                    </div>
                    <div className="h-4 w-px bg-border"></div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                      {/* Use Select for Market now */}
                      <Select value={filterMarket} onValueChange={setFilterMarket}>
                        <SelectTrigger className="w-31 h-6 text-[10px] bg-background border-border">
                          <SelectValue placeholder="MARKET" />
                        </SelectTrigger>
                        <SelectContent className="max-h-75 overflow-y-auto">
                          <SelectItem value="ALL_MARKETS">ALL_MARKETS</SelectItem>
                          {Object.values(MARKET_MAP).map((market) => (
                            <SelectItem key={market} value={market}>{market}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="h-4 w-px bg-border mx-2"></div>

                      <span>START:</span>
                      <DatePicker date={startDate} setDate={setStartDate} />
                      <span>END:</span>
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isDemo && (
                      <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-mono rounded">
                        DEMO MODE
                      </div>
                    )}

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
                  <div className="text-4xl sm:text-5xl font-mono text-primary font-bold tracking-tight shadow-primary/20 drop-shadow-sm">${analyticsData?.totalPnl?.total?.toFixed(2) || '0.00'}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-2">Date: 2026-02-09</div>
                </div>
              </div>

              {/* Chart Graphic */}
              <div className="w-full h-75 relative mt-2 border-t border-border/50 pt-6">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 pt-6">
                  <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
                  <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
                  <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
                  <div className="w-full h-px bg-border border-t border-dashed border-muted-foreground/30"></div>
                </div>
                <MainAnalyticsChart data={historicalPnlData} />
              </div>
            </motion.div>

            {/* Heatmap & Composition & Leaderboard */}
            <motion.div variants={item} className="mx-4 mb-4 grid grid-cols-1 md:grid-cols-12 gap-2 shrink-0">
              {/* Heatmap */}
              <div className="md:col-span-6 lg:col-span-4 bg-card border border-border rounded p-4 h-75">
                <Heatmap
                  data={heatmapData}
                  currentMonth={startDate || new Date()}
                  onMonthChange={(date) => {
                    setStartDate(startOfMonth(date))
                    setEndDate(endOfMonth(date))
                  }}
                />
              </div>

              {/* Composition */}
              <div className="md:col-span-6 lg:col-span-4 bg-card border border-border rounded p-4 h-75">
                <CompositionChart data={compositionData} />
              </div>

              {/* Leaderboard */}
              <div className="md:col-span-12 lg:col-span-4 bg-card border border-border rounded p-4 h-75">
                <Leaderboard data={leaderboardData} />
              </div>
            </motion.div>

            {/* SOL-PERP Metrics */}
            <motion.div variants={item} className="mx-4 mb-10 border border-border rounded bg-card shrink-0 overflow-hidden">
              <div className="h-10 border-b border-border flex items-center justify-between px-4 bg-muted/20">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-foreground font-bold tracking-widest">SOL-PERP METRICS</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">24H PERFORMANCE</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
                <div className="p-4">
                  <div className="text-[10px] font-mono text-muted-foreground mb-1">REALIZED PNL</div>
                  <div className="text-lg font-mono text-primary font-bold">{solData.pnl ? `+$${solData.pnl.toLocaleString()}` : '$0.00'}</div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-mono text-muted-foreground mb-1">TOTAL VOLUME</div>
                  <div className="text-lg font-mono text-foreground">{solData.volume.toLocaleString()} SOL</div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-mono text-muted-foreground mb-1">AVG ENTRY</div>
                  <div className="text-lg font-mono text-foreground">$141.20</div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-mono text-muted-foreground mb-1">FEES PAID</div>
                  <div className="text-lg font-mono text-pink">-${analyticsData.totalFees.toFixed(2)}</div>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>

        {/* Right Sidebar - Session Performance & Logs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex lg:flex-col lg:w-80 bg-card shrink-0 border-l border-border h-full overflow-hidden"
        >
          <header className="h-12 border-b border-border flex items-center px-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/10 shrink-0">
            SESSION_PERFORMANCE
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <SessionPerformance sessions={sessionData} />
          </div>

          {/* FIXED FOOTER (Always visible at the bottom) */}
          <div className="p-4 border-t border-border bg-card shrink-0">
            <button
              onClick={() => refetch()}
              className="w-full bg-foreground hover:bg-muted-foreground text-background font-mono font-bold text-xs py-3 rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <RefreshCcw size={14} />
              REFRESH_ANALYTICS
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout >
  )
}