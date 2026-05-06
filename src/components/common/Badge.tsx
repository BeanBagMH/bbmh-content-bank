import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className }) => {
  const styles: Record<string, string> = {
    "Deep Reel": "text-magenta border-b border-magenta",
    "Carousel": "text-graphite border-b border-mist",
    "Wide Short": "text-charcoal border-b border-mist",
    "Long Form": "text-graphite font-bold italic",
    "Script Ready": "text-magenta uppercase tracking-widest font-bold",
    "Draft": "text-ash uppercase tracking-widest",
    "default": "text-ash"
  };
  
  return (
    <span className={cn(
      "text-[10px] py-0.5 transition-all whitespace-nowrap inline-flex items-center gap-2", 
      styles[variant as keyof typeof styles] || styles.default,
      className
    )}>
      {children}
    </span>
  );
};
