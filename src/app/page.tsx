import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { JobPostingRow } from "@/features/dashboard/components/JobPostingRow";
import { InsightCard } from "@/features/dashboard/components/InsightCard";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Welcome & Top section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Portfolio Overview</h2>
          <p className="text-sm text-muted-foreground font-medium">Monitoring active search workflows and candidate pipeline health.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-border shadow-sm self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-primary opacity-60" />
          <span className="text-sm font-bold text-primary">October 24, 2023</span>
        </div>
      </div>

      {/* Stats Cards Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          label="Total Candidates" 
          value="1,284" 
          trend="12%" 
          icon="users" 
        />
        <StatsCard 
          label="Placement Rate" 
          value="84%" 
          trend="8% above target" 
          icon="completed" 
        />
        <div className="sm:col-span-2 lg:col-span-1 bg-white p-6 rounded-3xl border border-border flex items-center gap-6 text-primary shadow-sm relative overflow-hidden">
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-2">Pending Reviews</p>
            <h3 className="text-3xl md:text-4xl font-bold">18</h3>
            <p className="text-xs text-muted-foreground mt-3 font-medium">Candidate profiles awaiting final matching confirmation.</p>
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-primary/5 rounded-2xl">
             <Calendar className="w-8 h-8 md:w-10 md:h-10 text-primary opacity-40" />
          </div>
        </div>
      </div>

      {/* Active Job Postings Dashboard */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-primary">Active Job Postings</h3>
          <button className="text-sm font-bold text-primary hover:underline">View All &rarr;</button>
        </div>
        <div className="space-y-4">
          <JobPostingRow 
            title="Senior Frontend Engineer"
            department="Engineering"
            type="Full-time"
            location="Remote"
            progress={75}
            applicants={142}
            matched={12}
            icon="code"
          />
          <JobPostingRow 
            title="Lead Product Designer"
            department="Design"
            type="Full-time"
            location="London"
            progress={30}
            applicants={86}
            matched={5}
            icon="design"
          />
          <JobPostingRow 
            title="AI Research Scientist"
            department="Research"
            type="Full-time"
            location="Remote"
            progress={92}
            applicants={215}
            matched={38}
            icon="research"
          />
        </div>
      </div>

      {/* Bottom section: Insights & Activity Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <InsightCard />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

