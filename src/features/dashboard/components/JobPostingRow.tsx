import { MoreVertical, Code2, Palette, Microscope } from "lucide-react";
import Link from "next/link";

interface JobPostingRowProps {
  title: string;
  department: string;
  type: string;
  location: string;
  progress: number;
  applicants: number;
  matched: number;
  icon: "code" | "design" | "research";
}

const icons = {
  code: Code2,
  design: Palette,
  research: Microscope,
};

export function JobPostingRow({ 
  title, 
  department, 
  type, 
  location, 
  progress, 
  applicants, 
  matched, 
  icon 
}: JobPostingRowProps) {
  const Icon = icons[icon];
  const actionHref = progress === 100 ? "/shortlists" : `/screening?role=${encodeURIComponent(title)}`;
  const actionLabel = progress === 100 ? "Review shortlist" : "Start screening";
  const actionClassName = progress === 100 ? "btn-primary" : "btn-accent";

  return (
    <div className="soft-panel group flex flex-col gap-4 p-4 transition-all hover:border-primary/20 md:gap-6 md:p-6 xl:flex-row xl:items-center">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary transition-all group-hover:bg-primary group-hover:text-white">
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-primary text-base md:text-lg">{title}</h4>
          <p className="text-xs md:text-sm text-muted-foreground">
            {department} <span className="hidden sm:inline">• {type} • {location}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row xl:flex-1 gap-4 md:gap-8 xl:items-center w-full">
        <div className="flex-1 max-w-full xl:max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-semibold text-primary/60 uppercase tracking-tighter">Screening progress</span>
            <span className="text-xs font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 md:h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-start gap-8 md:gap-12 md:px-4">
          <div className="text-left md:text-center">
            <p className="text-xl md:text-2xl font-bold text-primary">{applicants}</p>
            <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Applicants</p>
          </div>
          <div className="text-left md:text-center">
            <p className="text-xl md:text-2xl font-bold text-primary">{matched}</p>
            <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Matched</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between xl:justify-end gap-3 border-t border-border/50 pt-4 xl:border-none xl:pt-0">
        <Link href={actionHref} className={`flex-1 xl:flex-none ${actionClassName} btn-sm`}>
          {actionLabel}
        </Link>
        <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
