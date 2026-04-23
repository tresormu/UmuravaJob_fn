"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadCard } from "@/features/applicants/components/UploadCard";
import { CandidateRow } from "@/features/applicants/components/CandidateRow";
import {
  Plus,
  Search,
  Briefcase,
  FileBox,
  Trash2,
  ArrowLeft,
  ChevronRight,
  SlidersHorizontal,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { BaseModal } from "@/components/common/BaseModal";
import { useAuth } from "@/context/AuthContext";
import {
  deleteApplicant,
  fetchApplicants,
  updateApplicantStatus,
  uploadApplicantPdfs,
  type ApplicantRecord,
} from "@/services/applicantsService";
import {
  fetchJobs,
  filterJobsForRecruiter,
  type JobRecord,
} from "@/services/jobsService";

export default function ApplicantsPage() {
  const router = useRouter();
  const { accessToken, user } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeleteSingleModalOpen, setIsDeleteSingleModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [applicantToDelete, setApplicantToDelete] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      if (!accessToken) {
        if (isActive) {
          setError("Your session expired. Sign in again to load applicants.");
          setIsLoading(false);
        }
        return;
      }

      try {
        setError(null);
        const [allJobs, allApplicants] = await Promise.all([
          fetchJobs(),
          fetchApplicants(accessToken),
        ]);

        if (!isActive) return;

        setJobs(filterJobsForRecruiter(allJobs, user?.id));
        setApplicants(allApplicants);
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn't load the applicant pipeline.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isActive = false;
    };
  }, [accessToken, user?.id]);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId],
  );

  const applicantCountsByJob = useMemo(() => {
    return applicants.reduce<Record<string, number>>((acc, applicant) => {
      if (!applicant.jobId) return acc;
      acc[applicant.jobId] = (acc[applicant.jobId] ?? 0) + 1;
      return acc;
    }, {});
  }, [applicants]);

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [jobs, searchQuery],
  );

  const currentApplicants = useMemo(() => {
    if (!selectedJobId) return [];

    let list = applicants.filter((applicant) => applicant.jobId === selectedJobId);

    if (searchQuery) {
      list = list.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.role.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "score") {
        return b.score - a.score;
      }
      return a.name.localeCompare(b.name);
    });
  }, [applicants, searchQuery, selectedJobId, sortBy]);

  const handleToggleShortlist = async (id: string) => {
    if (!accessToken) {
      setError("Your session expired. Sign in again to update applicant status.");
      return;
    }

    const existingApplicant = applicants.find((applicant) => applicant.id === id);
    if (!existingApplicant) return;

    const nextStatus = existingApplicant.isShortlisted ? "applied" : "shortlisted";

    try {
      const updatedApplicant = await updateApplicantStatus(accessToken, id, nextStatus);
      setApplicants((current) =>
        current.map((applicant) =>
          applicant.id === id ? updatedApplicant : applicant,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "We couldn't update this applicant right now.",
      );
    }
  };

  const handleDeleteApplicant = (id: string) => {
    setApplicantToDelete(id);
    setIsDeleteSingleModalOpen(true);
  };

  const confirmDeleteApplicant = async () => {
    if (!accessToken || !applicantToDelete) {
      setApplicantToDelete(null);
      return;
    }

    try {
      await deleteApplicant(accessToken, applicantToDelete);
      setApplicants((current) =>
        current.filter((applicant) => applicant.id !== applicantToDelete),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "We couldn't delete this applicant right now.",
      );
    } finally {
      setApplicantToDelete(null);
    }
  };

  const confirmDeleteAll = async () => {
    if (!accessToken || !selectedJobId) return;

    const applicantsForJob = applicants.filter((applicant) => applicant.jobId === selectedJobId);

    try {
      await Promise.all(
        applicantsForJob.map((applicant) => deleteApplicant(accessToken, applicant.id)),
      );
      setApplicants((current) =>
        current.filter((applicant) => applicant.jobId !== selectedJobId),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "We couldn't clear this pipeline right now.",
      );
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    if (!accessToken || !selectedJobId) {
      setError("Please select a job brief first.");
      return;
    }

    setIsUploading(true);
    setUploadFeedback(`Analyzing ${files.length} resume(s)...`);

    try {
      const newApplicants = await uploadApplicantPdfs(accessToken, selectedJobId, files);

      // Refresh the entire list for consistency
      const allApplicants = await fetchApplicants(accessToken);
      setApplicants(allApplicants);

      setUploadFeedback(`Successfully imported ${newApplicants.length} applicant(s).`);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setUploadFeedback(null);
      }, 2000);
    } catch (uploadError) {
      setUploadFeedback(
        uploadError instanceof Error ? uploadError.message : "Failed to process resumes."
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (!selectedJobId) {
    return (
      <div className="mx-auto max-w-6xl space-y-10 pb-20">
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Intake Pipeline</p>
          <h2 className="text-4xl font-black text-primary tracking-tight">Which role are you managing?</h2>
          <p className="text-muted-foreground text-sm max-w-xl">
            Select a real job brief from the backend to review its applicant pipeline.
          </p>
        </div>

        {error && (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search active job briefs..."
            className="w-full bg-white border border-border/50 rounded-3xl py-5 pl-14 pr-6 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="soft-panel p-12 text-center">
            <h3 className="text-2xl font-black text-primary">Loading roles</h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Pulling your active jobs and applicant counts from the backend.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job, idx) => (
              <motion.button
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  setSelectedJobId(job.id);
                  setSearchQuery("");
                }}
                className="bg-white border border-border/50 p-6 rounded-[2rem] hover:border-primary/20 hover:shadow-xl hover:shadow-black/5 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-lg">{job.title}</h4>
                    <p className="text-xs text-muted-foreground font-medium">
                      {job.department} • {applicantCountsByJob[job.id] ?? 0} applicants
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mr-2" />
              </motion.button>
            ))}

            <Link
              href="/jobs/create"
              className="border-2 border-dashed border-border/50 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/20 hover:bg-secondary/30 transition-all group min-h-[100px]"
            >
              <div className="p-2 bg-secondary rounded-full text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">
                Create new brief first
              </span>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
        <div className="space-y-4">
          <button
            onClick={() => setSelectedJobId(null)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to roles
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Active Job</div>
              <span className="text-muted-foreground text-xs font-medium">{selectedJob?.department}</span>
            </div>
            <h2 className="text-4xl font-black text-primary tracking-tight">{selectedJob?.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentApplicants.length > 0 && (
            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </button>
          )}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Import Talent
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className={cn(
        "grid grid-cols-1 gap-8",
        currentApplicants.length > 0 ? "lg:grid-cols-1" : "lg:grid-cols-12"
      )}>
        <div className={cn(
          "space-y-6",
          currentApplicants.length > 0 ? "lg:col-span-1" : "lg:col-span-8"
        )}>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search candidates by name or expertise..."
                className="w-full bg-white border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 border border-border/50 bg-white rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setSortBy("score")}
                className={cn(
                  "px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  sortBy === "score" ? "bg-primary text-white shadow-sm" : "hover:bg-secondary text-muted-foreground"
                )}
              >
                Score
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={cn(
                  "px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  sortBy === "name" ? "bg-primary text-white shadow-sm" : "hover:bg-secondary text-muted-foreground"
                )}
              >
                Name
              </button>
            </div>
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {currentApplicants.length > 0 ? (
                currentApplicants.map((applicant, index) => (
                  <motion.div
                    key={applicant.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 40,
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <CandidateRow
                      id={applicant.id}
                      rank={(index + 1).toString().padStart(2, "0")}
                      name={applicant.name}
                      role={applicant.role}
                      score={applicant.score}
                      tags={applicant.tags}
                      status={applicant.scoreLabel}
                      isShortlisted={applicant.isShortlisted}
                      onShortlistToggle={handleToggleShortlist}
                      onDelete={handleDeleteApplicant}
                      onViewDetails={(id) => router.push(`/applicants/${id}`)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border-2 border-dashed border-border/50 rounded-[2.5rem] p-20 flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <FileBox className="w-10 h-10 text-muted-foreground opacity-40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-primary">No applicants yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      This job brief is ready for intake. The live applicant import flow is the next
                      integration slice after this recruiter list and detail workflow.
                    </p>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setIsImportModalOpen(true)}
                      className="flex items-center gap-2 px-6 py-4 bg-secondary text-primary rounded-2xl font-bold hover:bg-muted transition-all"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      View import status
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {currentApplicants.length === 0 && (
          <div className="lg:col-span-4 space-y-6">
            <UploadCard className="opacity-70" />

            <div className="soft-panel p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Guideline</h4>
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {[
                  { title: "Live Records", text: "This view now reflects real backend applicants linked to the selected job." },
                  { title: "Shortlisting", text: "Starring a candidate updates their backend status to shortlisted." },
                  { title: "Import Next", text: "Spreadsheet and PDF intake will be wired next once the backend upload flow is cleaned up." },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-black text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-primary uppercase tracking-wider">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        onConfirm={() => void confirmDeleteAll()}
        title="Delete All Applicants"
        description="Are you sure you want to delete everyone in this pool? This action is permanent and will clear the intake pipeline for this role."
        confirmLabel="Clear Pipeline"
      />

      <ConfirmationModal
        isOpen={isDeleteSingleModalOpen}
        onClose={() => {
          setIsDeleteSingleModalOpen(false);
          setApplicantToDelete(null);
        }}
        onConfirm={() => void confirmDeleteApplicant()}
        title="Remove Applicant"
        description="Are you sure you want to remove this candidate? Their screening data and matching score will be lost."
        confirmLabel="Yes, Remove"
      />

      <BaseModal
        isOpen={isImportModalOpen}
        onClose={() => {
          if (!isUploading) {
            setIsImportModalOpen(false);
            setUploadFeedback(null);
          }
        }}
        title="Import Pipeline"
        description="The screening flow is now live. Upload PDF resumes to automatically extract profiles and calculate matching scores using Gemini AI."
      >
        <div className="p-8 space-y-6">
          {uploadFeedback && (
            <div className={cn(
              "rounded-[1.5rem] border px-5 py-4 text-sm font-bold uppercase tracking-tight",
              uploadFeedback.includes("Successfully")
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-accent/20 bg-accent/5 text-primary"
            )}>
              {uploadFeedback}
            </div>
          )}

          <div className={cn(isUploading && "pointer-events-none opacity-50")}>
            <UploadCard
              onFilesSelected={handleFilesSelected}
            />
          </div>

          {isUploading && (
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Gemini is processing...</span>
            </div>
          )}
        </div>
      </BaseModal>
    </div>
  );
}
