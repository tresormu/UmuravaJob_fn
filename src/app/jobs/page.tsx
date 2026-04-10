import { JobPostingRow } from "@/features/dashboard/components/JobPostingRow";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  const jobs = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      progress: 75,
      applicants: 142,
      matched: 12,
      icon: "code" as const,
    },
    {
      title: "Lead Product Designer",
      department: "Design",
      type: "Full-time",
      location: "London",
      progress: 30,
      applicants: 86,
      matched: 5,
      icon: "design" as const,
    },
    {
      title: "AI Research Scientist",
      department: "Research",
      type: "Full-time",
      location: "Remote",
      progress: 92,
      applicants: 215,
      matched: 38,
      icon: "research" as const,
    },
    {
      title: "Backend Team Lead",
      department: "Engineering",
      type: "Full-time",
      location: "Hybrid",
      progress: 10,
      applicants: 45,
      matched: 2,
      icon: "code" as const,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-end border-b border-border pb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">Job Management</h2>
          <p className="text-muted-foreground">You have <span className="text-primary font-bold">{jobs.length} Active Positions</span> in your pipeline.</p>
        </div>
        <Link 
          href="/jobs/create" 
          className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Create New Job
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by job title or keywords..."
            className="w-full bg-white border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-border px-6 py-3.5 rounded-xl text-sm font-bold text-primary hover:bg-secondary transition-all">
          <Filter className="w-4 h-4" />
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

