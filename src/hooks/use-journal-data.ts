import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { fetchHeatmap, fetchTrades } from '@/lib/api'
import { heatmapData as MOCK_HEATMAP, psychologyData as MOCK_PSYCH } from '@/lib/mock-data'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export function useJournalData(currentMonth: Date) {
    const { publicKey, connected } = useWallet()
    const walletAddress = publicKey?.toBase58()
    const isDemo = !connected || !walletAddress

    // 1. Fetch Heatmap (for Calendar)
    const heatmapQuery = useQuery({
        queryKey: ['heatmap', walletAddress, format(currentMonth, 'yyyy-MM')],
        queryFn: async () => {
             if (isDemo) {
                 return MOCK_HEATMAP
             }
             return fetchHeatmap(walletAddress!, { 
                 year: currentMonth.getFullYear(), 
                 month: currentMonth.getMonth() + 1
             })
        },
        staleTime: 5 * 60 * 1000
    })

    // 2. Fetch Trades for the Month (for Daily List)
    // In the new rich heatmap, trades are embedded per day. 
    // We'll keep this query for backward compatibility or if extra data is needed,
    // but we'll prioritize heatmap trades in the UI if available.
    const tradesQuery = useQuery({
        queryKey: ['journal-trades', walletAddress, format(currentMonth, 'yyyy-MM')],
        queryFn: async () => {
             if (isDemo) return []
            const start = startOfMonth(currentMonth).toISOString()
            const end = endOfMonth(currentMonth).toISOString()
            const response = await fetchTrades(walletAddress!, { startDate: start, endDate: end, limit: 1000 })
            return response.data
        },
    })

    const isLoading = heatmapQuery.isLoading || tradesQuery.isLoading

    // Merge Data
    const journalData: Record<string, any[]> = {}

    if (isDemo) {
        // Map rich heatmap trades to journalData format; include as many fields as available
        Object.entries(MOCK_HEATMAP).forEach(([dateStr, dayData]) => {
            journalData[dateStr] = dayData.trades.map(trade => ({
                id: trade.id,
                positionId: trade.positionId,
                signature: trade.signature,
                price: trade.price,
                fee: trade.fee,
                isEntry: trade.isEntry,
                orderType: trade.orderType,
                tradeType: trade.tradeType,
                notes: trade.notes,
                metadata: trade.metadata,
                rawData: trade.rawData,

                symbol: trade.market,
                side: trade.side,
                size: trade.totalSize,
                pnl: trade.realizedPnl,
                timestamp: new Date(trade.createdAt),
                position: trade
            }))
        })
    } else {
        // Group trades by date from API
        if (tradesQuery.data) {
            tradesQuery.data.forEach((trade: any) => {
                const dateStr = format(new Date(trade.timestamp), 'yyyy-MM-dd')
                if (!journalData[dateStr]) journalData[dateStr] = []

                journalData[dateStr].push({
                    id: trade.id,
                    positionId: trade.positionId,
                    signature: trade.signature,
                    price: trade.price,
                    fee: trade.fee,
                    isEntry: trade.isEntry,
                    orderType: trade.orderType,
                    tradeType: trade.tradeType,
                    notes: trade.notes,
                    metadata: trade.metadata,
                    rawData: trade.rawData,

                    symbol: trade.position.market,
                    side: trade.position.side,
                    size: trade.size,
                    pnl: trade.position.realizedPnl,
                    timestamp: new Date(trade.timestamp),
                    position: trade.position
                })
            })
        }
    }

    return {
        data: journalData,
        heatmap: heatmapQuery.data,
        psychology: isDemo ? MOCK_PSYCH : undefined,
        isLoading,
        isConnected: !!walletAddress,
        isDemo
    }
}
