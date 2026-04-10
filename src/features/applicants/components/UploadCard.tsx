"use client";

import { UploadCloud, FileText } from "lucide-react";
import { cn } from "@/utils/cn";

export function UploadCard() {
  return (
    <div className="bg-white p-10 rounded-[40px] border border-dashed border-border flex flex-col items-center justify-center text-center space-y-6 premium-shadow">
      <div className="w-20 h-20 bg-secondary rounded-[32px] flex items-center justify-center text-primary border border-border">
        <UploadCloud className="w-10 h-10" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-primary">Ingest Candidates</h3>
        <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
          Drag and drop your PDF resumes, CSV talent pools, or Excel exports here to begin AI-assisted screening.
        </p>
      </div>

      <div className="flex gap-2">
        {["PDF", "CSV", "XLSX"].map(ext => (
          <span key={ext} className="bg-secondary px-3 py-1.5 rounded-lg text-[10px] font-bold text-primary/60 border border-border">
            .{ext}
          </span>
        ))}
      </div>

      <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 max-w-[200px]">
        Browse Files
      </button>
    </div>
  );
}

export function ScreeningProgress() {
  return (
    <div className="bg-white p-8 rounded-3xl border border-border premium-shadow space-y-4">
      <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active Screening Progress</h4>
      <div className="space-y-2">
         <div className="flex justify-between items-end">
           <span className="text-xs font-bold text-primary">Success Rate</span>
           <span className="text-lg font-bold text-primary">98.2%</span>
         </div>
         <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
           <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "98.2%" }}></div>
         </div>
      </div>
    </div>
  );
}
