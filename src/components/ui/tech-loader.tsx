
import { cn } from "@/lib/utils"

interface TechLoaderProps {
  text?: string
  className?: string
}

export function TechLoader({ text = "SYSTEM PROCESSING", className }: TechLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      {/* Scanner Element */}
      <div className="relative w-16 h-16 border border-(--gain-mint)/30">
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-(--gain-mint)" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-(--gain-mint)" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-(--gain-mint)" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-(--gain-mint)" />

        {/* Scanning bar */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-(--gain-mint)/20 to-transparent animate-scan" />
        
        {/* Core pulse */}
        <div className="absolute inset-4 bg-(--gain-mint)/10 animate-pulse" />
      </div>

      {/* Glitchy Text */}
      <div className="font-mono-data text-xs text-(--gain-mint) tracking-widest animate-pulse">
        {text}
        <span className="animate-blink">_</span>
      </div>
    </div>
  )
}
