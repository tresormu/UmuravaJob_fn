import { LineChart, ArrowRight } from "lucide-react";

export function InsightCard() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/5 rounded-lg text-primary">
            <LineChart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-primary">Pipeline Intelligence</h3>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2">
          Details <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <p className="text-primary/70 text-sm leading-relaxed mb-8">
        Efficiency metrics for <span className="font-bold text-primary">Senior Frontend Engineers</span> indicate that 
        candidates with <span className="bg-primary/5 text-primary px-2 py-0.5 rounded font-medium">Next.js</span> and 
        <span className="bg-primary/5 text-primary px-2 py-0.5 rounded font-medium ml-1">TypeScript</span> proficiency 
        progress through the screening stage <span className="text-primary font-bold">40% faster</span> than the baseline.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#F8FAFB] p-4 rounded-xl border border-border">
          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Time to Screen</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">-2.4 Days</span>
          </div>
        </div>
        <div className="bg-[#F8FAFB] p-4 rounded-xl border border-border">
          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Success Rate</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-accent">+18%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
