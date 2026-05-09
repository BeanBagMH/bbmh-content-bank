import { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'loading';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

let toastCount = 0;
let observers: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

const notify = () => {
  observers.forEach(observer => observer([...toasts]));
};

export const toast = {
  success: (message: string, options?: { id?: string, duration?: number }) => {
    const id = options?.id || `toast-${toastCount++}`;
    const existing = toasts.find(t => t.id === id);
    if (existing) {
      toasts = toasts.map(t => t.id === id ? { ...t, message, type: 'success' as ToastType } : t);
    } else {
      toasts = [{ id, message, type: 'success', duration: options?.duration || 3000 }, ...toasts];
    }
    notify();
    if (!options?.id) setTimeout(() => toast.dismiss(id), options?.duration || 3000);
    return id;
  },
  error: (message: string, options?: { id?: string, duration?: number }) => {
    const id = options?.id || `toast-${toastCount++}`;
    toasts = [{ id, message, type: 'error', duration: options?.duration || 5000 }, ...toasts];
    notify();
    setTimeout(() => toast.dismiss(id), options?.duration || 5000);
    return id;
  },
  loading: (message: string, options?: { id?: string }) => {
    const id = options?.id || `toast-${toastCount++}`;
    toasts = [{ id, message, type: 'loading' }, ...toasts];
    notify();
    return id;
  },
  dismiss: (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    notify();
  }
};

export function useToasts() {
  const [activeToasts, setActiveToasts] = useState<Toast[]>([]);

  useEffect(() => {
    observers.push(setActiveToasts);
    setActiveToasts([...toasts]);
    return () => {
      observers = observers.filter(o => o !== setActiveToasts);
    };
  }, []);

  return activeToasts;
}
