"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Link2,
  FileText,
  BadgeCheck,
  Tag,
  Calendar,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchApplicantById,
  type ApplicantRecord,
} from "@/services/applicantsService";

export default function ApplicantDetailPage() {
  const params = useParams();
  const applicantId = params.slug as string;
  const { accessToken } = useAuth();

  const [applicant, setApplicant] = useState<ApplicantRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadApplicant = async () => {
      if (!accessToken) {
        if (isActive) {
          setError("Your session expired. Sign in again to load applicant details.");
          setIsLoading(false);
        }
        return;
      }

      try {
        setError(null);
        const nextApplicant = await fetchApplicantById(accessToken, applicantId);
        if (isActive) {
          setApplicant(nextApplicant);
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn't load this applicant.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadApplicant();

    return () => {
      isActive = false;
    };
  }, [accessToken, applicantId]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <Link href="/applicants" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Applicants
        </Link>
        <div className="soft-panel p-10 text-center">
          <h2 className="text-2xl font-black text-primary">Loading applicant profile</h2>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Pulling the latest details from the backend.
          </p>
        </div>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <Link href="/applicants" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Applicants
        </Link>
        <div className="soft-panel p-10 text-center">
          <h2 className="text-2xl font-black text-primary">Applicant not available</h2>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {error ?? "This applicant record could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <Link href="/applicants" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Applicants
      </Link>

      <section className="relative overflow-hidden rounded-[2.5rem] bg-primary text-white p-8 md:p-12">
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white/10 blur-3xl translate-x-20 -translate-y-20" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10">
              <UserCheck className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {applicant.workflowStatus}
              </span>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">{applicant.name}</h1>
              <p className="mt-2 text-white/75 text-lg font-medium">{applicant.role}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {applicant.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 min-w-[240px]">
            <div className="rounded-[1.5rem] bg-white/10 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">AI score</p>
              <p className="mt-2 text-3xl font-black">{applicant.score}%</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Source</p>
              <p className="mt-2 text-lg font-black uppercase">{applicant.source}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="soft-panel p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Contact and profile</h2>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Real backend data captured for this candidate so far.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard icon={Mail} label="Email" value={applicant.email ?? "Not provided"} />
            <InfoCard icon={Phone} label="Phone" value={applicant.phone ?? "Not provided"} />
            <InfoCard icon={MapPin} label="Location" value={applicant.location ?? "Not provided"} />
            <InfoCard
              icon={BadgeCheck}
              label="Shortlist status"
              value={applicant.isShortlisted ? "Shortlisted" : "Not shortlisted"}
            />
          </div>

          {(applicant.linkedInUrl || applicant.portfolioUrl || applicant.resumeUrl) && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-primary">Links</h3>
              <div className="grid gap-3">
                {applicant.linkedInUrl && (
                  <ExternalLink label="LinkedIn" href={applicant.linkedInUrl} />
                )}
                {applicant.portfolioUrl && (
                  <ExternalLink label="Portfolio" href={applicant.portfolioUrl} />
                )}
                {applicant.resumeUrl && (
                  <ExternalLink label={applicant.resumeFileName ?? "Resume"} href={applicant.resumeUrl} />
                )}
              </div>
            </div>
          )}

          {applicant.aiSummary && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-primary">AI summary</h3>
              <div className="rounded-[1.5rem] border border-border/50 bg-secondary/40 px-5 py-4 text-sm leading-7 text-primary/80">
                {applicant.aiSummary}
              </div>
            </div>
          )}

          {applicant.resumeText && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-primary">Resume text excerpt</h3>
              <div className="rounded-[1.5rem] border border-border/50 bg-secondary/40 px-5 py-4 text-sm leading-7 text-primary/80 max-h-72 overflow-y-auto whitespace-pre-wrap">
                {applicant.resumeText}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <DataList
            title="Skills"
            icon={Tag}
            items={applicant.skills}
            emptyLabel="No structured skills captured yet."
          />
          <DataList
            title="Experience"
            icon={FileText}
            items={applicant.experience}
            emptyLabel="No structured experience extracted yet."
          />
          <DataList
            title="Education"
            icon={BadgeCheck}
            items={applicant.education}
            emptyLabel="No education details captured yet."
          />
          <DataList
            title="Projects"
            icon={Calendar}
            items={applicant.projects}
            emptyLabel="No project details captured yet."
          />
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border/50 bg-white px-5 py-4">
      <div className="flex items-center gap-2 text-primary/60">
        <Icon className="w-4 h-4" />
        <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className="mt-3 text-sm font-bold text-primary break-words">{value}</p>
    </div>
  );
}

function ExternalLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-[1.25rem] border border-border/50 bg-white px-4 py-3 text-sm font-bold text-primary hover:border-primary/20 hover:bg-secondary/30 transition-all"
    >
      <span>{label}</span>
      <Link2 className="w-4 h-4 text-muted-foreground" />
    </a>
  );
}

function DataList({
  title,
  icon: Icon,
  items,
  emptyLabel,
}: {
  title: string;
  icon: typeof Tag;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <div className="soft-panel p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-black text-primary">{title}</h3>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <span
              key={item}
              className="px-3 py-2 rounded-full bg-secondary text-primary text-xs font-bold"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground font-medium">{emptyLabel}</p>
      )}
    </div>
  );
}
