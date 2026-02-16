'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { MobileNav } from '@/components/MobileNav'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Derive activeNav from pathname
  const getActiveNav = (path: string) => {
    if (!path) return 'dashboard'
    if (path === '/') return 'dashboard'
    if (path.startsWith('/history')) return 'history'
    if (path.startsWith('/analytics')) return 'analytics'
    if (path.startsWith('/journal')) return 'journal'
    return 'dashboard'
  }

  const activeNav = getActiveNav(pathname)

  const handleNavChange = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-background text-foreground transition-colors duration-300 font-mono">
      {/* Scanline Effect - visible on all screens as per design, maybe tune opacity for desktop */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="scanline-effect"></div>
      </div>

      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
      </div>

      {/* Mobile Sidebar Overlay - Only if we still want sidebar on mobile? 
          Design suggests Bottom Nav replaces it. Let's keep Sidebar hidden on mobile for now unless requested.
      */}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden h-full">
        {/* Desktop Headern - hidden on mobile (mobile header is part of page content or we make Header adaptive) */}
        <div className="hidden md:block">
            <Header 
            title={title} 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            />
        </div>
        
        {/* Mobile Header - Rendered here or in page? 
            Better in page to customize title per view? 
            Actually, the design shows a specific header. Let's make Header adaptive.
            I will update Header component next to handle mobile view.
        */}
        <div className="md:hidden">
            <Header 
            title={title} 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            />
        </div>


        {/* Page Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            {children}
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden border-t border-border bg-card">
            <MobileNav />
        </div>
      </main>
    </div>
  )
}
