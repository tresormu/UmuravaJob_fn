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
    <div className={cn("soft-panel flex items-start justify-between p-6", className)}>
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-3">{label}</p>
        <div className="space-y-3">
          <h3 className="text-3xl font-bold text-primary tracking-tight">{value}</h3>
          {trend && (
            <div className="inline-flex items-center gap-1 rounded-full border border-accent/10 bg-accent/5 px-2 py-0.5 text-[10px] font-bold text-accent">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>
      </div>
      <div className="relative z-10 rounded-2xl bg-secondary p-3 text-primary/55">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
