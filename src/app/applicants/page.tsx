import { UploadCard, ScreeningProgress } from "@/features/applicants/components/UploadCard";
import { UploadsTable } from "@/features/applicants/components/UploadsTable";
import { Settings2, BarChart3, ShieldCheck } from "lucide-react";

export default function ApplicantsPage() {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-24">
      {/* Professional Analytics Banner Dashboard */}
      <div className="bg-primary rounded-3xl md:rounded-[40px] p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-x-12 -translate-y-12 blur-3xl"></div>
        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur-md flex-shrink-0">
           <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-white opacity-80" />
        </div>
        <div className="flex-1 space-y-2 relative z-10">
           <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Pipeline Analytics</h2>
           <p className="text-sm md:text-base text-white/70 max-w-2xl leading-relaxed">
             Our matching engine is currently processing 42 active candidate files. Recent calibration improved alignment accuracy by 18% for core technical requirements.
           </p>
        </div>
        <button className="w-full md:w-auto bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:bg-white/90 transition-all z-10">
            Analytics Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Left column Dashboard (Ingestion) */}
        <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
           <UploadCard />
           <ScreeningProgress />
        </div>

        {/* Right column Dashboard (Batches) */}
        <div className="lg:col-span-8 order-1 lg:order-2">
           <UploadsTable />
        </div>
      </div>

      {/* Strategic Actions Bar Dashboard */}
      <div className="fixed bottom-6 md:bottom-10 left-4 right-4 md:left-[calc(50%+144px)] md:-translate-x-1/2 w-auto md:w-[600px] lg:w-[800px] bg-white border border-border shadow-lg p-3 md:p-4 rounded-3xl flex items-center justify-between z-40">
        <div className="flex items-center gap-3 md:gap-4 pl-2 md:pl-4 uppercase tracking-[0.2em] font-bold text-[9px] md:text-[10px] text-primary/40">
           <span className="hidden sm:inline">Workflow Actions:</span>
           <div className="flex items-center gap-2">
              <button className="bg-primary/5 text-primary px-3 md:px-4 py-2 rounded-xl border border-primary/10 hover:bg-primary hover:text-white transition-all text-[10px] md:text-xs font-bold">
                 Auto-Index
              </button>
              <button className="hidden sm:block bg-secondary text-primary px-4 py-2 rounded-xl border border-border hover:bg-primary hover:text-white transition-all text-xs font-bold">
                 Bulk Analysis
              </button>
           </div>
        </div>
        <div className="p-2 md:p-3 bg-primary text-white rounded-2xl shadow-sm cursor-pointer hover:scale-105 transition-transform">
           <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>
    </div>
  );
}
