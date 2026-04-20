"use client";

import { useMemo, useState } from "react";
import { UploadCard, ScreeningProgress } from "@/features/applicants/components/UploadCard";
import { ApplicantUploadEntry, UploadsTable } from "@/features/applicants/components/UploadsTable";
import { CheckCircle2, FileSpreadsheet, FileText, ListChecks } from "lucide-react";

export default function ApplicantsPage() {
  const [uploads, setUploads] = useState<ApplicantUploadEntry[]>([]);

  const queueFiles = (files: File[]) => {
    const nowLabel = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());

    const nextUploads = files.map<ApplicantUploadEntry>((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      const source: ApplicantUploadEntry["source"] =
        extension === "pdf"
          ? "Resume"
          : extension === "csv" || extension === "xlsx" || extension === "xls"
            ? "Spreadsheet"
            : "Platform";

      return {
        id: `${file.name}-${file.lastModified}-${file.size}`,
        name: file.name,
        count: 1,
        date: `Added at ${nowLabel}`,
        status: "Ready",
        score: null,
        source,
      };
    });

    setUploads((current) => {
      const seen = new Set(current.map((item) => item.id));
      const deduped = nextUploads.filter((item) => !seen.has(item.id));
      return [...deduped, ...current];
    });
  };

  const screeningProgress = useMemo(() => {
    const totalUploads = uploads.length;
    return {
      structured: totalUploads ? Math.min(100, 76 + totalUploads * 4) : 76,
      normalization: totalUploads ? Math.min(100, 58 + totalUploads * 6) : 58,
    };
  }, [uploads]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 pb-16">
      <div className="soft-panel grid gap-6 p-6 md:grid-cols-[1.4fr_1fr] md:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Applicant ingestion</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-primary">
            Bring every applicant into one simple review pipeline.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            This view supports the two hackathon scenarios: Umurava structured profiles and
            external uploads like CSV, Excel, PDF, or resume links. The goal is to keep intake
            clear for recruiters before backend parsing is connected.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
          {[
            { icon: ListChecks, label: "Structured profiles", text: "Map schema-aligned talent records" },
            { icon: FileSpreadsheet, label: "Spreadsheet uploads", text: "Import CSV or Excel applicant lists" },
            { icon: FileText, label: "Resume uploads", text: "Prepare PDFs and links for parsing" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-border bg-secondary p-4">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-bold text-primary">{item.label}</p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-12">
        <div className="order-2 space-y-6 lg:col-span-4 lg:order-1">
          <UploadCard onFilesSelected={queueFiles} />
          <ScreeningProgress
            structuredProgress={screeningProgress.structured}
            normalizationProgress={screeningProgress.normalization}
          />
          <div className="soft-panel p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Intake checklist</p>
            <div className="mt-5 space-y-4">
              {[
                "Collect the job brief before uploading applicants",
                "Keep source labels visible so recruiters know where candidates came from",
                "Prepare explainable ranking notes for every shortlisted profile",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 lg:col-span-8 lg:order-2">
          <UploadsTable uploads={uploads} />
        </div>
      </div>
    </div>
  );
}
