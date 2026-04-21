"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  department: string;
}

interface JobSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
}

export function JobSelectionModal({ isOpen, onClose, jobs }: JobSelectionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-none shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-primary tracking-tight">Select active pipeline</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">Pick a role to start candidate screening.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-secondary rounded-none text-muted-foreground hover:text-primary transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/screening?role=${encodeURIComponent(job.title)}`}
                  onClick={onClose}
                  className="group flex items-center justify-between p-4 bg-secondary/50 hover:bg-primary hover:text-white rounded-none transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center shadow-sm group-hover:bg-white/10 group-hover:text-white text-primary transition-all">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-base">{job.title}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-0.5">{job.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 bg-accent/10 group-hover:bg-accent text-accent group-hover:text-white rounded-full text-[9px] font-black uppercase tracking-tighter">
                      In Progress
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                  </div>
                </Link>
              ))}

              {jobs.length === 0 && (
                <div className="p-12 text-center space-y-4">
                  <p className="text-muted-foreground font-medium">No active jobs found.</p>
                  <Link href="/jobs/create" className="btn-primary btn-md inline-flex">
                    Create new job
                  </Link>
                </div>
              )}
            </div>

            <div className="p-8 bg-secondary/30">
              <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-none border border-accent/10">
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-none flex items-center justify-center">
                  <Zap className="w-5 h-5 flex-shrink-0" />
                </div>
                <p className="text-xs text-primary/70 leading-relaxed font-medium">
                  Select a role to access the <span className="font-bold text-primary">AI Applicant Ranking</span> and detailed candidate profiles.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
