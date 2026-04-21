"use client";

import React, { createContext, useContext, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface TransitionContextType {
  isTransitioning: boolean;
  setIsTransitioning: (value: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

function TransitionListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsTransitioning } = useTransition();

  // Reset transition state when the path or search params change
  React.useEffect(() => {
    setIsTransitioning(false);
  }, [pathname, searchParams, setIsTransitioning]);

  return null;
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <TransitionContext.Provider value={{ isTransitioning, setIsTransitioning }}>
      <Suspense fallback={null}>
        <TransitionListener />
      </Suspense>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
