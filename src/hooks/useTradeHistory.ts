'use client'

import { useQuery } from '@tanstack/react-query';
import { fetchTrades, TradesResponse, TradeSummary } from '@/lib/api';
import { tradeHistory as MOCK_TRADES, tradeSummary as MOCK_SUMMARY } from '@/lib/mock-data';
import { useWallet } from '@solana/wallet-adapter-react';

interface UseTradeHistoryOptions {
    market?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
    enabled?: boolean;
}

export function useTradeHistory({
    market,
    startDate,
    endDate,
    limit = 20,
    offset = 0,
    enabled = true
}: UseTradeHistoryOptions = {}) {
    const { publicKey, connected } = useWallet();
    const wallet = publicKey?.toString();
    const isDemo = !connected || !wallet;

    const query = useQuery({
        queryKey: ['trades', wallet, { market, startDate, endDate, limit, offset }],
        queryFn: async () => {
             if (isDemo) {
                // Return mock data if not connected
                let filtered = [...MOCK_TRADES];
                
                if (market) {
                    filtered = filtered.filter(t => 
                        t.position?.market.toLowerCase().includes(market.toLowerCase()) || 
                        t.positionId.toLowerCase().includes(market.toLowerCase())
                    );
                }
                
                // Pagination for mock
                const start = offset;
                const end = offset + limit;
                const pageData = filtered.slice(start, end);

                return {
                    success: true,
                    summary: MOCK_SUMMARY,
                    data: pageData,
                    pagination: {
                        total: filtered.length,
                        hasMore: end < filtered.length
                    }
                } as TradesResponse;
            }

            return fetchTrades(wallet!, {
                market,
                startDate,
                endDate,
                limit,
                offset
            });
        },
        enabled: enabled,
        staleTime: 1000 * 60, // 1 minute
        retry: 2,
        refetchInterval: !isDemo ? 30 * 1000 : false, // Poll only when live
    });

    return {
        trades: query.data?.data || (isDemo ? MOCK_TRADES.slice(offset, offset + limit) : []),
        summary: query.data?.summary || (isDemo ? MOCK_SUMMARY : undefined),
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        total: query.data?.pagination.total || (isDemo ? MOCK_TRADES.length : 0),
        hasMore: query.data?.pagination.hasMore || (isDemo ? (offset + limit < MOCK_TRADES.length) : false),
        refetch: query.refetch,
        isDemo
    };
}
