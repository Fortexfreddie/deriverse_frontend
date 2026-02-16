'use client'

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      {/* Scanline */}
      <div className="scanline-effect"></div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated Loading Indicator */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-8 bg-pnl-gain rounded"
              style={{
                animation: `loadPulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-pnl-gain text-xs sm:text-sm tracking-widest font-bold uppercase">
            INITIALIZING
          </p>
          <p className="text-muted-foreground text-[9px] sm:text-[10px] mt-2 tracking-wider">
            <span className="animate-pulse">_</span>
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-48 sm:w-64 h-1 bg-pnl-gain/20 rounded-full relative overflow-hidden">
          <div
            className="h-full bg-pnl-gain origin-left"
            style={{
              animation: `progressBar 2s ease-in-out infinite`,
            }}
          ></div>
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent animate-[shimmer_2s_infinite]"></div>
        </div>

        {/* Loading Percentage */}
        <p className="text-muted-foreground text-[9px] sm:text-[10px] tracking-widest">
          <span className="text-pnl-gain font-bold">25%</span>
        </p>
      </div>

      <style>{`
        @keyframes loadPulse {
          0%, 60%, 100% {
            height: 8px;
            opacity: 0.5;
          }
          30% {
            height: 32px;
            opacity: 1;
          }
        }

        @keyframes progressBar {
          0% {
            width: 0%;
          }
          50% {
            width: 85%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
