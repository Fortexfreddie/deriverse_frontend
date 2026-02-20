// Analytics data
export const dashboardData = [
  {
    positionId: "0-BUY-20489-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "SOL-USDC",
    side: "LONG" as const,
    entry: 83.64,
    current: 84.89,
    size: 0.6584,
    unrealized: 0.82,
    realized: 0,
    fees: 0.0209
  },
  {
    positionId: "0-SELL-20489-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "SOL-USDC",
    side: "SHORT" as const,
    entry: 84.6,
    current: 84.89,
    size: 1,
    unrealized: -0.29,
    realized: 0,
    fees: 0.0423
  },
  {
    positionId: "0-BUY-20493-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "SOL-USDC",
    side: "LONG" as const,
    entry: 85.21,
    current: 84.89,
    size: 1,
    unrealized: -0.32,
    realized: 0,
    fees: 0.0426
  },
  {
    positionId: "0-SELL-20493-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "SOL-USDC",
    side: "LONG" as const,
    entry: 85.14,
    current: 84.89,
    size: 1,
    unrealized: -0.25,
    realized: 0,
    fees: 0.0426
  },
  {
    positionId: "0-BUY-20496-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "SOL-USDC",
    side: "LONG" as const,
    entry: 78.0206,
    current: 84.89,
    size: 9.1,
    unrealized: 62.51,
    realized: 0,
    fees: 0.355
  },
  {
    positionId: "0-SELL-20496-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "SOL-USDC",
    side: "LONG" as const, // Again, SELL ID but side LONG in JSON
    entry: 77.25,
    current: 84.89,
    size: 1.1,
    unrealized: 8.4,
    realized: -0.18,
    fees: 0.0424
  },
  {
    positionId: "2-SELL-20496-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "LETTERA-USDC",
    side: "LONG" as const, // JSON says LONG
    entry: 13599.0427,
    current: 100,
    size: 0.0011,
    unrealized: -14.85,
    realized: 0,
    fees: 0.0075
  },
  {
    positionId: "0-BUY-20497-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "SOL-USDC",
    side: "LONG" as const,
    entry: 83.22,
    current: 84.89,
    size: 2,
    unrealized: 3.34,
    realized: 1.48,
    fees: 0.084
  },
  {
    positionId: "2-BUY-20497-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "LETTERA-USDC",
    side: "LONG" as const,
    entry: 13599.0436,
    current: 100,
    size: 0.0011,
    unrealized: -14.85,
    realized: 0,
    fees: 0.0075
  },
  {
    positionId: "6-SELL-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "SUN-USDC",
    side: "LONG" as const,
    entry: 3265.918,
    current: 100,
    size: 0.0005,
    unrealized: -1.58,
    realized: 0,
    fees: 0.0008
  },
  {
    positionId: "0-BUY-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "SOL-USDC",
    side: "LONG" as const,
    entry: 85.35,
    current: 84.89,
    size: 1.02,
    unrealized: -0.47,
    realized: -1.68,
    fees: 0.0427
  },
  {
    positionId: "0-SELL-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    market: "SOL-USDC",
    side: "LONG" as const,
    entry: 84.09,
    current: 84.89,
    size: 1.5297,
    unrealized: 1.22,
    realized: -0.09,
    fees: 0.042
  }
]

export const analyticsData = {
  totalPnl: {
    realized: 1250.50,
    unrealized: 45.20,
    total: 1295.70
  },
  winRate: 65.5,
  tradeCount: {
    total: 145,
    wins: 95,
    losses: 50,
    open: 2
  },
  avgTradeDuration: 3.2,
  longShortRatio: 1.5,
  largestGain: { amount: 420.00, positionId: "pos-sol-01", market: "SOL-PERP" },
  largestLoss: { amount: -150.00, positionId: "pos-btc-02", market: "BTC-PERP" },
  avgWin: 125.00,
  avgLoss: -55.00,
  totalFees: 45.20,
  totalVolume: 89450.50,
  feeComposition: {
    spot: 12.50,
    perp: 32.70,
    total: 45.20
  },
  sessionPerformance: {
    Asian: { pnl: 245.50, count: 45 },
    London: { pnl: 480.20, count: 32 },
    "New York": { pnl: 524.80, count: 68 }
  },
  orderTypePerformance: {
    MARKET: { pnl: 850.50, count: 120 },
    LIMIT: { pnl: 400.00, count: 25 }
  },
  marketPerformance: {
    "SOL-USDC": { pnl: 845.20, winRate: 72.0, tradeCount: 85, volume: 42050.00 },
    "BTC-USDC": { pnl: -120.50, winRate: 45.0, tradeCount: 15, volume: 15400.00 },
    "ETH-USDC": { pnl: 340.50, winRate: 60.0, tradeCount: 25, volume: 22500.00 },
    "JUP-USDC": { pnl: 185.30, winRate: 68.5, tradeCount: 20, volume: 9500.50 }
  },
  riskMetrics: {
    sharpeRatio: 1.85,
    sortinoRatio: 2.40,
    maxDrawdown: 12.5,
    profitFactor: 2.30,
    expectancy: 0.42,
    dailyVariance: 150.20,
    annualVolatility: 45.0
  }
}

