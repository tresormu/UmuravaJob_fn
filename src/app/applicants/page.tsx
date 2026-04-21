"use client";

import { useState, useMemo } from "react";
import { UploadCard } from "@/features/applicants/components/UploadCard";
import { CandidateRow } from "@/features/applicants/components/CandidateRow";
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  FileBox, 
  Trash2, 
  ArrowLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { BaseModal } from "@/components/common/BaseModal";

// --- Types ---
interface Job {
  id: string;
  title: string;
  department: string;
  applicantsCount: number;
  icon: "code" | "design" | "research";
}

interface Applicant {
  id: string;
  name: string;
  role: string;
  score: number;
  tags: string[];
  status: "Elite" | "High" | "Good";
  isShortlisted: boolean;
}

// --- Mock Data ---
const MOCK_JOBS: Job[] = [
  { id: "job-1", title: "Senior Frontend Engineer", department: "Engineering", applicantsCount: 12, icon: "code" },
  { id: "job-2", title: "Product Designer", department: "Design", applicantsCount: 8, icon: "design" },
  { id: "job-3", title: "Data Analyst", department: "Operations", applicantsCount: 0, icon: "research" },
  { id: "job-4", title: "Backend Developer", department: "Engineering", applicantsCount: 0, icon: "code" },
];

const MOCK_APPLICANTS: Record<string, Applicant[]> = {
  "job-1": [
    { id: "app-1", name: "Sarah Johnson", role: "React Expert", score: 96, status: "Elite", tags: ["TypeScript", "Next.js", "Tailwind"], isShortlisted: true },
    { id: "app-2", name: "Michael Chen", role: "Frontend Lead", score: 88, status: "High", tags: ["Architecture", "Redux", "Testing"], isShortlisted: false },
    { id: "app-3", name: "Emma Wilson", role: "UI Engineer", score: 72, status: "Good", tags: ["CSS", "Accessibility", "Figma"], isShortlisted: false },
  ],
  "job-2": [
    { id: "app-4", name: "Alex Rivers", role: "Product Designer", score: 92, status: "Elite", tags: ["UX Research", "Prototyping", "Figma"], isShortlisted: false },
    { id: "app-5", name: "Jessica Low", role: "Visual Designer", score: 84, status: "High", tags: ["Branding", "Illustrator", "Motion"], isShortlisted: true },
  ]
};

