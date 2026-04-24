"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SLIDES = [
  {
    id: 1,
    title: "Welcome to Umurava AI",
    description: "The future of talent screening is here. We help you transform application volumes into actionable shortlists using state-of-the-art AI.",
    icon: <Sparkles className="w-12 h-12 text-primary" />,
    color: "bg-primary/5"
  },
  {
    id: 2,
    title: "AI-Powered Shortlisting",
    description: "Automatically rank your top 10 or 20 candidates based on skills, experience, and education. No more manual sorting through hundreds of resumes.",
    icon: <Zap className="w-12 h-12 text-primary" />,
    color: "bg-primary/5"
  },
  {
    id: 3,
    title: "Explainable Insights",
    description: "Understand the 'why' behind every match. Our AI provides natural-language reasoning for every candidate, highlighting strengths and potential gaps.",
    icon: <Shield className="w-12 h-12 text-primary" />,
    color: "bg-primary/5"
  },
  {
    id: 4,
    title: "Human-Led, AI-Enhanced",
    description: "We handle the data parsing and heavy lifting, but you stay in control. Make your final hiring decisions with more confidence and less fatigue.",
    icon: <CheckCircle2 className="w-12 h-12 text-primary" />,
    color: "bg-primary/5"
  }
];

export function OnboardingFlow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { completeOnboarding } = useAuth();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="h-screen w-full flex overflow-hidden font-sans">
      {/* Left Panel: Visuals/Pictures Placeholder */}
      <div className="w-[45%] h-full bg-primary relative flex flex-col justify-between p-12 text-white overflow-hidden">
        {/* Decorative elements for the side */}
        <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-full h-full bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter">Umurava AI</span>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center">
           <div className="w-full aspect-[4/5] rounded-[3rem] border-2 border-white/20 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center text-white/40 italic text-sm text-center px-12 border-dashed">
              <Sparkles className="w-12 h-12 mb-4 opacity-20" />
              Pictures and visuals for the onboarding step will be inserted here
           </div>
        </div>

        <div className="relative z-10 flex flex-col gap-2">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Talent Screening Room</p>
           <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
                className="h-full bg-white" 
              />
           </div>
        </div>
      </div>

      {/* Right Panel: Content Section */}
      <div className="flex-1 h-full bg-white flex flex-col justify-center px-12 md:px-24">
        <div className="max-w-xl w-full space-y-12">
          {/* Progress Indicators */}
          <div className="flex gap-3">
            {SLIDES.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? "w-12 bg-primary" : "w-3 bg-primary/10"}`}
              />
            ))}
          </div>

          {/* Dynamic Content */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className={`w-16 h-16 ${slide.color} rounded-2xl flex items-center justify-center`}>
                  {slide.icon}
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  {slide.title}
                </h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
            <button 
              onClick={handleNext}
              className="w-full sm:w-auto px-12 h-16 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              {currentSlide === SLIDES.length - 1 ? "Finish & Explore" : "Next Step"}
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {currentSlide < SLIDES.length - 1 && (
              <button 
                onClick={completeOnboarding}
                className="text-slate-400 font-bold hover:text-primary transition-colors text-xs uppercase tracking-widest"
              >
                Skip Onboarding
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
