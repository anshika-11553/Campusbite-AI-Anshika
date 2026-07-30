import React from 'react';
import { Skeleton } from '@/components/common/Skeleton';

export const QueueTrackerSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full rounded-full" />
      <div className="grid grid-cols-4 gap-2 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
};
