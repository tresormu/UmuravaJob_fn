"use client";

import { Bell, Search, Menu, X, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { PremiumLink } from "@/components/common/PremiumLink";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  // onMenuClick and onAIChatClick are now handled via useUI context
}

const mockNotifications = [
  { id: 1, title: "New Applicant", message: "Someone applied for Senior Frontend Engineer", time: "2m ago" },
  { id: 2, title: "Shortlist Ready", message: "AI has completed screening for Product Designer", time: "1h ago" },
  { id: 3, title: "Job Expired", message: "Data Analyst role brief has reached its deadline", time: "5h ago" },
];

export function Header({}: HeaderProps) {
  const { setIsSidebarOpen, setIsAIChatOpen } = useUI();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileInitial = user?.firstName?.charAt(0).toUpperCase() ?? "U";
  const profileName = user?.fullName ?? "Recruiter";
  const profileEmail = user?.email ?? "recruiter@umurava.ai";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-border/50 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-4 lg:gap-8">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-primary lg:hidden hover:bg-secondary rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden lg:flex items-center gap-2">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">System Status:</span>
           <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-full">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
             <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Active</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="relative hidden sm:block w-40 md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs, projects, or talent..." 
            className="w-full bg-secondary/50 border border-border/50 rounded-2xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all duration-300 placeholder:text-muted-foreground/60 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 md:gap-4">
          <button className="p-2.5 text-muted-foreground hover:bg-secondary hover:text-primary rounded-xl relative sm:hidden transition-all">
            <Search className="w-5 h-5" />
          </button>
          
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-xl relative transition-all duration-300 ${showNotifications ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-primary"}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white shadow-sm"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white border border-border/50 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden z-50 p-2"
                >
                  <div className="p-4 flex items-center justify-between border-b border-border/30">
                    <h3 className="font-black text-primary uppercase text-[10px] tracking-widest">Notifications</h3>
                    <span className="text-[9px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">3 NEW</span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {mockNotifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer group rounded-2xl mt-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs font-black text-primary group-hover:text-accent transition-colors">{notif.title}</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{notif.message}</p>
                          </div>
                          <span className="text-[9px] text-muted-foreground font-bold shrink-0">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <PremiumLink href="/notifications" className="block text-center p-3 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-2xl mt-1">
                    View all activity
                  </PremiumLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsAIChatOpen(true)}
            className="p-2.5 text-muted-foreground hover:bg-secondary hover:text-primary rounded-xl transition-all"
            title="Chat with AI"
          >
            <Sparkles className="w-5 h-5 text-accent" />
          </button>
          
          <div className="relative group/profile" onMouseEnter={() => setShowProfileDropdown(true)} onMouseLeave={() => setShowProfileDropdown(false)}>
            <div className="flex items-center gap-3 ml-1 md:ml-2 border-l pl-3 md:pl-6 border-border/50 cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm border border-border/50">
                  {profileInitial}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-border/50 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50 p-1"
                >
                  <div className="p-3 border-b border-border/30 mb-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{profileName}</p>
                    <p className="text-[9px] text-muted-foreground font-medium truncate">{profileEmail}</p>
                  </div>
                  <div className="space-y-0.5">
                    <PremiumLink href="/profile" className="flex items-center gap-2 p-2.5 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-secondary rounded-xl transition-all">
                      Profile
                    </PremiumLink>
                    <PremiumLink href="/settings" className="flex items-center gap-2 p-2.5 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-secondary rounded-xl transition-all">
                      Settings
                    </PremiumLink>
                    <button 
                      onClick={() => void logout()}
                      className="w-full flex items-center gap-2 p-2.5 text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
