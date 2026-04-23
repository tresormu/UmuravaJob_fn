"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Zap, Shield, Cpu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GlassInput } from "@/components/ui/GlassInput";
import { cn } from "@/utils/cn";

type AuthMode = "login" | "register" | "verify";

type Feedback = {
  tone: "error" | "success" | "info";
  message: string;
};

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const { login, register, verifyEmail, resendVerificationCode } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    verificationCode: "",
  });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isVerify = mode === "verify";

  const title = isLogin
    ? "Welcome Back"
    : isRegister
      ? "Start your journey"
      : "Verify your email";

  const description = isLogin
    ? "Securely access your recruitment dashboard and manage your pipeline."
    : isRegister
      ? "Create your recruiter account, then verify your email to unlock the platform."
      : "We sent a verification code to your inbox. Confirm it here so we can finish your setup.";

  const setField = (key: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setFeedback(null);
    if (nextMode !== "verify") {
      setField("verificationCode", "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(formData.email.trim(), formData.password);
        return;
      }

      if (isRegister) {
        const message = await register({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });

        setFeedback({
          tone: "success",
          message: `${message} Enter the verification code sent to ${formData.email}.`,
        });
        setMode("verify");
        return;
      }

      const verifyMessage = await verifyEmail({
        email: formData.email.trim(),
        code: formData.verificationCode.trim(),
      });

      try {
        await login(formData.email.trim(), formData.password);
      } catch {
        setMode("login");
        setFeedback({
          tone: "success",
          message: `${verifyMessage} Your email is verified now. Sign in to continue.`,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";

      if (isLogin && /verify/i.test(message)) {
        setMode("verify");
        setFeedback({
          tone: "info",
          message: `${message} Enter the code sent to ${formData.email} to continue.`,
        });
      } else {
        setFeedback({ tone: "error", message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.email.trim()) {
      setFeedback({
        tone: "error",
        message: "Enter your email address first so we know where to resend the code.",
      });
      return;
    }

    setFeedback(null);
    setIsResending(true);

    try {
      const message = await resendVerificationCode(formData.email.trim());
      setFeedback({ tone: "success", message });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We couldn't resend the verification code.";
      setFeedback({ tone: "error", message });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Cpu className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-primary">Umurava AI</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-muted-foreground font-medium">{description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            {feedback && (
              <div
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm font-medium",
                  feedback.tone === "error" && "border-red-200 bg-red-50 text-red-700",
                  feedback.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                  feedback.tone === "info" && "border-blue-200 bg-blue-50 text-blue-700",
                )}
              >
                {feedback.message}
              </div>
            )}

            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  key="register-fields"
                  className="space-y-6"
                >
                  <GlassInput
                    label="First Name"
                    placeholder="Enter your first name"
                    icon={<User className="w-4 h-4" />}
                    value={formData.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    required
                  />
                  <GlassInput
                    label="Last Name"
                    placeholder="Enter your last name"
                    icon={<User className="w-4 h-4" />}
                    value={formData.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <GlassInput
              label="Email Address"
              type="email"
              placeholder="e.g. shema@umurava.africa"
              icon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={(e) => setField("email", e.target.value)}
              required
              disabled={isVerify}
            />

            {isVerify ? (
              <GlassInput
                label="Verification Code"
                placeholder="Enter the 6-digit code"
                icon={<Shield className="w-4 h-4" />}
                value={formData.verificationCode}
                onChange={(e) => setField("verificationCode", e.target.value)}
                inputMode="numeric"
                required
              />
            ) : (
              <GlassInput
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={formData.password}
                onChange={(e) => setField("password", e.target.value)}
                required
              />
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest text-xs disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting
                ? "Please wait"
                : isLogin
                  ? "Sign In"
                  : isRegister
                    ? "Create Account"
                    : "Verify & Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-4">
            {isVerify ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-medium">
                  Didn&apos;t get the email?
                  <button
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="ml-2 text-primary font-black hover:underline decoration-primary/30 underline-offset-4"
                  >
                    {isResending ? "Resending..." : "Resend code"}
                  </button>
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  Already verified?
                  <button
                    onClick={() => switchMode("login")}
                    className="ml-2 text-primary font-black hover:underline decoration-primary/30 underline-offset-4"
                  >
                    Go to sign in
                  </button>
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-medium">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => switchMode(isLogin ? "register" : "login")}
                  className="text-primary font-black hover:underline decoration-primary/30 underline-offset-4"
                >
                  {isLogin ? "Register Now" : "Log In"}
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 relative bg-secondary/10 items-center justify-center p-12 overflow-hidden">
        <div
          className="absolute inset-0 grayscale opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1932&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 w-full max-w-lg space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-primary">
              <Zap className="w-6 h-6" />
              <h3 className="text-3xl font-black tracking-tight">AI-Powered Shortlisting</h3>
            </div>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              Our AI analyzes thousands of profiles in seconds, delivering high-precision rankings
              tailored to your specific job briefs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-primary">
              <Shield className="w-6 h-6" />
              <h3 className="text-3xl font-black tracking-tight">Explainable AI</h3>
            </div>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              Every candidate ranking comes with a detailed natural language explanation. Understand
              the &quot;why&quot; behind every match.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