export const sentimentData = {
  bullish: 62,
  bearish: 38,
  label: "Moderately Bullish",
}

// Equity curve data (30 days)
export const equityCurveData = Array.from({ length: 30 }, (_, i) => {
  const base = 8000
  const trend = i * 180
  const noise = Math.sin(i * 0.8) * 800 + Math.cos(i * 1.3) * 400
  const value = Math.round((base + trend + noise) * 100) / 100
  return {
    date: new Date(2026, 0, 12 + i).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    realizedPnl: value * 0.8,
    unrealizedPnl: value * 0.2,
    totalPnl: value,
    cumulativePnl: value,
    drawdown: Math.max(0, 15 - (i * 0.5)),
    pnl: value, // keeping for backward compatibility if any
  }
})

export const drawdownData = Array.from({ length: 30 }, (_, i) => {
  const value = Math.max(0, Math.min(15, 5 + Math.sin(i * 0.5) * 5 + Math.random() * 2))
  return {
    timestamp: new Date(2026, 0, 12 + i).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    drawdown: value,
    pnl: 0,
    peak: 100,
    date: new Date(2026, 0, 12 + i).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }), // keeping for backward compatibility if any
  }
})

// Behavioral Metrics Mock Data (matches /api/analytics/{wallet}/behavior)
export const behavioralMetricsData = {
  expectancy: 150.5,
  winRate: 65.2,
  profitFactor: 2.1,
  riskRewardRatio: 1.5,
  revengeTradeCount: 2,
  streaks: { current: 3, maxWin: 5, maxLoss: 2 },
  insights: [
    "Strong win rate of 65.2% — above institutional average.",
    "Revenge trade count is low. You're managing tilt well.",
    "Current 3-win streak. Stay disciplined, don't get greedy.",
    "Profit factor of 2.1 indicates a healthy edge.",
  ]
}

// Time Analysis Mock Data (matches /api/analytics/{wallet}/time-analysis)
export const timeAnalysisData = {
  hourly: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    pnl: Math.round((Math.sin(i * 0.5) * 200 + Math.random() * 100 - 50) * 100) / 100,
    trades: Math.floor(Math.random() * 8) + 1
  })),
  daily: [
    { date: "2026-02-09", pnl: 144.80, trades: 3 },
    { date: "2026-02-14", pnl: 1200.00, trades: 1 },
    { date: "2026-02-15", pnl: -340.20, trades: 2 },
    { date: "2026-02-16", pnl: -0.02, trades: 3 },
    { date: "2026-02-17", pnl: 520.10, trades: 4 },
    { date: "2026-02-18", pnl: -125.40, trades: 1 },
  ]
}

// Equity Curve Mock Data (matches /api/analytics/{wallet}/equity-curve)
export const equityCurveMockData = Array.from({ length: 30 }, (_, i) => {
  const base = 10000
  const trend = i * 50
  const noise = Math.sin(i * 0.6) * 300 + Math.cos(i * 1.1) * 150
  const equity = Math.round((base + trend + noise) * 100) / 100
  return {
    timestamp: new Date(2026, 0, 22 + i).toISOString(),
    equity,
    change: Math.round((trend + noise - (i > 0 ? (i - 1) * 50 + Math.sin((i - 1) * 0.6) * 300 : 0)) * 100) / 100,
    market: i % 3 === 0 ? "BTC-PERP" : i % 2 === 0 ? "ETH-PERP" : "SOL-PERP"
  }
})

