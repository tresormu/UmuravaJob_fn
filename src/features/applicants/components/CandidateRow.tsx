import { User, ChevronRight, Star, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface CandidateRowProps {
  id: string;
  rank: string;
  name: string;
  role: string;
  score: number;
  tags: string[];
  status: string;
  isShortlisted?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onShortlistToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function CandidateRow({
  id,
  rank,
  name,
  role,
  score,
  tags,
  status,
  isShortlisted,
  isSelected,
  onSelect,
  onShortlistToggle,
  onDelete,
  onViewDetails
}: CandidateRowProps) {
  return (
    <div className={cn(
      "bg-white p-5 rounded-2xl border transition-all font-inter flex items-center gap-6 group relative mb-4 shadow-sm",
      isSelected ? "border-primary bg-primary/[0.02]" : isShortlisted ? "border-accent bg-accent/[0.02]" : "border-border hover:border-primary/20"
    )}>
      <div className="flex items-center gap-4 w-12 flex-shrink-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect?.(id, e.target.checked)}
          className="w-5 h-5 rounded-lg border-2 border-border text-primary focus:ring-primary/20 cursor-pointer transition-all accent-primary"
        />
      </div>

      <div className="text-3xl font-bold text-muted-foreground/30 w-12 text-center hidden sm:block">{rank}</div>

      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all overflow-hidden border border-border flex-shrink-0">
          <User className="w-6 h-6" />
        </div>
        <div className="truncate">
          <h4 className="font-bold text-primary truncate">{name}</h4>
          <p className="text-xs text-muted-foreground truncate">{role}</p>
        </div>
      </div>

      <div className="flex-1 max-w-[180px] hidden md:block">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-sm font-bold text-primary">
            {score > 0 ? `${score}%` : <span className="text-[10px] text-muted-foreground uppercase">Not Screened</span>}
            {score > 0 && <span className="text-[10px] font-medium opacity-60 ml-1">{status}</span>}
          </p>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              score === 0 ? "bg-muted" : status === "Elite" ? "bg-accent" : "bg-primary"
            )}
            style={{ width: `${score || 0}%` }}
          />
        </div>
      </div>

      <div className="hidden lg:flex flex-col gap-1 flex-1 items-center">
        <span className={cn(
          "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
          isShortlisted ? "bg-green-50 text-green-600 border-green-100" : "bg-secondary text-primary/60 border-border"
        )}>
          {isShortlisted ? "Shortlisted" : "Applied"}
        </span>
        <div className="flex flex-wrap gap-1 mt-1 justify-center">
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[8px] uppercase font-bold text-primary/40 bg-secondary/30 px-2 py-0.5 rounded tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onShortlistToggle?.(id)}
          className={cn(
            "p-2.5 rounded-xl transition-all border",
            isShortlisted
              ? "bg-accent text-white border-accent shadow-md shadow-accent/20"
              : "bg-secondary text-muted-foreground border-transparent hover:border-accent/40 hover:text-accent"
          )}
          title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
        >
          <Star className={cn("w-4 h-4", isShortlisted && "fill-current")} />
        </button>

        <button
          onClick={() => onViewDetails?.(id)}
          className="bg-secondary text-primary px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          View details
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete?.(id)}
          className="p-2.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100"
          title="Delete applicant"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
