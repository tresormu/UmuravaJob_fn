"use client";

import { useRef, useState } from "react";
import { AlertCircle, FileSpreadsheet, Link2, UploadCloud } from "lucide-react";

interface UploadCardProps {
  onFilesSelected: (files: File[]) => void;
}

const ACCEPTED_EXTENSIONS = [".json", ".csv", ".xlsx", ".xls", ".pdf"];

export function UploadCard({ onFilesSelected }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const pickFiles = () => {
    inputRef.current?.click();
  };

  const handleFiles = (list: FileList | null) => {
    if (!list) return;

    const nextFiles = Array.from(list);
    const validFiles = nextFiles.filter((file) => {
      const fileName = file.name.toLowerCase();
      return ACCEPTED_EXTENSIONS.some((extension) => fileName.endsWith(extension));
    });

    if (!validFiles.length) {
      setFeedback("Only JSON, CSV, XLSX, XLS, and PDF files are supported right now.");
      return;
    }

    const rejectedCount = nextFiles.length - validFiles.length;
    if (rejectedCount > 0) {
      setFeedback(`${rejectedCount} unsupported file(s) were skipped.`);
    } else {
      setFeedback(`${validFiles.length} file(s) added to the upload queue.`);
    }

    onFilesSelected(validFiles);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      className={`soft-panel flex flex-col items-center justify-center space-y-6 border-dashed p-10 text-center transition-all ${
        isDragging ? "border-primary bg-secondary/80" : ""
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS.join(",")}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <div className="flex h-20 w-20 items-center justify-center rounded-[32px] border border-border bg-secondary text-primary">
        <UploadCloud className="w-10 h-10" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-primary">Upload applicant sources</h3>
        <p className="max-w-[320px] text-sm leading-relaxed text-muted-foreground">
          Prepare recruiter-friendly intake for schema-based profiles, spreadsheet exports, or
          external resume documents.
        </p>
      </div>

      <div className="grid w-full gap-3 text-left sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-secondary p-4">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <p className="mt-3 text-sm font-bold text-primary">Structured and spreadsheet sources</p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">Talent schema JSON, CSV, and Excel files.</p>
        </div>
        <div className="rounded-2xl border border-border bg-secondary p-4">
          <Link2 className="h-5 w-5 text-primary" />
          <p className="mt-3 text-sm font-bold text-primary">External resume sources</p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">PDF resumes, portfolio links, and job board exports.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[".JSON", ".CSV", ".XLSX", ".PDF"].map((ext) => (
          <span key={ext} className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-[10px] font-bold text-primary/60">
            {ext}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={pickFiles}
        className="w-full max-w-[220px] rounded-2xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
      >
        Browse sources
      </button>

      <p className="text-xs text-muted-foreground">
        Drag and drop files here, or browse from your device.
      </p>

      {feedback && (
        <div className="flex w-full items-start gap-3 rounded-2xl border border-border bg-secondary px-4 py-3 text-left text-sm text-primary">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
}

interface ScreeningProgressProps {
  structuredProgress: number;
  normalizationProgress: number;
}

export function ScreeningProgress({
  structuredProgress,
  normalizationProgress,
}: ScreeningProgressProps) {
  return (
    <div className="soft-panel space-y-5 p-8">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current screening readiness</h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-xs font-bold text-primary">Schema-mapped profiles</span>
            <span className="text-lg font-bold text-primary">{structuredProgress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${structuredProgress}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-xs font-bold text-primary">Upload normalization</span>
            <span className="text-lg font-bold text-primary">{normalizationProgress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-accent transition-all duration-1000" style={{ width: `${normalizationProgress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
