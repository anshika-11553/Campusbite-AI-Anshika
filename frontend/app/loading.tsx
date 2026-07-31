import React from 'react';
import { Skeleton } from '@/components/common/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full flex flex-col gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <div className="flex flex-col gap-3 mt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full mt-2" />
        </div>
      </div>
    </div>
  );
}