// Leaderboard Mock Data
export const leaderboardData = [
  {
    wallet: "FK4ugT...G2q",
    pnl: 12500.50,
    winRate: 68.5,
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q"
  },
  {
    wallet: "7V9pbP...X9z",
    pnl: 8900.20,
    winRate: 62.1,
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=7V9pbP"
  },
  {
    wallet: "3mKqR1...L7w",
    pnl: 7450.00,
    winRate: 59.8,
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=3mKqR1"
  },
  {
    wallet: "9XzWpL...Q2m",
    pnl: 5200.80,
    winRate: 55.2,
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=9XzWpL"
  },
  {
    wallet: "2pL9wX...M4k",
    pnl: 4100.50,
    winRate: 52.4,
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=2pL9wX"
  },
]

// Portfolio Composition Mock Data
export const portfolioCompositionData = [
  { market: "SOL-USDC", value: 45000, percentage: 50.2 },
  { market: "BTC-USDC", value: 22000, percentage: 24.5 },
  { market: "ETH-USDC", value: 18000, percentage: 20.1 },
  { market: "JUP-USDC", value: 4650, percentage: 5.2 },
]

// Heatmap Mock Data

export const heatmapData: Record<string, { pnl: number; count: number; trades: any[] }> = {
  "2026-02-02": {
    "pnl": 300.50,
    "count": 2,
    "trades": [
      {
        "id": "1",
        "market": "SOL-USDC",
        "side": "LONG",
        "realizedPnl": 420.50,
        "totalSize": 150,
        "avgEntryPrice": 82.50,
        "avgExitPrice": 85.30,
        "totalFees": 0.0423,
        "status": "CLOSED",
        "createdAt": "2026-02-02T14:30:00Z",
        "notes": "Good entry on support bounce.",
        "emotion": "Calm",
        "rating": 5,
        "aiScore": 92,
        "aiBias": "Balanced",
        "aiReview": "Clean entry on confirmed support. Position sizing was appropriate. Took profit at resistance — textbook.",
        "aiNextAction": "Look for similar setups on the daily chart.",
        "marketSentiment": "Bullish",
        "macroContext": "SOL ecosystem TVL up 12% WoW. Jupiter volume at ATH.",
        "traderProfile": "The Momentum Rider",
        "lastNudge": "If it bounces twice, it will bounce a third time.",
        "fills": [
          { "id": "f1", "timestamp": "2026-02-02T14:30:00Z", "price": 82.50, "size": 100, "fee": 0.0211, "tradeType": "PERP", "isEntry": true },
          { "id": "f2", "timestamp": "2026-02-02T15:10:00Z", "price": 82.60, "size": 50, "fee": 0.0106, "tradeType": "PERP", "isEntry": true },
          { "id": "f3", "timestamp": "2026-02-02T17:45:00Z", "price": 85.30, "size": 150, "fee": 0.0106, "tradeType": "PERP", "isEntry": false }
        ]
      },
      {
        "id": "2",
        "market": "BTC-USDC",
        "side": "SHORT",
        "realizedPnl": -120.00,
        "totalSize": 0.5,
        "avgEntryPrice": 97850.00,
        "avgExitPrice": 98090.00,
        "totalFees": 0.0245,
        "status": "CLOSED",
        "createdAt": "2026-02-02T16:15:00Z",
        "notes": "Forced the short.",
        "emotion": "Greedy",
        "rating": 2,
        "aiScore": 45,
        "aiBias": "Overconfidence",
        "aiReview": "Entered against the trend without clear rejection signal. Position was forced after missing a prior setup.",
        "aiNextAction": "Wait for market structure break before entering shorts.",
        "marketSentiment": "Bullish",
        "traderProfile": "The Contrarian"
      }
    ]
  },
  "2026-02-05": {
    "pnl": 850.00,
    "count": 1,
    "trades": [
      {
        "id": "3",
        "market": "ETH-USDC",
        "side": "LONG",
        "realizedPnl": 850.00,
        "totalSize": 10,
        "avgEntryPrice": 3420.50,
        "avgExitPrice": 3505.50,
        "totalFees": 0.0685,
        "status": "CLOSED",
        "createdAt": "2026-02-05T09:00:00Z",
        "notes": "Followed the plan perfectly.",
        "emotion": "Calm",
        "rating": 5,
        "aiScore": 98,
        "aiBias": "Disciplined",
        "aiReview": "Textbook execution. Entry at the planned level, exit at target. No deviation from the thesis.",
        "aiNextAction": "Maintain this discipline — it's rare.",
        "marketSentiment": "Bullish",
        "macroContext": "ETH staking inflows increasing. BlackRock ETF seeding in progress.",
        "traderProfile": "The Disciplined Trader",
        "lastNudge": "This is what peak performance looks like.",
        "fills": [
          { "id": "f4", "timestamp": "2026-02-05T09:00:00Z", "price": 3420.50, "size": 10, "fee": 0.0342, "tradeType": "PERP", "isEntry": true },
          { "id": "f5", "timestamp": "2026-02-05T14:30:00Z", "price": 3505.50, "size": 10, "fee": 0.0343, "tradeType": "PERP", "isEntry": false }
        ]
      }
    ]
  },
  "2026-02-09": {
    "pnl": 144.80,
    "count": 3,
    "trades": [
      { "id": "4", "market": "SOL-USDC", "side": "SHORT", "totalSize": 200, "realizedPnl": 150.00, "avgEntryPrice": 86.20, "totalFees": 0.0344, "status": "CLOSED", "createdAt": "2026-02-09T11:20:00Z" },
      { "id": "5", "market": "JUP-USDC", "side": "LONG", "totalSize": 5000, "realizedPnl": -50.20, "avgEntryPrice": 1.42, "totalFees": 0.0142, "status": "CLOSED", "createdAt": "2026-02-09T13:45:00Z", "notes": "Should have waited for retest.", "emotion": "Anxious", "rating": 3, "aiScore": 60, "aiBias": "Impatience", "aiReview": "Entered before the retest. The thesis was right, but the timing was off.", "aiNextAction": "Wait for confirmation before entry." },
      { "id": "6", "market": "SOL-USDC", "side": "LONG", "totalSize": 100, "realizedPnl": 45.00, "avgEntryPrice": 84.10, "totalFees": 0.0168, "status": "CLOSED", "createdAt": "2026-02-09T15:00:00Z" }
    ]
  },
  "2026-02-14": {
    "pnl": 1200.00,
    "count": 1,
    "trades": [
      { "id": "7", "market": "BTC-USDC", "side": "LONG", "totalSize": 2.5, "realizedPnl": 1200.00, "avgEntryPrice": 96400.00, "avgExitPrice": 96880.00, "totalFees": 0.482, "status": "CLOSED", "createdAt": "2026-02-14T10:00:00Z", "notes": "Valentine's Day pump!", "emotion": "Greedy", "rating": 4, "aiScore": 80, "aiBias": "Euphoria", "aiReview": "Rode the momentum well. Exit was slightly early but secured a large gain.", "marketSentiment": "Bullish", "macroContext": "Bitcoin ETF inflows surging. Risk-on sentiment across crypto.", "traderProfile": "The Momentum Rider" }
    ]
  },
  "2026-02-15": {
    "pnl": -340.20,
    "count": 2,
    "trades": [
      { "id": "8", "market": "SOL-USDC", "side": "LONG", "totalSize": 300, "realizedPnl": -450.00, "avgEntryPrice": 87.50, "totalFees": 0.0525, "status": "CLOSED", "createdAt": "2026-02-15T08:00:00Z", "notes": "Stop loss hit.", "emotion": "Fearful", "rating": 2, "aiReview": "Entered on a gap fill that never came. Stop was appropriate but entry was premature.", "aiScore": 38, "aiBias": "Hope", "marketSentiment": "Bearish" },
      { "id": "9", "market": "ETH-USDC", "side": "SHORT", "totalSize": 5, "realizedPnl": 109.80, "avgEntryPrice": 3480.00, "totalFees": 0.0348, "status": "CLOSED", "createdAt": "2026-02-15T11:00:00Z", "notes": "Nice mean reversion.", "emotion": "Calm", "rating": 4, "aiReview": "Good read on extended conditions. Clean mean reversion trade.", "aiScore": 85, "marketSentiment": "Neutral" }
    ]
  },
  "2026-02-16": {
    "pnl": -0.018607,
    "count": 3,
    "trades": [
      {
        "id": "10",
        "market": "SOL-USDC",
        "side": "SHORT",
        "realizedPnl": 0,
        "totalSize": 1.5296,
        "avgEntryPrice": 84.03,
        "totalFees": 0.0420,
        "status": "OPEN",
        "createdAt": "2026-02-16T17:10:08Z",
        "notes": "Testing liquidity.",
        "aiReview": "Position opened to test market depth. No realized PnL yet — monitor closely.",
        "aiScore": 5,
        "aiBias": "Curiosity",
        "marketSentiment": "Neutral",
        "macroContext": "Mixed market conditions. CHOPPY WATER.",
        "traderProfile": "The Dip Chaser",
        "lastNudge": "Don't catch falling knives."
      },
      {
        "id": "11",
        "market": "SOL-USDC",
        "side": "LONG",
        "realizedPnl": -0.018607,
        "totalSize": 1.02,
        "avgEntryPrice": 83.70,
        "totalFees": 0.0426,
        "status": "OPEN",
        "createdAt": "2026-02-16T12:25:01Z"
      },
      {
        "id": "12",
        "market": "SUN-USDC",
        "side": "SHORT",
        "realizedPnl": 0,
        "totalSize": 0.0005,
        "avgEntryPrice": 3265.918,
        "totalFees": 0.0008,
        "status": "OPEN",
        "createdAt": "2026-02-16T12:17:35Z"
      }
    ]
  },
  "2026-02-17": {
    "pnl": 520.10,
    "count": 4,
    "trades": [
      { "id": "13", "market": "SOL-USDC", "side": "LONG", "totalSize": 100, "realizedPnl": 120.00, "avgEntryPrice": 83.40, "totalFees": 0.0167, "status": "CLOSED", "createdAt": "2026-02-17T09:00:00Z" },
      { "id": "14", "market": "SOL-USDC", "side": "LONG", "totalSize": 100, "realizedPnl": 150.00, "avgEntryPrice": 83.90, "totalFees": 0.0168, "status": "CLOSED", "createdAt": "2026-02-17T10:30:00Z" },
      { "id": "15", "market": "SOL-USDC", "side": "LONG", "totalSize": 200, "realizedPnl": 300.00, "avgEntryPrice": 84.10, "totalFees": 0.0336, "status": "CLOSED", "createdAt": "2026-02-17T13:00:00Z" },
      { "id": "16", "market": "SOL-USDC", "side": "SHORT", "totalSize": 500, "realizedPnl": -49.90, "avgEntryPrice": 85.50, "totalFees": 0.0855, "status": "CLOSED", "createdAt": "2026-02-17T16:00:00Z" }
    ]
  },
  "2026-02-18": {
    "pnl": -125.40,
    "count": 1,
    "trades": [
      { "id": "17", "market": "BTC-USDC", "side": "SHORT", "totalSize": 0.2, "realizedPnl": -125.40, "avgEntryPrice": 97200.00, "totalFees": 0.0194, "status": "CLOSED", "createdAt": "2026-02-18T14:00:00Z", "notes": "Bad entry on news.", "aiReview": "Reactive trade on breaking news. No thesis, no edge. Avoid news-driven entries.", "aiScore": 22, "aiBias": "Panic", "marketSentiment": "Bearish" }
    ]
  }
}


