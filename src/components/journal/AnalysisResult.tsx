'use client'

import { Brain, Activity, ArrowRight, X } from 'lucide-react'
import type { JournalAnalysis } from '@/lib/api'

interface AnalysisResultProps {
    analysis: JournalAnalysis
    onClose: () => void
}

export function AnalysisResult({ analysis, onClose }: AnalysisResultProps) {
    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="h-14 md:h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-muted/5 shrink-0">
                <span className="text-[10px] uppercase text-primary tracking-[0.2em] font-black italic flex items-center gap-2">
                    <Activity size={14} /> COACH_INTEL // ANALYSIS_COMPLETE
                </span>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                    <X size={16} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">

                    {/* AI Analysis Card */}
                    <div className="bg-black border border-primary/30 p-5 md:p-8 rounded-sm shadow-[inset_0_0_30px_rgba(var(--primary),0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Brain size={60} className="text-primary" />
                        </div>

                        <div className="flex justify-between items-center mb-6 border-b border-primary/20 pb-3">
                            <span className="text-xs text-primary font-black tracking-[0.2em]">AI_SCORE</span>
                            <span className="bg-primary text-black px-3 py-1 text-sm font-black ring-4 ring-primary/20">
                                {analysis.aiAnalysis.score}/10
                            </span>
                        </div>

                        <div className="space-y-6 font-mono">
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase mb-2 tracking-[0.2em] font-black">Bias Detected</div>
                                <div className="text-lg md:text-xl text-foreground font-black underline decoration-primary decoration-2 underline-offset-8">
                                    {analysis.aiAnalysis.bias}
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase mb-2 tracking-[0.2em] font-black">Insight</div>
                                <div className="text-xs text-muted-foreground italic leading-relaxed bg-muted/5 p-4 md:p-6 rounded-sm border-l-2 border-primary/50">
                                    &ldquo;{analysis.aiAnalysis.insight}&rdquo;
                                </div>
                            </div>

                            <div className="bg-primary/10 p-4 md:p-6 border border-primary/40 rounded-sm shadow-lg">
                                <div className="text-[10px] text-primary font-black uppercase mb-2 tracking-[0.2em]">Next Action</div>
                                <div className="text-sm text-foreground font-black flex items-center gap-3">
                                    <ArrowRight size={18} className="text-primary shrink-0" />
                                    {analysis.aiAnalysis.next_action}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trader Profile Card */}
                    <div className="bg-card border border-border p-5 md:p-8 rounded-sm space-y-5 md:space-y-6 relative overflow-hidden">
                        <div className="flex items-center gap-4 md:gap-5">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-primary/30 flex items-center justify-center bg-muted/5 shadow-inner">
                                <Brain size={28} className="text-primary" />
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Trader Archetype</div>
                                <div className="text-lg md:text-2xl font-black text-foreground tracking-tighter">
                                    {analysis.traderProfile.profile}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <div className="text-[9px] text-muted-foreground uppercase font-bold">Win Rate</div>
                                <div className="text-xl md:text-2xl font-black">{analysis.traderProfile.winRate}%</div>
                            </div>
                            <div>
                                <div className="text-[9px] text-muted-foreground uppercase font-bold">Strength</div>
                                <div className="text-[11px] font-bold text-primary">{analysis.traderProfile.strength}</div>
                            </div>
                        </div>

                        <div className="border border-dashed border-primary/30 p-4 md:p-6 bg-card/30 relative">
                            <div className="absolute -top-3 left-4 bg-background px-2 text-[9px] text-primary font-black border border-primary/30">
                                PSYCHE_NUDGE
                            </div>
                            <p className="text-sm text-foreground italic leading-relaxed text-center py-2">
                                &ldquo;{analysis.traderProfile.nudge}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Macro Context Card */}
                    <div className="bg-card border border-border p-5 md:p-6 rounded-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black flex items-center gap-2">
                                <Activity size={12} /> Market Context
                            </span>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 font-bold">{analysis.macroContext.sentiment}</span>
                        </div>
                        <p className="text-xs italic text-muted-foreground leading-relaxed">
                            &ldquo;{analysis.macroContext.macroContext}&rdquo;
                        </p>
                        {analysis.macroContext.headlines && analysis.macroContext.headlines.length > 0 && (
                            <div className="pt-2 space-y-2">
                                <div className="text-[9px] text-muted-foreground uppercase font-black">Headlines</div>
                                {analysis.macroContext.headlines.slice(0, 3).map((h, i) => (
                                    <div key={i} className="text-[10px] py-1 border-b border-border/50 last:border-0 truncate opacity-80">{h}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* What-If Card */}
                    {analysis.whatIfAnalysis && (
                        <div className="bg-card border border-border p-5 md:p-6 rounded-sm space-y-3">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">What-If Analysis</div>
                            <div className="text-2xl font-black font-mono text-pink">
                                ${analysis.whatIfAnalysis.opportunityCost.toFixed(2)}
                                <span className="text-xs text-muted-foreground ml-2 font-normal">opportunity cost</span>
                            </div>
                            <p className="text-xs text-muted-foreground italic">{analysis.whatIfAnalysis.opportunityCostNote}</p>
                        </div>
                    )}

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="w-full bg-muted/20 border border-border text-foreground font-bold text-xs py-4 rounded-sm hover:bg-muted/30 transition-colors"
                    >
                        CLOSE_ANALYSIS
                    </button>
                </div>
            </div>
        </div>
    )
}
