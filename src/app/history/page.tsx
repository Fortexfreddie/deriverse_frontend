'use client'


import { useState, useEffect } from 'react'
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



export default function HistoryPage() {

  const [filterMarket, setFilterMarket] = useState('ALL_MARKETS')
  const [filterType, setFilterType] = useState('ALL_TYPES')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Increased from 7 to fill space better

  const { trades, summary, total, isLoading: isTradesLoading } = useTradeHistory({
      market: filterMarket === 'ALL_MARKETS' ? undefined : filterMarket,
      limit: 100, // Fetch more to allow client-side filtering for Type
      offset: 0 // For now, we fetch a batch and filter client side for better UX on small datasets
  })

  // Client-side filtering for Type (since API might not support it yet) and re-pagination
  // In a real large-scale app, we'd pass all filters to the API.
  const filteredTrades = trades.filter((trade) => {
      // Market is already filtered by API if provided, but double check for safety
      const marketMatch = filterMarket === 'ALL_MARKETS' || 
          (trade.position?.market || parsePositionId(trade.positionId).market).includes(filterMarket)
      const typeMatch = filterType === 'ALL_TYPES' || trade.tradeType === filterType
      return marketMatch && typeMatch
  })

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedTrades = filteredTrades.slice(startIdx, startIdx + itemsPerPage)

  const [isLoading, setIsLoading] = useState(true)
  const [selectedTrade, setSelectedTrade] = useState<TradeEvent | null>(null)
  const [detailSidebarOpen, setDetailSidebarOpen] = useState(false)

  useEffect(() => {
    // Sync local loading state with hook, but ensure at least 1.2s load for effect
    if (!isTradesLoading) {
        const timer = setTimeout(() => setIsLoading(false), 1200)
        return () => clearTimeout(timer)
    }
    setIsLoading(true);
  }, [isTradesLoading])

  if (isLoading) {
    return <PageLoader />
  }

  const handleTradeClick = (trade: TradeEvent) => {
    setSelectedTrade(trade)
    setDetailSidebarOpen(true)
  }

  return (
    <DashboardLayout title="HISTORY // AUDIT">
      
      {/* Mobile Structure (War Room Audit Log v2) */}
      <div className="flex flex-col md:hidden min-h-0 h-full overflow-y-auto custom-scrollbar pb-20 bg-background font-mono">
        {/* Top Stats */}
        <section className="p-3 flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                <div className="min-w-[120px] flex-1 border border-border bg-card p-3 relative group">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Total Trades</div>
                    <div className="text-lg text-foreground font-bold">{filteredTrades.length}</div>
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-primary opacity-50"></div>
                </div>
                <div className="min-w-[120px] flex-1 border border-border bg-card p-3 relative group">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Total Fees</div>
                    <div className="text-lg text-foreground font-bold">$0.67</div>
                     <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-accent-pink opacity-50"></div>
                </div>
                <div className="min-w-[140px] flex-[1.2] border border-border bg-card p-3 relative group">
                    <div className="flex justify-between items-start mb-1">
                        <div className="text-[9px] text-muted-foreground uppercase tracking-widest">Net Vol</div>
                        <div className="text-[8px] text-primary bg-primary/10 px-1 py-0.5 rounded-sm">+12.4%</div>
                    </div>
                    <div className="text-lg text-foreground font-bold">$1.24M</div>
                </div>
            </div>

            {/* Distribution Bar */}
            <div className="border border-border bg-card p-3">
                <div className="flex justify-between items-end mb-2">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-widest">DISTRIBUTION</div>
                    <div className="flex gap-3 text-[9px] font-bold">
                        <span className="text-primary">SPOT 35%</span>
                        <span className="text-accent-pink">PERP 65%</span>
                    </div>
                </div>
                <div className="w-full h-1.5 bg-background flex">
                    <div className="h-full bg-primary w-[35%]"></div>
                    <div className="h-full bg-accent-pink w-[65%]"></div>
                </div>
            </div>
        </section>

        {/* Trade Entries */}
        <section className="px-3 pb-4 flex flex-col gap-2">
            <div className="text-[9px] text-muted-foreground uppercase tracking-widest pl-1 mb-1">TRADE_ENTRIES</div>
            {paginatedTrades.map((trade) => {
                const { market, side } = parsePositionId(trade.positionId)
                
                // Truncate market if it's too long (e.g. a public key)
                const displayMarket = market.length > 12 ? `${market.slice(0, 4)}...${market.slice(-4)}` : market;
                
                return (
                <div key={trade.id} onClick={() => handleTradeClick(trade)} className="border border-border bg-card hover:bg-white/5 transition-colors p-3 flex flex-col gap-2 relative group cursor-pointer overflow-hidden">
                    <div className="flex justify-between items-center text-[9px] text-muted-foreground">
                        <span className="font-bold text-foreground text-[10px] truncate max-w-[150px]">{displayMarket}</span>
                        <span className="shrink-0">{formatDate(trade.timestamp)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase border ${side === 'LONG' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent-pink/10 text-accent-pink border-accent-pink/20'}`}>
                                {side}
                            </span>
                             <span className="text-[9px] text-muted-foreground border border-border px-1">{trade.tradeType}</span>
                        </div>
                        <div className="text-right shrink-0">
                             <div className="text-foreground font-bold text-xs">{trade.price.toFixed(2)}</div>
                             <div className="text-[9px] text-muted-foreground uppercase">{trade.size.toFixed(4)} <span className="text-[8px] opacity-50">SIZE</span></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border mt-1">
                        <span className="text-[8px] text-muted-foreground font-mono flex-1 truncate mr-2">
                            HASH: <span className="text-foreground/50">{trade.signature.slice(0, 8)}...{trade.signature.slice(-4)}</span>
                        </span>
                        <span className="text-[8px] text-muted-foreground font-mono shrink-0">FEE: {trade.fee.toFixed(4)}</span>
                    </div>
                     <div className={`absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${side === 'LONG' ? 'bg-primary' : 'bg-accent-pink'}`}></div>
                </div>
            )})}
        </section>

        {/* Spacing */}
        <div className="h-4"></div>
      </div>

      {/* Desktop Grid (Original) */}
      <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-0 min-h-0 h-full">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-background w-full overflow-y-auto custom-scrollbar min-h-0">
          {/* Filters */}
          <div className="h-12 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 bg-card/50 gap-2 sm:gap-4 py-2 sm:py-0 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-[9px] sm:text-[10px] text-muted-foreground uppercase">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="whitespace-nowrap">Filter:</span>
                  <Select value={filterMarket} onValueChange={(value) => {
                    setFilterMarket(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-[110px] h-7 text-[10px] bg-card border-border">
                      <SelectValue placeholder="MARKET" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      <SelectItem value="ALL_MARKETS">ALL_MARKETS</SelectItem>
                      {Object.values(MARKET_MAP).map((market) => (
                        <SelectItem key={market} value={market}>{market}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="whitespace-nowrap">Type:</span>
                  <Select value={filterType} onValueChange={(value) => {
                    setFilterType(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-[110px] h-7 text-[10px] bg-card border-border">
                      <SelectValue placeholder="TYPE" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_TYPES">ALL_TYPES</SelectItem>
                      <SelectItem value="PERP">PERP</SelectItem>
                      <SelectItem value="SPOT">SPOT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            <button className="text-[9px] sm:text-[10px] uppercase text-primary border border-primary/30 px-2 sm:px-3 py-1 rounded hover:bg-primary/10 transition whitespace-nowrap">
              Export CSV
            </button>
          </div>

          {/* History Table */}
          <HistoryTable trades={paginatedTrades} onTradeClick={handleTradeClick} />

          {/* Pagination */}
          <div className="h-8 bg-card border-t border-border flex items-center justify-between px-4 sm:px-6 text-[9px] sm:text-[10px] uppercase text-muted-foreground flex-shrink-0">
            <div>Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredTrades.length)} of {filteredTrades.length} Records</div>
            <div className="flex gap-2 sm:gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="hover:text-foreground disabled:opacity-50 transition"
              >
                PREV
              </button>
              <span className="text-foreground">PAGE {currentPage}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="hover:text-foreground disabled:opacity-50 transition"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile/tablet */}
        <div className="hidden lg:flex lg:flex-col lg:w-80 bg-card flex-shrink-0 border-l border-border overflow-hidden">
          {/* History Metrics */}
          <header className="h-12 border-b border-border flex items-center px-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/20 flex-shrink-0">
            HISTORY_METRICS
          </header>
          <HistoryMetrics summary={summary} />

        </div>
      </div>

      {/* Trade Detail Sidebar */}
      <TradeDetailSidebar
        trade={selectedTrade}
        isOpen={detailSidebarOpen}
        onClose={() => setDetailSidebarOpen(false)}
      />
    </DashboardLayout>
  )
}
