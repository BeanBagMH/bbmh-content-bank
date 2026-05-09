import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { useToasts, toast } from '../../hooks/useToast';
import { cn } from './Badge';

export const ToastContainer: React.FC = () => {
  const toasts = useToasts();

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 items-center pointer-events-none w-full max-w-md px-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto flex items-center gap-4 p-4 pr-6 bg-white border border-mist shadow-2xl rounded-[24px] min-w-[280px] lg:min-w-[320px] backdrop-blur-xl",
              t.type === 'error' && "border-red-100",
              t.type === 'success' && "border-green-100"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              t.type === 'success' && "bg-green-50 text-green-500",
              t.type === 'error' && "bg-red-50 text-red-500",
              t.type === 'loading' && "bg-cyan/10 text-cyan",
              t.type === 'info' && "bg-light-grey text-ash"
            )}>
              {t.type === 'success' && <CheckCircle2 size={20} />}
              {t.type === 'error' && <AlertCircle size={20} />}
              {t.type === 'loading' && <Loader2 size={20} className="animate-spin" />}
            </div>
            
            <div className="flex-1">
               <p className="text-[13px] font-bold text-dark leading-tight">{t.message}</p>
               {t.type === 'loading' && <p className="text-[9px] font-black uppercase text-ash/40 tracking-widest mt-1">Strategic Process Active</p>}
            </div>

            <button 
              onClick={() => toast.dismiss(t.id)}
              className="p-2 text-ash/20 hover:text-dark transition-colors"
            >
               <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
