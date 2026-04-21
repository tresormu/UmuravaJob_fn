"use client";

import { MatchIntensity } from "@/features/applicants/components/MatchIntensity";
import { SkillMatrix } from "@/features/applicants/components/SkillMatrix";
import { CheckCircle2, Download, FileBadge2, IdCard, Share2, MapPin, Briefcase, UserCheck, Target } from "lucide-react";
import { CandidateProfile } from "@/features/applicants/data/candidates";

export function CandidateDetail({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-32">
      {/* Profile Header Dashboard */}
      <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-border premium-shadow-lg flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-32 -translate-y-32"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-10 relative z-10">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl bg-primary/10 overflow-hidden border-2 border-primary/20 shadow-inner flex-shrink-0">
             <div className="w-full h-full bg-[#004D4D] flex items-center justify-center">
                <UserCheck className="w-8 h-8 md:w-12 md:h-12 text-white/40" />
             </div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
              <h2 className="text-2xl md:text-4xl font-bold text-primary tracking-tight">{candidate.name}</h2>
              <span className="bg-[#E6F2F2] text-primary text-[9px] md:text-[10px] font-bold px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-primary/20 shadow-sm">
                {candidate.matchCategory === "Elite" ? "TOP 1% MATCH" : "HIGH MATCH"}
              </span>
            </div>
            <p className="text-lg md:text-xl text-primary/60 font-medium italic tracking-wide">{candidate.role}</p>
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground pt-1 md:pt-2">
              <span className="flex items-center gap-2 md:gap-2.5"><MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary/30" /> {candidate.location}</span>
              <span className="flex items-center gap-2 md:gap-2.5"><Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary/30" /> {candidate.experience}</span>
              <span className="flex items-center gap-2 md:gap-2.5 text-accent"><UserCheck className="w-3.5 h-3.5 md:w-4 md:h-4" /> Verified Identity</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 md:gap-4 relative z-10 w-full md:w-auto">
           <button className="flex-1 md:flex-none btn-secondary btn-md gap-2">
             <Download className="w-4 h-4" />
             CV
           </button>
           <button className="flex-1 md:flex-none btn-secondary btn-md gap-2">
             <Share2 className="w-4 h-4" />
             Share
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Alignment Analysis Card Dashboard */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white p-8 md:p-10 rounded-3xl md:rounded-[40px] border border-border flex flex-col items-center justify-center space-y-8 md:space-y-10 shadow-sm">
          <p className="text-[10px] md:text-[11px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Alignment Accuracy</p>
          <div className="scale-75 md:scale-100">
            <MatchIntensity score={candidate.matchScore} size={240} strokeWidth={18} />
          </div>
          <p className="text-xs md:text-sm text-muted-foreground text-center max-w-[280px] leading-relaxed font-medium">
            Score based on <span className="font-bold text-primary">14</span> cross-verified skill dimensions and requirement alignment.
          </p>
        </div>

        {/* Strategic Analysis Card Dashboard */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6 md:space-y-8">
           <div className="bg-white p-8 md:p-10 rounded-3xl md:rounded-[40px] border border-border shadow-sm flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="p-2 md:p-2.5 bg-primary/5 rounded-xl text-primary border border-primary/10">
                  <UserCheck className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <h3 className="font-bold text-lg md:text-xl text-primary">Strategic Analysis</h3>
              </div>
              
              <div className="flex-1 bg-secondary p-6 md:p-10 rounded-2xl md:rounded-3xl border-l-[6px] border-primary relative overflow-hidden">
                 <div className="absolute -top-6 -left-2 text-primary/5 text-8xl md:text-[120px] font-serif leading-none">&ldquo;</div>
                 <p className="text-primary italic text-lg md:text-xl leading-relaxed relative z-10 font-medium">
                   &ldquo;{candidate.analysis}&rdquo;
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-10">
                 <div className="bg-secondary/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-border">
                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5">Alignment Index</p>
                    <p className="text-xl md:text-2xl font-bold text-primary">{candidate.culturalPulse}% Match</p>
                 </div>
                 <div className="bg-secondary/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-border">
                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5">Employment Stability</p>
                    <p className="text-xl md:text-2xl font-bold text-primary">{candidate.retentionRisk}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mt-4">
                 <div className="bg-secondary/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-border">
                    <div className="flex items-center gap-2 text-primary">
                      <FileBadge2 className="w-4 h-4" />
                      <p className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Resume ID</p>
                    </div>
                    <p className="mt-2 text-lg md:text-xl font-bold text-primary">{candidate.resumeId}</p>
                 </div>
                 <div className="bg-secondary/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-border">
                    <div className="flex items-center gap-2 text-primary">
                      <IdCard className="w-4 h-4" />
                      <p className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Passport ID</p>
                    </div>
                    <p className="mt-2 text-lg md:text-xl font-bold text-primary">{candidate.passportId}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Portfolio Strengths Dashboard */}
        <div className="bg-white p-8 md:p-10 rounded-3xl md:rounded-[40px] border border-border shadow-sm space-y-6 md:space-y-8">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/5 text-primary rounded-lg border border-primary/10">
                 <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm md:text-base text-primary uppercase tracking-[0.2em]">Portfolio Strengths</h3>
           </div>
           <ul className="space-y-6 md:space-y-8">
              {candidate.strengths.map((item, i) => (
                <li key={i} className="flex gap-4 md:gap-5 items-start">
                   <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                   <div>
                      <p className="font-bold text-primary mb-1 text-base md:text-lg tracking-tight">{item.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                   </div>
                </li>
              ))}
           </ul>
        </div>

        {/* Growth Observations Dashboard */}
        <div className="bg-white p-8 md:p-10 rounded-3xl md:rounded-[40px] border border-border shadow-sm space-y-6 md:space-y-8">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/5 text-accent rounded-lg border border-accent/10">
                 <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm md:text-base text-primary uppercase tracking-[0.2em]">Growth Observations</h3>
           </div>
           <ul className="space-y-6 md:space-y-8">
              {candidate.gaps.map((item, i) => (
                <li key={i} className="flex gap-4 md:gap-5 items-start">
                   <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                   <div>
                      <p className="font-bold text-primary mb-1 text-base md:text-lg tracking-tight">{item.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                   </div>
                </li>
              ))}
           </ul>
        </div>
      </div>

      {/* Skill Matrix Dashboard */}
      <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-border shadow-sm">
        <SkillMatrix 
          skills={[
            { label: "Backend Systems (Go, Node.js)", score: 9.2, benchmark: 8.5 },
            { label: "Database Architecture (Postgres, Redis)", score: 8.8, benchmark: 8.0 },
            { label: "DevOps & CI/CD", score: 8.5, benchmark: 7.5 },
            { label: "Product Strategy Alignment", score: 7.9, benchmark: 8.2 }
          ]}
        />
      </div>

      {/* Action Bar Dashboard */}
      <div className="fixed bottom-6 md:bottom-10 left-4 right-4 md:left-[calc(50%+144px)] md:-translate-x-1/2 w-auto md:w-[calc(100%-288px)] max-w-6xl bg-white border border-border shadow-lg p-3 md:p-5 rounded-3xl md:rounded-[32px] flex items-center justify-between z-50 animate-in slide-in-from-bottom-10">
        <div className="flex items-center gap-2 md:gap-4 lg:pl-6">
           <span className="hidden sm:inline text-[9px] md:text-[10px] font-extrabold text-primary/40 uppercase tracking-[0.2em] whitespace-nowrap">Status:</span>
           <div className="flex items-center gap-2 bg-primary text-white px-3 md:px-5 py-2 md:py-2.5 rounded-2xl">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Active Search</span>
           </div>
        </div>
        <div className="flex gap-2 md:gap-4">
           <button className="hidden sm:block btn-secondary btn-md text-red-500 border-red-100 hover:bg-red-50">Reject</button>
           <button className="btn-secondary btn-md border-primary text-primary">Shortlist</button>
        </div>
      </div>

    </div>
  );
}
