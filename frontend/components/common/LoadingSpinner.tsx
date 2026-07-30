import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className, label }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4" role="status">
      <Loader2 className={cn('animate-spin text-[#054A36]', sizes[size], className)} />
      {label && <span className="text-xs sm:text-sm font-medium text-slate-600">{label}</span>}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
};
