'use client'

import { useEffect, useState } from 'react'

export function BootLoader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0)
  interface BootLog {
    id: number
    time: string
    label: string
    message: string
    status: string
    color: string
    delay: number
  }

  const [logs, setLogs] = useState<BootLog[]>([])

  useEffect(() => {
    // Progress animation to match the visual feel
    // The user had 64% in HTML, we will animate 0 -> 100
    const startTime = Date.now()
    const duration = 3000 // 3 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const calculatedProgress = (elapsed / duration) * 100
      
      if (calculatedProgress >= 100) {
        setProgress(100) // Force snap to 100
        clearInterval(interval)
        
        // Give the user a moment to actually see the 100%
        setTimeout(() => {
          onComplete?.()
        }, 1200)
      } else {
        setProgress(calculatedProgress)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete])

  // Log sequence
  useEffect(() => {
    const logSequence = [
      { id: 1, time: '09:41:02', label: 'SYSTEM', message: 'INITIALIZING_APP_KERNEL...', status: '[OK]', color: 'text-[#00ffc4]', delay: 200 },
      { id: 2, time: '09:41:03', label: 'NET', message: 'ESTABLISHING_WSS_FEED...', status: '[OK]', color: 'text-[#00ffc4]', delay: 600 },
      { id: 3, time: '09:41:03', label: 'UI', message: 'LOADING_GLYPHS_AND_ASSETS...', status: '[OK]', color: 'text-[#00ffc4]', delay: 1000 },
      { id: 4, time: '09:41:03', label: 'DATA', message: 'HYDRATING_PUBLIC_PRICE_FEED...', status: '[IN_PROGRESS]', color: 'text-yellow-400 animate-pulse', delay: 1400 },
      { id: 5, time: '09:41:03', label: 'ENGINE', message: 'WARMING_CHART_ADAPTERS...', status: '[WAITING]', color: 'text-gray-600', delay: 1800 },
      { id: 6, time: 'PENDING', label: 'AI', message: 'PRELOADING_NEURAL_WEIGHTS...', status: '[WAITING]', color: 'text-gray-600', delay: 2400 },
      { id: 7, time: 'PENDING', label: 'MEM', message: 'ALLOCATING_VIRTUAL_HEAP...', status: '[WAITING]', color: 'text-gray-600', delay: 2600 },
    ]

    logSequence.forEach((log) => {
      setTimeout(() => {
        setLogs((prev) => {
          if (prev.find(l => l.id === log.id)) return prev
          return [...prev, log]
        })
      }, log.delay)
    })
  }, [])

  return (
    <div className="bg-background text-foreground font-display min-h-screen flex flex-col overflow-hidden selection:bg-[#00ffc4] selection:text-[#050505] relative">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid-size opacity-20 pointer-events-none z-0"></div>
      
      {/* CRT Overlay */}
      <div className="fixed inset-0 bg-linear-to-b from-transparent to-black/20 pointer-events-none z-50 crt-flicker"></div>
      
      {/* Vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10"></div>
      
      {/* Main Content Area */}
      <main className="relative z-20 grow flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto h-screen">
        
        {/* System Status Header (Top Left) */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 font-mono text-[10px] md:text-xs text-[#00ffc4]/60 tracking-widest border border-[#00ffc4]/20 p-2 rounded z-30 bg-[#050505]/80 backdrop-blur-sm">
          <div>SYSTEM_ID: DC_ALPHA_009</div>
          <div>STATUS: BOOTING_KERNEL</div>
          <div>UPTIME: 00:00:03.412</div>
        </div>
        
        {/* System Resources (Top Right) */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 font-mono text-[10px] md:text-xs text-right text-gray-500 tracking-widest z-30">
          <div>MEM: 4096MB [ALLOCATED]</div>
          <div>CPU: 12 CORES [ACTIVE]</div>
          <div>NET: ENCRYPTED [TLS 1.3]</div>
        </div>
        
        {/* Center Container */}
        <div className="w-full max-w-2xl flex flex-col gap-8 md:gap-12 relative px-4">
          
          {/* Logo Section with Scanline */}
          <div className="relative overflow-hidden group">
            <div className="scanline-effect"></div>
            <h1 className="text-3xl md:text-6xl font-bold font-mono tracking-tighter text-foreground uppercase text-center relative z-20 leading-none">
              Deriverse<br/>
              <span className="text-[#00ffc4]">_Cockpit</span>
            </h1>
            {/* Glitch decorative elements */}
            <div className="absolute -left-4 top-1/2 w-2 h-8 bg-[#00ffc4]/20 hidden md:block"></div>
            <div className="absolute -right-4 top-1/4 w-2 h-4 bg-[#00ffc4]/20 hidden md:block"></div>
          </div>
          
          {/* Brutalist Progress Section */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-end font-mono text-sm uppercase text-[#00ffc4]/80 mb-1">
              <span>Loading Modules</span>
              <span className="text-[#00ffc4] font-bold">{Math.floor(progress)}%</span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="h-6 w-full border border-[#1A1A1A] bg-[#050505] relative p-0.5">
              {/* Filled Bar */}
              <div 
                className="h-full bg-[#00ffc4] relative overflow-hidden shadow-[0_0_15px_rgba(0,255,196,0.3)] transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              >
                {/* Stripes inside progress bar for texture */}
                <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)]"></div>
              </div>
            </div>
            
            <div className="flex justify-between font-mono text-[10px] text-gray-600 uppercase tracking-widest mt-1">
              <span>Est. Remaining: {(3 - (progress / 100) * 3).toFixed(1)}s</span>
              <span>Block: #249,102,944</span>
            </div>
          </div>
          
          {/* Terminal Logs */}
          <div className="w-full border border-[#1A1A1A] bg-[#0A0A0A]/50 backdrop-blur-sm p-4 font-mono text-xs md:text-sm h-48 overflow-hidden relative rounded-lg">
            {/* Header of terminal */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3 text-[10px] text-gray-500 uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[12px]"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
              <span>System Log Output</span>
            </div>
            
            {/* Logs List */}
            <div className="flex flex-col gap-1.5 text-gray-400">
               {logs.map((log, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-gray-600 min-w-15 text-[10px] md:text-xs">[{log.time}]</span>
                  <span className="uppercase">[{log.label}] {log.message}</span>
                  <span className={`${log.color} ml-auto font-bold`}>{log.status}</span>
                </div>
              ))}
              <div className="flex gap-3 mt-1 text-[#00ffc4]">
                <span className="text-[#00ffc4]/50 min-w-15">&gt;</span>
                <span className="cursor-blink">_</span>
              </div>
            </div>
            
            {/* Scrollbar Indicator */}
            <div className="absolute right-1 top-12 bottom-2 w-1 bg-white/5 rounded-full">
              <div 
                className="absolute top-0 w-full bg-[#00ffc4]/40 rounded-full transition-all duration-300"
                style={{ height: `${Math.max(10, progress)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-8 w-full text-center">
          <p className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.2em]">
            Secure Connection Established • V1.0.4 • © 2024 Deriverse
          </p>
        </div>
      </main>
      
      {/* Decorative Corner Elements */}
      <div className="fixed top-0 left-0 w-16 h-16 border-l border-t border-[#00ffc4]/30 rounded-tl-lg pointer-events-none z-30 m-4"></div>
      <div className="fixed top-0 right-0 w-16 h-16 border-r border-t border-[#00ffc4]/30 rounded-tr-lg pointer-events-none z-30 m-4"></div>
      <div className="fixed bottom-0 left-0 w-16 h-16 border-l border-b border-[#00ffc4]/30 rounded-bl-lg pointer-events-none z-30 m-4"></div>
      <div className="fixed bottom-0 right-0 w-16 h-16 border-r border-b border-[#00ffc4]/30 rounded-br-lg pointer-events-none z-30 m-4"></div>
      
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-40 mix-blend-overlay bg-noise"></div>
    </div>
  )
}

