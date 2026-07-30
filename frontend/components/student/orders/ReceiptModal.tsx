'use client';

import React from 'react';
import { StudentOrder } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { Utensils, Printer, Download, CheckCircle2, X } from 'lucide-react';

interface ReceiptModalProps {
  order: StudentOrder;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const gstAmount = order.gstAmountInINR ?? Math.round(order.totalAmountInINR * 0.05);
  const subtotal = order.totalAmountInINR - gstAmount;

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-lg p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl rounded-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#054A36] text-white rounded-xl">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">CampusBite AI</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Official Digital Payment Receipt
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Token Badge */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-center space-y-1">
          <span className="text-xs uppercase font-bold text-emerald-800 dark:text-emerald-300">Active Order Token</span>
          <p className="text-3xl font-extrabold text-[#054A36] dark:text-emerald-400">Token #{order.tokenNumber}</p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Pickup Counter: {order.pickupCounter || 'Counter A'}</p>
        </div>

        {/* Transaction Metadata */}
        <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-slate-400 block font-medium">Order ID</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Payment ID</span>
            <span className="font-bold text-[#054A36] dark:text-emerald-400 truncate block">{order.paymentId || 'pay_razorpay_simulated'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Payment Method</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">UPI QR Payment</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Payment Status</span>
            <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> PAID
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Date & Time</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Pickup Slot</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{order.pickupSlot}</span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-700 dark:text-slate-300">Purchased Items</h4>
          <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            {order.items.map((item) => (
              <div key={item.itemId} className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {item.quantity}x {item.itemName}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.priceInINR * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1 pt-1 text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5% Configured Canteen Tax)</span>
              <span>{formatCurrency(gstAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Total Amount Paid</span>
              <span className="text-[#054A36] dark:text-emerald-400">{formatCurrency(order.totalAmountInINR)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={handlePrintReceipt}
            leftIcon={<Printer className="h-4 w-4" />}
            className="w-1/2 border-slate-300 dark:border-slate-700"
          >
            Print
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handlePrintReceipt}
            leftIcon={<Download className="h-4 w-4" />}
            className="w-1/2 bg-[#054A36] text-white font-extrabold"
          >
            Download PDF
          </Button>
        </div>
      </Card>
    </div>
  );
};
