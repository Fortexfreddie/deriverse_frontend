import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import {
    fetchAnalytics,
    fetchHeatmap,
    fetchLeaderboard,
    fetchPortfolioComposition,
    fetchHistoricalPnl,
    fetchDrawdown,
    fetchBehavioralMetrics,
    fetchTimeAnalysis,
    fetchEquityCurve,
    ComprehensiveAnalytics,
    HeatmapData,
    LeaderboardEntry,
    PortfolioCompositionItem,
    BehavioralMetrics,
    TimeAnalysisData,
    EquityCurvePoint
} from '@/lib/api'
import {
    analyticsData as MOCK_ANALYTICS,
    equityCurveData as MOCK_PNL_HISTORY,
    drawdownData as MOCK_DRAWDOWN,
    leaderboardData as MOCK_LEADERBOARD,
    portfolioCompositionData as MOCK_COMPOSITION,
    heatmapData as MOCK_HEATMAP,
    behavioralMetricsData as MOCK_BEHAVIOR,
    timeAnalysisData as MOCK_TIME_ANALYSIS,
    equityCurveMockData as MOCK_EQUITY_CURVE
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
                month = filters.startDate.getMonth() + 1;
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

    // Behavioral Metrics Query
    const behaviorQuery = useQuery({
        queryKey: ['behavior', walletAddress],
        queryFn: async () => {
            if (isDemo) return MOCK_BEHAVIOR as BehavioralMetrics
            return fetchBehavioralMetrics(walletAddress!)
        },
        staleTime: 5 * 60 * 1000,
    })

    // Time Analysis Query
    const timeAnalysisQuery = useQuery({
        queryKey: ['timeAnalysis', walletAddress, filters],
        queryFn: async () => {
            if (isDemo) return MOCK_TIME_ANALYSIS as TimeAnalysisData
            const formatDate = (date?: Date) => date?.toISOString().split('T')[0]
            return fetchTimeAnalysis(walletAddress!, {
                startDate: formatDate(filters?.startDate),
                endDate: formatDate(filters?.endDate)
            })
        },
        staleTime: 5 * 60 * 1000,
    })

    // Equity Curve Query
    const equityCurveQuery = useQuery({
        queryKey: ['equityCurve', walletAddress],
        queryFn: async () => {
            if (isDemo) return MOCK_EQUITY_CURVE as EquityCurvePoint[]
            return fetchEquityCurve(walletAddress!)
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
        behaviorData: behaviorQuery.data || (isDemo ? MOCK_BEHAVIOR as BehavioralMetrics : undefined),
        timeAnalysisData: timeAnalysisQuery.data || (isDemo ? MOCK_TIME_ANALYSIS as TimeAnalysisData : undefined),
        equityCurveData: equityCurveQuery.data || (isDemo ? MOCK_EQUITY_CURVE as EquityCurvePoint[] : undefined),
        isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isDemo
    }
}
