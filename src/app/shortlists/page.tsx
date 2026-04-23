"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ShortlistStats } from "@/features/shortlists/components/ShortlistStats";
import { RankedTable } from "@/features/shortlists/components/RankedTable";
import { CuratorInsights } from "@/features/shortlists/components/CuratorInsights";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useJobs } from "@/context/JobContext";

export default function ShortlistPage() {
  const { jobs, isLoading } = useJobs();
  const [hidePrinciples, setHidePrinciples] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [topCandidates, setTopCandidates] = useState<string[]>([]);
  const handleTopCandidatesChange = useCallback((names: string[]) => setTopCandidates(names), []);

  // Auto-select first job once loaded
  if (!selectedJobId && jobs.length > 0) setSelectedJobId(jobs[0].id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-10 pb-24 animate-pulse">
        <div className="soft-panel h-48 bg-secondary rounded-3xl" />
        <div className="h-32 bg-secondary rounded-3xl" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 h-64 bg-secondary rounded-3xl" />
          <div className="lg:col-span-4 h-64 bg-secondary rounded-3xl" />
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-[1400px] space-y-10 pb-24">
      <div className="soft-panel grid gap-6 p-6 md:grid-cols-[1.4fr_0.9fr] md:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Ranked shortlist</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-primary">
            Show recruiters who rose to the top and why.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            The shortlist screen provides consistent ranking, clear strengths, and
            visible gaps, allowing recruiters to maintain final oversight of the AI&apos;s recommendations.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-white border border-border rounded-xl px-5 py-3 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary/10 min-w-[240px]"
            >
              <option value="" disabled>Select a job...</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            <Link href="/screening">
              <button className="btn-base btn-md bg-white border border-border text-primary font-black uppercase tracking-widest px-6 hover:bg-secondary transition-all shadow-sm">
                View Profiles Awaiting Decision
              </button>
            </Link>
          </div>
        </div>
        <AnimatePresence>
          {!hidePrinciples && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-3xl border border-border bg-secondary p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 rotate-12 text-primary" />
              </div>
              <p className="text-sm font-black text-primary uppercase tracking-widest">Review principles</p>
              <div className="mt-6 space-y-4 text-sm text-muted-foreground font-medium">
                <p className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  Every candidate shows strengths and risks together.
                </p>
                <p className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  Final recommendation remains advisory, not automatic.
                </p>
                <p className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  Shortlisted candidates can now be approved or rejected directly.
                </p>
              </div>
              <button 
                onClick={() => setHidePrinciples(true)}
                className="mt-8 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors underline underline-offset-4"
              >
                Never see this again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ShortlistStats selectedJobId={selectedJobId} />

      <div className="grid grid-cols-1 gap-10 items-start lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
           <RankedTable selectedJobId={selectedJobId} onTopCandidatesChange={handleTopCandidatesChange} />
        </div>

        <div className="lg:col-span-4">
           <CuratorInsights topCandidates={topCandidates} />
        </div>
      </div>
    </div>
  );
}
