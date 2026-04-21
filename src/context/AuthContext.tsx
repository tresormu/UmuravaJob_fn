"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isFirstLogin: boolean;
  login: (email: string) => void;
  register: (email: string, name: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Persistence check (optional for this task, but good for UX)
  useEffect(() => {
    const savedUser = localStorage.getItem("umurava_user");
    const onboardingDone = localStorage.getItem("umurava_onboarding_done");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsFirstLogin(!onboardingDone);
    }
  }, []);

  const login = (email: string) => {
    const mockUser = { id: "1", email, name: email.split("@")[0] };
    setUser(mockUser);
    localStorage.setItem("umurava_user", JSON.stringify(mockUser));
    // Login usually doesn't trigger onboarding unless it's the very first time
    const onboardingDone = localStorage.getItem("umurava_onboarding_done");
    setIsFirstLogin(!onboardingDone);
  };

  const register = (email: string, name: string) => {
    const mockUser = { id: Date.now().toString(), email, name };
    setUser(mockUser);
    setIsFirstLogin(true); // Always trigger onboarding on register
    localStorage.setItem("umurava_user", JSON.stringify(mockUser));
    localStorage.removeItem("umurava_onboarding_done");
  };

  const logout = () => {
    setUser(null);
    setIsFirstLogin(false);
    localStorage.removeItem("umurava_user");
  };

  const completeOnboarding = () => {
    setIsFirstLogin(false);
    localStorage.setItem("umurava_onboarding_done", "true");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isFirstLogin,
        login,
        register,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
