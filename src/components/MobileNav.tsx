'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, History, BarChart2, BookOpen, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'DASH', href: '/' },
    { id: 'history', icon: History, label: 'HIST', href: '/history' },
    { id: 'analytics', icon: BarChart2, label: 'ANLY', href: '/analytics' },
    { id: 'journal', icon: BookOpen, label: 'JRNL', href: '/journal' },
    { id: 'settings', icon: Settings, label: 'SETT', href: '/settings' }, 
  ]

  const isActive = (href: string) => {
      if (href === '#' || href === '') return false
      if (href === '/' && pathname === '/') return true
      if (href !== '/' && pathname.startsWith(href)) return true
      return false
  }

  return (
    <nav className="h-16 flex items-center justify-around w-full bg-card border-t border-border pb-safe z-40">
      {navItems.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 w-12 group transition-colors relative ${
              active
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground active:text-primary'
            }`}
          >
            {active && (
              <div className="absolute -top-[17px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary shadow-[0_0_10px_rgba(0,255,194,0.5)]"></div>
            )}
            <item.icon size={20} className="group-active:scale-95 transition-transform" />
            <span className={`text-[8px] uppercase tracking-wide ${active ? 'font-bold' : ''}`}>{item.label}</span>
          </Link>
        )
      })}
     </nav>
  )
}
