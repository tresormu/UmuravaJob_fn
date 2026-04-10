import { Target, FileText, Activity, TrendingUp } from "lucide-react";

export function CuratorInsights() {
  return (
    <div className="bg-white rounded-3xl md:rounded-[40px] border border-border shadow-sm overflow-hidden sticky top-24">
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-sm">
             <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary leading-tight">Match Insights</h3>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-0.5 opacity-60">Strategic Intelligence</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Trend Alert Dashboard */}
          <div className="bg-secondary/50 p-6 rounded-3xl border border-border space-y-4">
             <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h5 className="font-extrabold text-[12px] text-primary">Trend Alert:</h5>
             </div>
             <p className="text-xs text-primary font-medium leading-relaxed">
               Elena Rodriguez and Marcus Thorne have <span className="font-extrabold underline">overlapping core competencies</span>. Consider Rodriguez for lead architectural roles and Thorne for specialized implementation.
             </p>
          </div>

          <div className="bg-secondary/30 p-6 rounded-3xl border border-border italic text-primary/70 text-xs leading-relaxed relative">
             <Activity className="absolute -top-1 -right-1 w-4 h-4 text-primary opacity-20" />
             "Sarah Chen's background in fintech provides a unique domain advantage that offsets a slightly lower core technical alignment score."
          </div>

          <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-sm group">
             Full Analysis Report
             <FileText className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
}