// Psychology Mock Data
export const psychologyData = {
  archetype: "THE DIP CHASER",
  discipline: 65,
  patience: 30,
  riskManagement: 45,
  lastNudge: "Wait for the floor. You tend to buy the first red candle. Stop it.",
  strengths: ["Fast Execution", "Market Awareness"],
  weaknesses: ["Impulsive Entries", "Size Management"],
  coachIntel: {
    pattern: "FOMO_ENTRY",
    bias: "DENIAL",
    insight: "You are misrepresenting the trade status to avoid realizing the risk of the leverage size.",
    advice: "Stick to your plan.",
    next_action: "Walk away for 5 mins."
  },
  mockDossier: {
    symbol: "SOL-USDC",
    type: "PERPETUAL",
    aiScore: 3,
    sentiment: "ANXIOUS",
    notes: "I entered this SOL trade because the 4H support looked strong at 138.5. FOMO kicked in when it reclaimed 140."
  }
}

import { TradeEvent } from '@/lib/api';

// Trade history
export const tradeHistory: TradeEvent[] = [
  {
    id: "793462a0-4e2a-4dc0-a566-bb843148573f",
    signature: "127pQHsV29x7NboLdAxNXqZfifTXrPt5cvGuj1WS8nNLTZSWGUUB8GhoYiAVXTVEaV9uQg6QPksfhRVJwza4dz2K",
    positionId: "0-SELL-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    price: 83.95,
    size: 0.6470,
    fee: 0.020988,
    isEntry: true,
    orderType: "MARKET",
    tradeType: "SPOT",
    notes: "First trade note",
    metadata: null,
    rawData: { funding: 0, socLoss: 0 },
    timestamp: "2026-02-16T17:18:04.000Z",
    position: {
      id: "0-SELL-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
      walletAddress: "FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
      market: "SOL-USDC",
      side: "SHORT" as const,
      status: "OPEN" as const,
      avgEntryPrice: 84.0307,
      avgExitPrice: null,
      totalSize: 1.5296,
      totalFees: 0.0420,
      realizedPnl: 0,
      // demo journal defaults
      notes: "Demo note: entered on breakout",
      emotion: "Anxious",
      rating: 4,
      hypotheticalExitPrice: 85.0,
      strategyUsed: null,
      aiReview: null,
      aiBias: null,
      aiInsight: null,
      aiAdvice: null,
      aiScore: null,
      aiNextAction: null,
      actualExitPrice: null,

      opportunityCost: null,
      opportunityCostNote: null,
      newsHeadlines: null,
      marketSentiment: null,
      macroContext: null,
      traderProfile: null,
      tradeFrequency: null,
      lastNudge: null,
      createdAt: "2026-02-16T17:10:08.000Z",
      updatedAt: "2026-02-16T17:18:04.000Z",
      closedAt: null
    }
  },
  {
    id: "1c5f74f1-a8ed-4552-8f46-0362abbdc887",
    signature: "5unFYAY9i2oHjd1WSpH7w6fWj83U5xY7zn6Rrch9HCtd9Zi9YNuqu21CYAeP7KV5GLX5g5QTUmhWGE3QGLRbUDMx",
    positionId: "0-SELL-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    price: 84.09,
    size: 0.8826,
    fee: 0.0210245,
    isEntry: true,
    orderType: "MARKET",
    tradeType: "SPOT",
    notes: "Second trade note",
    timestamp: "2026-02-16T17:10:08.000Z",
    position: {
      id: "0-SELL-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
      walletAddress: "FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
      market: "SOL-USDC",
      side: "SHORT" as const,
      status: "OPEN" as const,
      avgEntryPrice: 84.03,
      avgExitPrice: null,
      totalSize: 1.5296,
      totalFees: 0.0420,
      realizedPnl: 0,
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
      actualExitPrice: null,
      hypotheticalExitPrice: null,
      opportunityCost: null,
      opportunityCostNote: null,
      newsHeadlines: null,
      marketSentiment: null,
      macroContext: null,
      traderProfile: null,
      tradeFrequency: null,
      lastNudge: null,
      createdAt: "2026-02-16T17:10:08.000Z",
      updatedAt: "2026-02-16T17:18:04.000Z",
      closedAt: null
    }
  },
  {
    id: "9f295632-c8ca-45c4-9fb7-77b5e248743b",
    signature: "2XGM9gBzUK3vjC7ipu6Vp9V5FahvXHoWfNkaVTyTSrKSnJYqV9sVzCrawrJaA7DC3nQTaNdGJP35qiD7d7SSJxTL",
    positionId: "0-BUY-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    price: 83.67,
    size: 1,
    fee: 0.04184,
    isEntry: true,
    orderType: "MARKET",
    notes: "Third trade note",
    tradeType: "PERP",
    timestamp: "2026-02-16T16:25:33.000Z",
    position: {
      id: "0-BUY-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
      walletAddress: "FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
      market: "SOL-USDC",
      side: "LONG" as const,
      status: "OPEN" as const,
      avgEntryPrice: 83.70,
      avgExitPrice: null,
      totalSize: 1.02,
      totalFees: 0.0426,
      realizedPnl: 0,
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
      actualExitPrice: null,
      hypotheticalExitPrice: null,
      opportunityCost: null,
      opportunityCostNote: null,
      newsHeadlines: null,
      marketSentiment: null,
      macroContext: null,
      traderProfile: null,
      tradeFrequency: null,
      lastNudge: null,
      createdAt: "2026-02-16T12:25:01.000Z",
      updatedAt: "2026-02-16T16:25:33.000Z",
      closedAt: null
    }
  },
  {
    id: "cd5bb1fc-94a1-41c2-b78d-8150665dc1bb",
    signature: "5Fy4wo8AYnQfwGE64AcLpJ21KURLADNa9nf78wqKWnX5zZMfTpFah6PFPwLB3to3KLdaKMzq2FYd1eF7CrfhLKRL",
    positionId: "0-BUY-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    price: 85.35,
    size: 0.02,
    fee: 0.000858,
    isEntry: true,
    orderType: "MARKET",
    tradeType: "SPOT",
    notes: null,
    timestamp: "2026-02-16T12:25:01.000Z",
    position: {
      id: "0-BUY-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
      walletAddress: "FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
      market: "SOL-USDC",
      side: "LONG" as const,
      status: "OPEN" as const,
      avgEntryPrice: 83.70,
      avgExitPrice: null,
      totalSize: 1.02,
      totalFees: 0.0426,
      realizedPnl: 0,
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
      actualExitPrice: null,
      hypotheticalExitPrice: null,
      opportunityCost: null,
      opportunityCostNote: null,
      newsHeadlines: null,
      marketSentiment: null,
      macroContext: null,
      traderProfile: null,
      tradeFrequency: null,
      lastNudge: null,
      createdAt: "2026-02-16T12:25:01.000Z",
      updatedAt: "2026-02-16T16:25:33.000Z",
      closedAt: null
    }
  },
  {
    id: "d9dfa4e6-a1fc-4899-9ac4-dea423ef840d",
    signature: "2HDzTyVcb3qAx5Hdb2ohVioEpEBwFwVUayjnnWoxFjwuNptNwZBVpM2Vv9vw7SvYn9dzDjbChRo4yvE1LxCPbDRW",
    positionId: "6-SELL-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
    price: 3265.918,
    size: 0.0005,
    fee: 0.000821,
    isEntry: true,
    orderType: "MARKET",
    tradeType: "SPOT",
    notes: null,
    timestamp: "2026-02-16T12:17:35.000Z",
    position: {
      id: "6-SELL-20500-FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
      walletAddress: "FK4ugTURYRR2hbSDZr1Q1kqU4xX4UQP7o28cr3wUpG2q",
      market: "SUN-USDC",
      side: "SHORT" as const,
      status: "OPEN" as const,
      avgEntryPrice: 3265.918,
      avgExitPrice: null,
      totalSize: 0.0005,
      totalFees: 0.0008,
      realizedPnl: 0,
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
      actualExitPrice: null,
      hypotheticalExitPrice: null,
      opportunityCost: null,
      opportunityCostNote: null,
      newsHeadlines: null,
      marketSentiment: null,
      macroContext: null,
      traderProfile: null,
      tradeFrequency: null,
      lastNudge: null,
      createdAt: "2026-02-16T12:17:35.000Z",
      updatedAt: "2026-02-16T12:17:35.000Z",
      closedAt: null
    }
  }
].map(t => ({
  ...t,
  metadata: t.metadata ?? null,
  rawData: t.rawData ?? { funding: 0, socLoss: 0 }
}));

