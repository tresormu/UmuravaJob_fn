"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatSidebar({ isOpen, onClose }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your Umurava AI assistant. How can I help you with your hiring pipeline today?" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = { 
        role: "assistant", 
        content: "I'm currently in a preview state. Soon, I'll be able to help you analyze candidate resumes, compare shortlists, and draft interview questions based on your specific job briefs." 
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-primary/20 backdrop-blur-sm lg:bg-transparent"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md bg-white shadow-2xl border-l border-border/50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-primary text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest">AI Assistant</h3>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-tight">Umurava Talent Intelligence</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-secondary/30"
            >
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex gap-4",
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    m.role === "assistant" ? "bg-primary text-white" : "bg-accent text-white"
                  )}>
                    {m.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed",
                    m.role === "assistant" 
                      ? "bg-white text-primary rounded-tl-none shadow-sm border border-border/50" 
                      : "bg-primary text-white rounded-tr-none shadow-xl shadow-primary/10"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-border/50 bg-white">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask the AI about your candidates..."
                  className="w-full bg-secondary/50 border border-border/50 rounded-2xl py-4 pl-4 pr-14 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-[10px] text-center text-muted-foreground font-medium uppercase tracking-widest opacity-50">
                Powered by Gemini 1.5 Pro
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
