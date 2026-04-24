"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Cpu, Zap, Shield, Search, BarChart3, Users, Globe } from "lucide-react";

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 px-6">
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-primary/10 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-accent/10 blur-[120px]"
          />
        </div>

        <div className="container mx-auto relative z-10 text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/80 italic">Umurava AI v1.0</span>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-primary"
          >
            The <span className="text-accent italic">AI Operating System</span> <br />
            for Talent Screening
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Empowering recruiters to unlock candidate potential through the <span className="text-accent">magic of AI</span> and <span className="text-primary">explainable intelligence</span>.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={onGetStarted}
              className="min-w-[240px] h-16 bg-primary text-white text-xs uppercase tracking-[0.3em] font-black rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Get Started Now
            </button>
            <button
              className="min-w-[240px] h-16 bg-white/50 backdrop-blur-md border border-primary/10 text-primary text-xs uppercase tracking-[0.3em] font-black rounded-2xl hover:bg-primary hover:text-white transition-all duration-500"
            >
              Watch Video
            </button>
          </motion.div>

          {/* Mockup Preview */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24 relative p-1 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/50 shadow-2xl overflow-hidden"
          >
            <Image 
              src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1932&auto=format&fit=crop" 
              alt="Platform Preview" 
              width={1932}
              height={1080}
              priority
              className="w-full h-auto rounded-[2.8rem] grayscale opacity-80"
            />

          </motion.div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="py-32 px-6 bg-secondary/30 relative">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/10">
                <Zap className="w-3 h-3 text-accent" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-accent">Platform Capabilities</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-black tracking-tight text-primary">
               Everything You Need for <span className="text-accent italic">Modern Recruitment</span>
             </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Search />, title: "Precision Search", desc: "Instantly find matching talent across diverse data formats." },
              { icon: <Cpu />, title: "AI Agent", desc: "Autonomous screening logic that understands your job requirements." },
              { icon: <BarChart3 />, title: "Analytics", desc: "Real-time insights into candidate progression and pipeline health." },
              { icon: <Shield />, title: "Explainable AI", desc: "Detailed reasoning behind every single match and score." },
              { icon: <Users />, title: "Collaboration", desc: "Shared workspaces for recruitment teams to decide together." },
              { icon: <Globe />, title: "Global Reach", desc: "Scale your recruitment efforts across borders seamlessly." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 bg-white border border-border/50 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 space-y-6"
              >
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black tracking-tight text-primary">{feature.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Footer */}
      <footer className="py-20 border-t border-border/50 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
               <Cpu className="w-6 h-6" />
             </div>
             <span className="text-xl font-black text-primary tracking-tighter">Umurava AI</span>
          </div>
          <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-muted-foreground">
             <a href="#" className="hover:text-primary">Solutions</a>
             <a href="#" className="hover:text-primary">Pricing</a>
             <a href="#" className="hover:text-primary">Company</a>
             <a href="#" className="hover:text-primary">Legal</a>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            © 2024 Umurava AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
