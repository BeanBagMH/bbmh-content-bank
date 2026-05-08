import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToasts, ToastType } from '../../hooks/useToast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../common/Badge';

export const ToastContainer: React.FC = () => {
  const toasts = useToasts();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast }: { toast: any }) => {
  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success': return "bg-dark border-cyan/20 text-white";
      case 'error': return "bg-red-500 border-red-400 text-white";
      default: return "bg-white border-mist text-dark";
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-cyan" />;
      case 'error': return <AlertCircle size={16} className="text-white" />;
      default: return <Info size={16} className="text-ash" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={cn(
        "flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl pointer-events-auto min-w-[300px]",
        getStyles(toast.type)
      )}
    >
      {getIcon(toast.type)}
      <p className="text-[12px] font-bold tracking-tight flex-1">{toast.message}</p>
    </motion.div>
  );
};
