
import { cn } from "@/lib/utils"

interface ChartFiltersProps {
  timeRange: string
  setTimeRange: (range: string) => void
  market?: string
  setMarket?: (market: string) => void
  availableMarkets?: string[]
}

const TIME_RANGES = ["1H", "1D", "1W", "1M", "ALL"]

export function ChartFilters({
  timeRange,
  setTimeRange,
  market,
  setMarket,
  availableMarkets = ["SOL", "BTC", "ETH"]
}: ChartFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Market Selector */}
      {market && setMarket && (
        <div className="flex bg-(--bg-secondary) border border-(--border-subtle) p-0.5">
          {availableMarkets.map((m) => (
            <button
              key={m}
              onClick={() => setMarket(m)}
              className={cn(
                "px-3 py-1 text-[10px] label-uppercase transition-all duration-200",
                market === m
                  ? "bg-(--gain-mint) text-(--bg-primary) font-bold shadow-[0_0_10px_rgba(0,196,159,0.3)]"
                  : "text-(--text-tertiary) hover:text-(--text-primary)"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Time Range Selector */}
      <div className="flex bg-(--bg-secondary) border border-(--border-subtle) p-0.5">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              "px-3 py-1 text-[10px] label-uppercase transition-all duration-200 relative overflow-hidden",
              timeRange === range
                ? "text-(--gain-mint)"
                : "text-(--text-tertiary) hover:text-(--text-primary)"
            )}
          >
            {/* Active Underline */}
            {timeRange === range && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-(--gain-mint)" />
            )}
            {range}
          </button>
        ))}
      </div>
    </div>
  )
}
