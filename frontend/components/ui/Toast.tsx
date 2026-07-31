import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
  };

  const borderVariants = {
    success: 'border-l-4 border-l-emerald-600 bg-white border border-slate-200',
    error: 'border-l-4 border-l-red-600 bg-white border border-slate-200',
    warning: 'border-l-4 border-l-amber-600 bg-white border border-slate-200',
    info: 'border-l-4 border-l-blue-600 bg-white border border-slate-200',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start justify-between gap-3 p-4 rounded-xl shadow-lg shadow-slate-200/50 max-w-sm w-full transition-all duration-300 animate-in fade-in slide-in-from-top-2',
        borderVariants[toast.type]
      )}
    >
      <div className="flex items-start gap-3">
        {icons[toast.type]}
        <div className="flex flex-col gap-0.5">
          {toast.title && <h4 className="font-bold text-xs text-slate-900">{toast.title}</h4>}
          <p className="text-xs text-slate-600 leading-normal">{toast.message}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
