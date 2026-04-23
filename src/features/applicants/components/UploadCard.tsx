"use client";

import { useRef, useState } from "react";
import { AlertCircle, FileSpreadsheet, Link2, UploadCloud, Info } from "lucide-react";
import { cn } from "@/utils/cn";

interface UploadCardProps {
  onFilesSelected?: (files: File[]) => void;
  isUploading?: boolean;
  className?: string;
}

const ACCEPTED_EXTENSIONS = [".json", ".csv", ".xlsx", ".xls", ".pdf"];

export function UploadCard({ onFilesSelected, isUploading, className }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Clear feedback when uploading finishes
  if (!isUploading && feedback?.includes("Processing")) {
    setFeedback(null);
  }

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const nextFiles = Array.from(list);
    const validFiles = nextFiles.filter((file) => {
      const fileName = file.name.toLowerCase();
      return ACCEPTED_EXTENSIONS.some((extension) => fileName.endsWith(extension));
    });

    if (!validFiles.length) {
      setFeedback("Unsupported format. Please use JSON, CSV, XLSX, or PDF.");
      return;
    }

    if (onFilesSelected) {
      setFeedback(`Processing ${validFiles.length} file(s)...`);
      onFilesSelected(validFiles);
    } else {
      setFeedback("Intake not yet connected here.");
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("soft-panel p-8 space-y-6", className)}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <UploadCloud className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-primary">Intake Source</h3>
      </div>

      <div
        className={cn(
          "border-2 border-dashed border-border/50 rounded-2xl p-8 transition-all flex flex-col items-center text-center space-y-4 cursor-pointer hover:border-primary/20 hover:bg-secondary/30",
          isDragging && "border-primary bg-primary/5"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
          <FileSpreadsheet className="w-6 h-6" />
        </div>

        <div>
          <p className="text-sm font-bold text-primary">Drop files to parse</p>
          <p className="text-[11px] text-muted-foreground mt-1">Supports PDF, CSV, Excel, and JSON</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl">
          <Info className="w-4 h-4 text-primary mt-0.5" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Source Labeling</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Applicants will be automatically tagged with their source file name for tracking.</p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-xl">
          <AlertCircle className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{feedback}</span>
        </div>
      )}
    </div>
  );
}