export const tradeSummary = {
  totalTrades: 18,
  totalFees: 0.730288,
  netVolume24h: 212,
  volumeChange24h: 6253.7,
  avgTradeSize: 1.0228,
  distribution: {
    spot: 83,
    perp: 17
  },
  gasVsProtocolRatio: 0,
  tradeFrequency: 1.5,
  profitFactorHistory: 0
}

// Journal data for individual trades
export const journalEntries: Record<
  string,
  {
    aiReview: string
    aiScore: number
    aiBias: string
    opportunityCost: number
    traderProfile: string
    macroContext: string
    marketSentiment: string
    notes: string
  }
> = {
  "TRD-001": {
    aiReview:
      "Strong entry on the SOL breakout above $172 resistance. Position sizing was appropriate. Exit could have been held longer - SOL continued to $195 within the next 8 hours. Consider trailing stops for momentum plays.",
    aiScore: 82,
    aiBias: "Confirmation Bias - entered after seeing 3 green candles",
    opportunityCost: 253.5,
    traderProfile: "The Momentum Rider",
    macroContext:
      "SOL ecosystem TVL up 12% WoW. Jupiter volume at ATH. Favorable conditions for long positions.",
    marketSentiment: "Bullish",
    notes: "",
  },
  "TRD-002": {
    aiReview:
      "Well-timed short on ETH after rejection at $3,900 psychological level. Good risk management with tight stop. Clean execution.",
    aiScore: 88,
    aiBias: "None detected - disciplined entry",
    opportunityCost: 0,
    traderProfile: "The Contrarian",
    macroContext:
      "ETH facing selling pressure from whale wallets. Merge upgrade concerns in community.",
    marketSentiment: "Bearish",
    notes: "",
  },
  "TRD-003": {
    aiReview:
      "Entered BTC long against the trend. The $98K level had weak support. Position was held too long despite clear rejection signals at 4h mark.",
    aiScore: 34,
    aiBias: "Anchoring Bias - fixated on $100K target",
    opportunityCost: 456.0,
    traderProfile: "The Dip Chaser",
    macroContext:
      "BTC in consolidation phase. Funding rates elevated. Low probability environment for directional longs.",
    marketSentiment: "Neutral",
    notes: "",
  },
  "TRD-004": {
    aiReview:
      "Excellent read on JUP overextension. Quick scalp with defined risk. Textbook mean reversion trade.",
    aiScore: 91,
    aiBias: "None detected",
    opportunityCost: 120.0,
    traderProfile: "The Scalper",
    macroContext:
      "JUP token unlock event approaching. Selling pressure expected. Good environment for shorts.",
    marketSentiment: "Bearish",
    notes: "",
  },
  "TRD-005": {
    aiReview:
      "WIF long was a revenge trade after missing the initial pump. Entry was chasing. Size was 2x normal - classic tilt behavior. Stop was too wide.",
    aiScore: 18,
    aiBias: "Revenge Trading + FOMO",
    opportunityCost: 0,
    traderProfile: "The Dip Chaser",
    macroContext:
      "Meme coin sector cooling off. WIF showing distribution pattern on 4h. Counter-trend trade.",
    marketSentiment: "Bearish",
    notes: "",
  },
  "TRD-006": {
    aiReview:
      "Solid SOL long at support. Good patience waiting for the retest. Exit was slightly early but profitable.",
    aiScore: 76,
    aiBias: "Loss Aversion - exited too early to lock in gains",
    opportunityCost: 180.0,
    traderProfile: "The Momentum Rider",
    macroContext:
      "SOL DeFi ecosystem expanding. Positive sentiment in Solana community.",
    marketSentiment: "Bullish",
    notes: "",
  },
  "TRD-007": {
    aiReview:
      "RNDR short against strong trend. AI/GPU narrative was bullish. Fighting the tape is costly. Consider aligning with higher timeframe trend.",
    aiScore: 29,
    aiBias: "Overconfidence Bias",
    opportunityCost: 0,
    traderProfile: "The Contrarian",
    macroContext:
      "AI sector tokens in strong uptrend. RNDR partnership announcements upcoming.",
    marketSentiment: "Bullish",
    notes: "",
  },
  "TRD-008": {
    aiReview:
      "Clean ETH long on the dip. Good size management. Held through volatility which shows conviction. Well executed.",
    aiScore: 85,
    aiBias: "None detected",
    opportunityCost: 67.5,
    traderProfile: "The Momentum Rider",
    macroContext:
      "ETH recovering from sell-off. Institutional buying detected on-chain.",
    marketSentiment: "Bullish",
    notes: "",
  },
}

