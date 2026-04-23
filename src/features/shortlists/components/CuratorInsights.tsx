"use client";

import { Target, FileText, Activity, TrendingUp } from "lucide-react";

interface CuratorInsightsProps {
  topCandidates?: string[];
}

export function CuratorInsights({ topCandidates = [] }: CuratorInsightsProps) {
  const patternNote =
    topCandidates.length >= 2
      ? `${topCandidates[0]} and ${topCandidates[1]} both score highly. Review their profiles side-by-side to identify the best fit for scope and team needs.`
      : topCandidates.length === 1
      ? `${topCandidates[0]} is the top-ranked candidate. Review their profile against the role requirements before making a final decision.`
      : "Shortlist candidates to see pattern insights here.";

  return (
    <div className="soft-panel sticky top-24 overflow-hidden">
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-sm">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary leading-tight">Review guidance</h3>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-0.5 opacity-60">
              Explainability notes
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/50 p-6 rounded-3xl border border-border space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h5 className="font-extrabold text-[12px] text-primary">Pattern to note</h5>
            </div>
            <p className="text-xs text-primary font-medium leading-relaxed">{patternNote}</p>
          </div>

          <div className="bg-secondary/30 p-6 rounded-3xl border border-border italic text-primary/70 text-xs leading-relaxed relative">
            <Activity className="absolute -top-1 -right-1 w-4 h-4 text-primary opacity-20" />
            &ldquo;Domain relevance can justify a slightly lower raw score when the candidate solves a
            core business need better than others.&rdquo;
          </div>

          <div className="rounded-3xl border border-border bg-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Human guardrail</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Recruiters should always validate shortlist outputs against interview goals, culture
              needs, and role-specific trade-offs before taking action.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/30 p-5">
            <FileText className="w-4 h-4 text-primary opacity-40 shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Run AI screening on the Screening page to generate ranked summaries for each candidate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
