import React from 'react';
import { Skeleton } from '@/components/common/Skeleton';

export const CartSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3" aria-label="Loading cart items">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
          <div className="flex flex-col gap-1.5 w-1/2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
};
