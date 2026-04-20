import { JobPostingRow } from "@/features/dashboard/components/JobPostingRow";
import { Plus, Search, Filter, Sparkles } from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  const jobs = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Kigali / Remote",
      progress: 82,
      applicants: 62,
      matched: 12,
      icon: "code" as const,
    },
    {
      title: "Product Designer",
      department: "Design",
      type: "Contract",
      location: "Remote",
      progress: 55,
      applicants: 31,
      matched: 8,
      icon: "design" as const,
    },
    {
      title: "Data Analyst",
      department: "Operations",
      type: "Full-time",
      location: "Hybrid",
      progress: 40,
      applicants: 93,
      matched: 14,
      icon: "research" as const,
    },
    {
      title: "Backend Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      progress: 18,
      applicants: 19,
      matched: 4,
      icon: "code" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      <div className="soft-panel grid gap-6 p-6 md:grid-cols-[1.4fr_0.8fr] md:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Job intake</p>
          <h2 className="mt-3 text-3xl font-black text-primary">Build role briefs recruiters can trust.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Keep the setup simple: define the role, capture the must-have signals, and prepare
            a clean scoring model that your backend team can later wire into Gemini.
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-secondary p-5">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4 text-accent" />
            <p className="text-sm font-bold">Suggested scoring model</p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>Skills fit: 40%</p>
            <p>Relevant experience: 30%</p>
            <p>Role relevance and impact: 20%</p>
            <p>Education and certifications: 10%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h3 className="text-2xl font-bold text-primary">Open jobs</h3>
          <p className="text-sm text-muted-foreground">
            {jobs.length} active positions currently feeding the screening workflow.
          </p>
        </div>
        <Link
          href="/jobs/create"
          className="flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          New job brief
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by role, department, or keyword..."
            className="w-full rounded-xl border border-border bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-bold text-primary transition-all hover:bg-secondary">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map((job, i) => (
          <JobPostingRow key={i} {...job} />
        ))}
      </div>
    </div>
  );
}
