"use client";

import { useState } from "react";
import { MatchIntensity } from "@/features/applicants/components/MatchIntensity";
import { SkillMatrix } from "@/features/applicants/components/SkillMatrix";
import {
  CheckCircle2, X, MapPin, Briefcase, UserCheck, Target,
  Mail, Phone, Star, Clock, ExternalLink,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { ApplicantRecord } from "@/services/applicantsService";

interface CandidateDetailProps {
  applicant: ApplicantRecord;
  onClose: () => void;
  onStatusChange?: (id: string, status: "applied" | "screened" | "shortlisted" | "rejected") => void;
}

function parseAiSummaryIntoPoints(summary: string): { title: string; desc: string }[] {
  if (!summary) return [];
  const lines = summary
    .split(/[\n•\-]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 10);

  return lines.slice(0, 3).map((line) => {
    const parts = line.split(":");
    return {
      title: parts.length > 1 ? parts[0].trim() : "Key Insight",
      desc: parts.length > 1 ? parts.slice(1).join(":").trim() : line,
    };
  });
}

const statusColors: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700 border-blue-200",
  screened: "bg-amber-100 text-amber-700 border-amber-200",
  shortlisted: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

export function CandidateDetail({ applicant, onClose, onStatusChange }: CandidateDetailProps) {
  const score = applicant.score ?? 0;
  const skills = applicant.skills ?? [];
  const experienceYears = applicant.experience?.length ?? 0;
  const summary = applicant.aiSummary ?? "";
  const insights = parseAiSummaryIntoPoints(summary);
  const [confirmingStatus, setConfirmingStatus] = useState<"shortlisted" | "rejected" | null>(null);

  const handleStatusClick = (status: "shortlisted" | "rejected") => {
    setConfirmingStatus(status);
  };

  const handleConfirm = () => {
    if (confirmingStatus && onStatusChange && applicant.id) {
      onStatusChange(applicant.id, confirmingStatus);
    }
    setConfirmingStatus(null);
  };

  const skillMatrixItems = skills.slice(0, 4).map((skill: string, i: number) => ({
    label: skill,
    score: Math.min(10, score / 10 + (i % 2 === 0 ? 0.5 : -0.3)),
    benchmark: 7.5,
  }));

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50/40 relative">
      {/* Confirmation Overlay */}
      {confirmingStatus && (
        <div className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-sm flex items-center justify-center p-8 text-center animate-in fade-in duration-200">
          <div className="max-w-xs space-y-6">
            <div className={cn(
              "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
              confirmingStatus === "rejected" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            )}>
              <Star className={cn("w-8 h-8", confirmingStatus === "shortlisted" && "fill-current")} />
            </div>
            <div>
              <h4 className="text-lg font-black text-primary">Are you sure?</h4>
              <p className="text-sm text-muted-foreground mt-2">
                You are about to {confirmingStatus} <strong>{applicant.name}</strong>.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirm}
                className={cn(
                  "w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95",
                  confirmingStatus === "rejected" ? "bg-red-600 shadow-red-200" : "bg-primary shadow-primary/20"
                )}
              >
                Yes, {confirmingStatus}
              </button>
              <button
                onClick={() => setConfirmingStatus(null)}
                className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-primary bg-secondary border border-border hover:bg-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-border px-8 py-6 flex items-start justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl flex-shrink-0">
            {applicant.name?.charAt(0) ?? "?"}
          </div>
          <div>
            <h2 className="text-xl font-black text-primary tracking-tight">{applicant.name}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border",
                statusColors[applicant.workflowStatus] ?? "bg-gray-100 text-gray-600 border-gray-200"
              )}>
                {applicant.workflowStatus}
              </span>
              {applicant.source && (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  via {applicant.source}
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-all flex-shrink-0">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Body */}
      <div className="p-8 space-y-6">
        {/* Contact & Meta */}
        <div className="grid grid-cols-2 gap-4">
          {applicant.email && (
            <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary/40 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                <p className="text-sm font-bold text-primary truncate">{applicant.email}</p>
              </div>
            </div>
          )}
          {applicant.phone && (
            <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary/40 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Phone</p>
                <p className="text-sm font-bold text-primary">{applicant.phone}</p>
              </div>
            </div>
          )}
          {applicant.location && (
            <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-primary/40 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                <p className="text-sm font-bold text-primary">{applicant.location}</p>
              </div>
            </div>
          )}
          {applicant.experience?.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-primary/40 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Experience</p>
                <p className="text-sm font-bold text-primary">{applicant.experience[0]}</p>
              </div>
            </div>
          )}
        </div>

        {/* AI Score */}
        {score > 0 && (
          <div className="bg-white rounded-3xl border border-border p-8 flex flex-col items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">AI Match Score</p>
            <MatchIntensity score={score} size={180} strokeWidth={14} />
            <p className="text-xs text-muted-foreground text-center max-w-[240px] leading-relaxed font-medium">
              Score based on Gemini AI analysis of skills alignment and experience.
            </p>
          </div>
        )}

        {/* AI Summary */}
        {summary && (
          <div className="bg-white rounded-3xl border border-border p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/5 text-primary rounded-xl border border-primary/10">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="font-black text-primary uppercase tracking-wider text-sm">AI Strategic Analysis</h3>
            </div>
            <div className="bg-secondary p-6 rounded-2xl border-l-4 border-primary">
              <p className="text-primary italic text-sm leading-relaxed font-medium">&ldquo;{summary}&rdquo;</p>
            </div>
          </div>
        )}

        {/* Key Insights (parsed from summary) */}
        {insights.length > 0 && (
          <div className="bg-white rounded-3xl border border-border p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/5 text-primary rounded-xl border border-primary/10">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-black text-primary uppercase tracking-wider text-sm">Key Insights</h3>
            </div>
            <ul className="space-y-5">
              {insights.map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <div>
                    <p className="font-black text-primary text-sm tracking-tight">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="bg-white rounded-3xl border border-border p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/5 text-accent rounded-xl border border-accent/10">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-black text-primary uppercase tracking-wider text-sm">Extracted Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, i: number) => (
                <span key={i} className="text-[10px] font-black uppercase tracking-wider bg-secondary border border-border text-primary px-3 py-1.5 rounded-xl">
                  {skill}
                </span>
              ))}
            </div>
            {skillMatrixItems.length > 0 && (
              <div className="pt-4">
                <SkillMatrix skills={skillMatrixItems} />
              </div>
            )}
          </div>
        )}

        {/* Links */}
        {(applicant.linkedInUrl || applicant.portfolioUrl || applicant.resumeUrl) && (
          <div className="bg-white rounded-3xl border border-border p-6 space-y-3">
            <h3 className="font-black text-primary uppercase tracking-wider text-[10px]">External Links</h3>
            <div className="flex flex-col gap-2">
              {applicant.linkedInUrl && (
                <a href={applicant.linkedInUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> LinkedIn Profile
                </a>
              )}
              {applicant.portfolioUrl && (
                <a href={applicant.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                </a>
              )}
              {applicant.resumeUrl && (
                <a href={applicant.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Resume / CV
                </a>
              )}
            </div>
          </div>
        )}

        {/* Applied at */}
        {applicant.createdAt && (
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <Clock className="w-3 h-3" />
            Applied {new Date(applicant.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        )}
      </div>

      {/* Action Bar */}
      {onStatusChange && applicant.id && (
        <div className="sticky bottom-0 bg-white border-t border-border p-5 flex items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Star className="w-3.5 h-3.5 text-accent" />
            Update Status
          </div>
          <div className="flex gap-3">
            {applicant.workflowStatus !== "rejected" && (
              <button
                onClick={() => handleStatusClick("rejected")}
                className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-[10px] font-black uppercase tracking-wider hover:bg-red-50 transition-all"
              >
                Reject
              </button>
            )}
            {applicant.workflowStatus !== "shortlisted" && (
              <button
                onClick={() => handleStatusClick("shortlisted")}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Shortlist
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
