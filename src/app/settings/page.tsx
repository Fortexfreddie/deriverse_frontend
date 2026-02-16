'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  return (
    <DashboardLayout title="DASHBOARD // CONFIGURATION">
      <div className="flex-1 flex overflow-hidden h-full">
        {/* Main Content - System Parameters */}
        <div className="flex-1 flex flex-col bg-background overflow-y-auto custom-scrollbar">
          <div className="p-4 md:p-6">
            <h2 className="font-mono text-xs text-primary uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
              <span className="material-icons text-sm">dns</span>
              SYSTEM_PARAMETERS
            </h2>
            
            <div className="grid grid-cols-1 gap-4 md:gap-6 max-w-4xl">
              
              {/* RPC Configuration */}
              <div className="bg-card border border-border rounded p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                  <h3 className="font-mono text-xs text-foreground uppercase font-bold">RPC_CONFIGURATION</h3>
                  <span className="text-[10px] text-muted-foreground font-mono">LATENCY: 14ms</span>
                </div>
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase mb-1">Primary RPC URL</label>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-background border border-border text-foreground font-mono text-xs px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-muted-foreground" 
                        type="text" 
                        defaultValue="https://api.mainnet-beta.solana.com"
                      />
                      <button className="px-3 py-2 bg-primary/10 border border-primary/30 text-primary font-mono text-[10px] font-bold hover:bg-primary/20 transition-colors uppercase">
                        Ping_Test
                      </button>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase mb-1">Backup RPC URL (Failover)</label>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-background border border-border text-muted-foreground font-mono text-xs px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-muted-foreground" 
                        type="text" 
                        defaultValue="https://solana-api.projectserum.com"
                      />
                      <button className="px-3 py-2 bg-card border border-border text-muted-foreground font-mono text-[10px] font-bold hover:text-foreground hover:border-foreground/50 transition-colors uppercase">
                        Ping_Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Controls */}
              <div className="bg-card border border-border rounded p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                  <h3 className="font-mono text-xs text-foreground uppercase font-bold">RISK_CONTROLS</h3>
                  <span className="text-[10px] text-accent-pink font-mono uppercase">Strict Mode</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex justify-between mb-2">
                      <label className="text-[10px] font-mono text-muted-foreground uppercase">Max Leverage</label>
                      <span className="text-[10px] font-mono text-primary">5x</span>
                    </div>
                    <input 
                      className="w-full appearance-none bg-transparent focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:bg-border [&::-webkit-slider-runnable-track]:cursor-pointer" 
                      max="20" 
                      min="1" 
                      type="range" 
                      defaultValue="5"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] font-mono text-muted-foreground">1x</span>
                      <span className="text-[10px] font-mono text-muted-foreground">20x</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase mb-1">Daily Loss Limit (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-muted-foreground font-mono text-xs">$</span>
                      <input 
                        className="w-full bg-background border border-border text-foreground font-mono text-xs pl-6 pr-3 py-2 focus:ring-1 focus:ring-accent-pink focus:border-accent-pink outline-none transition-all" 
                        type="number" 
                        defaultValue="5000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase mb-1">Auto-Deleverage Threshold</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-background border border-border text-foreground font-mono text-xs px-3 py-2 focus:ring-1 focus:ring-accent-pink focus:border-accent-pink outline-none transition-all" 
                        type="number" 
                        defaultValue="85"
                      />
                      <span className="absolute right-3 top-2 text-muted-foreground font-mono text-xs">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Routing */}
              <div className="bg-card border border-border rounded p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                  <h3 className="font-mono text-xs text-foreground uppercase font-bold">NOTIFICATION_ROUTING</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-foreground uppercase">Telegram Webhooks</div>
                      <div className="text-[10px] text-muted-foreground">Receive alerts via bot API</div>
                    </div>
                    <Switch defaultChecked id="toggle-telegram" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-foreground uppercase">Browser Alerts</div>
                      <div className="text-[10px] text-muted-foreground">Native push notifications</div>
                    </div>
                    <Switch id="toggle-browser" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Panel - API Keys (Desktop Only) */}
        <div className="hidden lg:flex w-[340px] border-l border-border bg-background flex-col flex-shrink-0">
          <header className="h-12 border-b border-border flex items-center justify-between px-4 font-mono text-[10px] uppercase tracking-wider bg-card">
            <span className="text-foreground font-bold leading-none">API_KEYS</span>
            <button className="text-primary hover:text-foreground transition-colors flex items-center gap-1 group">
              <span className="material-icons text-[14px] group-hover:rotate-90 transition-transform">add</span> NEW
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
            
            {/* API Key Item */}
            <div className="border border-border rounded bg-card p-3 group hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-muted-foreground">api</span>
                  <span className="text-[10px] font-mono text-foreground font-bold">SOLANA_RPC_MAIN</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(0,255,196,0.5)]"></span>
              </div>
              <div className="font-mono text-[10px] text-muted-foreground bg-background p-1.5 rounded border border-border mb-3 truncate">
                sk_live_...93jK2
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1 text-[10px] font-mono border border-border hover:bg-foreground/5 rounded text-muted-foreground transition-colors flex items-center justify-center gap-1">
                  <span className="material-icons text-[10px]">refresh</span> ROTATE
                </button>
                <button className="flex-1 py-1 text-[10px] font-mono border border-border hover:border-accent-pink hover:text-accent-pink hover:bg-accent-pink/5 rounded text-muted-foreground transition-colors flex items-center justify-center gap-1">
                  <span className="material-icons text-[10px]">block</span> REVOKE
                </button>
              </div>
            </div>

            {/* API Key Item */}
            <div className="border border-border rounded bg-card p-3 group hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-muted-foreground">insights</span>
                  <span className="text-[10px] font-mono text-foreground font-bold">DEX_SCREENER_PRO</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(0,255,196,0.5)]"></span>
              </div>
              <div className="font-mono text-[10px] text-muted-foreground bg-background p-1.5 rounded border border-border mb-3 truncate">
                ds_v1_...m2N9x
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1 text-[10px] font-mono border border-border hover:bg-foreground/5 rounded text-muted-foreground transition-colors flex items-center justify-center gap-1">
                  <span className="material-icons text-[10px]">refresh</span> ROTATE
                </button>
                <button className="flex-1 py-1 text-[10px] font-mono border border-border hover:border-accent-pink hover:text-accent-pink hover:bg-accent-pink/5 rounded text-muted-foreground transition-colors flex items-center justify-center gap-1">
                  <span className="material-icons text-[10px]">block</span> REVOKE
                </button>
              </div>
            </div>

            {/* API Key Item */}
            <div className="border border-border rounded bg-card p-3 group hover:border-primary/30 transition-colors opacity-75">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-muted-foreground">visibility</span>
                  <span className="text-[10px] font-mono text-muted-foreground font-bold">BIRDEYE_DATA</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              </div>
              <div className="font-mono text-[10px] text-muted-foreground bg-background p-1.5 rounded border border-border mb-3 truncate">
                be_public_...x9P2
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1 text-[10px] font-mono border border-border hover:bg-foreground/5 rounded text-muted-foreground transition-colors flex items-center justify-center gap-1">
                  <span className="material-icons text-[10px]">refresh</span> ROTATE
                </button>
                <button className="flex-1 py-1 text-[10px] font-mono border border-border hover:border-accent-pink hover:text-accent-pink hover:bg-accent-pink/5 rounded text-muted-foreground transition-colors flex items-center justify-center gap-1">
                  <span className="material-icons text-[10px]">block</span> REVOKE
                </button>
              </div>
            </div>

            {/* Warning Box */}
            <div className="my-2 border-t border-border border-dashed"></div>
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded">
              <div className="flex items-start gap-2">
                <span className="material-icons text-yellow-500 text-sm mt-0.5">warning</span>
                <p className="text-[10px] text-yellow-500/80 font-mono leading-tight">
                    API Rate limits approaching 85% on DexScreener endpoint. Consider upgrading plan.
                </p>
              </div>
            </div>
            
            {/* Factory Reset */}
            <div className="mt-auto pt-4">
              <button className="w-full bg-accent-pink hover:bg-red-600 text-white font-mono font-bold text-xs py-3 rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(255,32,121,0.2)]">
                <span className="material-icons text-sm">delete_forever</span>
                FACTORY_RESET
              </button>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
