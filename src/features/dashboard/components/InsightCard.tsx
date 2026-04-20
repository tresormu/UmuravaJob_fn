import { LineChart, ArrowRight } from "lucide-react";

export function InsightCard() {
  return (
    <div className="soft-panel p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/5 rounded-lg text-primary">
            <LineChart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-primary">Screening workflow</h3>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2">
          Notes <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "1. Define role",
            body: "Capture must-have skills, experience range, and recruiter notes.",
          },
          {
            title: "2. Ingest applicants",
            body: "Accept structured talent profiles, spreadsheets, or uploaded resumes.",
          },
          {
            title: "3. Review shortlist",
            body: "Present a ranked list with strengths, gaps, and recommendation notes.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-secondary p-5">
            <p className="text-sm font-bold text-primary">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
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
