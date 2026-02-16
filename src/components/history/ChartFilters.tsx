interface ChartFiltersProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  chartType: string
  onChartTypeChange: (type: string) => void
  timeframe: string
  onTimeframeChange: (tf: string) => void
}

export function ChartFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  chartType,
  onChartTypeChange,
  timeframe,
  onTimeframeChange,
}: ChartFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      {/* Date Filters */}
      <div className="flex gap-2 text-[8px] sm:text-xs">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground hidden sm:inline">START:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-background border border-border px-2 py-1 rounded text-foreground text-[8px] sm:text-xs focus:border-pnl-gain focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground hidden sm:inline">END:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-background border border-border px-2 py-1 rounded text-foreground text-[8px] sm:text-xs focus:border-pnl-gain focus:outline-none"
          />
        </div>
      </div>

      {/* Chart Type Toggles */}
      <div className="flex gap-1 text-[8px] sm:text-[9px]">
        {['REALIZED', 'UNREALIZED', 'TOTAL'].map((type) => (
          <button
            key={type}
            onClick={() => onChartTypeChange(type)}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border transition-colors ${
              chartType === type
                ? 'bg-pnl-gain/20 border-pnl-gain text-pnl-gain'
                : 'border-border text-muted-foreground hover:border-foreground/50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Timeframe Buttons */}
      <div className="flex gap-1 text-[8px] sm:text-[9px]">
        {['1DM', '1H', '1D'].map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange(tf)}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border transition-colors ${
              timeframe === tf
                ? 'bg-muted border-foreground/30 text-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/50'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  )
}
