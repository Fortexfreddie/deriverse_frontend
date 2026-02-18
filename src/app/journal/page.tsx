'use client'

import { useState, useCallback } from 'react'
import { format } from 'date-fns'
import { DashboardLayout } from '@/components/DashboardLayout'
import { PageLoader } from '@/components/PageLoader'
import { useJournalData } from '@/hooks/use-journal-data'
import { JournalHeatmap, type HeatmapTrade } from '@/components/journal/JournalHeatmap'
import { TradeListDialog } from '@/components/journal/TradeListDialog'
import { MobileTradeFlow } from '@/components/journal/MobileTradeFlow'

export default function JournalPage() {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 1))
    const { data: journalData, isLoading: isDataLoading, isDemo } = useJournalData(currentMonth)

    // Desktop dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedTrades, setSelectedTrades] = useState<HeatmapTrade[]>([])

    // Mobile flow state (null = showing heatmap)
    const [mobileDate, setMobileDate] = useState<Date | null>(null)
    const [mobileTrades, setMobileTrades] = useState<HeatmapTrade[]>([])

    // Desktop-only day click
    const handleDesktopDayClick = useCallback((date: Date, trades: HeatmapTrade[]) => {
        setSelectedDate(date)
        setSelectedTrades(trades)
        setIsDialogOpen(true)
    }, [])

    // Mobile-only day click
    const handleMobileDayClick = useCallback((date: Date, trades: HeatmapTrade[]) => {
        setMobileDate(date)
        setMobileTrades(trades)
    }, [])

    // Mobile: navigate to adjacent day
    const handleMobileDateChange = useCallback((date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        const dayData = (journalData || {})[dateStr] || []
        setMobileDate(date)
        setMobileTrades(dayData as HeatmapTrade[])
    }, [journalData])

    if (isDataLoading) {
        return <PageLoader />
    }

    return (
        <DashboardLayout title="JOURNAL // ANALYSIS">
            {/* ── Desktop (md+) ─────────────────────────────────────────── */}
            <div className="hidden md:flex flex-1 flex-col h-full overflow-hidden">
                <JournalHeatmap
                    journalData={journalData || {}}
                    currentMonth={currentMonth}
                    onMonthChange={setCurrentMonth}
                    onDayClick={handleDesktopDayClick}
                />
                <TradeListDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    selectedDate={selectedDate}
                    trades={selectedTrades}
                    isDemo={isDemo}
                />
            </div>

            {/* ── Mobile (<md) ───────────────────────────────────────────── */}
            <div className="flex flex-col md:hidden h-full overflow-hidden relative">
                {mobileDate && mobileTrades.length > 0 ? (
                    <MobileTradeFlow
                        date={mobileDate}
                        trades={mobileTrades}
                        isDemo={isDemo}
                        onBack={() => {
                            setMobileDate(null)
                            setMobileTrades([])
                        }}
                        onDateChange={handleMobileDateChange}
                    />
                ) : (
                    <JournalHeatmap
                        journalData={journalData || {}}
                        currentMonth={currentMonth}
                        onMonthChange={setCurrentMonth}
                        onDayClick={handleMobileDayClick}
                    />
                )}
            </div>
        </DashboardLayout>
    )
}