import { MoreVertical, Code2, Palette, Microscope, StopCircle, Hourglass, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { cn } from "@/utils/cn";

interface JobPostingRowProps {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  progress: number;
  applicants: number;
  matched: number;
  icon: "code" | "design" | "research";
  onDelete?: (id: string) => Promise<void> | void;
}

const icons = {
  code: Code2,
  design: Palette,
  research: Microscope,
};

export function JobPostingRow({ 
  id,
  title, 
  department, 
  type, 
  location, 
  progress, 
  applicants, 
  matched, 
  icon,
  onDelete,
}: JobPostingRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExpireModal, setShowExpireModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Icon = icons[icon];
  const actionHref = progress === 100 ? "/shortlists" : `/screening?role=${encodeURIComponent(title)}`;
  const actionLabel = progress === 100 ? "Review shortlist" : "Start screening";
  const actionClassName = progress === 100 ? "btn-primary" : "btn-accent";

  return (
    <div className="soft-panel group flex flex-col gap-4 p-4 transition-all hover:border-primary/20 md:gap-6 md:p-6 xl:flex-row xl:items-center">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-none bg-secondary text-primary transition-all group-hover:bg-primary group-hover:text-white">
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
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={cn(
              "p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors",
              showMenu && "bg-secondary text-primary"
            )}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 bottom-full mb-3 xl:bottom-auto xl:top-full xl:mt-3 w-56 bg-white border border-border/50 rounded-none shadow-xl shadow-black/5 z-50 overflow-hidden p-1.5"
              >
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-primary hover:bg-secondary rounded-xl transition-all">
                  <StopCircle className="w-4 h-4 text-orange-500" />
                  Stop Screening
                </button>
                <button 
                  onClick={() => { setShowMenu(false); setShowExpireModal(true); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-primary hover:bg-secondary rounded-none transition-all"
                >
                  <Hourglass className="w-4 h-4 text-blue-500" />
                  Expire Job
                </button>
                <Link 
                  href={`/jobs/edit/${id}`}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-primary hover:bg-secondary rounded-none transition-all"
                >
                  <Edit3 className="w-4 h-4 text-accent" />
                  Update Job
                </Link>
                <div className="my-1 border-t border-border/30" />
                <button 
                  onClick={() => { setShowMenu(false); setShowDeleteModal(true); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Job
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          if (onDelete) {
            void onDelete(id);
          }
        }}
        title="Delete this job?"
        description={`This action will permanently remove the "${title}" job brief and all related candidate screening data. This cannot be undone.`}
        confirmLabel="Yes, Delete Job"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={showExpireModal}
        onClose={() => setShowExpireModal(false)}
        onConfirm={() => console.log("Expiring job:", title)}
        title="Expire this job?"
        description={`Marking "${title}" as expired will stop all active screening and notify pending applicants that the role is no longer active.`}
        confirmLabel="Expire Role"
        variant="warning"
      />
    </div>
  );
}
