import { LineChart, ArrowRight } from "lucide-react";

export function InsightCard() {
  return (
    <div className="soft-panel p-6 md:p-8 bg-gradient-to-br from-white to-secondary/30">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/5 rounded-lg text-primary">
            <LineChart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-primary">Screening workflow</h3>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2">
          Documentation <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="p-5 rounded-none bg-white border border-border shadow-sm">
             <h4 className="text-xs font-black uppercase tracking-widest text-accent mb-2">Human Control</h4>
             <p className="text-sm text-primary font-bold leading-relaxed">
               You maintain absolute oversight. Manually review profiles, add internal notes, and override any AI scoring to ensure your unique hiring bar is met.
             </p>
          </div>
          <div className="p-5 rounded-none bg-primary text-white shadow-xl shadow-primary/10">
             <h4 className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">AI Assistance</h4>
             <p className="text-sm font-bold leading-relaxed">
               Leverage Gemini-powered suggestions to extract hidden signals, flag experience gaps, and normalize candidate data for faster side-by-side comparison.
             </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 bg-secondary/50 rounded-none border border-border/50">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">The Decision Engine</p>
           <h3 className="text-xl font-black text-primary leading-tight mb-4">
             Shortlisting with <span className="text-accent underline decoration-accent/20 underline-offset-4">contextual</span> knowledge.
           </h3>
           <p className="text-xs text-muted-foreground leading-relaxed font-medium">
             Unlike black-box systems, Umurava Screen explains *why* a candidate is recommended. Use AI signals to inform your judgment, then shortlist with total confidence in your data.
           </p>
           
           <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-[10px] font-bold text-primary">
                     {String.fromCharCode(64 + i)}
                   </div>
                 ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Collaborative Scoring</p>
           </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-none border border-border bg-white p-4">
          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Explainability standard</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">Strengths + gaps</span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Decision model</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-accent">AI assists, recruiter decides</span>
          </div>
        </div>
      </div>
    </div>
  );
}
