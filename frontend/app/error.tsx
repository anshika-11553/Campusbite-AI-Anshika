'use client';

import React, { useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { logger } from '@/utils/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Global App Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-md w-full p-8 text-center flex flex-col items-center gap-4">
        <div className="p-4 bg-red-100 rounded-full text-red-600">
          <AlertOctagon className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">500 - Application Error</h1>
        <p className="text-sm text-slate-600">
          An unexpected server or runtime error occurred while processing your request.
        </p>
        <Button
          variant="primary"
          onClick={() => reset()}
          className="w-full mt-2"
          leftIcon={<RotateCcw className="h-4 w-4" />}
        >
          Reload & Try Again
        </Button>
      </Card>
    </div>
  );
}
