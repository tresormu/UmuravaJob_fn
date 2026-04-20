"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  FileBadge2,
  FileText,
  IdCard,
  MapPin,
  MessageSquareText,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CandidateProfile } from "@/features/applicants/data/candidates";
import { cn } from "@/utils/cn";

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

  const [prompt, setPrompt] = useState(initialPrompt);
  const [lastRunLabel, setLastRunLabel] = useState<string | null>(null);
  const [messages, setMessages] = useState<TranscriptMessage[]>([
    {
      role: "assistant",
      content: `Gemini-ready screening workspace is live. ${applicants.length} applicants are loaded with resume IDs, identity records, and passport photos.`,
    },
  ]);

  const stats = useMemo(() => {
    const readyCount = applicants.filter((candidate) => candidate.screeningStatus === "Ready").length;
    const followUpCount = applicants.filter(
      (candidate) => candidate.screeningStatus === "Needs follow-up",
    ).length;

    return {
      readyCount,
      followUpCount,
      averageScore: Math.round(
        applicants.reduce((sum, candidate) => sum + candidate.matchScore, 0) / applicants.length,
      ),
      topMatches: applicants
        .slice()
        .sort((left, right) => right.matchScore - left.matchScore)
        .slice(0, 3)
        .map((candidate) => candidate.name),
    };
  }, [applicants]);

  const promptSuggestions = [
    `Prioritize backend architecture and delivery ownership for ${selectedRole}.`,
    "Verify the resume IDs against each passport record before ranking.",
    "Return shortlist, approve, reject, and follow-up recommendations.",
  ];

  const handleStartScreening = () => {
    const cleanedPrompt = prompt.trim();

    if (!cleanedPrompt) {
      return;
    }

    const now = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());

    const assistantMessage = `Screening started for ${applicants.length} applicants. I will score role fit for ${selectedRole}, cross-check ${applicants.length} resume IDs against uploaded identity documents, and recommend ${stats.topMatches.join(", ")} as the strongest current shortlist. ${stats.followUpCount} applicant requires manual follow-up before final approval.`;

    setMessages((current) => [
      ...current,
      { role: "user", content: cleanedPrompt },
      { role: "assistant", content: assistantMessage },
    ]);
    setLastRunLabel(`Last started at ${now}`);
  };

  const handleResetPrompt = () => {
    setPrompt(initialPrompt);
  };

  return (
    <div className="space-y-10 pb-16">
      <div className="soft-panel grid gap-6 p-6 md:grid-cols-[1.35fr_0.95fr] md:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Start screening
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-primary">
            Review every applicant in one Gemini-ready screening room.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            This page keeps the recruiter in control while giving the AI everything it needs to
            start scoring candidates: resumes, passport photos, identity references, and a prompt
            panel that can later connect directly to Gemini.
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

        <div className="rounded-[28px] border border-primary/10 bg-primary p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Gemini-ready</p>
              <h3 className="mt-1 text-xl font-bold">Prompt contract and recruiter guardrails</h3>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm text-white/80">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-[#f4a259]" />
              <p>AI recommendations stay advisory and the recruiter still approves or rejects candidates.</p>
            </div>
            <div className="flex items-start gap-3">
              <FileBadge2 className="mt-0.5 h-4 w-4 text-[#f4a259]" />
              <p>Every applicant record includes a resume ID plus identity and passport references.</p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-[#f4a259]" />
              <p>Prompt responses can later be mapped to shortlist, approve, reject, and follow-up states.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-5">
          <div className="soft-panel p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/5 p-3 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  AI prompt panel
                </p>
                <h3 className="mt-1 text-xl font-bold text-primary">Prompt Gemini to start screening</h3>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-border bg-secondary p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Selected role
              </p>
              <p className="mt-2 text-lg font-bold text-primary">{selectedRole}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                The prompt below is ready for your Gemini API handoff once backend wiring is added.
              </p>
            </div>

            <label className="mt-6 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Screening prompt
            </label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={7}
              className="mt-3 w-full rounded-[28px] border border-border bg-white px-5 py-4 text-sm leading-7 text-primary outline-none transition-all focus:ring-2 focus:ring-primary/20"
              placeholder="Describe how the AI should rank and explain candidates..."
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {promptSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setPrompt(suggestion)}
                  className="rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-secondary"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={handleStartScreening} className="btn-primary btn-md gap-2">
                <Sparkles className="h-4 w-4" />
                Start screening
              </button>
              <button type="button" onClick={handleResetPrompt} className="btn-secondary btn-md gap-2">
                <RefreshCcw className="h-4 w-4" />
                Reset prompt
              </button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {lastRunLabel ?? "No screening run has been started from this page yet."}
            </p>
          </div>

          <div className="soft-panel p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Output contract
            </p>
            <div className="mt-5 space-y-4 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-border bg-secondary p-4">
                <p className="font-bold text-primary">Expected response shape</p>
                <p className="mt-2">Shortlist candidates, explain strengths, flag gaps, and propose approve or reject actions.</p>
              </div>
              <div className="rounded-2xl border border-border bg-secondary p-4">
                <p className="font-bold text-primary">Document checks</p>
                <p className="mt-2">Keep resume ID and passport reference visible for every applicant before final recruiter action.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-7">
          <div className="soft-panel p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Screening transcript
                </p>
                <h3 className="mt-1 text-xl font-bold text-primary">Recruiter and AI interaction log</h3>
              </div>
              <div className="rounded-full border border-border bg-secondary px-4 py-2 text-xs font-bold text-primary">
                {stats.topMatches.join(" • ")}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={cn(
                    "rounded-[28px] border p-5",
                    message.role === "assistant"
                      ? "border-border bg-secondary"
                      : "border-primary/10 bg-primary text-white",
                  )}
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {message.role === "assistant" ? (
                      <>
                        <MessageSquareText className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Gemini-ready assistant</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-white/70" />
                        <span className="text-white/70">Recruiter prompt</span>
                      </>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-3 text-sm leading-7",
                      message.role === "assistant" ? "text-primary/80" : "text-white",
                    )}
                  >
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {applicants.map((candidate) => (
              <div key={candidate.slug} className="soft-panel overflow-hidden">
                <div className="border-b border-border/60 bg-secondary/70 p-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div
                        className={cn(
                          "flex h-28 w-24 items-end justify-start rounded-[22px] bg-gradient-to-br p-4 text-white",
                          candidate.passportPhoto.frameClassName,
                          candidate.passportPhoto.glowClassName,
                        )}
                      >
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/60">
                            Passport photo
                          </p>
                          <p className="mt-1 text-2xl font-black">{candidate.passportPhoto.initials}</p>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            Applicant {candidate.rank}
                          </p>
                          <h4 className="mt-2 text-xl font-bold tracking-tight text-primary">
                            {candidate.name}
                          </h4>
                          <p className="mt-1 text-sm font-medium text-primary/70">{candidate.role}</p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]",
                            candidate.screeningStatus === "Ready" &&
                              "bg-primary/10 text-primary",
                            candidate.screeningStatus === "In Review" &&
                              "bg-[#f4a259]/10 text-[#b05b2f]",
                            candidate.screeningStatus === "Needs follow-up" &&
                              "bg-red-50 text-red-600",
                          )}
                        >
                          {candidate.screeningStatus}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-primary/50" />
                          {candidate.location}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary/50" />
                          {candidate.experience}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-secondary p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <FileText className="h-4 w-4" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          Resume ID
                        </p>
                      </div>
                      <p className="mt-3 text-sm font-bold text-primary">{candidate.resumeId}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-secondary p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <IdCard className="h-4 w-4" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          ID / Passport
                        </p>
                      </div>
                      <p className="mt-3 text-sm font-bold text-primary">{candidate.passportId}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-white p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Screening note
                    </p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{candidate.summary}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {candidate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Match score
                      </p>
                      <p className="mt-1 text-2xl font-black text-primary">{candidate.matchScore}%</p>
                    </div>
                    <Link href={`/applicants/${candidate.slug}`} className="btn-secondary btn-sm">
                      Review profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
