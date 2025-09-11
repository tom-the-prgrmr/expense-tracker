import { useContext } from 'react';
import { ToastContext, type ToastContextValue } from './ToastProvider';

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
