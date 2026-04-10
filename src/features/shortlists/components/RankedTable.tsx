"use client";

import { ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

const candidates = [
  {
    rank: "01",
    name: "Elena Rodriguez",
    slug: "elena-rodriguez",
    role: "Senior Software Architect",
    score: 98,
    category: "High Alignment",
    tags: ["SYSTEM DESIGN", "LEADERSHIP", "GO / RUST"],
  },
  {
    rank: "02",
    name: "Marcus Thorne",
    slug: "marcus-thorne",
    role: "Principal Engineer",
    score: 95,
    category: "High Alignment",
    tags: ["K8S / AWS", "SCALABILITY", "TYPESCRIPT"],
  },
  {
    rank: "03",
    name: "Sarah Chen",
    slug: "sarah-chen",
    role: "Full Stack Developer",
    score: 89,
    category: "High",
    tags: ["REACT / NODE", "API DEV", "PYTHON"],
  },
];


export function RankedTable() {
  return (
    <div className="bg-white rounded-3xl md:rounded-[40px] border border-border shadow-sm overflow-hidden">
      <div className="hidden md:grid grid-cols-12 px-10 py-5 bg-secondary text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">
         <div className="col-span-4">Candidate Profile</div>
         <div className="col-span-2 text-center">Alignment Score</div>
         <div className="col-span-6 text-right pr-10">Competencies & Analysis</div>
      </div>
      
      <div className="divide-y divide-border/50">
        {candidates.map((c, i) => (
          <div key={i} className="flex flex-col md:grid md:grid-cols-12 px-6 md:px-10 py-6 md:py-8 md:items-center group hover:bg-secondary transition-colors gap-6 md:gap-0">
            {/* Rank & Profile Dashboard */}
            <div className="col-span-4 flex items-center gap-6 md:gap-8">
               <span className="text-2xl md:text-3xl font-black text-primary/10 group-hover:text-primary/20 transition-colors flex-shrink-0">{c.rank}</span>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0 shadow-sm">
                     <User className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-primary text-lg md:text-xl leading-none tracking-tight">{c.name}</h4>
                    <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">{c.role}</p>
                  </div>
               </div>
            </div>

            {/* Alignment Dashboard */}
            <div className="col-span-2 flex flex-row md:flex-col items-center gap-4 md:gap-2 border-y md:border-none border-border/50 py-4 md:py-0">
               <div className="block md:hidden text-[10px] font-black text-muted-foreground uppercase tracking-widest flex-1">Alignment</div>
               <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-black text-primary">{c.score}</span>
                  <span className="text-[10px] font-bold text-muted-foreground opacity-40">%</span>
               </div>
               <div className="w-20 md:w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={cn(
                    "h-full rounded-full transition-all duration-1000 bg-primary"
                  )} style={{ width: `${c.score}%` }} />
               </div>
               <span className="text-[9px] font-bold uppercase text-primary/60">{c.category}</span>
            </div>

            {/* Strengths & Actions Dashboard */}
            <div className="col-span-6 flex flex-col sm:flex-row md:flex-row items-stretch md:items-center justify-end gap-6 md:gap-10 w-full">
               <div className="flex flex-wrap gap-2 md:justify-end">
                  {c.tags.map(tag => (
                    <span key={tag} className="px-3 md:px-4 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold tracking-tight bg-white border border-border text-primary/70 shadow-sm whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
               </div>
               
               <Link 
                  href={`/applicants/${c.slug}`}
                  className="btn-primary md:btn-secondary btn-sm gap-2 transition-all group/btn whitespace-nowrap shadow-sm"
               >
                  Profile
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
               </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
