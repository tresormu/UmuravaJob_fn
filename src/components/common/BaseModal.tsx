"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function BaseModal({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  description,
  className 
}: BaseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/50",
              className
            )}
          >
            {(title || description) && (
              <div className="p-8 border-b border-border/50 flex items-center justify-between bg-secondary/30">
                <div>
                  {title && <h3 className="text-2xl font-black text-primary tracking-tight">{title}</h3>}
                  {description && <p className="text-sm text-muted-foreground font-medium mt-1">{description}</p>}
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-white rounded-2xl text-muted-foreground hover:text-primary transition-all shadow-sm border border-transparent hover:border-border"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <div className="relative">
              {!title && (
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 z-10 p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-primary transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