export default function ApplicantsPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [applicants, setApplicants] = useState<Record<string, Applicant[]>>(MOCK_APPLICANTS);
  const [sortBy, setSortBy] = useState<"score" | "name">("score");

  // Confirmation Modal States
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeleteSingleModalOpen, setIsDeleteSingleModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [applicantToDelete, setApplicantToDelete] = useState<string | null>(null);

  const selectedJob = useMemo(() => MOCK_JOBS.find(j => j.id === selectedJobId), [selectedJobId]);

  const currentApplicants = useMemo(() => {
    if (!selectedJobId) return [];
    let list = [...(applicants[selectedJobId] || [])];
    
    if (searchQuery) {
      list = list.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...list].sort((a, b) => {
      if (sortBy === "score") {
        return b.score - a.score;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return sorted;
  }, [selectedJobId, applicants, searchQuery, sortBy]);

  // --- Handlers ---
  const handleToggleShortlist = (id: string) => {
    if (!selectedJobId) return;
    setApplicants(prev => ({
      ...prev,
      [selectedJobId]: prev[selectedJobId].map(a => 
        a.id === id ? { ...a, isShortlisted: !a.isShortlisted } : a
      )
    }));
  };

  const handleDeleteApplicant = (id: string) => {
    setApplicantToDelete(id);
    setIsDeleteSingleModalOpen(true);
  };

  const confirmDeleteApplicant = () => {
    if (!selectedJobId || !applicantToDelete) return;
    setApplicants(prev => ({
      ...prev,
      [selectedJobId]: prev[selectedJobId].filter(a => a.id !== applicantToDelete)
    }));
    setApplicantToDelete(null);
  };

  const handleDeleteAll = () => {
    setIsDeleteAllModalOpen(true);
  };

  const confirmDeleteAll = () => {
    if (!selectedJobId) return;
    setApplicants(prev => ({
      ...prev,
      [selectedJobId]: []
    }));
  };

  // --- Renderers ---
  if (!selectedJobId) {
    return (
      <div className="mx-auto max-w-6xl space-y-10 pb-20">
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Intake Pipeline</p>
          <h2 className="text-4xl font-black text-primary tracking-tight">Which role are you importing for?</h2>
          <p className="text-muted-foreground text-sm max-w-xl">Select a job brief to manage its applicants or import new talent sources.</p>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_JOBS.filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase())).map((job, idx) => (
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
                  <p className="text-xs text-muted-foreground font-medium">{job.department} • {applicants[job.id]?.length || 0} applicants</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mr-2" />
            </motion.button>
          ))}
          
          <button className="border-2 border-dashed border-border/50 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/20 hover:bg-secondary/30 transition-all group min-h-[100px]">
            <div className="p-2 bg-secondary rounded-full text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">Create new brief first</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 pb-20">
      {/* Header */}
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
              onClick={handleDeleteAll}
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

      <div className={cn(
        "grid grid-cols-1 gap-8",
        currentApplicants.length > 0 ? "lg:grid-cols-1" : "lg:grid-cols-12"
      )}>
        <div className={cn(
          "space-y-6",
          currentApplicants.length > 0 ? "lg:col-span-1" : "lg:col-span-8"
        )}>
          {/* Filters Bar */}
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

          {/* List Area */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {currentApplicants.length > 0 ? (
                currentApplicants.map((app, i) => (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 40,
                      opacity: { duration: 0.2 }
                    }}
                  >
                    <CandidateRow 
                      {...app} 
                      rank={(i + 1).toString().padStart(2, '0')}
                      onShortlistToggle={handleToggleShortlist}
                      onDelete={handleDeleteApplicant}
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
                    <h3 className="text-2xl font-black text-primary">No applicants imported yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">This job brief is ready for intake. Import candidates from spreadsheets, CSVs, or LinkedIn profile links to begin screening.</p>
                  </div>
                  <div className="flex gap-4 pt-4">
                     <button className="flex items-center gap-2 px-6 py-4 bg-secondary text-primary rounded-2xl font-bold hover:bg-muted transition-all">
                        <FileSpreadsheet className="w-5 h-5" />
                        Browse Sources
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {currentApplicants.length === 0 && (
          <div className="lg:col-span-4 space-y-6">
            <UploadCard />
            
            <div className="soft-panel p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Guideline</h4>
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
               </div>
               <div className="space-y-4">
                  {[
                    { title: "Source Transparency", text: "Always verify where the talent data originated before shortlisting." },
                    { title: "Scoring Weight", text: "AI scores are based on the job brief defined in the creation step." },
                    { title: "Manual Review", text: "Shortlisting a candidate here will move them to the firm review stage." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-black text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        {i + 1}
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

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        onConfirm={confirmDeleteAll}
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
        onConfirm={confirmDeleteApplicant}
        title="Remove Applicant"
        description="Are you sure you want to remove this candidate? Their screening data and matching score will be lost."
        confirmLabel="Yes, Remove"
      />

      <BaseModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Source Intake"
        description="Add fresh candidates to this pipeline via spreadsheet or resume parsing."
      >
        <div className="p-8">
           <UploadCard 
            onFilesSelected={(files) => {
              // Mock processing
              setTimeout(() => {
                setIsImportModalOpen(false);
                alert(`${files.length} applicant sources successfully added to the processing queue.`);
              }, 1500);
            }}
           />
        </div>
      </BaseModal>
    </div>
  );
}