// Mock Analysis Result for Demo
export const mockAnalysisResult = {
  aiAnalysis: {
    bias: "Recency Bias",
    insight: "You're heavily influenced by the last 3 winning trades. Your entries are getting sloppier as confidence over-extends.",
    score: 8,
    advice: "Stick to the pre-defined entry triggers. Don't eyeball the support.",
    next_action: "Set limit orders and close the terminal for 2 hours."
  },
  traderProfile: {
    profile: "THE MOMENTUM RIDER",
    strength: "Excellent trend identification",
    weakness: "Poor exit timing on reversals",
    nudge: "Don't let a winner turn into a loser. Use trail stops.",
    winRate: 72
  },
  macroContext: {
    sentiment: "BULLISH",
    macroContext: "Solana DeFi TVL is breaking yearly highs. Institutional interest is peaking.",
    headlines: [
      "Solana ETF rumors intensify",
      "Jupiter hits record daily volume",
      "Phantom wallet reaches 5M DAU"
    ]
  },
  whatIfAnalysis: {
    opportunityCost: 145.20,
    opportunityCostNote: "Exiting 15 mins later would have captured the local peak."
  }
}

// AI Coach messages
export const aiCoachMessages = [
  "Pattern detected: You tend to overtrade after a loss. Your win rate drops 23% in the hour following a losing trade. Consider enforcing a 30-min cooldown.",
  "Your best performance window is 14:00-18:00 UTC. 72% of your profits come from this period. Consider limiting off-peak trading.",
  "Risk alert: Current JUP-PERP position is 2.3x your average size. Your historical loss rate on oversized positions is 68%.",
  "Strength: Your SOL-PERP trades have a 78% win rate with 2.8 profit factor. This is your edge - lean into it.",
]
