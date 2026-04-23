"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  AuthSession,
  RecruiterUser,
  RegisterInput,
  VerifyEmailInput,
} from "@/services/authService";
import {
  loginRecruiter,
  logoutRecruiter,
  refreshRecruiterSession,
  registerRecruiter,
  resendRecruiterVerification,
  verifyRecruiterEmail,
} from "@/services/authService";

const AUTH_SESSION_KEY = "umurava_auth_session";
const ONBOARDING_KEY = "umurava_onboarding_done";

interface AuthContextType {
  user: RecruiterUser | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isFirstLogin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string>;
  register: (input: RegisterInput) => Promise<string>;
  verifyEmail: (input: VerifyEmailInput) => Promise<string>;
  resendVerificationCode: (email: string) => Promise<string>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredSession = (): AuthSession | null => {
  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
};

const persistSession = (session: AuthSession) => {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
};

const clearPersistedSession = () => {
  localStorage.removeItem(AUTH_SESSION_KEY);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const restoreSession = async () => {
      const savedSession = readStoredSession();
      const onboardingDone = localStorage.getItem(ONBOARDING_KEY);

      if (!savedSession) {
        if (isActive) {
          setIsFirstLogin(false);
          setIsLoading(false);
        }
        return;
      }

      if (isActive) {
        setSession(savedSession);
        setIsFirstLogin(!onboardingDone);
      }

      try {
        const refreshedTokens = await refreshRecruiterSession(savedSession.refreshToken);
        if (!isActive) return;

        const nextSession = {
          ...savedSession,
          ...refreshedTokens,
        };

        setSession(nextSession);
        persistSession(nextSession);
      } catch {
        if (!isActive) return;
        clearPersistedSession();
        setSession(null);
        setIsFirstLogin(false);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { message, session: nextSession } = await loginRecruiter(email, password);

    setSession(nextSession);
    persistSession(nextSession);

    const onboardingDone = localStorage.getItem(ONBOARDING_KEY);
    setIsFirstLogin(!onboardingDone);

    return message;
  };

  const register = async (input: RegisterInput) => {
    return registerRecruiter(input);
  };

  const verifyEmail = async (input: VerifyEmailInput) => {
    return verifyRecruiterEmail(input);
  };

  const resendVerificationCode = async (email: string) => {
    return resendRecruiterVerification(email);
  };

  const logout = async () => {
    if (session?.refreshToken) {
      try {
        await logoutRecruiter(session.refreshToken);
      } catch {
        // Clearing the local session is still the safest recovery path for the UI.
      }
    }

    setSession(null);
    setIsFirstLogin(false);
    clearPersistedSession();
  };

  const completeOnboarding = () => {
    setIsFirstLogin(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        accessToken: session?.accessToken ?? null,
        isLoggedIn: !!session?.user,
        isFirstLogin,
        isLoading,
        login,
        register,
        verifyEmail,
        resendVerificationCode,
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
