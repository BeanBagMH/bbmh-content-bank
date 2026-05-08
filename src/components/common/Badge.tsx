import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className, ...props }) => {
  const getStyles = (v?: string) => {
    switch (v) {
      // Priority
      case 'Urgent': return 'bg-red-500 text-white border-red-600';
      case 'High': return 'bg-red-50 text-red-600 border-red-200';
      case 'Medium': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Low': return 'bg-slate-50 text-slate-500 border-slate-200';
      
      // Status
      case 'Published': return 'bg-turquoise/10 text-cyan border-turquoise/20';
      case 'Scheduled': return 'bg-cyan text-white border-cyan';
      case 'Review': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Scripting': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      
      // Types
      case 'Reel': return 'bg-magenta-whisper text-magenta border-magenta/20';
      case 'YouTube Short': return 'bg-red-50 text-red-600 border-red-100';
      case 'Blog': return 'bg-amber-50 text-amber-700 border-amber-200';
      
      default: return 'bg-light-grey text-ash/60 border-mist';
    }
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
        getStyles(variant),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
