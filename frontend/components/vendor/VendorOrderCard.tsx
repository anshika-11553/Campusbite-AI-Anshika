'use client';

import React from 'react';
import { StudentOrder } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/constants/currency';
import { Check, X, ArrowRight, Printer, Clock, Bell, Flame } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface VendorOrderCardProps {
  order: StudentOrder;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onForwardToKitchen: (orderId: string) => void;
}

export const VendorOrderCard: React.FC<VendorOrderCardProps> = ({
  order,
  onAccept,
  onReject,
  onForwardToKitchen,
}) => {
  const { showToast } = useToast();

  const handlePrintSlip = () => {
    // TODO: Replace with thermal printer API call
    showToast(`Thermal slip printed for Token #${order.tokenNumber}`, 'info');
  };

  const handleDelayOrder = () => {
    // TODO: Replace with vendor delay order API call
    showToast(`Added +5 mins delay for Token #${order.tokenNumber}`, 'info');
  };

  const handleNotifyStudent = () => {
    // TODO: Replace with student push notification API call
    showToast(`Push notification sent to ${order.studentName || 'Student'}`, 'success');
  };

  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="p-5 border-slate-200/80 hover:border-slate-300 transition-all shadow-sm bg-white flex flex-col justify-between gap-4">
      {/* Top Bar: Token & Student Details */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#054A36] text-white flex flex-col items-center justify-center font-extrabold shadow-sm shrink-0">
            <span className="text-[9px] uppercase tracking-wider text-emerald-200">TOKEN</span>
            <span className="text-xl">#{order.tokenNumber}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">{order.studentName || 'Student'}</h3>
              <Badge variant="emerald" className="text-[10px]">
                {order.status}
              </Badge>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-[#054A36] px-2 py-0.5 rounded-full border border-emerald-300">
                PAID ({order.paymentMethod})
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>Order #{order.orderNumber} ({formattedTime})</span>
              <span>•</span>
              <span>Payment ID: {order.paymentId || 'pay_razorpay_simulated'}</span>
            </p>
          </div>
        </div>

        <span className="font-extrabold text-base text-[#054A36]">{formatCurrency(order.totalAmountInINR)}</span>
      </div>

      {/* Items & Instructions */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Items Ordered</span>
        <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs font-semibold text-slate-800">
              <span>
                {item.quantity}x {item.itemName}
              </span>
              <span>{formatCurrency(item.priceInINR * item.quantity)}</span>
            </div>
          ))}
        </div>

        {order.specialInstructions && (
          <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 font-medium">
            <strong>Note:</strong> {order.specialInstructions}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Placeholders */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrintSlip}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Print Kitchen Thermal Slip"
          >
            <Printer className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleDelayOrder}
            className="p-2 text-slate-500 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 rounded-lg transition-colors"
            title="Delay Order +5 Mins"
          >
            <Clock className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleNotifyStudent}
            className="p-2 text-slate-500 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"
            title="Send Push Alert to Student"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>

        {/* Workflow Action Buttons */}
        <div className="flex items-center gap-2">
          {order.status === 'PENDING' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReject(order.id)}
                leftIcon={<X className="h-4 w-4 text-red-500" />}
                className="text-xs text-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onAccept(order.id)}
                leftIcon={<Check className="h-4 w-4" />}
                className="bg-[#054A36] text-xs font-bold"
              >
                Accept Order
              </Button>
            </>
          )}

          {order.status === 'ACCEPTED' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onForwardToKitchen(order.id)}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="bg-[#054A36] text-xs font-bold"
            >
              Forward to Kitchen
            </Button>
          )}

          {(order.status === 'SENT_TO_KITCHEN' || order.status === 'PREPARING') && (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
              In Kitchen Queue
            </span>
          )}

          {order.status === 'READY' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onForwardToKitchen(order.id)}
              leftIcon={<Check className="h-4 w-4" />}
              className="bg-[#054A36] text-xs font-bold"
            >
              Verify Token & Mark Delivered
            </Button>
          )}

          {order.status === 'COLLECTED' && (
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Completed & Delivered
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
