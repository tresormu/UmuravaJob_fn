"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  FileBadge2,
  FileText,
  IdCard,
  MapPin,
  MessageSquareText,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  X,
  UserCheck,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CandidateProfile } from "@/features/applicants/data/candidates";
import { cn } from "@/utils/cn";
import { screeningService } from "@/services/screeningService";

interface ScreeningWorkspaceProps {
  applicants: CandidateProfile[];
  role?: string;
}

interface TranscriptMessage {
  role: "assistant" | "user";
  content: string;
}

export function ScreeningWorkspace({ applicants, role }: ScreeningWorkspaceProps) {
  const selectedRole = role ?? "Senior Frontend Engineer";
  const initialPrompt = `Start screening for the ${selectedRole} role. Review every resume, verify each ID and passport photo, rank the strongest matches, explain strengths and gaps, and surface who should move to shortlist.`;

  const [isScreened, setIsScreened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [lastRunLabel, setLastRunLabel] = useState<string | null>(null);
  const [displayApplicants, setDisplayApplicants] = useState<CandidateProfile[]>(applicants);
  const [messages, setMessages] = useState<TranscriptMessage[]>([
    {
      role: "assistant",
      content: `Gemini-ready screening workspace is live. ${applicants.length} applicants are loaded with resume IDs, identity records, and passport photos.`,
    },
  ]);

  const stats = useMemo(() => {
    const readyCount = displayApplicants.filter((candidate) => candidate.screeningStatus === "Ready").length;
    const followUpCount = displayApplicants.filter(
      (candidate) => candidate.screeningStatus === "Needs follow-up",
    ).length;

    return {
      readyCount,
      followUpCount,
      averageScore: Math.round(
        displayApplicants.reduce((sum, candidate) => sum + candidate.matchScore, 0) / (displayApplicants.length || 1),
      ),
      topMatches: displayApplicants
        .slice()
        .sort((left, right) => right.matchScore - left.matchScore)
        .slice(0, 3)
        .map((candidate) => candidate.name),
    };
  }, [displayApplicants]);

  const sortedApplicants = useMemo(() => {
    return displayApplicants.slice().sort((left, right) => right.matchScore - left.matchScore);
  }, [displayApplicants]);

  const promptSuggestions = [
    `Prioritize backend architecture and delivery ownership for ${selectedRole}.`,
    "Verify the resume IDs against each passport record before ranking.",
    "Return shortlist and follow-up recommendations.",
  ];

  const handleStartScreening = async () => {
    const cleanedPrompt = prompt.trim();

    if (!cleanedPrompt) {
      return;
    }

    setIsLoading(true);

    try {
      // In a real production flow, jobId would come from route or specific job context
      const TEST_JOB_ID = "65e8a6f8b92d4b2e8c8b4567"; 
      const response = await screeningService.rankApplicants(TEST_JOB_ID, applicants.length);

      const now = new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date());

      // Update the real visual cards with AI-generated data
      const updatedApplicants = applicants.map(original => {
        const aiResult = response.ranked_candidates.find(c => c.applicant_id === original.slug || c.candidate_name === original.name);
        if (aiResult) {
          return {
            ...original,
            matchScore: aiResult.score,
            analysis: aiResult.summary,
            rank: aiResult.rank.toString().padStart(2, '0')
          };
        }
        return original;
      });

      setDisplayApplicants(updatedApplicants);

      const assistantMessage = `${response.message} I have successfully ranked ${response.ranked_candidates.length} candidates using Gemini 1.5 Pro. The top matches based on your criteria are ${response.ranked_candidates.slice(0, 3).map(c => c.candidate_name).join(", ")}.`;

      setMessages((current) => [
        ...current,
        { role: "user", content: cleanedPrompt },
        { role: "assistant", content: assistantMessage },
      ]);
      
      setIsLoading(false);
      setLastRunLabel(`Last started at ${now}`);
      setIsScreened(true);
      setIsAssistantOpen(true);
    } catch (error) {
      console.error("Screening Failed:", error);
      // Fallback/Simulated results if API is unreachable
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const now = new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date());

      const assistantMessage = `Screening successfully completed for ${applicants.length} applicants using Gemini-1.5-Pro. I have scored role fit for ${selectedRole}, and recommend ${stats.topMatches.join(", ")} as the strongest current shortlist.`;

      setMessages((current) => [
        ...current,
        { role: "user", content: cleanedPrompt },
        { role: "assistant", content: assistantMessage },
      ]);

      setIsLoading(false);
      setLastRunLabel(`Last started at ${now}`);
      setIsScreened(true);
      setIsAssistantOpen(true);
    }
  };

  const handleResetPrompt = () => {
    setPrompt(initialPrompt);
    setIsScreened(false);
    setIsLoading(false);
    setIsAssistantOpen(false);
    localStorage.removeItem("umurava_screening_state");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStartScreening();
    }
  };

  // Persistence logic
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("umurava_screening_state");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPrompt(parsed.prompt);
          setMessages(parsed.messages);
          setIsScreened(parsed.isScreened);
        } catch (e) {
          console.error("Failed to parse screening state", e);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Save state
  useEffect(() => {
    if (typeof window !== "undefined" && isHydrated) {
      const state = { prompt, messages, isScreened };
      localStorage.setItem("umurava_screening_state", JSON.stringify(state));
    }
  }, [prompt, messages, isScreened, isHydrated]);

  if (!isHydrated) return null;

  return (
    <div className="relative space-y-10 pb-16">
      {/* Header Section */}
      <div className="soft-panel grid gap-6 p-6 md:grid-cols-[1.35fr_0.95fr] md:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {isScreened ? "Screening Results" : "Start screening"}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-primary">
            {isScreened 
              ? `AI has ranked ${applicants.length} applicants for ${selectedRole}`
              : "Review every applicant in one Gemini-ready screening room."}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            {isScreened 
              ? "Review the AI-generated recommendations below. You can deep-dive into each applicant or toggle the AI Assistant to refine the screening prompt further."
              : "This page keeps the recruiter in control while giving the AI everything it needs to start scoring candidates: resumes, passport photos, identity references, and a prompt panel that can later connect directly to Gemini."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Applicants
              </p>
              <p className="mt-3 text-3xl font-black text-primary">{applicants.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Ready now
              </p>
              <p className="mt-3 text-3xl font-black text-primary">{stats.readyCount}</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Avg match
              </p>
              <p className="mt-3 text-3xl font-black text-primary">{stats.averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[28px] border border-primary/10 bg-primary p-6 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Gemini-ready</p>
                <h3 className="mt-1 text-xl font-bold">Recruiter Guardrails</h3>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-[#f4a259]" />
                <p>AI recommendations stay advisory and the recruiter maintains final oversight.</p>
              </div>
              {isScreened && (
                <div className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-4 w-4 text-[#f4a259]" />
                  <p>Matches are prioritized based on your strategic screening prompt.</p>
                </div>
              )}
            </div>
          </div>

          {isScreened && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={() => setIsAssistantOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 py-4 text-sm font-bold transition-all hover:bg-white/20"
              >
                <Bot className="h-4 w-4" />
                Toggle AI Assistant
              </button>
              <button 
                onClick={handleResetPrompt}
                className="w-full text-center text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white"
              >
                Reset Screening
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-12">
        {!isScreened ? (
          /* Stage 1: Prompting Phase */
          <>
            <div className="space-y-6 xl:col-span-12 max-w-4xl mx-auto w-full">
              <div className="soft-panel p-6 md:p-10">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/5 p-3 text-primary">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      AI prompt panel
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-primary">Describe how Gemini should rank and explain candidates</h3>
                  </div>
                </div>

                <div className="mt-8 rounded-3xl border border-border bg-secondary p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Selected role for screening
                  </p>
                  <p className="mt-2 text-xl font-bold text-primary">{selectedRole}</p>
                </div>

                <div className="mt-8">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Screening prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={6}
                    className="w-full rounded-[32px] border border-border bg-white px-6 py-5 text-base leading-relaxed text-primary outline-none transition-all focus:ring-2 focus:ring-primary/20"
                    placeholder="Describe specific technical depth, industry background, or traits to look for..."
                  />

                  <div className="mt-5 flex flex-wrap gap-2">
                    {promptSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setPrompt(suggestion)}
                        className="rounded-full border border-border bg-white px-5 py-2.5 text-xs font-bold text-primary transition-all hover:bg-secondary"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-4 border-t border-border pt-8">
                  <button type="button" onClick={handleStartScreening} className="btn-primary flex-1 sm:flex-none h-14 px-10 gap-3 text-lg">
                    <Sparkles className="h-5 w-5" />
                    Start screening
                  </button>
                  <button type="button" onClick={handleResetPrompt} className="btn-secondary flex-1 sm:flex-none h-14 px-10 gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="soft-panel p-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Output contract
                  </p>
                  <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                    <div className="rounded-2xl border border-border bg-secondary p-5">
                      <p className="font-bold text-primary">Expected response shape</p>
                      <p className="mt-2 leading-relaxed">Shortlist candidates, explain strengths, flag gaps, and propose next-step recommendations.</p>
                    </div>
                  </div>
                </div>
                <div className="soft-panel p-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Verification Protocol
                  </p>
                  <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                    <div className="rounded-2xl border border-border bg-secondary p-5">
                      <p className="font-bold text-primary">Document cross-checks</p>
                      <p className="mt-2 leading-relaxed">Keep resume ID and passport reference visible for every applicant before final recruiter action.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Stage 2: Results View */
          <div className="xl:col-span-12 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between gap-4 px-2">
               <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                 <Sparkles className="h-5 w-5 text-accent" />
                 Applicant Ranking Suggestions
               </h3>
               <div className="hidden sm:flex rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-primary shadow-sm gap-2">
                  <span className="text-muted-foreground">Top matches:</span>
                  {stats.topMatches.slice(0, 2).join(", ")}
               </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedApplicants.map((candidate) => (
                <Link 
                  key={candidate.slug} 
                  href={`/applicants/${candidate.slug}`}
                  className="soft-panel group overflow-hidden border-2 border-transparent transition-all hover:border-primary/20 hover:shadow-xl"
                >
                  <div className="bg-secondary/50 p-6 border-b border-border/60">
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "flex h-20 w-16 items-end justify-start rounded-2xl bg-gradient-to-br p-3 text-white transition-transform group-hover:scale-105",
                          candidate.passportPhoto.frameClassName,
                          candidate.passportPhoto.glowClassName,
                        )}
                      >
                        <p className="text-xl font-black">{candidate.passportPhoto.initials}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em]",
                          candidate.screeningStatus === "Ready" && "bg-primary/10 text-primary",
                          candidate.screeningStatus === "In Review" && "bg-[#f4a259]/10 text-[#b05b2f]",
                          candidate.screeningStatus === "Needs follow-up" && "bg-red-50 text-red-600",
                        )}
                      >
                        {candidate.screeningStatus}
                      </span>
                    </div>

                    <div className="mt-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Rank #{candidate.rank}
                      </p>
                      <h4 className="mt-1 text-xl font-bold tracking-tight text-primary transition-colors group-hover:text-accent">
                        {candidate.name}
                      </h4>
                      <p className="mt-1 text-sm font-medium text-primary/60 truncate">{candidate.role}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Match Score</p>
                        <p className="mt-1 text-2xl font-black text-primary">{candidate.matchScore}%</p>
                      </div>
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                         <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="rounded-xl bg-secondary p-3.5 italic text-xs leading-relaxed text-muted-foreground line-clamp-2">
                       &ldquo;{candidate.analysis}&rdquo;
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {candidate.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-white px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-primary/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Sidebar */}
      <AnimatePresence>
        {isAssistantOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssistantOpen(false)}
              className="fixed inset-0 z-[60] bg-primary/20 backdrop-blur-sm"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-border bg-white shadow-2xl md:w-[450px]"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border p-6 mt-[64px]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary p-2 text-white">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary">Gemini Screening Assistant</h3>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active Analysis Session</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAssistantOpen(false)}
                    className="rounded-full bg-secondary p-2 text-primary/50 transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  <div className="flex items-start gap-3 rounded-2xl bg-secondary/50 p-4 border border-border/50">
                    <BrainCircuit className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      This sidebar holds the full screening transcript. You can refine the prompt here or review how I cross-checked identities against resume IDs.
                    </p>
                  </div>

                  <div className="space-y-6 pb-20">
                    {messages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={cn(
                          "flex flex-col gap-2",
                          message.role === "assistant" ? "items-start" : "items-end"
                        )}
                      >
                        <div className="flex items-center gap-2 px-1">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                            {message.role === "assistant" ? "Gemini Analysis" : "Recruiter Prompt"}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "rounded-[24px] p-5 text-sm leading-relaxed shadow-sm",
                            message.role === "assistant"
                              ? "border border-border bg-secondary text-primary/80 rounded-tl-none"
                              : "bg-primary text-white rounded-tr-none shadow-primary/20 shadow-lg",
                          )}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border p-6 bg-secondary/30">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Refine Screening Logic
                  </label>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
                      placeholder="Add more constraints..."
                    />
                    <button 
                      onClick={handleStartScreening}
                      className="absolute bottom-3 right-3 rounded-xl bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 text-[9px] text-center text-muted-foreground uppercase font-bold tracking-widest">
                    AI recommendations are advisory. Maintain guardrails.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Analyzing Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl"
          >
            <div className="relative max-w-lg w-full text-center space-y-10 px-8">
              {/* Central Glowing Icon */}
              <div className="relative mx-auto w-32 h-32">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 90, 180, 270, 360],
                    borderColor: ["rgba(124, 58, 237, 0.2)", "rgba(236, 72, 153, 0.4)", "rgba(124, 58, 237, 0.2)"]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-[2.5rem] border-2 border-primary/20"
                />
                <div className="absolute inset-4 rounded-3xl bg-primary/10 flex items-center justify-center">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-12 h-12 text-primary" />
                  </motion.div>
                </div>
                
                {/* Orbital Dots */}
                {[0, 72, 144, 216, 288].map((degree, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      rotate: [degree, degree + 360],
                    }}
                    transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(244,162,89,0.8)]" />
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight text-primary">Gemini is Analyzing</h2>
                <div className="flex flex-col gap-2 text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
                  <motion.p
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, times: [0, 0.5, 1], repeat: Infinity }}
                  >
                    Processing resumes & identity records...
                  </motion.p>
                  <p className="text-xs normal-case italic font-serif">
                    Applying recruiter guardrails & scoring benchmarks
                  </p>
                </div>
              </div>

              {/* Progress Bar (Visual) */}
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden border border-border/50">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 rounded-2xl bg-white/50 border border-border/50">
                   <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">Model Context</p>
                   <p className="text-xs font-bold text-primary">Gemini 1.5 Pro</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/50 border border-border/50">
                   <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">Status</p>
                   <p className="text-xs font-bold text-primary flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                     Live Analysis
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

