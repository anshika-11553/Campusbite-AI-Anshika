import React from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';

export interface ApiErrorDisplayProps {
  message?: string;
  onRetry: () => void;
}

export const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({
  message = 'Failed to load data from canteen server.',
  onRetry,
}) => {
  return (
    <div className="p-4 flex flex-col items-center gap-3">
      <Alert variant="error" title="Network Connection Issue" className="w-full">
        {message}
      </Alert>
      <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<RotateCcw className="h-4 w-4" />}>
        Retry Loading
      </Button>
    </div>
  );
};
