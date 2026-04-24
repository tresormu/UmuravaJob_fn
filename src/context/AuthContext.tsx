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
  requestAccountDeletion,
  confirmAccountDeletion,
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
  requestDeleteAccount: () => Promise<string>;
  confirmDeleteAccount: (code: string) => Promise<void>;
  completeOnboarding: () => void;
  updateUser: (userData: RecruiterUser) => void;
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

const isTokenExpiredOrExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Refresh if expired or expiring within the next 60 seconds
    return Date.now() >= (payload.exp - 60) * 1000;
  } catch {
    return true;
  }
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

      if (savedSession) {
        setSession(savedSession);
        setIsFirstLogin(!onboardingDone);
      }
      setIsLoading(false);
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
    const pendingOnboarding = localStorage.getItem("umurava_pending_onboarding");
    if (!onboardingDone || pendingOnboarding) {
      setIsFirstLogin(true);
      localStorage.removeItem("umurava_pending_onboarding");
    }

    return message;
  };

  const register = async (input: RegisterInput) => {
    return registerRecruiter(input);
  };

  const verifyEmail = async (input: VerifyEmailInput) => {
    const { message, session: nextSession } = await verifyRecruiterEmail(input);

    const onboardingDone = localStorage.getItem(ONBOARDING_KEY);

    if (nextSession) {
      setSession(nextSession);
      persistSession(nextSession);
      if (!onboardingDone) setIsFirstLogin(true);
    } else {
      // Backend didn't return a session — store a flag so the app shows
      // onboarding after the user logs in manually.
      if (!onboardingDone) localStorage.setItem("umurava_pending_onboarding", "true");
    }

    return message;
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
    localStorage.removeItem("umurava_pending_onboarding");
  };

  const requestDeleteAccount = async () => {
    if (!session?.accessToken) throw new Error("Not authenticated");
    return requestAccountDeletion(session.accessToken);
  };

  const confirmDeleteAccount = async (code: string) => {
    if (!session?.accessToken) throw new Error("Not authenticated");
    await confirmAccountDeletion(session.accessToken, code);
    setSession(null);
    setIsFirstLogin(false);
    clearPersistedSession();
    localStorage.removeItem("umurava_pending_onboarding");
  };

  const completeOnboarding = () => {
    setIsFirstLogin(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const updateUser = (userData: RecruiterUser) => {
    if (session) {
      const nextSession = { ...session, user: userData };
      setSession(nextSession);
      persistSession(nextSession);
    }
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
        requestDeleteAccount,
        confirmDeleteAccount,
        completeOnboarding,
        updateUser,
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
