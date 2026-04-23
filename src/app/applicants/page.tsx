"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UploadCard } from "@/features/applicants/components/UploadCard";
import { CandidateRow } from "@/features/applicants/components/CandidateRow";
import { AiChatDrawer } from "@/features/applicants/components/AiChatDrawer";
import { CandidateDetail } from "@/features/applicants/components/CandidateDetail";
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
  BrainCircuit,
  UserPlus,
  Ban,
} from "lucide-react";
import { Toast } from "@/components/common/Toast";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { BaseModal } from "@/components/common/BaseModal";
import { useAuth } from "@/context/AuthContext";
import {
  bulkUpdateApplicantsStatus,
  createApplicant,
  deleteApplicant,
  fetchApplicants,
  updateApplicantStatus,
  uploadApplicantPdfs,
  uploadApplicantSpreadsheet,
  type ApplicantRecord,
} from "@/services/applicantsService";
import { useJobs } from "@/context/JobContext";

export default function ApplicantsPage() {
  const { accessToken, user } = useAuth();
  const { jobs, selectedJobId, setSelectedJobId, selectedJob, isLoading: isJobsLoading } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeleteSingleModalOpen, setIsDeleteSingleModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [applicantToDelete, setApplicantToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isRejectAllRemainingOpen, setIsRejectAllRemainingOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantRecord | null>(null);

  const [manualFormData, setManualFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    resumeUrl: "",
  });

  useEffect(() => {
    let isActive = true;

    const loadApplicants = async () => {
      if (!accessToken) return;
      setIsLoading(true);
      try {
        const allApplicants = await fetchApplicants(accessToken);
        if (isActive) setApplicants(allApplicants);
      } catch (err: any) {
        if (isActive) setError(err.message || "Failed to load applicants");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };
    loadApplicants();

    return () => {
      isActive = false;
    };
  }, [accessToken, user?.id]);

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

  const confirmRejectAllRemaining = async () => {
    if (!accessToken || !selectedJobId) return;

    const pendingApplicants = currentApplicants.filter(
      (app) => app.workflowStatus === "applied"
    );

    if (pendingApplicants.length === 0) {
      setToast({ message: "No pending applicants to reject.", type: "error" });
      return;
    }

    setIsBulkUpdating(true);
    try {
      await bulkUpdateApplicantsStatus(
        accessToken,
        pendingApplicants.map((a) => a.id),
        "rejected"
      );

      setApplicants((prev) =>
        prev.map((app) =>
          app.jobId === selectedJobId && app.workflowStatus === "applied"
            ? { ...app, workflowStatus: "rejected", isShortlisted: false }
            : app
        )
      );

      setToast({ message: `Successfully rejected ${pendingApplicants.length} applicant(s).`, type: "success" });
    } catch (err: any) {
      setError(err.message || "Failed to reject remaining applicants");
    } finally {
      setIsBulkUpdating(false);
      setIsRejectAllRemainingOpen(false);
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(currentApplicants.map((a) => a.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleBulkMove = async (status: ApplicantRecord["workflowStatus"]) => {
    if (selectedIds.size === 0 || !accessToken) return;

    setIsBulkUpdating(true);
    try {
      await bulkUpdateApplicantsStatus(accessToken, Array.from(selectedIds), status);

      setApplicants((prev) =>
        prev.map((app) =>
          selectedIds.has(app.id) ? { ...app, workflowStatus: status, isShortlisted: status === "shortlisted" } : app
        )
      );

      setSelectedIds(new Set());
      setUploadFeedback(`Successfully moved ${selectedIds.size} applicant(s) to ${status}`);
      setTimeout(() => setUploadFeedback(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update applicants");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0 || !accessToken) return;
    setIsBulkDeleteOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (!accessToken) return;
    setIsBulkUpdating(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) => deleteApplicant(accessToken, id))
      );

      setApplicants((prev) => prev.filter((app) => !selectedIds.has(app.id)));
      setSelectedIds(new Set());
      setUploadFeedback(`Successfully deleted ${selectedIds.size} applicant(s)`);
      setTimeout(() => setUploadFeedback(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete applicants");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleViewDetails = (id: string) => {
    const found = applicants.find((a) => a.id === id);
    if (found) setSelectedApplicant(found);
  };

  const handleDetailStatusChange = async (id: string, status: ApplicantRecord["workflowStatus"]) => {
    if (!accessToken) return;
    try {
      await updateApplicantStatus(accessToken, id, status);
      setApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, workflowStatus: status as ApplicantRecord["workflowStatus"], isShortlisted: status === "shortlisted" } : a))
      );
      setSelectedApplicant((prev) =>
        prev?.id === id ? { ...prev, workflowStatus: status as ApplicantRecord["workflowStatus"], isShortlisted: status === "shortlisted" } : prev
      );
      setToast({ message: `Applicant successfully ${status}.`, type: "success" });
    } catch (err: any) {
      setError(err.message || "Failed to update applicant status");
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
      const pdfs = files.filter(f => f.type === "application/pdf");
      const sheets = files.filter(f => f.type !== "application/pdf");

      let totalImported = 0;

      if (pdfs.length > 0) {
        setUploadFeedback(`Analyzing ${pdfs.length} PDF resume(s)...`);
        const res = await uploadApplicantPdfs(accessToken, selectedJobId, pdfs);
        totalImported += res.length;
      }

      if (sheets.length > 0) {
        for (const sheet of sheets) {
          setUploadFeedback(`Importing ${sheet.name}...`);
          const res = await uploadApplicantSpreadsheet(accessToken, selectedJobId, sheet);
          totalImported += res.count;
        }
      }

      // Refresh the relevant pipeline for consistency
      const allApplicants = await fetchApplicants(accessToken, selectedJobId);
      setApplicants(allApplicants);

      setUploadFeedback(`Successfully imported ${totalImported} applicant(s).`);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setUploadFeedback(null);
      }, 2000);
    } catch (uploadError: any) {
      console.error("[Upload] Error details:", uploadError);

      let message = uploadError.message || "Failed to process resumes.";

      // If we have detailed failure info, append it
      if (uploadError.failed && Array.from(uploadError.failed).length > 0) {
        const details = (uploadError.failed as any[])
          .map(f => `${f.fileName}: ${f.error}`)
          .join(" | ");
        message = `${message} (Details: ${details})`;
      }

      setUploadFeedback(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedJobId) return;

    setIsUploading(true);
    try {
      const newApplicant = await createApplicant(accessToken, {
        ...manualFormData,
        jobId: selectedJobId as any,
        source: "manual",
        status: "applied",
      });

      setApplicants((prev) => [newApplicant, ...prev]);
      setIsManualModalOpen(false);
      setManualFormData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        resumeUrl: "",
      });
      setUploadFeedback("Applicant added successfully!");
      setTimeout(() => setUploadFeedback(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add applicant");
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

        {isJobsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-secondary rounded-[2rem]" />
            ))}
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
            <>
              <button
                onClick={() => setIsRejectAllRemainingOpen(true)}
                className="px-6 py-3 rounded-2xl bg-amber-50 text-amber-600 text-xs font-black uppercase tracking-widest border border-amber-100 hover:bg-amber-100 transition-all flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Reject All Remaining
              </button>
              <button
                onClick={() => setIsDeleteAllModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete All
              </button>
            </>
          )}
           <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-secondary text-primary text-xs font-black uppercase tracking-widest border border-border/50 hover:bg-white transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Applicant
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-secondary text-primary text-xs font-black uppercase tracking-widest border border-border/50 hover:bg-white transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Import Talent
          </button>
          {selectedJobId && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-6 py-3 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4" />
              Chat with AI
            </button>
          )}
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

          <div className="flex items-center justify-between px-4 mb-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedIds.size === currentApplicants.length && currentApplicants.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-5 h-5 rounded-lg border-2 border-border text-primary focus:ring-primary/20 cursor-pointer transition-all accent-primary"
              />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select All Candidates</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{currentApplicants.length} Applicants found</div>
          </div>

          <div className="min-h-[400px] relative">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-secondary rounded-2xl" />
                ))}
              </div>
            ) : (
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
                      isSelected={selectedIds.has(applicant.id)}
                      onSelect={handleSelect}
                      onShortlistToggle={handleToggleShortlist}
                      onDelete={handleDeleteApplicant}
                      onViewDetails={handleViewDetails}
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
            )}
          </div>
        </div>

        {currentApplicants.length === 0 && (
          <div className="lg:col-span-4 space-y-6">
            <UploadCard
              onFilesSelected={handleFilesSelected}
              isUploading={isUploading}
              className="opacity-70"
            />

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
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={() => void confirmBulkDelete()}
        title="Delete Selected Applicants"
        description={`Are you sure you want to delete ${selectedIds.size} applicant(s)? This action cannot be undone.`}
        confirmLabel="Delete"
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
              isUploading={isUploading}
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

      <BaseModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Manual Applicant Addition"
        description="Add a candidate manually to the pipeline by providing their basic details and CV link."
      >
        <form onSubmit={handleManualAdd} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name *</label>
              <input
                required
                type="text"
                placeholder="Candidate Full Name"
                value={manualFormData.fullName}
                onChange={(e) => setManualFormData({ ...manualFormData, fullName: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={manualFormData.email}
                  onChange={(e) => setManualFormData({ ...manualFormData, email: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Phone</label>
                <input
                  type="text"
                  placeholder="+250..."
                  value={manualFormData.phone}
                  onChange={(e) => setManualFormData({ ...manualFormData, phone: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Location</label>
              <input
                type="text"
                placeholder="City, Country"
                value={manualFormData.location}
                onChange={(e) => setManualFormData({ ...manualFormData, location: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">CV PDF Link (URL)</label>
              <input
                type="url"
                placeholder="https://..."
                value={manualFormData.resumeUrl}
                onChange={(e) => setManualFormData({ ...manualFormData, resumeUrl: e.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 text-primary outline-none focus:bg-white focus:border-accent transition-all font-bold"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-accent transition-all disabled:opacity-50"
            >
              {isUploading ? "Adding..." : "Add to Pipeline"}
            </button>
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="px-6 py-4 bg-secondary text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-border transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </BaseModal>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 pr-8 border-r border-white/10">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-sm">
                {selectedIds.size}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Selected</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Move to stage:</span>
                <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5">
                  {(["applied", "screened", "shortlisted", "rejected"] as const).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => handleBulkMove(stage)}
                      disabled={isBulkUpdating}
                      className="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all disabled:opacity-50"
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-8 w-px bg-white/10 mx-2" />

              <button
                onClick={handleBulkDelete}
                disabled={isBulkUpdating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-100 hover:bg-red-500 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        jobId={selectedJobId || ""}
        accessToken={accessToken || ""}
        jobTitle={selectedJob?.title}
      />

      {/* Candidate Detail Slide-over */}
      <AnimatePresence>
        {selectedApplicant && (
          <>
            <motion.div
              key="detail-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApplicant(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              key="detail-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col border-l border-border"
            >
              <CandidateDetail
                applicant={selectedApplicant}
                onClose={() => setSelectedApplicant(null)}
                onStatusChange={handleDetailStatusChange}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ConfirmationModal
        isOpen={isRejectAllRemainingOpen}
        onClose={() => setIsRejectAllRemainingOpen(false)}
        onConfirm={() => void confirmRejectAllRemaining()}
        title="Reject Remaining Applicants"
        description="This will move every applicant currently in the 'Applied' stage to 'Rejected'. Are you sure?"
        confirmLabel="Reject All Remaining"
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
