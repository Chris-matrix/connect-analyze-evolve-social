'use client';

import * as React from 'react';

type ToastVariant = 'default' | 'destructive';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (props: ToastProps) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  toast: () => {},
});

export const useToast = () => {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
