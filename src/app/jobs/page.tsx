"use client";

import { useMemo, useState } from "react";
import { JobPostingRow } from "@/features/dashboard/components/JobPostingRow";
import { Plus, Search, Filter, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useJobs } from "@/context/JobContext";
import { deleteJob } from "@/services/jobsService";

export default function JobsPage() {
  const { accessToken } = useAuth();
  const { jobs, isLoading, error: jobsError, refreshJobs } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const displayError = error ?? jobsError;

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) =>
        [job.title, job.department, job.location]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    [jobs, searchQuery],
  );

  const handleDeleteJob = async (jobId: string) => {
    if (!accessToken) {
      setError("Your session expired. Sign in again to delete a job.");
      return;
    }
    try {
      await deleteJob(accessToken, jobId);
      await refreshJobs();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "We couldn't delete this job.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-10">
      <section className="relative overflow-hidden p-1 bg-primary rounded-[3rem] shadow-2xl shadow-primary/10">
        <div className="bg-white rounded-[2.8rem] p-8 md:p-12 grid gap-10 md:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent">Intelligent Sourcing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter leading-[1.1]">Build roles recruiters <span className="text-accent underline decoration-accent/20 underline-offset-8">trust.</span></h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-xl">
              Capture the exact signals needed for high-fidelity AI screening. Define your scoring
              blueprint early to ensure explainable shortlists.
            </p>
          </div>
          <div className="bg-secondary/50 rounded-[2.5rem] p-8 border border-border/50 self-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-6">Saved from backend</h4>
            <div className="space-y-4">
              {[
                { label: "Live roles", val: jobs.length, suffix: "" },
                { label: "Filtered roles", val: filteredJobs.length, suffix: "" },
                { label: "Screening ready", val: jobs.filter((job) => job.skills.length > 0).length, suffix: "" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                    {item.label}
                  </span>
                  <span className="text-sm font-black text-accent">
                    {item.val}
                    {item.suffix}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-3xl font-black text-primary tracking-tight">Active Job Board</h3>
          <p className="text-muted-foreground font-medium mt-1">
            Managing{" "}
            <span className="text-primary font-black underline decoration-accent/30 underline-offset-4">
              {filteredJobs.length}
            </span>{" "}
            positions with live backend data.
          </p>
        </div>
        <Link href="/jobs/create" className="btn-primary btn-lg gap-3">
          <Plus className="h-5 w-5" />
          Create new brief
        </Link>
      </div>

      {displayError && (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {displayError}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter roles, departments, or locations..."
            className="w-full rounded-[1.5rem] border border-border/50 bg-white py-4 pl-14 pr-12 text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-primary/5 focus:border-primary/20 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-secondary rounded-xl transition-all"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <button className="flex items-center gap-2 rounded-[1.5rem] border border-border/50 bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-primary transition-all hover:bg-secondary shadow-sm">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-secondary rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <JobPostingRow {...job} onDelete={handleDeleteJob} />
              </motion.div>
            ))}
          </AnimatePresence>

          {!isLoading && filteredJobs.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-xl font-black text-primary">
                {jobs.length === 0 ? "No jobs created yet" : "No positions found"}
              </h4>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {jobs.length === 0
                  ? "Create your first role brief to start the recruiter pipeline."
                  : `We couldn&apos;t find any job briefs matching "${searchQuery}". Try a different keyword.`}
              </p>
              {jobs.length === 0 ? (
                <Link href="/jobs/create" className="btn-primary btn-md inline-flex mt-4">
                  Create first job
                </Link>
              ) : (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-accent font-black text-xs uppercase tracking-widest hover:underline pt-4"
                >
                  Clear search filter
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
