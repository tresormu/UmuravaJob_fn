import { ShortlistStats } from "@/features/shortlists/components/ShortlistStats";
import { RankedTable } from "@/features/shortlists/components/RankedTable";
import { CuratorInsights } from "@/features/shortlists/components/CuratorInsights";

export default function ShortlistPage() {
  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-24">
      {/* Stats Overview Dashboard */}
      <ShortlistStats />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Ranked List Dashboard */}
        <div className="lg:col-span-8 space-y-8">
           <RankedTable />
        </div>

        {/* Floating AI Insights Dashboard */}
        <div className="lg:col-span-4">
           <CuratorInsights />
        </div>
      </div>
    </div>
  );
}
