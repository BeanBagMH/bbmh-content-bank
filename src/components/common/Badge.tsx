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
    "Deep Reel": "bg-cyan/10 text-cyan border border-cyan/20",
    "Carousel": "bg-yellow/10 text-yellow border border-yellow/20",
    "Wide Short": "bg-red/10 text-red border border-red/20",
    "Long Form": "bg-turq/10 text-turq border border-turq/20",
    "Script Ready": "bg-cyan/10 text-cyan border border-cyan/30",
    "Draft": "bg-white/5 text-white/50 border border-white/10",
    "default": "bg-white/5 text-white/40"
  };
  
  return (
    <span className={cn(
      "text-[10px] font-black px-2.5 py-1 rounded-lg transition-all whitespace-nowrap uppercase tracking-wider", 
      styles[variant as keyof typeof styles] || styles.default,
      className
    )}>
      {children}
    </span>
  );
};
