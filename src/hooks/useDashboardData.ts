'use client'

import { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { 
    fetchDashboard, 
    fetchAnalytics, 
    fetchHistoricalPnl,
    fetchDrawdown,
    syncWallet, 
    DashboardPosition, 
    ComprehensiveAnalytics 
} from '@/lib/api'
import { 
    dashboardData as MOCK_POSITIONS, 
    analyticsData as MOCK_ANALYTICS,
    equityCurveData,
    drawdownData
} from '@/lib/mock-data'

export function useDashboardData() {
    const { publicKey } = useWallet()
    const queryClient = useQueryClient()
    const walletAddress = publicKey?.toBase58()

    // Local state to track if we've already synced this session/wallet
    const [hasSynced, setHasSynced] = useState(false)
    const [showSyncLoader, setShowSyncLoader] = useState(false)

    // Sync state initialization and persistence
    useEffect(() => {
        if (walletAddress) {
            const alreadySynced = sessionStorage.getItem(`synced-${walletAddress}`) === 'true'
            if (alreadySynced) {
                // delay to satisfy hook lint rule
                setTimeout(() => setHasSynced(true), 0)
            }
        } else {
            setHasSynced(false)
        }
    }, [walletAddress])

    // Clear data on disconnect
    useEffect(() => {
        if (!walletAddress) {
            queryClient.removeQueries({ queryKey: ['dashboard'] })
            queryClient.removeQueries({ queryKey: ['analytics'] })
            queryClient.removeQueries({ queryKey: ['historicalPnl'] })
            queryClient.removeQueries({ queryKey: ['drawdown'] })
            setHasSynced(false)
            setShowSyncLoader(false)
        }
    }, [walletAddress, queryClient])

    // Mutation for Syncing Wallet
    const syncMutation = useMutation({
        mutationFn: syncWallet,
        onSuccess: (data) => {
            console.log("Sync successful:", data)
            setHasSynced(true)
            if (walletAddress) {
                sessionStorage.setItem(`synced-${walletAddress}`, 'true')
            }
            queryClient.invalidateQueries({ queryKey: ['dashboard', walletAddress] })
            queryClient.invalidateQueries({ queryKey: ['analytics', walletAddress] })
            queryClient.invalidateQueries({ queryKey: ['historicalPnl', walletAddress] })
            queryClient.invalidateQueries({ queryKey: ['drawdown', walletAddress] })
            // Note: Don't hide loader here, wait for completeSync from UI
        },
        onError: (error) => {
            console.error("Sync failed:", error)
            setShowSyncLoader(false)
        }
    })

    // Trigger sync on first connection
    useEffect(() => {
        if (walletAddress && !hasSynced && !syncMutation.isPending && !syncMutation.isSuccess && !showSyncLoader) {
            // Check session storage one last time to avoid race condition
            if (sessionStorage.getItem(`synced-${walletAddress}`) === 'true') {
                setTimeout(() => setHasSynced(true), 0)
                return
            }
            setShowSyncLoader(true)
            syncMutation.mutate(walletAddress)
        }
    }, [walletAddress, hasSynced, syncMutation, showSyncLoader])

    // Derived State
    const isConnected = !!walletAddress
    const isSyncing = showSyncLoader
    const isDemo = !isConnected

    // Fetch Real Dashboard Data (Positions)
    const dashboardQuery = useQuery({
        queryKey: ['dashboard', walletAddress],
        queryFn: () => fetchDashboard(walletAddress!),
        enabled: isConnected && hasSynced,
        staleTime: 30 * 1000, 
        refetchInterval: isConnected && hasSynced ? 10 * 1000 : false, // Poll only when live
    })

    // Fetch Real Analytics Data
    const analyticsQuery = useQuery({
        queryKey: ['analytics', walletAddress],
        queryFn: () => fetchAnalytics(walletAddress!),
        enabled: isConnected && hasSynced,
        staleTime: 60 * 1000,
        refetchInterval: isConnected && hasSynced ? 30 * 1000 : false, // Poll only when live
    })

    // Fetch Historical PnL
    const historicalPnlQuery = useQuery({
        queryKey: ['historicalPnl', walletAddress],
        queryFn: () => fetchHistoricalPnl(walletAddress!),
        enabled: isConnected && hasSynced,
        staleTime: 5 * 60 * 1000,
    })

    // Fetch Drawdown
    const drawdownQuery = useQuery({
        queryKey: ['drawdown', walletAddress],
        queryFn: () => fetchDrawdown(walletAddress!),
        enabled: isConnected && hasSynced,
        staleTime: 5 * 60 * 1000,
    })

    // Determine what to return
    const useRealData = isConnected && hasSynced && dashboardQuery.isSuccess
    const useRealAnalytics = isConnected && hasSynced && analyticsQuery.isSuccess

    const positions: DashboardPosition[] = useRealData 
        ? dashboardQuery.data 
        : (MOCK_POSITIONS as unknown as DashboardPosition[])

    const analytics: ComprehensiveAnalytics = useRealAnalytics 
        ? analyticsQuery.data 
        : (MOCK_ANALYTICS as unknown as ComprehensiveAnalytics)

    const historicalPnl = (isConnected && hasSynced && historicalPnlQuery.isSuccess)
        ? historicalPnlQuery.data
        : (equityCurveData)

    const drawdown = (isConnected && hasSynced && drawdownQuery.isSuccess)
        ? drawdownQuery.data
        : (drawdownData || [])

    return {
        // Data
        positions,
        analytics,
        historicalPnl,
        drawdown,
        
        // Status Flags
        isConnected,
        isSyncing,
        isDemo,
        isLoading: (isConnected && hasSynced) ? (dashboardQuery.isLoading || historicalPnlQuery.isLoading) : false,
        isAnalyticsLoading: (isConnected && hasSynced) ? analyticsQuery.isLoading : false,
        isError: dashboardQuery.isError || historicalPnlQuery.isError,
        isAnalyticsError: analyticsQuery.isError,
        
        // Sync Info
        syncStatus: syncMutation.status,
        syncResult: syncMutation.data,
        
        // Actions
        refresh: () => {
            if (walletAddress) {
                queryClient.invalidateQueries({ queryKey: ['dashboard', walletAddress] })
                queryClient.invalidateQueries({ queryKey: ['analytics', walletAddress] })
                queryClient.invalidateQueries({ queryKey: ['historicalPnl', walletAddress] })
                queryClient.invalidateQueries({ queryKey: ['drawdown', walletAddress] })
            }
        },
        triggerSync: () => {
            if (walletAddress) {
                setShowSyncLoader(true)
                syncMutation.mutate(walletAddress)
            }
        },
        completeSync: () => {
            setShowSyncLoader(false)
        }
    }
}
