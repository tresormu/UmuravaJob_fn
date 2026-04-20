import { ShortlistStats } from "@/features/shortlists/components/ShortlistStats";
import { RankedTable } from "@/features/shortlists/components/RankedTable";
import { CuratorInsights } from "@/features/shortlists/components/CuratorInsights";

export default function ShortlistPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-10 pb-24">
      <div className="soft-panel grid gap-6 p-6 md:grid-cols-[1.4fr_0.9fr] md:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Ranked shortlist</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-primary">
            Show recruiters who rose to the top and why.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            The shortlist screen should feel trustworthy: consistent ranking, clear strengths,
            visible gaps, and obvious approve or reject actions so the recruiter makes the final call.
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-secondary p-5">
          <p className="text-sm font-bold text-primary">Review principles</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>Every candidate shows strengths and risks together.</p>
            <p>Final recommendation remains advisory, not automatic.</p>
            <p>Shortlisted candidates can now be approved or rejected directly from the list.</p>
            <p>Top 10 and Top 20 output can be supported later by backend config.</p>
          </div>
        </div>
      </div>

      <ShortlistStats />

      <div className="grid grid-cols-1 gap-10 items-start lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
           <RankedTable />
        </div>

        <div className="lg:col-span-4">
           <CuratorInsights />
        </div>
      </div>
    </div>
  );
}
