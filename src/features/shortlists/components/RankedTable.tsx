"use client";

import { ChevronRight, ThumbsDown, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";
import { fetchApplicants, updateApplicantStatus } from "@/services/applicantsService";
import { useEffect, useState } from "react";

type ShortlistedCandidate = {
  name: string;
  role: string;
  slug: string;
  matchScore: number;
  rank: string;
  recommendation: string;
  shortlistStrengths: string[];
  shortlistGap: string;
};

type Decision = "Approved" | "Rejected";

export function RankedTable({ selectedJobId, onTopCandidatesChange }: { selectedJobId: string; onTopCandidatesChange?: (names: string[]) => void }) {
  const { accessToken } = useAuth();
  const [decisions, setDecisions] = useState<Record<string, Decision | undefined>>({});

  const handleDecision = async (slug: string, decision: Decision) => {
    if (!accessToken) return;
    const status = decision === "Approved" ? "shortlisted" : "rejected";
    try {
      await updateApplicantStatus(accessToken, slug, status);
      setDecisions(prev => ({ ...prev, [slug]: decision }));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  const [candidates, setCandidates] = useState<ShortlistedCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadShortlisted() {
      if (!selectedJobId || !accessToken) return;
      setIsLoading(true);
      try {
        const allApplicants = await fetchApplicants(accessToken, selectedJobId);
        const shortlisted = allApplicants
          .filter(app => app.workflowStatus === "shortlisted")
          .map((app, index) => ({
            name: app.name,
            role: app.role,
            slug: app.id,
            matchScore: app.score,
            rank: (index + 1).toString().padStart(2, "0"),
            recommendation: app.aiSummary || "Strong candidate for the role.",
            shortlistStrengths: app.tags.slice(0, 3),
            shortlistGap: "No significant gaps identified.",
          }));
        setCandidates(shortlisted);
        onTopCandidatesChange?.(shortlisted.slice(0, 3).map(c => c.name));
      } catch (error) {
        console.error("Failed to fetch shortlisted candidates:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadShortlisted();
  }, [selectedJobId, accessToken, onTopCandidatesChange]);

  if (isLoading) {
    return (
      <div className="soft-panel p-20 flex items-center justify-center">
        <p className="text-muted-foreground font-bold animate-pulse">Loading shortlist...</p>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="soft-panel p-20 flex flex-col items-center justify-center text-center">
        <p className="text-xl font-bold text-primary">No shortlisted candidates yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Candidates will appear here once they are moved to the shortlist.</p>
      </div>
    );
  }
  return (
    <div className="soft-panel overflow-hidden">
      <div className="hidden grid-cols-12 bg-secondary px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground md:grid">
        <div className="col-span-4">Candidate</div>
        <div className="col-span-2 text-center">Score</div>
        <div className="col-span-6 text-right pr-10">Reasoning and actions</div>
      </div>

      <div className="divide-y divide-border/50">
        {candidates.map((candidate) => {
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

                {!decision && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision(candidate.slug, "Approved")}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-primary/90 active:scale-95"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleDecision(candidate.slug, "Rejected")}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-2.5 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:bg-border active:scale-95"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
