"use client";

import { Bell, CheckCircle2, MessageSquare, UserPlus, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const activities = [
  {
    id: 1,
    type: "applicant",
    title: "New Talent Profile",
    description: "Jean Claude N. just applied for the Senior Frontend Engineer position.",
    time: "2 minutes ago",
    icon: UserPlus,
    color: "bg-primary",
  },
  {
    id: 2,
    type: "ai",
    title: "AI Screening Complete",
    description: "Gemini has finished ranking 12 candidates for the Product Designer role.",
    time: "1 hour ago",
    icon: CheckCircle2,
    color: "bg-emerald-500",
  },
  {
    id: 3,
    type: "message",
    title: "New Recruiter Note",
    description: "Alice left a note on Sarah's profile: 'Strong technical background, worth a call.'",
    time: "3 hours ago",
    icon: MessageSquare,
    color: "bg-accent",
  },
  {
    id: 4,
    type: "system",
    title: "Job Brief Expiring",
    description: "The 'Data Analyst' job brief will expire in 24 hours. Consider renewing soon.",
    time: "5 hours ago",
    icon: Clock,
    color: "bg-orange-500",
  },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary tracking-tighter">Activity & Notifications</h2>
          <p className="mt-2 text-muted-foreground font-medium">Stay updated on your hiring pipeline and AI insights.</p>
        </div>
        <button className="text-xs font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors underline underline-offset-8">
          Mark all as read
        </button>
      </header>

      <div className="soft-panel overflow-hidden border border-border/50">
        <div className="divide-y divide-border/30">
          {activities.map((activity, i) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 md:p-8 flex gap-6 hover:bg-secondary/30 transition-all cursor-pointer group"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                activity.color,
                "text-white"
              )}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-bold text-primary text-lg">{activity.title}</h4>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium max-w-2xl">
                  {activity.description}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">
                  View Details <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="text-center">
        <button className="btn-base bg-secondary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
          Load older notifications
        </button>
      </footer>
    </div>
  );
}
