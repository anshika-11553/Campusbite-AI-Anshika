import React from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('max-w-7xl mx-auto w-full space-y-6', className)} {...props}>
      {children}
    </div>
  );
};
