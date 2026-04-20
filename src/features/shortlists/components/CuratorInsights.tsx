import { Target, FileText, Activity, TrendingUp } from "lucide-react";

export function CuratorInsights() {
  return (
    <div className="soft-panel sticky top-24 overflow-hidden">
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-sm">
             <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary leading-tight">Review guidance</h3>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-0.5 opacity-60">Explainability notes</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/50 p-6 rounded-3xl border border-border space-y-4">
             <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h5 className="font-extrabold text-[12px] text-primary">Pattern to note</h5>
             </div>
             <p className="text-xs text-primary font-medium leading-relaxed">
               Elena Rodriguez and Marcus Thorne both perform strongly on senior technical depth.
               The differentiator is role scope: Elena fits architecture leadership, while Marcus
               is a stronger implementation lead.
             </p>
          </div>

          <div className="bg-secondary/30 p-6 rounded-3xl border border-border italic text-primary/70 text-xs leading-relaxed relative">
             <Activity className="absolute -top-1 -right-1 w-4 h-4 text-primary opacity-20" />
             &ldquo;Domain relevance can justify a slightly lower raw score when the candidate solves a
             core business need better than others.&rdquo;
          </div>

          <div className="rounded-3xl border border-border bg-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Human guardrail</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Recruiters should always validate shortlist outputs against interview goals, culture
              needs, and role-specific trade-offs before taking action.
            </p>
          </div>

          <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-sm group">
             Open analysis summary
             <FileText className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
}
