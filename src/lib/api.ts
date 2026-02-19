export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Shared Types 

export interface APIResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

// Position & Trade Types

export interface DashboardPosition {
    positionId: string;
    market: string;
    side: 'LONG' | 'SHORT';
    entry: number;
    current: number;
    size: number;
    unrealized: number;
    realized: number;
    fees: number;
}

export interface TradePosition {
    id: string;
    walletAddress: string;
    market: string;
    side: 'LONG' | 'SHORT';
    status: 'OPEN' | 'CLOSED';
    avgEntryPrice: number;
    avgExitPrice: number | null;
    totalSize: number;
    totalFees: number;
    realizedPnl: number;
    notes: string | null;
    strategyUsed: string | null;
    rating: number | null;
    emotion: string | null;
    aiReview: string | null;
    aiBias: string | null;
    aiInsight: string | null;
    aiAdvice: string | null;
    aiScore: number | null;
    aiNextAction: string | null;
    actualExitPrice: number | null;
    hypotheticalExitPrice: number | null;
    opportunityCost: number | null;
    opportunityCostNote: string | null;
    newsHeadlines: string[] | null;
    marketSentiment: string | null;
    macroContext: string | null;
    traderProfile: string | null;
    tradeFrequency: number | null;
    lastNudge: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
}

export interface TradeEvent {
    id: string;
    signature: string;
    positionId: string;
    price: number;
    size: number;
    fee: number;
    isEntry: boolean;
    orderType: string;
    tradeType: string;
    notes: string | null;
    // arbitrary metadata from backend (e.g. calculated pnl, tags, etc.)
    metadata?: Record<string, any> | null;
    // raw trade details often populated by the core service
    rawData?: Record<string, any> | null;
    timestamp: string;
    position: TradePosition;
}

export interface TradeSummary {
    totalTrades: number;
    totalFees: number;
    netVolume24h: number;
    volumeChange24h: number;
    avgTradeSize: number;
    distribution: {
        spot: number;
        perp: number;
    };
    gasVsProtocolRatio?: number;
    tradeFrequency?: number;
    profitFactorHistory?: number;
}

export interface TradesResponse {
    success: boolean;
    summary: TradeSummary;
    data: TradeEvent[];
    pagination: {
        total: number;
        hasMore: boolean;
    };
}

// Analytics Types 

export interface ComprehensiveAnalytics {
    totalPnl: {
        realized: number;
        unrealized: number;
        total: number;
    };
    winRate: number;
    tradeCount: {
        total: number;
        wins: number;
        losses: number;
        open: number;
    };
    avgTradeDuration: number;
    longShortRatio: number;
    largestGain: number | null;
    largestLoss: number | null;
    avgWin: number;
    avgLoss: number;
    totalFees: number;
    totalVolume: number;
    feeComposition: {
        spot: number;
        perp: number;
        total: number;
    };
    sessionPerformance: Record<string, { pnl: number; count: number }>;
    orderTypePerformance?: Record<string, { count: number; totalPnl: number; avgPnl: number }>;
    marketPerformance: Record<string, { pnl: number; winRate: number; tradeCount: number; volume: number }>;
    riskMetrics: {
        sharpeRatio: number;
        sortinoRatio: number;
        maxDrawdown: number;
        profitFactor: number;
        expectancy: number;
        dailyVariance?: number;
        annualVolatility?: number;
    };
}

export interface HistoricalPnlData {
    date: string;
    realizedPnl: number;
    unrealizedPnl: number;
    totalPnl: number;
    cumulativePnl: number;
    drawdown: number;
}

export interface LeaderboardEntry {
    wallet: string;
    pnl: number;
    winRate?: number;
    avatar?: string;
}

export interface EquityCurvePoint {
    timestamp: string;
    equity: number;
    change: number;
    market: string;
}

export interface TimeAnalysisData {
    hourly: Array<{
        hour: number;
        pnl: number;
        trades: number;
        winRate: number;
        volume: number;
    }>;
    daily: Array<{
        date: string;
        day: string;
        pnl: number;
        trades: number;
        winRate: number;
        volume: number;
    }>;
}

export interface PortfolioCompositionItem {
    market: string;
    value: number;
    percentage: number;
}

export interface BehavioralMetrics {
    expectancy: number;
    winRate: number;
    profitFactor: number;
    riskRewardRatio: number;
    revengeTradeCount: number;
    streaks: {
        current: number;
        maxWin: number;
        maxLoss: number;
    };
    insights: string[];
}

// Journal Types

export interface JournalEntryUpdate {
    notes?: string;
    emotion?: 'Fearful' | 'Greedy' | 'Calm' | 'Anxious' | 'Neutral';
    rating?: number;
    hypotheticalExitPrice?: number;
}

export interface JournalUpdateResponse {
    id: string;
    notes: string;
    rating: number;
    emotion: string;
    aiReview: string;
    aiBias: string;
    aiScore: number;
    hypotheticalExitPrice: number;
}

export interface JournalAnalysis {
    aiAnalysis: {
        bias: string;
        insight: string;
        score: number;
        advice: string;
        next_action: string;
    };
    traderProfile: {
        profile: string;
        strength: string;
        weakness: string;
        nudge: string;
        winRate: number;
    };
    macroContext: {
        sentiment: string;
        macroContext: string;
        headlines?: string[];
    };
    whatIfAnalysis: {
        opportunityCost: number;
        opportunityCostNote: string;
    };
}

