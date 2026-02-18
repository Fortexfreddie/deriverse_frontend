'use client'

import { Trophy, TrendingUp, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LeaderboardEntry } from '@/lib/api'

interface LeaderboardProps {
    data?: LeaderboardEntry[]
}

export function Leaderboard({ data }: LeaderboardProps) {
  // Fallback if no data provided (or loading)
  const displayData = data || []

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
          {displayData.map((trader, index) => {
             // Generate missing UI fields deterministically or randomly for now
             const winRate = 78 - (index * 5) + Math.floor(Math.random() * 5); 

             return (
             <div 
                key={trader.wallet}
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
                       "w-8 h-8 flex items-center justify-center text-[10px] font-bold rounded-full border overflow-hidden",
                       index === 0 ? "bg-yellow-500/10 border-yellow-500 text-yellow-500" :
                       index === 1 ? "bg-gray-400/10 border-gray-400 text-gray-400" :
                       index === 2 ? "bg-amber-700/10 border-amber-700 text-amber-700" :
                       "bg-muted/10 border-border text-muted-foreground"
                   )}>
                       {trader.avatar ? (
                           <img src={trader.avatar} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                           index + 1
                       )}
                   </div>
                   <div>
                       <div className="text-xs font-bold text-foreground flex items-center gap-1">
                           {!trader.avatar && <User size={10} className="text-primary/70" />}
                           {trader.wallet}
                       </div>
                       <div className="text-[9px] text-muted-foreground font-mono flex items-center gap-2">
                           <span className="flex items-center gap-0.5">
                               <TrendingUp size={8} /> {trader.winRate || (78 - (index * 5))}% WR
                           </span>
                       </div>
                   </div>
                </div>
                
                <div className="text-right">
                    <div className="text-sm font-mono font-bold text-primary">
                        {trader.pnl >= 1000 ? `+$${(trader.pnl / 1000).toFixed(1)}k` : `+$${trader.pnl.toFixed(1)}`}
                    </div>
                </div>
             </div>
          )})}
       </div>
    </div>
  )
}
