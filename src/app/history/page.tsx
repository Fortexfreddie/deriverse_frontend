'use client'

import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { HistoryTable } from '@/components/history/HistoryTable'
import { HistoryMetrics } from '@/components/history/HistoryMetrics'
import { PageLoader } from '@/components/PageLoader'
import { TradeDetailSidebar } from '@/components/history/TradeDetailSidebar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TradeEvent } from '@/lib/api'
import { parsePositionId, formatDate } from '@/lib/utils'
import { useTradeHistory } from '@/hooks/useTradeHistory'
import { MARKET_MAP } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Activity, Shield, Hash, Layers, ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function HistoryPage() {
  const [filterMarket, setFilterMarket] = useState('ALL_MARKETS')
  const [filterType, setFilterType] = useState('ALL_TYPES')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { trades, summary, isLoading: isTradesLoading } = useTradeHistory({
    market: filterMarket === 'ALL_MARKETS' ? undefined : filterMarket,
    limit: 100,
    offset: 0
  })

  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const marketMatch = filterMarket === 'ALL_MARKETS' ||
        (trade.position?.market || parsePositionId(trade.positionId).market).includes(filterMarket)
      const typeMatch = filterType === 'ALL_TYPES' || trade.tradeType === filterType
      return marketMatch && typeMatch
    })
  }, [trades, filterMarket, filterType])

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedTrades = filteredTrades.slice(startIdx, startIdx + itemsPerPage)

  const [isLoading, setIsLoading] = useState(true)
  const [selectedTrade, setSelectedTrade] = useState<TradeEvent | null>(null)
  const [detailSidebarOpen, setDetailSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isTradesLoading) {
      const timer = setTimeout(() => setIsLoading(false), 1200)
      return () => clearTimeout(timer)
    }
    setIsLoading(true)
  }, [isTradesLoading])

  if (isLoading) return <PageLoader />

  const handleTradeClick = (trade: TradeEvent) => {
    setSelectedTrade(trade)
    setDetailSidebarOpen(true)
  }

  return (
    <DashboardLayout title="HISTORY // AUDIT">

      {/* --- MOBILE: AUDIT LOG VIEW --- */}
      <div className="flex flex-col md:hidden h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar bg-background font-mono">

        {/* Top Operational Stats */}
        <section className="p-4 space-y-4 border-b border-border bg-muted/5 shrink-0">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            <div className="min-w-[130px] flex-1 bg-card border border-border p-4 rounded-sm relative">
              <span className="text-[8px] text-muted-foreground uppercase tracking-widest block mb-1">Total_Audit_Logs</span>
              <span className="text-xl font-black tracking-tighter">{filteredTrades.length}</span>
              <div className="absolute top-0 right-0 p-1 opacity-20"><Shield size={10} className="text-primary" /></div>
            </div>
            <div className="min-w-[130px] flex-1 bg-card border border-border p-4 rounded-sm relative">
              <span className="text-[8px] text-muted-foreground uppercase tracking-widest block mb-1">Aggregated_Fees</span>
              <span className="text-xl font-black tracking-tighter">$0.67</span>
              <div className="absolute top-0 right-0 p-1 opacity-20"><Hash size={10} className="text-pink" /></div>
            </div>
          </div>

          <div className="bg-card border border-border p-4 rounded-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Layers size={12} className="text-primary opacity-50" />
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Type_Distribution</span>
              </div>
              <div className="text-[9px] font-black flex gap-3">
                <span className="text-primary">SPOT 35%</span>
                <span className="text-pink">PERP 65%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-muted/20 rounded-full overflow-hidden flex">
              <div className="h-full bg-primary" style={{ width: '35%' }} />
              <div className="h-full bg-pink" style={{ width: '65%' }} />
            </div>
          </div>
        </section>

        {/* Audit Entries */}
        <section className="px-4 py-6 flex-1 space-y-3">
          <div className="flex items-center justify-between opacity-40 mb-2 px-1">
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Operational_Sequence</span>
            <Activity size={12} />
          </div>

          {paginatedTrades.map((trade) => {
            const { market, side } = parsePositionId(trade.positionId)
            const displayMarket = market.length > 12 ? `${market.slice(0, 4)}..${market.slice(-4)}` : market

            return (
              <div
                key={trade.id}
                onClick={() => handleTradeClick(trade)}
                className="group border border-border bg-card/40 hover:bg-muted/10 p-4 rounded-sm relative active:scale-[0.98] transition-all cursor-pointer overflow-hidden shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="text-xs font-black tracking-tighter uppercase">{displayMarket}</div>
                    <div className="text-[9px] text-muted-foreground opacity-60 italic">{formatDate(trade.timestamp)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-foreground">{trade.price.toFixed(2)}</div>
                    <div className="text-[8px] text-muted-foreground font-bold tracking-widest uppercase">Price_Exec</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex gap-2">
                    <span className={cn(
                      "px-2 py-0.5 text-[8px] font-black rounded-xs border",
                      side === 'LONG' ? "bg-primary/10 border-primary/20 text-primary" : "bg-pink/10 border-pink/20 text-pink"
                    )}>
                      {side}
                    </span>
                    <span className="text-[8px] text-muted-foreground border border-border px-1.5 py-0.5 font-bold uppercase">{trade.tradeType}</span>
                  </div>
                  <div className="text-[9px] font-bold text-foreground opacity-80 uppercase tracking-tighter">
                    {trade.size.toFixed(4)} <span className="opacity-40 ml-0.5 italic">Vol</span>
                  </div>
                </div>

                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 transition-all opacity-40 group-hover:opacity-100",
                  side === 'LONG' ? "bg-primary" : "bg-pink"
                )} />
              </div>
            )
          })}

          {/* MOBILE PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="pt-6 pb-2 flex flex-col items-center gap-4">
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                Sector {currentPage} <span className="opacity-30">/</span> {totalPages}
              </div>
              <div className="flex items-center gap-2 w-full max-w-[240px]">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="flex-1 h-10 border border-border bg-card flex items-center justify-center rounded-sm disabled:opacity-20 active:bg-primary/10 transition-colors"
                >
                  <ChevronLeft size={16} className="text-primary" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="flex-1 h-10 border border-border bg-card flex items-center justify-center rounded-sm disabled:opacity-20 active:bg-primary/10 transition-colors"
                >
                  <ChevronRight size={16} className="text-primary" />
                </button>
              </div>
            </div>
          )}

          {filteredTrades.length === 0 && (
            <div className="py-20 text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-30 italic">
              No audit logs found for current filter
            </div>
          )}
        </section>
      </div>

      {/* --- DESKTOP: FULL AUDIT GRID --- */}
      <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-0 h-full overflow-hidden bg-background">
        <div className="flex-1 flex flex-col min-w-0 border-r border-border h-full overflow-hidden">

          {/* Header Controls */}
          <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/30 flex-shrink-0 backdrop-blur-sm z-10 font-mono">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Market</span>
                <Select value={filterMarket} onValueChange={(v) => { setFilterMarket(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[130px] h-8 text-[10px] bg-background border-border font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border font-mono">
                    <SelectItem value="ALL_MARKETS" className="text-[10px]">ALL_MARKETS</SelectItem>
                    {Object.values(MARKET_MAP).map(m => <SelectItem key={m} value={m} className="text-[10px]">{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 border-l border-border pl-6">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Security_Type</span>
                <Select value={filterType} onValueChange={(v) => { setFilterType(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[100px] h-8 text-[10px] bg-background border-border font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border font-mono">
                    <SelectItem value="ALL_TYPES" className="text-[10px]">ALL_TYPES</SelectItem>
                    <SelectItem value="PERP" className="text-[10px]">PERP</SelectItem>
                    <SelectItem value="SPOT" className="text-[10px]">SPOT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <button className="h-8 px-4 bg-primary text-black font-black text-[9px] uppercase tracking-widest rounded-xs hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all">
              Export_Audit_CSV
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-background/20">
            <HistoryTable trades={paginatedTrades} onTradeClick={handleTradeClick} />
          </div>

          <div className="h-10 bg-black border-t border-border flex items-center justify-between px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredTrades.length)} of {filteredTrades.length} Sequences
            </div>
            <div className="flex items-center gap-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="hover:text-primary disabled:opacity-30 transition-colors"
              >
                &lt; Previous
              </button>
              <span className="text-foreground border-x border-border px-4">Sector {currentPage}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="hover:text-primary disabled:opacity-30 transition-colors"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-col lg:w-80 bg-card/10 flex-shrink-0 h-full overflow-hidden">
          <header className="h-14 flex items-center px-6 font-black text-[10px] uppercase tracking-[0.3em] text-primary border-b border-border bg-black/20">
            <Activity size={14} className="mr-3" /> Audit_Analytics
          </header>
          <ScrollArea className="flex-1">
            <HistoryMetrics summary={summary} />
          </ScrollArea>
        </div>
      </div>

      <TradeDetailSidebar
        trade={selectedTrade}
        isOpen={detailSidebarOpen}
        onClose={() => setDetailSidebarOpen(false)}
      />
    </DashboardLayout>
  )
}