import { User, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface CandidateRowProps {
  rank: string;
  name: string;
  role: string;
  score: number;
  tags: string[];
  status: "Elite" | "High" | "Good";
}

const statusColors = {
  Elite: "text-primary border-primary bg-primary/10",
  High: "text-[#B05B2F] border-[#B05B2F] bg-[#B05B2F]/10",
  Good: "text-muted-foreground border-muted-foreground bg-muted/10",
};

export function CandidateRow({ rank, name, role, score, tags, status }: CandidateRowProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-border premium-shadow flex items-center gap-6 group hover:border-primary/20 transition-all">
      <div className="text-3xl font-bold text-muted-foreground/30 w-12 text-center">{rank}</div>
      
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all overflow-hidden border border-border">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-primary">{name}</h4>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>

      <div className="flex-1 max-w-[200px]">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-sm font-bold text-primary">{score} <span className="text-[10px] font-medium opacity-60">{status}</span></p>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${score}%` }} 
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 flex-[1.5] justify-center">
        {tags.map(tag => (
          <span key={tag} className="text-[10px] uppercase font-bold text-primary/60 bg-secondary/50 px-3 py-1 rounded-md tracking-wider">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-secondary text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-muted transition-all flex items-center gap-2">
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
