"use client";

import { Bell, Search, HelpCircle, Menu } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 lg:gap-8">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-primary lg:hidden hover:bg-secondary rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <nav className="hidden md:flex gap-6">
          <button className="text-primary font-bold border-b-2 border-primary pb-1">Talent Screening</button>
          <button className="text-muted-foreground hover:text-primary transition-colors">Analytics</button>
          <button className="text-muted-foreground hover:text-primary transition-colors">Reports</button>
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="relative hidden sm:block w-40 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-secondary border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-4">
          <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full relative sm:hidden">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="hidden sm:p-2 text-muted-foreground hover:bg-secondary rounded-full">
            <HelpCircle className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 ml-1 md:ml-2 border-l pl-3 md:pl-6 border-border">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary overflow-hidden border-2 border-primary/10">
              <div className="w-full h-full bg-[#004D4D] flex items-center justify-center text-white font-bold text-xs md:text-base">
                S
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
