'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PageLoader } from '@/components/PageLoader'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, Eye, EyeOff, Shield, Activity, Zap, Cpu, Bell, Volume2, UserCheck } from 'lucide-react'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [streamerMode, setStreamerMode] = useState(false)
  const [aiPersona, setAiPersona] = useState<'risk_manager' | 'performance_coach' | 'degen_bro'>('risk_manager')
  const [interventionLevel, setInterventionLevel] = useState(50)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <DashboardLayout title="DASHBOARD // CONFIGURATION">
      <div className="flex-1 flex overflow-hidden h-full">
        {/* Main Content - System Parameters */}
        <div className="flex-1 flex flex-col bg-background overflow-y-auto custom-scrollbar">
          <div className="p-4 md:p-6 w-full">
            
            <header className="mb-8 border-b border-border pb-4">
               <h1 className="text-xl font-bold font-mono uppercase tracking-widest flex items-center gap-2">
                 <Settings className="text-primary" size={20}/> System_Configuration
               </h1>
               <p className="text-xs text-muted-foreground mt-1 font-mono">Adjust terminal behavior, AI limits, and risk protocols.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* SECTION 1: INTERFACE PREFERENCES (Privacy/Streamer) */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                 <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Shield size={14} /> Interface_Preferences
                    </h3>
                 </div>

                 {/* Privacy Mode */}
                 <div className="flex items-center justify-between group">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                             <div className="text-sm font-bold text-foreground">Privacy Mode</div>
                             {privacyMode && <span className="bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">Active</span>}
                         </div>
                         <div className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                           Blur sensitive values (PnL, Balance) for screenshots sharing.
                         </div>
                    </div>
                    <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
                 </div>

                 {/* Streamer Mode */}
                 <div className="flex items-center justify-between group">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                             <div className="text-sm font-bold text-foreground">Streamer Mode</div>
                             {streamerMode && <span className="bg-accent-pink/20 text-accent-pink text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">Live</span>}
                         </div>
                         <div className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                           Hide wallet address and transaction signatures from UI.
                         </div>
                    </div>
                    <Switch checked={streamerMode} onCheckedChange={setStreamerMode} />
                 </div>
              </div>


              {/* SECTION 2: AI COACH CONFIGURATION */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-6 relative overflow-hidden">
                 {/* Decorative background element */}
                 <div className={`absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none transition-opacity ${aiPersona === 'degen_bro' ? 'bg-pink-500/10' : ''}`} />

                 <div className="flex items-center justify-between border-b border-border pb-2 mb-2 relative z-10">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Cpu size={14} /> AI_Coach_Logic
                    </h3>
                 </div>

                 {/* Persona Selection */}
                 <div className="space-y-3 relative z-10">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wide block">Persona Protocol</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            onClick={() => setAiPersona('risk_manager')}
                            className={`p-3 rounded border text-left transition-all ${
                                aiPersona === 'risk_manager' 
                                ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                                : 'bg-background border-border text-muted-foreground hover:bg-muted/10'
                            }`}
                        >
                            <div className="text-[10px] uppercase font-bold mb-1">Risk Manager</div>
                            <div className="text-[9px] opacity-70 leading-tight">Focus on drawdowns & capital preservation.</div>
                        </button>
                        <button 
                            onClick={() => setAiPersona('performance_coach')}
                            className={`p-3 rounded border text-left transition-all ${
                                aiPersona === 'performance_coach' 
                                ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                                : 'bg-background border-border text-muted-foreground hover:bg-muted/10'
                            }`}
                        >
                            <div className="text-[10px] uppercase font-bold mb-1">Performance</div>
                            <div className="text-[9px] opacity-70 leading-tight">Balanced psych & technical advice.</div>
                        </button>
                        <button 
                            onClick={() => setAiPersona('degen_bro')}
                            className={`p-3 rounded border text-left transition-all ${
                                aiPersona === 'degen_bro' 
                                ? 'bg-pink-500/10 border-pink-500 text-pink-500 shadow-sm' 
                                : 'bg-background border-border text-muted-foreground hover:bg-muted/10'
                            }`}
                        >
                            <div className="text-[10px] uppercase font-bold mb-1">Degen Bro</div>
                            <div className="text-[9px] opacity-70 leading-tight">High risk, high reward encouragement.</div>
                        </button>
                    </div>
                 </div>

                 {/* Intervention Volume */}
                 <div className="space-y-4 relative z-10">
                     <div className="flex justify-between">
                        <label className="text-xs font-bold text-foreground uppercase tracking-wide block">Intervention Frequency</label>
                        <span className="text-xs font-mono text-primary">{interventionLevel}%</span>
                     </div>
                     <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={interventionLevel} 
                      onChange={(e) => setInterventionLevel(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                     />
                     <div className="flex justify-between text-[9px] text-muted-foreground font-mono uppercase">
                         <span>Passive</span>
                         <span>Balanced</span>
                         <span>Aggressive</span>
                     </div>
                 </div>
              </div>


              {/* SECTION 3: SYSTEM PARAMETERS (Realistic) */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                 <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Zap size={14} /> System_Parameters
                    </h3>
                 </div>

                 {/* Explorer Selection */}
                 <div className="group">
                    <label className="block text-xs font-bold text-foreground uppercase mb-2">Block Explorer</label>
                    <Select defaultValue="Solscan">
                      <SelectTrigger className="w-full bg-background border-border font-mono text-sm text-muted-foreground">
                        <SelectValue placeholder="Select Explorer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Solscan">Solscan (Recommended)</SelectItem>
                        <SelectItem value="SolanaFM">SolanaFM</SelectItem>
                        <SelectItem value="SolanaBeach">Solana Beach</SelectItem>
                        <SelectItem value="XRAY">XRAY</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                        Used for external transaction links in history.
                    </p>
                 </div>

                 {/* RPC Endpoint (Classic Realistic Setting) */}
                 <div className="group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-foreground uppercase">RPC Endpoint</label>
                        <span className="text-[9px] text-green-500 font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            14ms
                        </span>
                    </div>
                    <input 
                        type="text" 
                        defaultValue="https://api.mainnet-beta.solana.com"
                        className="w-full bg-background border border-border text-xs font-mono p-2.5 rounded  focus:border-primary outline-none text-muted-foreground"
                    />
                 </div>
              </div>


              {/* SECTION 4: NOTIFICATIONS */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                 <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                    <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Bell size={14} /> Data_Feeds
                    </h3>
                 </div>

                 <div className="flex items-center justify-between group">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                             <div className="text-sm font-bold text-foreground">Telegram Webhook</div>
                         </div>
                         <div className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                           Push execution fills to private channel.
                         </div>
                    </div>
                    <Switch defaultChecked />
                 </div>

                 <div className="flex items-center justify-between group">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                             <div className="text-sm font-bold text-foreground">Browser Alerts</div>
                         </div>
                         <div className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                           Sound alerts on fill/SL hit.
                         </div>
                    </div>
                    <Switch />
                 </div>
              </div>

            </div> {/* End Grid */}

            {/* Footer / Danger Zone */}
            <div className="mt-8 pt-8 border-t border-border flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
                 <div className="text-xs text-muted-foreground font-mono">
                     Build: v3.2.1-beta <br/>
                     Session: 8f92-xx-29a
                 </div>
                 <button className="text-[10px] text-red-500 hover:text-red-400 uppercase font-bold tracking-widest border border-red-900/30 hover:bg-red-900/10 px-4 py-2 rounded transition-colors">
                     Reset_Factory_Defaults
                 </button>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
