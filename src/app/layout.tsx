import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Umurava Screen | AI Hiring Workspace",
  description:
    "Premium recruiter workspace for AI-assisted applicant screening, explainable shortlists, and human-led hiring decisions.",
};

import { TransitionProvider } from "@/context/TransitionContext";
import { AuthProvider } from "@/context/AuthContext";
import { JobProvider } from "@/context/JobContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-hidden">
        <AuthProvider>
          <JobProvider>
            <TransitionProvider>
              <Suspense fallback={null}>
                <LoadingScreen />
              </Suspense>
              <AppShell>
                {children}
              </AppShell>
            </TransitionProvider>
          </JobProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
