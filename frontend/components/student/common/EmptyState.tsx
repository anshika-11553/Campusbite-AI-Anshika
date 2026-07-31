import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <Card className="p-8 text-center flex flex-col items-center justify-center gap-3 max-w-md mx-auto my-6 border-slate-200/80">
      <div className="p-3.5 bg-slate-100 rounded-full text-slate-500">{icon}</div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
