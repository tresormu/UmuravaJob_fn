import { ShieldCheck, Zap, BarChart3 } from "lucide-react";

export function ShortlistStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Precision Score Dashboard */}
      <div className="bg-white p-8 rounded-3xl border border-border flex flex-col justify-between h-48 shadow-sm group relative overflow-hidden">
        <div className="absolute -right-4 top-0 w-32 h-32 bg-primary/5 rounded-full translate-x-12 -translate-y-12 transition-transform duration-700 group-hover:scale-125"></div>
        <div className="relative z-10">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-4">Screening Quality</p>
          <div className="flex items-end gap-3">
             <h3 className="text-5xl font-black text-primary">99.4<span className="text-2xl font-bold opacity-40">%</span></h3>
             <span className="bg-[#F4F7F9] text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 mb-2 uppercase">Verified</span>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10 pt-4 border-t border-border/50">
           <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
           <p className="text-[10px] font-bold text-muted-foreground leading-tight">Confirmed through 142 alignment markers.</p>
        </div>
      </div>

      {/* Speed Dashboard */}
      <div className="bg-white p-8 rounded-3xl border border-border flex flex-col justify-between h-48 shadow-sm relative overflow-hidden">
         <div className="absolute -right-4 top-0 w-32 h-32 bg-primary/5 rounded-full translate-x-12 -translate-y-12 transition-transform duration-700"></div>
         <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-4">Processing Speed</p>
            <div className="flex items-end gap-3">
               <h3 className="text-5xl font-black text-primary">1.2<span className="text-2xl font-bold opacity-40">s</span></h3>
               <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">Real-Time</span>
            </div>
         </div>
         <div className="flex items-center gap-3 pt-4 border-t border-border/50">
            <Zap className="w-5 h-5 text-primary opacity-40" />
            <p className="text-[10px] font-bold text-muted-foreground leading-tight">250 profiles analyzed against search criteria.</p>
         </div>
      </div>

      {/* Shortlist Health Dashboard */}
      <div className="bg-primary p-8 rounded-3xl text-white flex flex-col justify-between h-48 shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-4 -translate-y-4"></div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] uppercase font-bold text-white/50 tracking-[0.2em]">Workflow Status</p>
              <BarChart3 className="w-5 h-5 text-white opacity-40" />
            </div>
            <h3 className="text-3xl font-bold tracking-tight">Optimized</h3>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/60">
                <span>Diversification</span>
                <span>88%</span>
             </div>
             <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: "88%" }}></div>
             </div>
          </div>
      </div>
    </div>

  );
}
