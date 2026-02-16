'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { HistoryTable } from '@/components/history/HistoryTable'
import { HistoryMetrics } from '@/components/history/HistoryMetrics'
import { AuditStream } from '@/components/history/AuditStream'
import { PageLoader } from '@/components/PageLoader'
import { TradeDetailSidebar } from '@/components/history/TradeDetailSidebar'
import { ChevronDown } from 'lucide-react'

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

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <DashboardLayout title="DASHBOARD // TRADE_HISTORY">
      {/* Dashboard Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 min-h-0 h-full">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-background w-full overflow-y-auto custom-scrollbar min-h-0">
          {/* Filters */}
          <div className="h-12 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 bg-card/50 gap-2 sm:gap-4 py-2 sm:py-0 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-[9px] sm:text-[10px] text-muted-foreground uppercase">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="whitespace-nowrap">Filter:</span>
                <div className="relative">
                  <select
                    value={filterMarket}
                    onChange={(e) => {
                      setFilterMarket(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="bg-card text-foreground border border-border pl-2 pr-6 py-1 rounded text-[9px] sm:text-[10px] appearance-none focus:outline-none focus:border-primary cursor-pointer hover:bg-muted/20 transition-colors"
                  >
                    <option>ALL_MARKETS</option>
                    <option>SOL-USDC</option>
                    <option>BTC-USDC</option>
                    <option>ETH-USDC</option>
                    <option>JUP-USDC</option>
                    <option>BONK-USDC</option>
                  </select>
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronDown size={10} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="whitespace-nowrap">Type:</span>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="bg-card text-foreground border border-border pl-2 pr-6 py-1 rounded text-[9px] sm:text-[10px] appearance-none focus:outline-none focus:border-primary cursor-pointer hover:bg-muted/20 transition-colors"
                  >
                    <option>ALL_TYPES</option>
                    <option>PERP</option>
                    <option>SPOT</option>
                  </select>
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronDown size={10} />
                  </div>
                </div>
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
