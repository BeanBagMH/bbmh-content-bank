import { useState, useEffect, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Global state for toasts
let listeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

const notify = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
};

const addToast = (message: string, type: ToastType) => {
  const id = Math.random().toString(36).substring(2, 9);
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => {
    removeToast(id);
  }, 3000);
};

const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
};

export const useToasts = () => {
  const [state, setState] = useState<Toast[]>(toasts);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);

  return state;
};
