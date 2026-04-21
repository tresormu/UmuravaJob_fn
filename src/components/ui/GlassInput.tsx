"use client";

import React from "react";
import { cn } from "@/utils/cn"; // Assuming a cn utility exists or I'll create it

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export function GlassInput({ label, icon, className, ...props }: GlassInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground ml-1">
        {label}
      </label>
      <div className={cn(
        "group relative flex items-center rounded-2xl border border-border bg-white/5 backdrop-blur-md transition-all duration-300 focus-within:border-primary/50 focus-within:bg-primary/5 focus-within:shadow-[0_0_20px_-5px_rgba(var(--primary),0.2)]",
        className
      )}>
        {icon && (
          <div className="pl-4 text-muted-foreground group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          className="w-full bg-transparent p-4 text-sm outline-none placeholder:text-muted-foreground/50 disabled:opacity-50"
          {...props}
        />
      </div>
    </div>
  );
}
