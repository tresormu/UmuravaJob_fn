"use client";

import { JobPostingRow } from "@/features/dashboard/components/JobPostingRow";
import { InsightCard } from "@/features/dashboard/components/InsightCard";
import { Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { JobSelectionModal } from "@/components/common/JobSelectionModal";
import { useAuth } from "@/context/AuthContext";
import {
  deleteJob,
  fetchJobs,
  filterJobsForRecruiter,
  type JobRecord,
} from "@/services/jobsService";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, user } = useAuth();

  useEffect(() => {
    let isActive = true;

    const loadJobs = async () => {
      try {
        setError(null);
        const allJobs = await fetchJobs();
        if (isActive) {
          setJobs(filterJobsForRecruiter(allJobs, user?.id));
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn't load your active roles.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadJobs();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  const activeJobs = useMemo(
    () => jobs.slice(0, 3),
    [jobs],
  );

  const modalJobs = useMemo(
    () => jobs.map((job) => ({ id: job.id, title: job.title, department: job.department })),
    [jobs],
  );

  const handleDeleteJob = async (jobId: string) => {
    if (!accessToken) {
      setError("Your session expired. Sign in again to manage jobs.");
      return;
    }

    try {
      await deleteJob(accessToken, jobId);
      setJobs((current) => current.filter((job) => job.id !== jobId));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "We couldn't delete this job right now.",
      );
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      <div className="grid gap-8 lg:grid-cols-1">
        <motion.section variants={item} className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary rounded-3xl shadow-2xl shadow-primary/20 transition-all duration-500 group-hover:scale-[1.01]">
            <div className="absolute top-0 right-0 p-20 opacity-10">
              <Sparkles className="w-64 h-64 rotate-12 text-white" />
            </div>
          </div>

          <div className="relative p-8 md:p-16 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Talent Intelligence Hub</span>
            </div>

            <div className="max-w-2xl space-y-6">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.1] text-balance">
                High-precision screening, <span className="text-accent underline decoration-accent/30 underline-offset-8">human-led</span> decisions.
              </h1>
              <p className="text-lg leading-relaxed text-white/70 font-medium max-w-xl">
                Maximize your recruitment throughput with AI-assisted ranking that respects your
                judgment. We normalize mixed candidate data into actionable, explainable insights.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <Link href="/jobs/create" className="btn-accent btn-lg gap-3">
                Publish new brief
                <Zap className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-base bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-2xl text-base font-bold transition-all"
              >
                Review pipelines
              </button>
            </div>
          </div>
        </motion.section>
      </div>

      <JobSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobs={modalJobs}
      />

      <motion.div variants={item} className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-primary tracking-tight">Active jobs you posted</h3>
            <p className="text-sm text-muted-foreground font-medium">
              Real-time tracking of candidate progression across your active roles.
            </p>
          </div>
          <Link href="/jobs" className="text-xs font-black uppercase tracking-[0.2em] text-accent hover:underline decoration-accent/30 underline-offset-8">
            Manage all roles
          </Link>
        </div>

        {error && (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="soft-panel p-10 text-center">
            <h4 className="text-xl font-black text-primary">Loading active roles</h4>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Pulling your live jobs from the backend.
            </p>
          </div>
        ) : activeJobs.length > 0 ? (
          <div className="grid gap-4">
            {activeJobs.map((job) => (
              <JobPostingRow key={job.id} {...job} onDelete={handleDeleteJob} />
            ))}
          </div>
        ) : (
          <div className="soft-panel p-10 text-center">
            <h4 className="text-xl font-black text-primary">No jobs yet</h4>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Publish your first brief to start building a real screening pipeline.
            </p>
          </div>
        )}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-8 lg:grid-cols-1">
        <div className="lg:col-span-1">
          <InsightCard />
        </div>
      </motion.div>
    </motion.div>
  );
}
