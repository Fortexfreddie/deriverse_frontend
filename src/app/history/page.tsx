'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { HistoryTable } from '@/components/history/HistoryTable'
import { HistoryMetrics } from '@/components/history/HistoryMetrics'
import { AuditStream } from '@/components/history/AuditStream' // We might need to make this adaptable or create a MobileAuditStream
import { PageLoader } from '@/components/PageLoader'
import { TradeDetailSidebar } from '@/components/history/TradeDetailSidebar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Trade {
  id: string
  timestamp: string
  market: string
  side: 'LONG' | 'SHORT'
  price: string
  size: string
  fee: string
  type: 'PERP' | 'SPOT'
  signature: string
}

const defaultTrades: Trade[] = [
  {
    id: '1',
    timestamp: '2026-02-13 19:52:10',
    market: 'SOL-USDC',
    side: 'LONG',
    price: '142.50 USDC',
    size: '420.00 SOL',
    fee: '0.05',
    type: 'PERP',
    signature: 'fWAn...3Uve',
  },
  {
    id: '2',
    timestamp: '2026-02-13 18:14:22',
    market: 'BTC-USDC',
    side: 'SHORT',
    price: '68,420.00 USDC',
    size: '2.50 BTC',
    fee: '12.40',
    type: 'PERP',
    signature: '9xK2...Lp9M',
  },
  {
    id: '3',
    timestamp: '2026-02-13 15:30:05',
    market: 'ETH-USDC',
    side: 'LONG',
    price: '3,210.55 USDC',
    size: '15.00 ETH',
    fee: '4.20',
    type: 'SPOT',
    signature: 'Qm8s...j7H2',
  },
  {
    id: '4',
    timestamp: '2026-02-12 22:15:00',
    market: 'SOL-USDC',
    side: 'SHORT',
    price: '144.20 USDC',
    size: '100.00 SOL',
    fee: '0.02',
    type: 'PERP',
    signature: 'Tr3x...9BvC',
  },
  {
    id: '5',
    timestamp: '2026-02-12 14:05:33',
    market: 'JUP-USDC',
    side: 'LONG',
    price: '1.24 USDC',
    size: '15,000 JUP',
    fee: '0.01',
    type: 'SPOT',
    signature: 'Kp9L...m5N2',
  },
  {
    id: '6',
    timestamp: '2026-02-12 09:12:45',
    market: 'BONK-USDC',
    side: 'SHORT',
    price: '0.000024 USDC',
    size: '50M BONK',
    fee: '0.15',
    type: 'PERP',
    signature: 'Zx8Y...q2W1',
  },
  {
    id: '7',
    timestamp: '2026-02-11 23:59:11',
    market: 'SOL-USDC',
    side: 'LONG',
    price: '138.90 USDC',
    size: '250.00 SOL',
    fee: '0.08',
    type: 'PERP',
    signature: 'Rv5T...s8K9',
  },
]

export default function HistoryPage() {

  const [filterMarket, setFilterMarket] = useState('ALL_MARKETS')
  const [filterType, setFilterType] = useState('ALL_TYPES')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const [detailSidebarOpen, setDetailSidebarOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleTradeClick = (trade: Trade) => {
    setSelectedTrade(trade)
    setDetailSidebarOpen(true)
  }

  const itemsPerPage = 7
  const filteredTrades = defaultTrades.filter((trade) => {
    const marketMatch = filterMarket === 'ALL_MARKETS' || trade.market.includes(filterMarket)
    const typeMatch = filterType === 'ALL_TYPES' || trade.type === filterType
    return marketMatch && typeMatch
  })

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedTrades = filteredTrades.slice(startIdx, startIdx + itemsPerPage)

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
            {paginatedTrades.map((trade) => (
                <div key={trade.id} onClick={() => handleTradeClick(trade)} className="border border-border bg-card hover:bg-white/5 transition-colors p-3 flex flex-col gap-2 relative group cursor-pointer">
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span className="font-bold text-foreground">{trade.market}</span>
                        <span>{trade.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase border ${trade.side === 'LONG' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent-pink/10 text-accent-pink border-accent-pink/20'}`}>
                                {trade.side}
                            </span>
                             <span className="text-[10px] text-muted-foreground border border-border px-1">{trade.type}</span>
                        </div>
                        <div className="text-right">
                             <div className="text-foreground font-bold text-xs">{trade.price}</div>
                             <div className="text-[10px] text-muted-foreground">{trade.size}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border mt-1">
                        <span className="text-[9px] text-muted-foreground font-mono">HASH: <span className="text-foreground/50">{trade.signature}</span></span>
                        <span className="text-[9px] text-muted-foreground font-mono">FEE: {trade.fee}</span>
                    </div>
                     <div className={`absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${trade.side === 'LONG' ? 'bg-primary' : 'bg-accent-pink'}`}></div>
                </div>
            ))}
        </section>

        {/* System Audit Stream */}
        <section className="px-3 pb-4">
            <div className="border border-border bg-black p-3 font-mono text-[9px] min-h-[100px] flex flex-col justify-end">
                <div className="text-muted-foreground border-b border-border pb-1 mb-2 flex justify-between">
                    <span>SYSTEM_AUDIT_STREAM</span>
                    <span className="text-primary animate-pulse">●</span>
                </div>
                <div className="flex flex-col gap-1">
                     <div className="text-muted-foreground animate-[typing_3.5s_steps(40,end)] overflow-hidden whitespace-nowrap">
                        <p><span className="text-primary mr-1">[INFO]</span>Order filled: {paginatedTrades[0]?.price || 'N/A'}</p>
                    </div>
                    <div className="text-muted-foreground animate-[typing_3.5s_steps(40,end)] overflow-hidden whitespace-nowrap" style={{ animationDelay: '1s' }}>
                        <p><span className="text-accent-pink mr-1">[WARN]</span>High slippage detected on #{paginatedTrades[1]?.id || 'N/A'}</p>
                    </div>
                     <div className="text-muted-foreground animate-[typing_3.5s_steps(40,end)] overflow-hidden whitespace-nowrap" style={{ animationDelay: '2s' }}>
                        <p><span className="text-primary mr-1">[INFO]</span>Syncing block 240592...</p>
                    </div>
                </div>
            </div>
        </section>
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
                    <SelectContent>
                      <SelectItem value="ALL_MARKETS">ALL_MARKETS</SelectItem>
                      <SelectItem value="SOL-USDC">SOL-USDC</SelectItem>
                      <SelectItem value="BTC-USDC">BTC-USDC</SelectItem>
                      <SelectItem value="ETH-USDC">ETH-USDC</SelectItem>
                      <SelectItem value="JUP-USDC">JUP-USDC</SelectItem>
                      <SelectItem value="BONK-USDC">BONK-USDC</SelectItem>
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
          {/* Metrics Header */}
          <header className="h-12 border-b border-border flex items-center px-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/20 flex-shrink-0">
            HISTORY_METRICS
          </header>

          {/* History Metrics */}
          <HistoryMetrics trades={filteredTrades} />

          {/* Audit Stream */}
          <AuditStream />
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
