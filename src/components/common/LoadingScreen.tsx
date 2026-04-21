"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "@/context/TransitionContext";

function LoadingScreenContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isTransitioning } = useTransition();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Show loading screen if either Next.js is changing paths OR our custom transition is active
    if (isTransitioning) {
      setShowLoading(true);
    } else {
      // If we're not transitioning manually, we still show on route change
      setShowLoading(true);
      
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 800);

      return () => {
        clearTimeout(timer);
        setShowLoading(false);
      };
    }
  }, [pathname, searchParams, isTransitioning]);

  return (
    <AnimatePresence mode="wait">
      {showLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 bg-accent rounded-[2rem] flex items-center justify-center shadow-2xl shadow-accent/20">
              <span className="text-white font-black text-2xl tracking-[0.2em]">US</span>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-white text-3xl font-black tracking-tighter">Umurava</h2>
              <p className="text-accent text-[10px] uppercase font-black tracking-[0.4em] mt-2">Transitioning...</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
          >
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">AI Hiring Workspace</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LoadingScreen() {
  return (
    <Suspense fallback={null}>
      <LoadingScreenContent />
    </Suspense>
  );
}