// API Functions

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `API request failed: ${res.statusText} (${res.status})`);
    }
    const json: APIResponse<T> = await res.json();
    if (!json.success) {
        throw new Error(json.error || 'API request failed with unknown error');
    }
    return json.data;
}

// Sync

export async function syncWallet(wallet: string): Promise<{ positionsUpdated: number; fillsProcessed: number }> {
    return fetchAPI('/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: wallet })
    });
}

// Dashboard 

export async function fetchDashboard(wallet: string): Promise<DashboardPosition[]> {
    return fetchAPI<DashboardPosition[]>(`/dashboard/${wallet}`);
}

// Trades 

export async function fetchTrades(
    wallet: string,
    filters?: {
        market?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
        offset?: number;
    }
): Promise<TradesResponse> {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
    }
    const queryString = params.toString();
    const endpoint = `/trades/${wallet}${queryString ? `?${queryString}` : ''}`;
    
    // Manual fetch to handle custom response structure (summary/pagination siblings)
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `API request failed: ${res.statusText} (${res.status})`);
    }
    
    const json = await res.json();
    if (!json.success) {
        throw new Error(json.error || 'API request failed');
    }

    // Return the whole object as TradesResponse (it matches the interface)
    return {
        success: json.success,
        summary: json.summary,
        data: json.data,
        pagination: json.pagination
    };
}

// Analytics 

export async function fetchAnalytics(
    wallet: string,
    filters?: {
        market?: string;
        startDate?: string;
        endDate?: string;
    }
): Promise<ComprehensiveAnalytics> {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
    }
    const queryString = params.toString();
    const endpoint = `/analytics/${wallet}${queryString ? `?${queryString}` : ''}`;
    return fetchAPI<ComprehensiveAnalytics>(endpoint);
}

export async function fetchHistoricalPnl(
    wallet: string,
    filters?: {
        startDate?: string;
        endDate?: string;
    }
): Promise<HistoricalPnlData[]> {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
    }
    const queryString = params.toString();
    const endpoint = `/analytics/${wallet}/historical-pnl${queryString ? `?${queryString}` : ''}`;
    return fetchAPI<HistoricalPnlData[]>(endpoint);
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    return fetchAPI<LeaderboardEntry[]>('/analytics/leaderboard');
}

export async function fetchEquityCurve(wallet: string): Promise<EquityCurvePoint[]> {
    return fetchAPI<EquityCurvePoint[]>(`/analytics/${wallet}/equity-curve`);
}

export async function fetchTimeAnalysis(
    wallet: string,
    filters?: {
        startDate?: string;
        endDate?: string;
    }
): Promise<TimeAnalysisData> {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
    }
    const queryString = params.toString();
    const endpoint = `/analytics/${wallet}/time-analysis${queryString ? `?${queryString}` : ''}`;
    return fetchAPI<TimeAnalysisData>(endpoint);
}

export async function fetchPortfolioComposition(wallet: string): Promise<PortfolioCompositionItem[]> {
    return fetchAPI<PortfolioCompositionItem[]>(`/analytics/${wallet}/composition`);
}

export async function fetchBehavioralMetrics(wallet: string): Promise<BehavioralMetrics> {
    return fetchAPI<BehavioralMetrics>(`/analytics/${wallet}/behavior`);
}

// Drawdown Types
export interface DrawdownPoint {
    timestamp: string;
    pnl: number;
    drawdown: number;
    peak: number;
}

// Analytics
export async function fetchDrawdown(wallet: string): Promise<DrawdownPoint[]> {
    return fetchAPI<DrawdownPoint[]>(`/analytics/drawdown/${wallet}`);
}

// Heatmap
export interface HeatmapTrade {
    id: string;
    market: string;
    side: 'LONG' | 'SHORT';
    realizedPnl: number;
    fills: any[];
}

export interface HeatmapDayData {
    pnl: number;
    count: number;
    trades: HeatmapTrade[];
}

export type HeatmapData = Record<string, HeatmapDayData>;

export async function fetchHeatmap(
    wallet: string,
    filters?: {
        year?: number;
        month?: number;
    }
): Promise<HeatmapData> {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', String(filters.year));
    if (filters?.month) params.append('month', String(filters.month));
    const queryString = params.toString();
    const endpoint = `/analytics/${wallet}/heatmap${queryString ? `?${queryString}` : ''}`;
    return fetchAPI<HeatmapData>(endpoint);
}

// Journal

export async function submitJournal(
    positionId: string,
    updates: JournalEntryUpdate
): Promise<{ data: JournalUpdateResponse; analysis: JournalAnalysis }> {
    const res = await fetch(`${API_URL}/journal/${positionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `API request failed: ${res.statusText}`);
    }

    const json = await res.json();
    if (!json.success) {
        throw new Error(json.error || 'API request failed');
    }

    // Handle the specific response structure where analysis is a sibling of data
    return {
        data: json.data,
        analysis: json.analysis // This field is a sibling of data in the response
    };
}
