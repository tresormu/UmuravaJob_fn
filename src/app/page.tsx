import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { JobPostingRow } from "@/features/dashboard/components/JobPostingRow";
import { InsightCard } from "@/features/dashboard/components/InsightCard";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <section className="soft-panel overflow-hidden">
          <div className="border-b border-border px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Recruiter Command Center
          </div>
          <div className="space-y-6 px-6 py-8 md:px-8 md:py-10">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl font-black tracking-tight text-primary md:text-5xl">
                Screen talent faster, keep hiring decisions human.
              </h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                This UI is designed around the Umurava hackathon brief: create jobs, ingest
                structured profiles or external resumes, generate a ranked shortlist, and give
                recruiters clear reasons for every recommendation.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs/create" className="btn-primary btn-lg gap-2">
                Create job brief
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/shortlists" className="btn-secondary btn-lg gap-2">
                Review shortlist
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                "Structured Umurava profiles supported",
                "CSV, Excel, and PDF intake prepared",
                "Explainable Top 10 or Top 20 workflow",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-secondary px-4 py-4 text-sm font-semibold text-primary">
                  <div className="mb-2 flex items-center gap-2 text-accent">
                    <CheckCircle2 className="h-4 w-4" />
                    Ready
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="soft-panel p-6 md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Why this matters
          </p>
          <div className="mt-6 space-y-5">
            {[
              {
                title: "High application volume",
                body: "Recruiters need a quicker first-pass review without losing judgment or context.",
              },
              {
                title: "Objective comparison",
                body: "Candidates arrive in mixed formats, so the product must normalize and explain ranking decisions.",
              },
              {
                title: "Human-in-control",
                body: "AI assists with screening, while final shortlist approval stays with the recruiter.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-white p-4">
                <h3 className="font-bold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Open Roles" value="04" trend="2 ready to shortlist" icon="jobs" />
        <StatsCard label="Profiles In Review" value="186" trend="Across 3 active sources" icon="users" />
        <StatsCard label="Pending Decisions" value="14" trend="Human review needed" icon="pending" />
        <StatsCard label="Completed Shortlists" value="03" trend="This week" icon="completed" />
      </div>

      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-primary">Active hiring pipelines</h3>
            <p className="text-sm text-muted-foreground">
              Simple recruiter view of jobs currently moving through screening.
            </p>
          </div>
          <Link href="/jobs" className="text-sm font-bold text-primary hover:underline">
            View all jobs
          </Link>
        </div>
        <div className="space-y-4">
          <JobPostingRow
            title="Senior Frontend Engineer"
            department="Engineering"
            type="Full-time"
            location="Kigali / Remote"
            progress={82}
            applicants={62}
            matched={12}
            icon="code"
          />
          <JobPostingRow title="Product Designer" department="Design" type="Contract" location="Remote" progress={55} applicants={31} matched={8} icon="design" />
          <JobPostingRow title="Data Analyst" department="Operations" type="Full-time" location="Hybrid" progress={40} applicants={93} matched={14} icon="research" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
          <InsightCard />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
