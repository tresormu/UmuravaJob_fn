import { ShieldCheck, Zap, BarChart3 } from "lucide-react";

export function ShortlistStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="soft-panel relative flex h-48 flex-col justify-between overflow-hidden p-8">
        <div className="relative z-10">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Shortlist coverage</p>
          <div className="flex items-end gap-3">
             <h3 className="text-5xl font-black text-primary">10<span className="text-2xl font-bold opacity-40">/10</span></h3>
             <span className="mb-2 rounded-full border border-primary/20 bg-secondary px-3 py-1 text-[10px] font-bold uppercase text-primary">Ready</span>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3 border-t border-border/50 pt-4">
           <ShieldCheck className="h-5 w-5 text-primary opacity-40" />
           <p className="text-[10px] font-bold leading-tight text-muted-foreground">Each candidate includes reasons, gaps, and recommendation notes.</p>
        </div>
      </div>

      <div className="soft-panel relative flex h-48 flex-col justify-between overflow-hidden p-8">
         <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Decision support</p>
            <div className="flex items-end gap-3">
               <h3 className="text-5xl font-black text-primary">04<span className="text-2xl font-bold opacity-40"> key</span></h3>
               <span className="mb-2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Signals</span>
            </div>
         </div>
         <div className="flex items-center gap-3 pt-4 border-t border-border/50">
            <Zap className="h-5 w-5 text-primary opacity-40" />
            <p className="text-[10px] font-bold leading-tight text-muted-foreground">Skills, experience, relevance, and risk all stay visible during review.</p>
         </div>
      </div>

      <div className="flex h-48 flex-col justify-between overflow-hidden rounded-3xl bg-primary p-8 text-white shadow-lg shadow-primary/20">
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] uppercase font-bold text-white/50 tracking-[0.2em]">Human review gate</p>
              <BarChart3 className="h-5 w-5 text-white opacity-40" />
            </div>
            <h3 className="text-3xl font-bold tracking-tight">Required</h3>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/60">
                <span>Profiles awaiting recruiter decision</span>
                <span>06</span>
             </div>
             <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: "60%" }}></div>
             </div>
          </div>
      </div>
    </div>

  );
}
