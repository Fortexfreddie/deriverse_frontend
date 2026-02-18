import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { 
    fetchAnalytics, 
    fetchHeatmap, 
    fetchLeaderboard, 
    fetchPortfolioComposition,
    fetchHistoricalPnl,
    fetchDrawdown,
    ComprehensiveAnalytics,
    HeatmapData,
    LeaderboardEntry,
    PortfolioCompositionItem
} from '@/lib/api'
import { 
    analyticsData as MOCK_ANALYTICS,
    equityCurveData as MOCK_PNL_HISTORY,
    drawdownData as MOCK_DRAWDOWN,
    leaderboardData as MOCK_LEADERBOARD,
    portfolioCompositionData as MOCK_COMPOSITION,
    heatmapData as MOCK_HEATMAP
} from '@/lib/mock-data'

export function useAnalytics(filters?: { market?: string; startDate?: Date; endDate?: Date }) {
    const { publicKey, connected } = useWallet()
    const walletAddress = publicKey?.toBase58()
    const isDemo = !connected || !walletAddress

    const query = useQuery({
        queryKey: ['analytics', walletAddress, filters],
        queryFn: async () => {
            if (isDemo) {
                return (MOCK_ANALYTICS as unknown) as ComprehensiveAnalytics
            }
            
            const formatDate = (date?: Date) => date?.toISOString().split('T')[0]

            return fetchAnalytics(walletAddress!, {
                market: filters?.market === 'ALL' ? undefined : filters?.market,
                startDate: formatDate(filters?.startDate),
                endDate: formatDate(filters?.endDate)
            })
        },
        placeholderData: (previousData) => previousData,
        staleTime: 60 * 1000,
        refetchInterval: !isDemo ? 60 * 1000 : false,
    })

    // Heatmap Query
    const heatmapQuery = useQuery({
        queryKey: ['heatmap', walletAddress, filters?.startDate],
        queryFn: async () => {
            if (isDemo) return MOCK_HEATMAP as HeatmapData
            let year, month;
            if (filters?.startDate) {
                year = filters.startDate.getFullYear();
                month = filters.startDate.getMonth();
            }
            return fetchHeatmap(walletAddress!, { year, month })
        },
        staleTime: 5 * 60 * 1000, 
    })

    // Leaderboard Query
    const leaderboardQuery = useQuery({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            if (isDemo) return MOCK_LEADERBOARD as LeaderboardEntry[]
            return fetchLeaderboard()
        },
        staleTime: 5 * 60 * 1000,
    })

    // Composition Query
    const compositionQuery = useQuery({
        queryKey: ['composition', walletAddress],
        queryFn: async () => {
            if (isDemo) return MOCK_COMPOSITION as PortfolioCompositionItem[]
            return fetchPortfolioComposition(walletAddress!)
        },
        staleTime: 5 * 60 * 1000,
    })

    // Historical PnL Query
    const historicalPnlQuery = useQuery({
        queryKey: ['historicalPnl', walletAddress, filters],
        queryFn: async () => {
            if (isDemo) return MOCK_PNL_HISTORY
            return fetchHistoricalPnl(walletAddress!)
        },
        staleTime: 5 * 60 * 1000,
    })

    // Drawdown Query
    const drawdownQuery = useQuery({
        queryKey: ['drawdown', walletAddress, filters],
        queryFn: async () => {
            if (isDemo) return MOCK_DRAWDOWN
            return fetchDrawdown(walletAddress!)
        },
        staleTime: 5 * 60 * 1000,
    })

    const isLoading = query.isLoading || heatmapQuery.isLoading || leaderboardQuery.isLoading || compositionQuery.isLoading

    return {
        data: query.data || (MOCK_ANALYTICS as unknown as ComprehensiveAnalytics),
        heatmapData: heatmapQuery.data || (isDemo ? MOCK_HEATMAP as HeatmapData : undefined),
        leaderboardData: leaderboardQuery.data || (isDemo ? MOCK_LEADERBOARD : undefined),
        compositionData: compositionQuery.data || (isDemo ? MOCK_COMPOSITION as PortfolioCompositionItem[] : undefined),
        historicalPnlData: historicalPnlQuery.data || MOCK_PNL_HISTORY,
        drawdownData: drawdownQuery.data || MOCK_DRAWDOWN,
        isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isDemo
    }
}
