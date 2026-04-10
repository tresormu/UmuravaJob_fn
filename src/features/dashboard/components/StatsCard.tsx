import { Users, Briefcase, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatsCardProps {
  label: string;
  value: string;
  trend?: string;
  icon: "users" | "jobs" | "pending" | "completed";
  className?: string;
}

const icons = {
  users: Users,
  jobs: Briefcase,
  pending: Clock,
  completed: CheckCircle2,
};

export function StatsCard({ label, value, trend, icon, className }: StatsCardProps) {
  const Icon = icons[icon];

  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-border flex items-start justify-between shadow-sm relative overflow-hidden", className)}>
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-3">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-primary tracking-tight">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/5 text-accent border border-accent/10">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </div>
          )}
        </div>
      </div>
      <div className="p-3 bg-secondary rounded-xl text-primary/40 relative z-10">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
