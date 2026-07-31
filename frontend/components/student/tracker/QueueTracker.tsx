'use client';

import React from 'react';
import { QueueStatus } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QrCode, Clock, CheckCircle2, ChefHat, PackageCheck, Flame, Users } from 'lucide-react';

interface QueueTrackerProps {
  queueStatus: QueueStatus | null;
  onOpenQRModal: () => void;
}

export const QueueTracker: React.FC<QueueTrackerProps> = ({ queueStatus, onOpenQRModal }) => {
  if (!queueStatus) return null;

  const steps = [
    { label: 'Order Placed', icon: <Flame className="h-4 w-4" /> },
    { label: 'Confirmed', icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: 'Preparing', icon: <ChefHat className="h-4 w-4" /> },
    { label: 'Ready for Pickup', icon: <PackageCheck className="h-4 w-4" /> },
  ];

  return (
    <Card className="p-5 sm:p-6 border-slate-200/80 shadow-md bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-lg text-slate-900">Active Order #{queueStatus.orderNumber}</h3>
            <Badge variant="emerald" className="animate-pulse">
              Live Queue Status
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{queueStatus.statusText}</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Queue Position Pill */}
          {queueStatus.queuePosition && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold">
              <Users className="h-4 w-4 text-blue-600" />
              <span>Position #{queueStatus.queuePosition} in Queue</span>
            </div>
          )}

          {/* Wait Time Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold">
            <Clock className="h-4 w-4 text-amber-600" />
            <span>Est. Wait: ~{queueStatus.estimatedWaitMinutes} mins</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenQRModal}
            leftIcon={<QrCode className="h-4 w-4" />}
            className="bg-[#054A36] text-white font-bold shadow-sm"
          >
            Show Pickup QR
          </Button>
        </div>
      </div>

      {/* Progress Steps Timeline */}
      <div className="grid grid-cols-4 gap-2 relative">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isDone = queueStatus.currentStep >= stepNumber;
          const isCurrent = queueStatus.currentStep === stepNumber;

          return (
            <div key={idx} className="flex flex-col items-center text-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#054A36] text-white ring-4 ring-emerald-100 scale-110 shadow-md'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`text-[11px] font-semibold leading-tight ${
                  isCurrent ? 'text-[#054A36] font-bold' : isDone ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
