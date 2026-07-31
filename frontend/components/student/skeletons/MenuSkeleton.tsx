import React from 'react';
import { Skeleton } from '@/components/common/Skeleton';

export const MenuSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Loading food menu">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-3">
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
};
