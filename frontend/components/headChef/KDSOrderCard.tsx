'use client';

import React, { useState, useEffect } from 'react';
import { StudentOrder } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, Pause, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface KDSOrderCardProps {
  order: StudentOrder;
  onStartPreparing: (orderId: string) => void;
  onPausePreparation: (orderId: string) => void;
  onResumePreparation: (orderId: string) => void;
  onMarkReady: (orderId: string) => void;
}

export const KDSOrderCard: React.FC<KDSOrderCardProps> = ({
  order,
  onStartPreparing,
  onPausePreparation,
  onResumePreparation,
  onMarkReady,
}) => {
  const { showToast } = useToast();
  const [cookingSeconds, setCookingSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (order.status === 'PREPARING' && !order.isPaused) {
      interval = setInterval(() => {
        setCookingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [order.status, order.isPaused]);

  const handleChangePriority = () => {
    // TODO: Replace with KDS priority API call
    showToast(`Priority updated for Token #${order.tokenNumber}`, 'info');
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const priorityColor =
    order.kitchenPriority === 'HIGH'
      ? 'bg-red-50 text-red-700 border-red-200'
      : order.kitchenPriority === 'MEDIUM'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <Card className="p-5 border-slate-200/80 shadow-md bg-white flex flex-col justify-between gap-4 relative overflow-hidden">
      {/* Priority Indicator Strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          order.kitchenPriority === 'HIGH' ? 'bg-red-500' : 'bg-[#054A36]'
        }`}
      />

      {/* Top Header: Token & Priority */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center font-extrabold shadow-md shrink-0">
            <span className="text-[9px] uppercase tracking-wider text-amber-400">TOKEN</span>
            <span className="text-2xl text-amber-300">#{order.tokenNumber}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">Order #{order.orderNumber}</h3>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${priorityColor}`}>
                {order.kitchenPriority || 'NORMAL'} PRIORITY
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pickup Slot: <strong>{order.pickupSlot}</strong>
            </p>
          </div>
        </div>

        {/* Live Cooking Timer Display */}
        {order.status === 'PREPARING' && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Cooking Timer</span>
            <span className="text-base font-extrabold text-amber-600 font-mono flex items-center gap-1">
              <Clock className="h-4 w-4 text-amber-500 animate-spin" />
              {formatTimer(cookingSeconds)}
            </span>
          </div>
        )}
      </div>

      {/* Ticket Item List */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Preparation Ticket</span>
        <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm font-bold text-slate-900">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#054A36] text-white text-xs flex items-center justify-center font-extrabold">
                  {item.quantity}x
                </span>
                <span>{item.itemName}</span>
              </span>
            </div>
          ))}
        </div>

        {order.specialInstructions && (
          <p className="text-xs text-red-800 bg-red-50 p-2.5 rounded-lg border border-red-200 font-semibold flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>Chef Note: {order.specialInstructions}</span>
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleChangePriority}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline"
        >
          Change Priority
        </button>

        <div className="flex items-center gap-2">
          {order.status === 'SENT_TO_KITCHEN' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStartPreparing(order.id)}
              leftIcon={<Play className="h-4 w-4" />}
              className="bg-[#054A36] text-xs font-bold"
            >
              Start Preparing
            </Button>
          )}

          {order.status === 'PREPARING' && (
            <>
              {order.isPaused ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onResumePreparation(order.id)}
                  leftIcon={<Play className="h-4 w-4" />}
                  className="text-xs"
                >
                  Resume
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onPausePreparation(order.id)}
                  leftIcon={<Pause className="h-4 w-4" />}
                  className="text-xs"
                >
                  Pause
                </Button>
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={() => onMarkReady(order.id)}
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-xs font-extrabold shadow-sm"
              >
                Mark Ready
              </Button>
            </>
          )}

          {order.status === 'READY' && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Ready for Pickup
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
