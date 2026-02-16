// Analytics data
export const dashboardData = [
  {
    positionId: "POS-7X2K",
    market: "SOL-PERP",
    side: "LONG" as const,
    entry: 187.42,
    current: 194.18,
    size: 52.5,
    unrealized: 354.9,
    realized: 0,
    leverage: "5x",
    lastDirection: "up"
  },
  {
    positionId: "POS-3M9N",
    market: "ETH-PERP",
    side: "SHORT" as const,
    entry: 3842.1,
    current: 3791.55,
    size: 2.8,
    unrealized: 141.54,
    realized: 0,
    leverage: "3x",
    lastDirection: "up"
  },
  {
    positionId: "POS-1Q8R",
    market: "BTC-PERP",
    side: "LONG" as const,
    entry: 98450.0,
    current: 99120.75,
    size: 0.15,
    unrealized: 100.61,
    realized: 0,
    leverage: "2x",
    lastDirection: "up"
  },
  {
    positionId: "POS-5T4W",
    market: "JUP-PERP",
    side: "LONG" as const,
    entry: 1.243,
    current: 1.198,
    size: 8500,
    unrealized: -382.5,
    realized: 0,
    leverage: "10x",
    lastDirection: "up"
  },
  {
    positionId: "POS-9K1L",
    market: "WIF-PERP",
    side: "SHORT" as const,
    entry: 2.87,
    current: 2.94,
    size: 3200,
    unrealized: -224.0,
    realized: 0,
    leverage: "5x",
    lastDirection: "down"
  },
  {
    positionId: "POS-2F6G",
    market: "RNDR-PERP",
    side: "LONG" as const,
    entry: 11.32,
    current: 11.89,
    size: 420,
    unrealized: 239.4,
    realized: 0,
    leverage: "3x",
    lastDirection: "down"
  }
]

export const analyticsData = {
  totalPnl: {
    realized: 12847.32,
    unrealized: 354.9,
    total: 13202.22,
  },
  winRate: 67.4,
  tradeCount: {
    total: 243,
    wins: 164,
    losses: 79,
    open: 2,
  },
  avgTradeDuration: 4.5,
  longShortRatio: 1.38,
  largestGain: { amount: 4231.87, market: "SOL-PERP" },
  largestLoss: { amount: -1892.43, market: "WIF-PERP" },
  avgWin: 312.45,
  avgLoss: -189.23,
  totalFees: 89.17,
  totalVolume: 487320,
  profitFactor: 2.72,
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
    pnl: value,
  }
})

// Trade history
export const tradeHistory = [
  {
    id: "TRD-001",
    market: "SOL-PERP",
    side: "LONG" as const,
    entry: 172.35,
    exit: 189.42,
    size: 45.0,
    pnl: 768.15,
    date: "Feb 10, 2026",
    duration: "4h 23m",
    fees: 12.34,
  },
  {
    id: "TRD-002",
    market: "ETH-PERP",
    side: "SHORT" as const,
    entry: 3901.0,
    exit: 3842.55,
    size: 3.2,
    pnl: 187.04,
    date: "Feb 09, 2026",
    duration: "2h 11m",
    fees: 8.92,
  },
  {
    id: "TRD-003",
    market: "BTC-PERP",
    side: "LONG" as const,
    entry: 97800.0,
    exit: 96950.0,
    size: 0.12,
    pnl: -102.0,
    date: "Feb 09, 2026",
    duration: "6h 47m",
    fees: 15.23,
  },
  {
    id: "TRD-004",
    market: "JUP-PERP",
    side: "SHORT" as const,
    entry: 1.312,
    exit: 1.278,
    size: 10000,
    pnl: 340.0,
    date: "Feb 08, 2026",
    duration: "1h 05m",
    fees: 5.67,
  },
  {
    id: "TRD-005",
    market: "WIF-PERP",
    side: "LONG" as const,
    entry: 2.65,
    exit: 2.41,
    size: 4200,
    pnl: -1008.0,
    date: "Feb 08, 2026",
    duration: "8h 32m",
    fees: 18.45,
  },
  {
    id: "TRD-006",
    market: "SOL-PERP",
    side: "LONG" as const,
    entry: 168.9,
    exit: 176.22,
    size: 60.0,
    pnl: 439.2,
    date: "Feb 07, 2026",
    duration: "3h 15m",
    fees: 10.11,
  },
  {
    id: "TRD-007",
    market: "RNDR-PERP",
    side: "SHORT" as const,
    entry: 12.05,
    exit: 12.43,
    size: 500,
    pnl: -190.0,
    date: "Feb 07, 2026",
    duration: "5h 40m",
    fees: 7.89,
  },
  {
    id: "TRD-008",
    market: "ETH-PERP",
    side: "LONG" as const,
    entry: 3755.0,
    exit: 3891.3,
    size: 2.5,
    pnl: 340.75,
    date: "Feb 06, 2026",
    duration: "7h 12m",
    fees: 11.56,
  },
  {
    id: "TRD-009",
    market: "LINK-PERP",
    side: "LONG" as const,
    entry: 18.55,
    exit: 19.82,
    size: 150,
    pnl: 190.50,
    date: "Feb 05, 2026",
    duration: "12h 10m",
    fees: 4.56,
  },
  {
    id: "TRD-010",
    market: "AVAX-PERP",
    side: "SHORT" as const,
    entry: 42.15,
    exit: 40.85,
    size: 80,
    pnl: 104.0,
    date: "Feb 05, 2026",
    duration: "3h 45m",
    fees: 3.20,
  },
  {
    id: "TRD-011",
    market: "SOL-PERP",
    side: "SHORT" as const,
    entry: 182.50,
    exit: 179.20,
    size: 35.0,
    pnl: 115.5,
    date: "Feb 04, 2026",
    duration: "1h 30m",
    fees: 5.40,
  },
  {
    id: "TRD-012",
    market: "BTC-PERP",
    side: "LONG" as const,
    entry: 96500.0,
    exit: 97100.0,
    size: 0.1,
    pnl: 60.0,
    date: "Feb 04, 2026",
    duration: "2h 20m",
    fees: 8.50,
  }
]

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

// AI Coach messages
export const aiCoachMessages = [
  "Pattern detected: You tend to overtrade after a loss. Your win rate drops 23% in the hour following a losing trade. Consider enforcing a 30-min cooldown.",
  "Your best performance window is 14:00-18:00 UTC. 72% of your profits come from this period. Consider limiting off-peak trading.",
  "Risk alert: Current JUP-PERP position is 2.3x your average size. Your historical loss rate on oversized positions is 68%.",
  "Strength: Your SOL-PERP trades have a 78% win rate with 2.8 profit factor. This is your edge - lean into it.",
]
