import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({ className, children, variant = 'error', title, ...props }) => {
  const icons = {
    error: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
  };

  const variants = {
    error: 'bg-red-50 border-red-200 text-red-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  return (
    <div
      role="alert"
      className={cn('flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm font-medium', variants[variant], className)}
      {...props}
    >
      {icons[variant]}
      <div className="flex flex-col gap-0.5">
        {title && <h4 className="font-semibold">{title}</h4>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
