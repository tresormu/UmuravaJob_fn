"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info" | "primary";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger"
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-black/10 overflow-hidden pointer-events-auto border border-border/50"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    variant === "danger" ? "bg-red-50 text-red-600" :
                    variant === "warning" ? "bg-accent/10 text-accent" :
                    "bg-primary/10 text-primary"
                  )}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-2xl font-black text-primary tracking-tight mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {description}
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={cn(
                      "flex-1 btn-lg font-black uppercase tracking-widest text-[11px]",
                      variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white" :
                      variant === "warning" ? "btn-accent" :
                      "btn-primary"
                    )}
                  >
                    {confirmLabel}
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 btn-lg bg-secondary text-primary hover:bg-secondary/80 font-black uppercase tracking-widest text-[11px]"
                  >
                    {cancelLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
