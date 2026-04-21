"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Mail, Lock, User, Zap, Shield, Cpu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GlassInput } from "@/components/ui/GlassInput";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(formData.email);
    } else {
      register(formData.email, formData.name);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative font-sans">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Panel: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Cpu className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-primary">Umurava AI</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight leading-tight">
              {isLogin ? "Welcome Back" : "Start your journey"}
            </h1>
            <p className="text-muted-foreground font-medium">
              {isLogin 
                ? "Securely access your recruitment dashboard and manage your pipeline." 
                : "Join the future of talent acquisition with AI-powered screening."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  key="name-field"
                >
                  <GlassInput 
                    label="Full Name" 
                    placeholder="Enter your name"
                    icon={<User className="w-4 h-4" />}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />

            <GlassInput 
              label="Password" 
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />

            <button 
              type="submit"
              className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-black hover:underline decoration-primary/30 underline-offset-4"
              >
                {isLogin ? "Register Now" : "Log In"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Content (Simplified) */}
      <div className="hidden lg:flex flex-1 relative bg-secondary/10 items-center justify-center p-12 overflow-hidden">
        <div 
          className="absolute inset-0 grayscale opacity-20 mix-blend-overlay"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1932&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center"
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
              Our AI analyzes thousands of profiles in seconds, delivering high-precision rankings tailored to your specific job briefs.
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
              Every candidate ranking comes with a detailed natural language explanation. Understand the "why" behind every match.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
