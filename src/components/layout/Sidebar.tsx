"use client";

import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  BarChart3, 
  Sparkles,
  Settings, 
  PlusCircle,
  ChevronRight,
  ChevronLeft,
  User2,
  X
} from "lucide-react";
import { cn } from "@/utils/cn";
import { PremiumLink } from "@/components/common/PremiumLink";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Applicants", href: "/applicants", icon: Users },
  { label: "Screening", href: "/screening", icon: Sparkles },
  { label: "Shortlists", href: "/shortlists", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Profile", href: "/profile", icon: User2 },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay Dashboard */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "bg-white h-screen flex flex-col border-r border-border shadow-sm relative z-50 transition-all duration-300 ease-in-out lg:translate-x-0 overflow-hidden",
        "fixed inset-y-0 left-0 lg:sticky lg:flex",
        isCollapsed ? "w-24" : "w-72",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Branding Area Dashboard */}
        <div className={cn(
          "p-8 relative flex items-center border-b border-border/50",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <PremiumLink href="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105">
              <span className="text-white font-black text-sm tracking-[0.2em]">US</span>
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <h1 className="font-black text-primary leading-none tracking-tight text-xl italic uppercase">Umurava</h1>
              </div>
            )}
          </PremiumLink>
          <button onClick={onClose} className="lg:hidden p-2 text-primary/40 hover:text-primary transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Area Dashboard */}
        <div className="flex-1 py-6 space-y-8 overflow-y-auto no-scrollbar relative px-4">
          <div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <PremiumLink
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    title={isCollapsed ? item.label : ""}
                    className={cn(
                      "flex items-center rounded-2xl text-sm font-bold transition-all duration-300 group relative",
                      isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3.5",
                      isActive 
                        ? "bg-primary/5 text-primary shadow-sm border border-primary/10" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-xl transition-all duration-300",
                        isActive 
                          ? "bg-primary text-white shadow-md shadow-primary/20" 
                          : "bg-transparent text-muted-foreground group-hover:bg-white group-hover:text-primary group-hover:shadow-sm"
                      )}>
                        <Icon className={cn("transition-transform duration-300", isActive ? "w-4 h-4" : "w-5 h-5 group-hover:scale-110")} />
                      </div>
                      {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>}
                    </div>
                    {isActive && !isCollapsed && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    {!isActive && !isCollapsed && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />}
                  </PremiumLink>
                );
              })}
            </nav>
          </div>

        </div>

        {/* Footer Actions Dashboard */}
        <div className={cn(
          "p-6 mt-auto relative border-t border-border/50 bg-white/50 backdrop-blur-sm space-y-4",
          isCollapsed ? "flex flex-col items-center" : ""
        )}>
          <PremiumLink 
            href="/jobs/create"
            onClick={onClose}
            title={isCollapsed ? "Create New Job" : ""}
            className={cn(
              "btn-primary active:scale-95 group overflow-hidden",
              isCollapsed ? "w-12 h-12 rounded-xl" : "w-full btn-lg gap-3"
            )}
          >
            <PlusCircle className={cn("transition-transform duration-300 group-hover:rotate-90", isCollapsed ? "w-6 h-6" : "w-5 h-5")} />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Create New Job</span>}
          </PremiumLink>

          {/* Collapse Toggle Button Dashboard */}
          <button 
            onClick={onToggleCollapse}
            className={cn(
              "hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm group",
              isCollapsed ? "mx-auto" : "ml-auto"
            )}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            ) : (
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
