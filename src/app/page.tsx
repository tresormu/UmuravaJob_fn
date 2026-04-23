"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LandingPage } from "@/features/landing/LandingPage";
import { AuthPage } from "@/features/auth/AuthPage";
import { OnboardingFlow } from "@/features/onboarding/OnboardingFlow";
import { Dashboard } from "@/features/dashboard/Dashboard";

export default function Home() {
  const { isLoggedIn, isFirstLogin, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/60">Umurava AI</p>
          <h1 className="text-2xl font-black text-primary">Restoring your session</h1>
          <p className="text-sm text-muted-foreground font-medium">
            We&apos;re checking your recruiter workspace so you land in the right place.
          </p>
        </div>
      </div>
    );
  }

  // 1. If user is not logged in, show the Landing Page or Auth Page
  if (!isLoggedIn) {
    if (showAuth) {
      return <AuthPage />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // 2. If user just registered, show the Onboarding Flow
  if (isFirstLogin) {
    return <OnboardingFlow />;
  }

  // 3. Otherwise, show the Main Dashboard
  return <Dashboard />;
}
