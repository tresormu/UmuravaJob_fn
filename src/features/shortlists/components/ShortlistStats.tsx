"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchApplicants } from "@/services/applicantsService";

interface ShortlistStatsProps {
  selectedJobId: string;
}

export function ShortlistStats({ selectedJobId }: ShortlistStatsProps) {
  const { accessToken } = useAuth();
  const [total, setTotal] = useState(0);
  const [shortlisted, setShortlisted] = useState(0);
  const [pending, setPending] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!selectedJobId || !accessToken) return;
      setIsLoading(true);
      try {
        const applicants = await fetchApplicants(accessToken, selectedJobId);
        const shortlistedList = applicants.filter(a => a.workflowStatus === "shortlisted");
        const pendingList = applicants.filter(
          a => a.workflowStatus === "applied" || a.workflowStatus === "screened"
        );
        setTotal(applicants.length);
        setShortlisted(shortlistedList.length);
        setPending(pendingList.length);
      } catch (error) {
        console.error("Failed to load shortlist stats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [selectedJobId, accessToken]);

  const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="soft-panel relative flex h-48 flex-col justify-between overflow-hidden p-8">
        <div className="relative z-10">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Shortlist coverage
          </p>
          <div className="flex items-end gap-3">
            <h3 className="text-5xl font-black text-primary">
              {isLoading ? "—" : shortlisted}
              <span className="text-2xl font-bold opacity-40">/{isLoading ? "—" : total}</span>
            </h3>
            <span className="mb-2 rounded-full border border-primary/20 bg-secondary px-3 py-1 text-[10px] font-bold uppercase text-primary">
              Ready
            </span>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3 border-t border-border/50 pt-4">
          <ShieldCheck className="h-5 w-5 text-primary opacity-40" />
          <p className="text-[10px] font-bold leading-tight text-muted-foreground">
            Each candidate includes reasons, gaps, and recommendation notes.
          </p>
        </div>
      </div>

      <div className="soft-panel relative flex h-48 flex-col justify-between overflow-hidden p-8">
        <div className="relative z-10 text-primary flex items-center gap-3">
          <Zap className="h-5 w-5 text-accent" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Strategic Analysis
          </p>
        </div>
        <p className="relative z-10 text-xs font-medium leading-relaxed text-primary/70">
          Scoring logic factors in technical depth, platform architecture, and cross-border delivery experience.
        </p>
        <div className="relative z-10 flex items-center justify-between border-t border-border/50 pt-4">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Active Weights</span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">v1.2.4</span>
        </div>
      </div>

      <div className="flex h-48 flex-col justify-between overflow-hidden rounded-none bg-primary p-8 text-white shadow-lg shadow-primary/20">
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] uppercase font-bold text-white/50 tracking-[0.2em]">Human review gate</p>
            <BarChart3 className="h-5 w-5 text-white opacity-40" />
          </div>
          <h3 className="text-3xl font-bold tracking-tight">Required</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/60">
            <span>Profiles awaiting recruiter decision</span>
            <span>{isLoading ? "—" : pending.toString().padStart(2, "0")}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${pendingPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
