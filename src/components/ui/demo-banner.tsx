"use client"

import { useState, useEffect } from "react"
import { 
  Wallet2, 
  ShieldAlert, 
  ChevronUp, 
  Activity,
  Code2,
  AlertCircle
} from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useAnalytics } from "@/hooks/use-analytics"
import { cn } from "@/lib/utils"

export function DemoBanner() {
  const { isDemo, error } = useAnalytics()
  const { publicKey, connected, disconnect: walletDisconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [isExpanded, setIsExpanded] = useState(false)

  // Auto-expand on error
  useEffect(() => {
    if (error) setIsExpanded(true)
  }, [error])

  if (!isDemo && !error) return null

  const handleConnect = () => {
    setVisible(true) // Opens the wallet adapter modal
  }

  const handleDisconnect = () => {
    walletDisconnect() // Disconnect from wallet adapter
  }

  // Unified color mapping for industrial consistency
  // Now using amber-500 (demo) as the base for the non-error state
  const theme = {
    color: error ? "text-pink" : "text-amber-500",
    bg: error ? "bg-pink" : "bg-amber-500",
    border: error ? "border-pink/30" : "border-amber-500/30",
    shadow: error ? "shadow-[0_4px_30px_rgba(255,32,121,0.1)]" : "shadow-[0_4px_30px_rgba(245,158,11,0.1)]",
    pulse: error ? "bg-pink/10 shadow-[inset_0_0_10px_rgba(255,32,121,0.2)]" : "bg-amber-500/10 shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]"
  }

  return (
    <div
      className={cn(
        "sticky top-0 z-[100] w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden",
        "backdrop-blur-xl border-b md:ml-16",
        error ? "bg-pink/5 dark:bg-pink/5" : "bg-amber-500/8 dark:bg-amber-500/5",
        theme.border,
        theme.shadow,
        isExpanded ? "max-h-[56px] sm:max-h-[64px] py-0" : "max-h-[8px] cursor-pointer group/banner hover:max-h-[12px]"
      )}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {/* ─── ATMOSPHERIC LAYER: HAZARD STRIPES (Unified Animation) ─── */}
      <div className={cn(
        "absolute inset-0 pointer-events-none transition-opacity duration-1000",
        isExpanded ? "opacity-[0.04]" : "opacity-[0.1]",
        error 
          ? "bg-[repeating-linear-gradient(45deg,transparent,transparent_12px,#FF2079_12px,#FF2079_24px)]" 
          : "bg-[repeating-linear-gradient(45deg,transparent,transparent_12px,#f59e0b_12px,#f59e0b_24px)]"
      )} />

      {/* ─── ATMOSPHERIC LAYER: GLASS SCANLINE ─── */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-foreground/[0.02] dark:from-background/5 to-transparent h-1/2" />

      {/* ─── COLLAPSED STATE: THE "WIRE" ─── */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-500",
        isExpanded ? "opacity-0 invisible scale-95" : "opacity-100 visible scale-100"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn("h-[2px] w-12 rounded-full blur-[1px] animate-pulse", theme.bg)} />
          <AlertCircle size={8} className={cn("animate-spin-slow", theme.color)} />
          <div className={cn("h-[2px] w-12 rounded-full blur-[1px] animate-pulse", theme.bg)} />
        </div>
      </div>

      {/* ─── EXPANDED STATE: THE CONTROL RAIL ─── */}
      <div className={cn(
        "max-w-[1600px] mx-auto px-3 sm:px-6 h-[48px] sm:h-[56px] flex items-center justify-between gap-3 sm:gap-8 relative z-10 transition-all duration-700",
        isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}>
        
        {/* LEFT: TELEMETRY STATUS */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className={cn(
            "size-7 sm:size-9 flex items-center justify-center border-t border-l border-foreground/10 dark:border-background/10 relative shrink-0",
            theme.pulse,
            theme.color
          )}>
            {error ? <ShieldAlert size={14} className="sm:size-[18px]" /> : <Activity size={14} className="sm:size-[18px] animate-pulse" />}
            {/* Corner Bracket Decor */}
            <div className="absolute -top-px -left-px size-1 border-t border-l border-current" />
          </div>
          
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={cn(
                "font-label text-[7px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.4em] font-black opacity-70",
                theme.color
              )}>
                {error ? "Connection Error" : "Sandbox Mode"}
              </span>
              <div className={cn("size-1 rounded-full animate-ping", theme.bg)} />
            </div>
            <span className={cn(
              "font-mono-data text-[10px] sm:text-[12px] font-bold uppercase tracking-tight truncate",
              error ? "text-pink drop-shadow-[0_0_5px_rgba(255,32,121,0.5)]" : "text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]"
            )}>
              {error ? `Error: ${error}` : "Viewing demo data — no wallet connected"}
            </span>
          </div>
        </div>

        {/* RIGHT: TACTICAL ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              error ? handleDisconnect() : handleConnect()
            }}
            className={cn(
              "relative group/btn flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-2 border overflow-hidden transition-all duration-300",
              "font-label text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em]",
              error 
                ? "border-pink/50 text-pink hover:text-white" 
                : "border-amber-500/50 text-amber-500 hover:text-white"
            )}
          >
            {/* Slide-up hover fill */}
            <div className={cn(
              "absolute inset-0 z-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300",
              error ? "bg-pink" : "bg-amber-500"
            )} />
            {error ? <Code2 size={12} className="relative z-10 sm:size-[14px]" /> : <Wallet2 size={12} className="relative z-10 sm:size-[14px]" />}
            <span className="relative z-10 hidden sm:inline">{error ? "Return to Demo" : "Connect Wallet"}</span>
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(false)
            }}
            className="p-1 sm:p-2 text-foreground/20 hover:text-foreground transition-colors"
            aria-label="Minimize"
          >
            <ChevronUp size={16} className="sm:size-[20px]" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* ─── BOTTOM EDGE: GLOW SHIMMER ─── */}
      <div className={cn(
        "absolute bottom-0 h-[1.5px] w-full",
        error ? "bg-pink/20" : "bg-amber-500/20"
      )}>
        <div className={cn(
          "absolute inset-0 w-1/3 animate-shimmer blur-[1px]",
          error 
            ? "bg-gradient-to-r from-transparent via-pink to-transparent" 
            : "bg-gradient-to-r from-transparent via-amber-500 to-transparent"
        )} />
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(350%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shimmer { animation: shimmer 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  )
}