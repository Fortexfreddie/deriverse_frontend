"use client"

import React, { useState, useEffect, useCallback, useContext, createContext } from "react"
import { 
    fetchDashboard, 
    fetchAnalytics, 
    fetchTrades, 
    fetchHistoricalPnl,
    WalletPerformance,
    ComprehensiveAnalytics,
    TradeEvent,
    HistoricalPnl,
    Position
} from "@/lib/api"
import { 
    dashboardData as mockDashboard,  
    analyticsData as mockAnalytics, 
    equityCurveData as mockHistory,
    tradeHistory as mockTrades
} from "@/lib/mock-data"

interface TradesPagination {
    page: number
    total: number
    hasMore: boolean
}

interface AnalyticsContextValue {
    wallet: string | null
    isDemoMode: boolean
    error: string | null
    updateWallet: (wallet: string | null) => void
    disconnect: () => void
    dashboardData: WalletPerformance[]
    analyticsData: ComprehensiveAnalytics | null
    trades: TradeEvent[]
    tradesPagination: TradesPagination
    historicalPnl: HistoricalPnl[]
    isLoading: boolean
    isLoadingTrades: boolean
    refreshDashboard: () => Promise<void>
    refreshAnalytics: (filters?: Record<string, string | number | boolean | undefined>) => Promise<void>
    refreshTrades: (page?: number, limit?: number) => Promise<void>
    refreshHistory: (days?: number) => Promise<void>
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const [wallet, setWallet] = useState<string | null>(null)

    // Hydrate wallet from localStorage on client only (avoids SSR mismatch)
    useEffect(() => {
        const stored = localStorage.getItem("deriverse_wallet")
        if (stored) setWallet(stored)
    }, [])

    const isDemoMode = !wallet

    const [dashboardData, setDashboardData] = useState<WalletPerformance[]>([])
    const [analyticsData, setAnalyticsData] = useState<ComprehensiveAnalytics | null>(null)
    const [trades, setTrades] = useState<TradeEvent[]>([])
    const [tradesPagination, setTradesPagination] = useState<TradesPagination>({ page: 1, total: 0, hasMore: false })
    const [historicalPnl, setHistoricalPnl] = useState<HistoricalPnl[]>([])
    
    // Loading states
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(false)
    const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)
    const [isLoadingTrades, setIsLoadingTrades] = useState(false)
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)

    // Errors
    const [error, setError] = useState<string | null>(null)

    const updateWallet = useCallback((newWallet: string | null) => {
        setWallet(prev => {
            if (prev === newWallet) return prev
            if (newWallet) {
                localStorage.setItem("deriverse_wallet", newWallet)
            } else {
                localStorage.removeItem("deriverse_wallet")
            }
            return newWallet
        })
        setError(null)
    }, [])

    const disconnect = useCallback(() => updateWallet(null), [updateWallet])

    const loadDashboard = useCallback(async () => {
        // Mock data only for now - no backend connection
        setDashboardData(mockDashboard)
        setIsLoadingDashboard(false)
    }, [])

    const loadAnalytics = useCallback(async (filters?: Record<string, string | number | boolean | undefined>) => {
        // Mock data only for now - no backend connection
        setAnalyticsData(mockAnalytics as unknown as ComprehensiveAnalytics)
        setIsLoadingAnalytics(false)
    }, [])

    const loadTrades = useCallback(async (page = 1, limit = 10) => {
        // Mock data only for now - no backend connection
        // Simulate pagination
        const start = (page - 1) * limit
        const end = start + limit
        const paginatedTrades = mockTrades.slice(start, end).map(t => ({
            id: t.id,
            signature: "5x8...",
            positionId: "POS-...",
            price: t.entry,
            size: t.size,
            fee: t.fees,
            isEntry: false, // simplified
            orderType: "MARKET",
            tradeType: t.side,
            notes: null,
            timestamp: t.date,
            position: {
                id: "POS-...",
                walletAddress: "...",
                market: t.market,
                side: t.side,
                status: "CLOSED" as "CLOSED",
                avgEntryPrice: t.entry,
                avgExitPrice: t.exit,
                totalSize: t.size,
                totalFees: t.fees,
                realizedPnl: t.pnl,
                notes: null,
                strategyUsed: null,
                rating: null,
                emotion: null,
                aiReview: null,
                aiBias: null,
                aiInsight: null,
                aiAdvice: null,
                aiScore: null,
                aiNextAction: null,
                actualExitPrice: t.exit,
                hypotheticalExitPrice: null,
                opportunityCost: null,
                opportunityCostNote: null,
                newsHeadlines: null,
                marketSentiment: null,
                macroContext: null,
                traderProfile: null,
                tradeFrequency: null,
                lastNudge: null,
                createdAt: t.date,
                updatedAt: t.date,
                closedAt: t.date
            }
        }))

        setTrades(paginatedTrades) 
        setTradesPagination({ 
            page, 
            total: mockTrades.length, 
            hasMore: end < mockTrades.length 
        })
        setIsLoadingTrades(false)
    }, [])

    const loadHistory = useCallback(async (days = 30) => {
        // Mock data only for now - no backend connection
        setHistoricalPnl(mockHistory.map(h => ({ 
             date: h.date, 
             cumulativePnl: h.pnl, 
             pnl: h.pnl
         })))
        setIsLoadingHistory(false)
    }, [])

    // Initial load
    useEffect(() => {
        loadDashboard()
        loadAnalytics()
        loadTrades()
        loadHistory()
    }, [wallet, loadDashboard, loadAnalytics, loadTrades, loadHistory])

    const value: AnalyticsContextValue = {
        wallet,
        isDemoMode,
        error,
        updateWallet,
        disconnect,
        dashboardData,
        analyticsData,
        trades,
        tradesPagination,
        historicalPnl,
        isLoading: (isLoadingDashboard || isLoadingAnalytics) && !!wallet,
        isLoadingTrades: isLoadingTrades && !!wallet,
        refreshDashboard: loadDashboard,
        refreshAnalytics: loadAnalytics,
        refreshTrades: loadTrades,
        refreshHistory: loadHistory
    }

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    )
}

export function useAnalytics() {
    const context = useContext(AnalyticsContext)
    if (!context) {
        throw new Error("useAnalytics must be used within an AnalyticsProvider")
    }
    return context
}
