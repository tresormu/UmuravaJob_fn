"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { JobForm } from "@/features/jobs/components/JobForm";
import { useAuth } from "@/context/AuthContext";
import {
  fetchJobById,
  jobFormValuesFromJob,
  type JobRecord,
  updateJob,
} from "@/services/jobsService";

export default function UpdateJobPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken } = useAuth();
  const jobId = params.slug as string;

  const [job, setJob] = useState<JobRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadJob = async () => {
      try {
        setError(null);
        const nextJob = await fetchJobById(jobId);
        if (isActive) {
          setJob(nextJob);
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn't load this job brief.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadJob();

    return () => {
      isActive = false;
    };
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto pb-20 space-y-6">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Jobs
        </Link>
        <div className="soft-panel p-10 text-center">
          <h2 className="text-2xl font-black text-primary">Loading job brief</h2>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            We&apos;re pulling the latest role details from the backend.
          </p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto pb-20 space-y-6">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Jobs
        </Link>
        <div className="soft-panel p-10 text-center">
          <h2 className="text-2xl font-black text-primary">Unable to load this role</h2>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {error ?? "The requested job brief could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <JobForm
        mode="edit"
        initialValues={jobFormValuesFromJob(job)}
        onSubmit={async (values) => {
          if (!accessToken) {
            throw new Error("Your session expired. Sign in again to update this job.");
          }

          await updateJob(accessToken, jobId, values);
          router.push("/jobs");
          return "Job brief updated successfully.";
        }}
      />
    </div>
  );
}
