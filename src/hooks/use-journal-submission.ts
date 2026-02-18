import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitJournal, JournalEntryUpdate } from '@/lib/api'
import { journalSchema } from '@/lib/schemas' 
import { toast } from 'sonner' 
import { mockAnalysisResult } from '@/lib/mock-data'

export function useJournalSubmission(positionId: string, isDemo?: boolean) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: any) => {
            // Client-side validation
            const result = journalSchema.safeParse(data)
            if (!result.success) {
                throw new Error(result.error.issues[0].message)
            }
            
            if (isDemo) {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 800))
                return {
                    data: { ...data, id: positionId, aiScore: 8, aiBias: 'Recency Bias' },
                    analysis: mockAnalysisResult
                }
            }

            return submitJournal(positionId, data as JournalEntryUpdate)
        },
        onSuccess: (response) => {
             toast.success('TRADE_ANALYSIS_GENERATED')
             // Invalidate journal queries if not in demo
             if (!isDemo) {
                queryClient.invalidateQueries({ queryKey: ['journal', positionId] })
             }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to save journal entry')
        }
    })
}
