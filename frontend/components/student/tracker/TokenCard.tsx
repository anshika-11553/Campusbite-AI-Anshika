'use client';

import React, { useState, useEffect } from 'react';
import { StudentOrder } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QrCode, Clock, CheckCircle2, ChefHat, PackageCheck, Flame, Users, Store, ArrowRight, UserCheck } from 'lucide-react';

interface TokenCardProps {
  order: StudentOrder;
  onOpenQRModal: () => void;
  onConfirmCollection?: (orderId: string) => void;
}

export const TokenCard: React.FC<TokenCardProps> = ({ order, onOpenQRModal, onConfirmCollection }) => {
  const [countdownMinutes, setCountdownMinutes] = useState<number>(order.estimatedPreparationTimeMinutes || 8);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prevSec) => {
        if (prevSec > 0) return prevSec - 1;
        if (countdownMinutes > 0) {
          setCountdownMinutes((prevMin) => prevMin - 1);
          return 59;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownMinutes]);

  const timelineSteps = [
    { key: 'PENDING', label: 'Pending', icon: <Flame className="h-4 w-4" />, color: 'bg-amber-400 text-slate-900', border: 'border-amber-400' },
    { key: 'ACCEPTED', label: 'Accepted', icon: <CheckCircle2 className="h-4 w-4" />, color: 'bg-blue-500 text-white', border: 'border-blue-500' },
    { key: 'SENT_TO_KITCHEN', label: 'Sent to Kitchen', icon: <Store className="h-4 w-4" />, color: 'bg-purple-500 text-white', border: 'border-purple-500' },
    { key: 'PREPARING', label: 'Preparing', icon: <ChefHat className="h-4 w-4" />, color: 'bg-orange-500 text-white', border: 'border-orange-500' },
    { key: 'READY', label: 'Ready for Pickup', icon: <PackageCheck className="h-4 w-4" />, color: 'bg-emerald-500 text-white', border: 'border-emerald-500' },
    { key: 'COLLECTED', label: 'Collected', icon: <CheckCircle2 className="h-4 w-4" />, color: 'bg-slate-700 text-white', border: 'border-slate-700' },
  ];

  const getStepIndex = (st: string) => {
    switch (st) {
      case 'PENDING': return 0;
      case 'ACCEPTED': return 1;
      case 'SENT_TO_KITCHEN': return 2;
      case 'PREPARING': return 3;
      case 'READY': return 4;
      case 'COLLECTED': return 5;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <Card className="p-0 border-2 border-emerald-600/30 shadow-xl bg-white rounded-3xl overflow-hidden relative">
      {/* Top Banner Shimmer Accent */}
      <div className="bg-gradient-to-r from-[#054A36] via-emerald-800 to-[#054A36] text-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
        <div className="flex items-center gap-4">
          {/* Prominent Large Token Box */}
          <div className="w-20 h-20 bg-white text-[#054A36] rounded-2xl flex flex-col items-center justify-center shadow-lg border-2 border-emerald-300 shrink-0">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-500">TOKEN</span>
            <span className="text-3xl font-extrabold tracking-tighter">#{order.tokenNumber}</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Badge variant="emerald" className="bg-emerald-400 text-slate-950 font-extrabold animate-pulse">
                Order #{order.orderNumber}
              </Badge>
              {order.pickupCounter && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 border border-white/20">
                  {order.pickupCounter}
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">{order.vendorName}</h3>
            <p className="text-xs text-emerald-100/80">
              {order.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <Button
            variant="secondary"
            onClick={onOpenQRModal}
            leftIcon={<QrCode className="h-4 w-4 text-[#054A36]" />}
            className="bg-white text-[#054A36] font-bold shadow-md hover:bg-slate-100"
          >
            Show Pickup QR
          </Button>

          {order.status === 'READY' && onConfirmCollection && (
            <Button
              variant="primary"
              onClick={() => onConfirmCollection(order.id)}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-md animate-bounce"
            >
              I Have Collected
            </Button>
          )}
        </div>
      </div>

      {/* Middle Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 bg-slate-50 border-b border-slate-200">
        <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Queue Position</span>
            <h4 className="font-extrabold text-sm text-slate-900">Position #{order.queuePosition || 1}</h4>
          </div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Est. Countdown</span>
            <h4 className="font-extrabold text-sm text-amber-700">
              {String(countdownMinutes).padStart(2, '0')}:{String(countdownSeconds).padStart(2, '0')} min
            </h4>
          </div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Accepted By</span>
            <h4 className="font-bold text-xs text-slate-900 truncate">{order.acceptedBy || 'Main Food Court'}</h4>
          </div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <ChefHat className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Prepared By</span>
            <h4 className="font-bold text-xs text-slate-900 truncate">{order.preparedBy || 'Head Chef Kitchen'}</h4>
          </div>
        </div>
      </div>

      {/* 6-Step Animated Progress Timeline */}
      <div className="p-5 sm:p-6 bg-white space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-[#054A36]" />
          Order Preparation Timeline
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 relative pt-2">
          {timelineSteps.map((step, idx) => {
            const isDone = currentStepIdx > idx;
            const isCurrent = currentStepIdx === idx;

            return (
              <div key={step.key} className="flex flex-col items-center text-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCurrent
                      ? `${step.color} ring-4 ring-emerald-100 scale-110 shadow-md animate-pulse`
                      : isDone
                      ? 'bg-emerald-700 text-white'
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
      </div>
    </Card>
  );
};
