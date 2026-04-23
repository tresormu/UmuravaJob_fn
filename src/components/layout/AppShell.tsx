"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIChatSidebar } from "@/components/common/AIChatSidebar";
import { UIProvider, useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <AppShellContent>{children}</AppShellContent>
    </UIProvider>
  );
}

function AppShellContent({ children }: { children: React.ReactNode }) {
  const { 
    isSidebarOpen, 
    setIsSidebarOpen, 
    isSidebarCollapsed, 
    toggleSidebarCollapse,
    isAIChatOpen,
    setIsAIChatOpen
  } = useUI();
  const { isLoggedIn, isFirstLogin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/60">Umurava AI</p>
          <h1 className="text-2xl font-black text-primary">Loading workspace</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Your recruiter session is being prepared.
          </p>
        </div>
      </div>
    );
  }

  // If not logged in or in onboarding, show a clean layout without the app shell chrome
  if (!isLoggedIn || isFirstLogin) {
    return (
      <div className="h-screen w-full bg-background overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-secondary">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
      <AIChatSidebar 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
      />
    </div>
  );
}
