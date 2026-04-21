"use client";

import Link, { LinkProps } from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "@/context/TransitionContext";
import React from "react";

interface PremiumLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title?: string;
}

export function PremiumLink({ 
  href, 
  children, 
  className, 
  onClick, 
  ...props 
}: PremiumLinkProps) {
  const { setIsTransitioning } = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's a normal left click without modifiers
    if (
      e.button === 0 && 
      !e.ctrlKey && 
      !e.metaKey && 
      !e.shiftKey && 
      !e.altKey &&
      typeof href === 'string' &&
      !href.startsWith('http') &&
      !href.startsWith('#')
    ) {
      e.preventDefault();
      
      // If we're already on this page, don't trigger the transition overlay
      // to avoid an endless loading state.
      if (href === pathname) {
        return;
      }

      setIsTransitioning(true);
      
      // Artificial slight delay to ensure UI threads don't block the animation start
      // before navigation begins
      setTimeout(() => {
        router.push(href);
      }, 10);
    }
    
    if (onClick) onClick(e);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
