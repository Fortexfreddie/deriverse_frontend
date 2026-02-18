import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parsePositionId(positionId: string) {
    if (!positionId) return { market: 'UNKNOWN', side: 'FLAT' };
    const parts = positionId.split('-');
    if (parts.length >= 3) {
        return {
            market: parts.slice(2, 4).join('-').replace('PERP', 'PERP'),
            side: parts[1].includes('BUY') ? 'LONG' : parts[1].includes('SELL') ? 'SHORT' : 'FLAT'
        };
    }
    return { market: 'UNKNOWN', side: 'FLAT' };
}

export function formatDate(dateString: string) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().replace('T', ' ').substring(0, 19);
}
