"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LandingPage } from "@/features/landing/LandingPage";
import { AuthPage } from "@/features/auth/AuthPage";
import { OnboardingFlow } from "@/features/onboarding/OnboardingFlow";
import { Dashboard } from "@/features/dashboard/Dashboard";

export default function Home() {
  const { isLoggedIn, isFirstLogin } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

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
