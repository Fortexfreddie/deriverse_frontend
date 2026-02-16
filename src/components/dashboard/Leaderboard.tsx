'use client'

import { Trophy, TrendingUp, User } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock Data for Leaderboard
const LEADERBOARD_DATA = [
    { rank: 1, name: 'SolanaWhale.sol', pnl: 45200.50, winRate: 78, avatar: '🦍' },
    { rank: 2, name: 'DiamondHands', pnl: 32150.20, winRate: 65, avatar: '💎' },
    { rank: 3, name: 'DegenerateApe', pnl: 28900.00, winRate: 52, avatar: '🦧' },
    { rank: 4, name: 'MoonBoi_99', pnl: 15400.80, winRate: 48, avatar: '🚀' },
    { rank: 5, name: 'PaperHands', pnl: 12200.10, winRate: 42, avatar: '📄' },
]

export function Leaderboard() {
  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
             <Trophy className="text-yellow-500" size={16} />
             <span className="text-[10px] font-mono font-bold tracking-widest text-foreground">TOP_TRADERS</span>
          </div>
          <button className="text-[10px] text-primary hover:underline">View All</button>
       </div>

       <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {LEADERBOARD_DATA.map((trader, index) => (
             <div 
                key={trader.rank}
                className={cn(
                    "flex items-center justify-between p-3 bg-card/50 border border-border/50 rounded-sm hover:bg-muted/10 hover:border-primary/30 transition-all group animate-in slide-in-from-bottom duration-500",
                    index === 0 ? "bg-yellow-500/5 border-yellow-500/20" : "",
                    index === 1 ? "bg-gray-400/5 border-gray-400/20" : "",
                    index === 2 ? "bg-amber-700/5 border-amber-700/20" : ""
                )}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
             >
                <div className="flex items-center gap-3">
                   <div className={cn(
                       "w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-full border",
                       index === 0 ? "bg-yellow-500/10 border-yellow-500 text-yellow-500" :
                       index === 1 ? "bg-gray-400/10 border-gray-400 text-gray-400" :
                       index === 2 ? "bg-amber-700/10 border-amber-700 text-amber-700" :
                       "bg-muted/10 border-border text-muted-foreground"
                   )}>
                       {trader.rank}
                   </div>
                   <div>
                       <div className="text-xs font-bold text-foreground flex items-center gap-1">
                           {trader.name}
                       </div>
                       <div className="text-[9px] text-muted-foreground font-mono flex items-center gap-2">
                           <span className="flex items-center gap-0.5">
                               <TrendingUp size={8} /> {trader.winRate}% WR
                           </span>
                       </div>
                   </div>
                </div>
                
                <div className="text-right">
                    <div className="text-sm font-mono font-bold text-primary">
                        +${(trader.pnl / 1000).toFixed(1)}k
                    </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  )
}
