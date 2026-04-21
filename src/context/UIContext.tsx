"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface UIContextType {
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;
  toggleAIChat: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleAIChat = useCallback(() => setIsAIChatOpen(prev => !prev), []);
  const toggleSidebarCollapse = useCallback(() => setIsSidebarCollapsed(prev => !prev), []);

  return (
    <UIContext.Provider
      value={{
        isAIChatOpen,
        setIsAIChatOpen,
        toggleAIChat,
        isSidebarOpen,
        setIsSidebarOpen,
        isSidebarCollapsed,
        toggleSidebarCollapse,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
