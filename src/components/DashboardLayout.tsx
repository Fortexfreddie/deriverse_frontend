'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
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
    <div className="h-screen w-full flex overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Desktop Sidebar */}
      <div className="hidden sm:flex flex-shrink-0">
        <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-30 bg-background/80 sm:hidden backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="fixed top-0 left-0 h-screen z-40 sm:hidden bg-card border-r border-border overflow-y-auto w-64">
            <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <Header 
          title={title} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        {/* Page Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            {children}
        </div>
      </main>
    </div>
  )
}
