import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center px-6"
    >
      <div className="w-20 h-20 bg-light-grey rounded-full flex items-center justify-center mb-6 text-ash/20">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-display font-bold text-dark/40">{title}</h3>
      <p className="text-ash/30 text-[11px] font-bold uppercase tracking-widest mt-2 max-w-xs mx-auto">
        {description}
      </p>
      
      {action && (
        <button 
          onClick={action.onClick}
          className="mt-8 px-8 py-3 bg-dark text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-cyan transition-all shadow-lg shadow-dark/5"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};
