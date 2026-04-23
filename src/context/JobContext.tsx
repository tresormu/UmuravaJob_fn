"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchJobs, type JobRecord } from "@/services/jobsService";
import { useAuth } from "@/context/AuthContext";

interface JobContextType {
  jobs: JobRecord[];
  isLoading: boolean;
  error: string | null;
  refreshJobs: () => Promise<void>;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  selectedJob: JobRecord | null;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const refreshJobs = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // Fetch specifically for this recruiter
      const allJobs = await fetchJobs(user.id);
      setJobs(allJobs);
      
      // Default selection if none exists
      if (allJobs.length > 0 && !selectedJobId) {
        setSelectedJobId(allJobs[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, selectedJobId]);

  useEffect(() => {
    if (user?.id) {
      refreshJobs();
    } else {
      setJobs([]);
      setSelectedJobId(null);
    }
  }, [user?.id]); // Only refresh when user changes

  const selectedJob = jobs.find(j => j.id === selectedJobId) || null;

  return (
    <JobContext.Provider value={{ 
      jobs, 
      isLoading, 
      error, 
      refreshJobs, 
      selectedJobId, 
      setSelectedJobId,
      selectedJob 
    }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
}
