'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, History, BarChart2, BookOpen, Settings, Coins } from 'lucide-react'

interface SidebarProps {
  activeNav: string
  onNavChange: (nav: string) => void
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { id: 'history', icon: History, label: 'History', href: '/history' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', href: '/analytics' },
    { id: 'journal', icon: BookOpen, label: 'Journal', href: '/journal' },
    { id: 'settings', icon: Settings, label: 'Settings', href: '/settings' },
  ]

  return (
    <aside className="w-16 h-full border-r border-border flex flex-col items-center py-6 bg-card z-20 flex-shrink-0">
      {/* Logo */}
      <div className="mb-8 w-8 h-8 flex items-center justify-center bg-pnl-gain/10 rounded border border-pnl-gain/30 text-pnl-gain">
        <Coins size={20} />
      </div>

      {/* Main Nav */}
      <nav className="flex-1 flex flex-col gap-6 w-full items-center">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => onNavChange(item.id)}
            className={`group w-10 h-10 flex items-center justify-center rounded transition-colors relative ${
              activeNav === item.id
                ? 'bg-muted text-pnl-gain'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            // title={item.label}
          >
            <item.icon size={20} />
            {/* Tooltip */}
            <div className="absolute left-14 hidden group-hover:block bg-(--bg-secondary) border border-(--border-subtle) px-2 py-1 text-xs text-(--text-primary) whitespace-nowrap z-50">
              {item.label}
            </div>
            {activeNav === item.id && (
              <div className="absolute left-0 w-0.5 h-full bg-pnl-gain rounded-r"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="mt-auto flex flex-col gap-6 items-center w-full">
        {/* Settings moved to main nav */}
        <div className="w-8 h-8 rounded-full bg-pnl-gain/20 border border-pnl-gain/50 flex items-center justify-center text-xs font-mono text-pnl-gain font-bold">
          DV
        </div>
      </div>
    </aside>
  )
}

