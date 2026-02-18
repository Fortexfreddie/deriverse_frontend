'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SyncResults {
  positionsUpdated: number
  fillsProcessed: number
}

interface WalletSyncLoaderProps {
  onComplete?: () => void
  data?: SyncResults | null
}

export function WalletSyncLoader({ onComplete, data }: WalletSyncLoaderProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'INIT' | 'SYNC' | 'RESULTS'>('INIT')
  const logContainerRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  // Phase 1: Simulation (0-90%)
  useEffect(() => {
    if (phase !== 'INIT') return

    const steps = [
      { msg: '[INIT] Establishing secure connection to Solana Mainnet-Beta...', delay: 500 },
      { msg: '[AUTH] Verifying wallet ownership signature...', delay: 1200 },
      { msg: '[SYNC] Scanning address for compressed NFTs...', delay: 2000 },
      { msg: '[FETCH] Retrieving transaction history (Batch 1)...', delay: 2800 },
      { msg: '[FETCH] Retrieving transaction history (Batch 2)...', delay: 3500 },
      { msg: '[ANALYSIS] Computing historical PnL...', delay: 4200 },
      { msg: '[ANALYSIS] Identifying wash trades...', delay: 4800 },
    ]

    let currentStep = 0
    let interval: NodeJS.Timeout | undefined = undefined

    const runSimulation = () => {
      if (currentStep >= steps.length) {
         setPhase('SYNC') // Wait for real data
         return
      }
      
      const step = steps[currentStep]
      interval = setTimeout(() => {
        setLogs(prev => [...prev, step.msg])
        setProgress(prev => Math.min(prev + 12, 90))
        currentStep++
        runSimulation() // Chain next step
      }, 800) 
    }

    runSimulation()

    return () => {
        if (interval) clearTimeout(interval)
    }
  }, [phase])

  // Phase 2: Data Arrival & Transition
  useEffect(() => {
    if (data && phase === 'SYNC') {
      setLogs(prev => [...prev, '[SUCCESS] Data payload received.', '[PROCESS] Finalizing metrics...'])
      setProgress(100)
      
      // Short delay before showing results
      setTimeout(() => {
        setPhase('RESULTS')
      }, 1000)
    }
  }, [data, phase])

  // Phase 3: Auto-Complete
  useEffect(() => {
    if (phase === 'RESULTS') {
      const timer = setTimeout(() => {
        onComplete?.()
      }, 4000) // Show results for 4 seconds
      return () => clearTimeout(timer)
    }
  }, [phase, onComplete])

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center font-mono overflow-hidden">
      {/* Scanline & Vignette */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-tr from-black/80 via-transparent to-black/80"></div>
      
      {/* Container */}
      <div className="relative z-30 w-full max-w-2xl p-8 flex flex-col items-center">
        
        {phase !== 'RESULTS' ? (
           <>
            {/* Terminal Window */}
            <div className="w-full bg-black border border-primary/30 p-4 rounded mb-8 shadow-[0_0_30px_rgba(0,255,196,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-6 bg-primary/10 border-b border-primary/20 flex items-center px-2 gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                    <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                    <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                    <div className="ml-auto text-[9px] text-primary/70 uppercase">DERIVERSE_SYNC_PROTOCOL_V3</div>
                </div>
                
                <div 
                    ref={logContainerRef}
                    className="mt-6 h-48 overflow-y-auto font-mono text-xs space-y-1 scrollbar-hide"
                >
                    {logs.map((log, i) => (
                        <div key={i} className="text-primary/80 animate-[fadeIn_0.1s_ease-out]">
                            <span className="opacity-50 mr-2">{'>'}</span>
                            {log}
                        </div>
                    ))}
                    <div className="animate-pulse text-primary">_</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden relative">
                <div 
                    className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,255,196,0.5)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="w-full flex justify-between mt-2 text-[10px] text-primary/60 uppercase tracking-widest">
                <span>System_Status: {phase === 'SYNC' ? 'WAITING_FOR_DATA' : 'PROCESSING'}</span>
                <span>{progress}%</span>
            </div>
           </>
        ) : (
           /* RESULTS VIEW */
           <div className="flex flex-col items-center animate-[zoomIn_0.3s_ease-out]">
               <div className="text-6xl text-primary font-black tracking-tighter mb-2 animate-pulse drop-shadow-[0_0_15px_rgba(0,255,196,0.8)]">
                  COMPLETE
               </div>
               <div className="h-px w-32 bg-primary/50 mb-8"></div>
               
               <div className="grid grid-cols-2 gap-8 w-full mb-12">
                   <div className="text-center">
                       <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">POSITIONS UPDATED</div>
                       <div className="text-4xl text-white font-bold font-sans">
                           <span className="text-primary mr-1">[</span>
                           {data?.positionsUpdated || 0}
                           <span className="text-primary ml-1">]</span>
                       </div>
                   </div>
                   <div className="text-center">
                       <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">FILLS PROCESSED</div>
                       <div className="text-4xl text-white font-bold font-sans">
                           <span className="text-primary mr-1">[</span>
                           {data?.fillsProcessed || 0}
                           <span className="text-primary ml-1">]</span>
                       </div>
                   </div>
               </div>
               
               <div className="animate-[blink_1s_infinite] text-primary text-sm uppercase tracking-[0.2em] border border-primary/30 px-4 py-2 rounded bg-primary/5">
                   REDIRECTING_TO_DASHBOARD...
               </div>
           </div>
        )}

      </div>
      
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 0.8; transform: translateY(0); }
        }
        @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.9); filter: blur(4px); }
            to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes blink {
            50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
