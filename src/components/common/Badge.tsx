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
    "Deep Reel": "bg-cyan/10 text-[#127171]",
    "Carousel": "bg-yellow/20 text-[#7a6500]",
    "Wide Short": "bg-red/10 text-[#b83030]",
    "Long Form": "bg-turq/20 text-[#0d7060]",
    "Script Ready": "bg-cyan/10 text-cyan border border-cyan/20",
    "Draft": "bg-muted/10 text-muted",
    "default": "bg-muted/5 text-muted"
  };
  
  return (
    <span className={cn(
      "text-[10px] font-bold px-2 py-0.5 rounded-full transition-all whitespace-nowrap", 
      styles[variant as keyof typeof styles] || styles.default,
      className
    )}>
      {children}
    </span>
  );
};
