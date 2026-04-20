"use client";

import { FileText, MoreVertical, ListRestart, SlidersHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ApplicantUploadEntry {
  id: string;
  name: string;
  count: number;
  date: string;
  status: "Parsing" | "Ready" | "Failed";
  score: number | null;
  source: "Platform" | "Resume" | "Spreadsheet" | "Link";
}

const seedUploads: ApplicantUploadEntry[] = [
  {
    id: "seed-platform-frontend",
    name: "Frontend Engineer - Umurava Profiles",
    count: 24,
    date: "Structured schema import",
    status: "Parsing",
    score: null,
    source: "Platform",
  },
  {
    id: "seed-resume-product",
    name: "Product Designer - External CVs",
    count: 18,
    date: "PDF batch upload",
    status: "Ready",
    score: 88,
    source: "Resume",
  },
  {
    id: "seed-sheet-ops",
    name: "Operations Analyst - Referral Sheet",
    count: 41,
    date: "CSV upload",
    status: "Ready",
    score: 91,
    source: "Spreadsheet",
  },
  {
    id: "seed-link-sales",
    name: "Sales Associate - External Links",
    count: 9,
    date: "Manual URL import",
    status: "Failed",
    score: null,
    source: "Link",
  },
];

interface UploadsTableProps {
  uploads?: ApplicantUploadEntry[];
}

export function UploadsTable({ uploads = [] }: UploadsTableProps) {
  const allUploads = [...uploads, ...seedUploads];

  return (
    <div className="soft-panel overflow-hidden">
      <div className="p-6 md:p-10 flex items-center justify-between border-b border-border">
        <div>
           <h3 className="text-lg md:text-xl font-bold text-primary tracking-tight">Recent applicant sources</h3>
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1 opacity-60">What is ready for screening</p>
        </div>
        <div className="flex gap-2 md:gap-4">
           <button className="p-2.5 text-muted-foreground hover:bg-secondary rounded-xl border border-transparent hover:border-border transition-all">
              <SlidersHorizontal className="w-5 h-5" />
           </button>
           <button className="p-2.5 text-muted-foreground hover:bg-secondary rounded-xl border border-transparent hover:border-border transition-all">
              <ListRestart className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="w-full">
        <div className="hidden md:grid grid-cols-[3fr_1fr_0.9fr_1.6fr_60px] px-10 py-5 bg-secondary text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em] border-b border-border/50">
           <div className="text-left">Batch Identification</div>
           <div className="text-center">Source</div>
           <div className="text-center">Status</div>
           <div className="text-center whitespace-nowrap">Avg Alignment</div>
           <div className="text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-border/50">
          {allUploads.map((upload) => (
            <div key={upload.id} className="flex flex-col md:grid md:grid-cols-[3fr_1fr_0.9fr_1.6fr_60px] px-6 md:px-10 py-6 md:py-8 items-start md:items-center hover:bg-secondary/30 transition-all group gap-5 md:gap-0">
               <div className="flex items-center gap-5 min-w-0 w-full md:w-auto">
                  <div className={cn(
                    "w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 shadow-sm border border-border group-hover:scale-110",
                    upload.status === "Failed" ? "bg-red-50 text-red-500" : "bg-white text-primary group-hover:bg-primary group-hover:text-white"
                  )}>
                     <FileText className="w-5 h-5 transition-transform group-hover:rotate-6" />
                  </div>
                  <div className="truncate">
                    <h5 className="font-bold text-primary text-sm md:text-lg leading-none tracking-tight truncate">{upload.name}</h5>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2 opacity-40">{upload.date}</p>
                    <p className="mt-2 text-xs text-muted-foreground md:hidden">{upload.count} applicants</p>
                  </div>
               </div>
               
               <div className="md:text-center w-full md:w-auto flex justify-between items-center md:block px-4 py-2 md:p-0 bg-secondary/10 md:bg-transparent rounded-xl md:rounded-none">
                  <span className="md:hidden text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Source</span>
                  <div className="space-y-1">
                    <span className="block text-xs md:text-sm font-bold text-primary/70">{upload.source}</span>
                    <span className="block text-[11px] text-muted-foreground">{upload.count} applicants</span>
                  </div>
               </div>

               <div className="flex md:justify-center w-full md:w-auto">
                  <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[9px] font-black border flex items-center gap-1.5 shadow-sm whitespace-nowrap tracking-wide uppercase",
                    upload.status === "Parsing" ? "bg-primary/5 text-primary border-primary/10" :
                    upload.status === "Ready" ? "bg-green-50 text-green-700 border-green-100" :
                    "bg-red-50 text-red-700 border-red-100"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", 
                      upload.status === "Parsing" ? "bg-primary animate-pulse" :
                      upload.status === "Ready" ? "bg-green-500" : 
                      "bg-red-500"
                    )} />
                    {upload.status}
                  </span>
               </div>

               <div className="flex md:justify-center items-center gap-4 w-full md:w-auto border-t md:border-none border-border/50 pt-4 md:pt-0">
                  <span className="md:hidden text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] flex-1">Avg Alignment</span>
                  <div className="flex items-center gap-3">
                    {upload.score ? (
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:block w-12 md:w-24 h-1.5 bg-secondary rounded-full overflow-hidden border border-border/10">
                          <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${upload.score}%` }} />
                        </div>
                        <span className="text-sm font-black text-primary min-w-[32px]">{upload.score}%</span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black text-muted-foreground opacity-20 tracking-[0.2em] uppercase">
                        {upload.status === "Failed" ? "UNSUPPORTED" : "ANALYZING"}
                      </span>
                    )}
                  </div>
               </div>

               <div className="flex justify-end items-center w-full md:w-auto">
                  <span className="md:hidden text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] flex-1">Actions</span>
                  <button className={cn(
                    "p-2 text-muted-foreground hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm border border-transparent hover:border-primary/20 group/dots",
                    upload.status === "Ready" ? "relative" : ""
                  )}>
                     <MoreVertical className="w-5 h-5 opacity-40 group-hover/dots:opacity-100" />
                     {upload.status === "Ready" && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white animate-bounce shadow-sm" />
                     )}
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
