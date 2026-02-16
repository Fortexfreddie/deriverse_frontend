import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TechPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export function TechPagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled
}: TechPaginationProps) {
  // Generate page numbers
  const pages = []
  if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
      if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
          pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
  }

  return (
    <div className="flex items-center gap-2 font-mono-data text-xs select-none">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || disabled}
        className="group relative px-3 py-1.5 border border-(--border-subtle) hover:border-(--gain-mint) disabled:opacity-30 disabled:hover:border-(--border-subtle) transition-colors"
      >
        <span className="sr-only">Previous</span>
        <ChevronLeft size={14} className="group-hover:text-(--gain-mint) transition-colors" />
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-(--gain-mint) opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-(--gain-mint) opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 mx-2">
        {pages.map((page, i) => (
            typeof page === 'number' ? (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={disabled}
                    className={cn(
                        "w-8 h-8 flex items-center justify-center border transition-all duration-200",
                        currentPage === page 
                            ? "border-(--gain-mint) bg-(--gain-mint)/10 text-(--gain-mint) shadow-[0_0_10px_rgba(0,196,159,0.2)]"
                            : "border-transparent hover:border-(--border-subtle) text-(--text-secondary)"
                    )}
                >
                    {String(page).padStart(2, '0')}
                </button>
            ) : (
                <span key={`ellipsis-${i}`} className="text-(--text-tertiary)">..</span>
            )
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || disabled}
        className="group relative px-3 py-1.5 border border-(--border-subtle) hover:border-(--gain-mint) disabled:opacity-30 disabled:hover:border-(--border-subtle) transition-colors"
      >
        <span className="sr-only">Next</span>
        <ChevronRight size={14} className="group-hover:text-(--gain-mint) transition-colors" />

        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-(--gain-mint) opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-(--gain-mint) opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Status Text (e.g., PAGE 01/05) */}
      <div className="hidden sm:block ml-4 text-[10px] text-(--text-tertiary) label-uppercase border-l border-(--border-subtle) pl-4">
        PAGE <span className="text-(--text-primary)">{String(currentPage).padStart(2, '0')}</span> / {String(totalPages).padStart(2, '0')}
      </div>
    </div>
  )
}
