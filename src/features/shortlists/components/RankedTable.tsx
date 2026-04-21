"use client";

import { useState } from "react";
import { ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { shortlistCandidates } from "@/features/applicants/data/candidates";
import { cn } from "@/utils/cn";

type Decision = "Approved" | "Rejected";

export function RankedTable() {
  const [decisions, setDecisions] = useState<Record<string, Decision | undefined>>({});

  return (
    <div className="soft-panel overflow-hidden">
      <div className="hidden grid-cols-12 bg-secondary px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground md:grid">
        <div className="col-span-4">Candidate</div>
        <div className="col-span-2 text-center">Score</div>
        <div className="col-span-6 text-right pr-10">Reasoning and actions</div>
      </div>

      <div className="divide-y divide-border/50">
        {shortlistCandidates.map((candidate) => {
          const decision = decisions[candidate.slug];

          return (
            <div
              key={candidate.slug}
              className="group flex flex-col gap-6 px-6 py-6 transition-colors hover:bg-secondary md:grid md:grid-cols-12 md:items-center md:gap-0 md:px-10 md:py-8"
            >
              <div className="col-span-4 flex items-center gap-6 md:gap-8">
                <span className="flex-shrink-0 text-2xl font-black text-primary/10 transition-colors group-hover:text-primary/20 md:text-3xl">
                  {candidate.rank}
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-white shadow-sm transition-all group-hover:bg-primary group-hover:text-white md:h-14 md:w-14 md:rounded-2xl">
                    <User className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold leading-none tracking-tight text-primary md:text-xl">
                      {candidate.name}
                    </h4>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground md:text-xs">
                      {candidate.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex flex-row items-center gap-4 border-y border-border/50 py-4 md:flex-col md:gap-2 md:border-none md:py-0">
                <div className="block flex-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground md:hidden">
                  Score
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-primary md:text-3xl">
                    {candidate.matchScore}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground opacity-40">%</span>
                </div>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary md:w-24">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${candidate.matchScore}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em]",
                    decision === "Approved" && "bg-emerald-50 text-emerald-700",
                    decision === "Rejected" && "bg-red-50 text-red-600",
                    !decision && "bg-primary/10 text-primary/70",
                  )}
                >
                  {decision ?? "Shortlisted"}
                </span>
              </div>

              <div className="col-span-6 flex flex-col items-stretch justify-end gap-4 md:gap-5">
                <div className="space-y-3 text-sm">
                  <p className="font-semibold leading-6 text-primary/80">{candidate.recommendation}</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.shortlistStrengths.map((tag) => (
                      <span
                        key={tag}
                        className="whitespace-nowrap rounded-lg border border-border bg-white px-3 py-1.5 text-[10px] font-bold tracking-tight text-primary/70 shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-primary">Gap:</span> {candidate.shortlistGap}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
