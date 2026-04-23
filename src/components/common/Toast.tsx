"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={cn(
            "fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-[20px] shadow-2xl border min-w-[300px]",
            type === "success" 
              ? "bg-white border-green-100 text-primary" 
              : "bg-white border-red-100 text-red-600"
          )}
        >
          {type === "success" ? (
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <XCircle className="w-5 h-5" />
            </div>
          )}
          
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-0.5">
              {type === "success" ? "Success" : "Notification"}
            </p>
            <p className="text-sm font-bold tracking-tight">{message}</p>
          </div>

          <button 
            onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
            className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
