'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, QrCode, ShieldCheck } from 'lucide-react';
import { analytics } from '@/services/analytics';

interface QRPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  qrCodeUrl?: string;
}

export const QRPickupModal: React.FC<QRPickupModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  qrCodeUrl,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      analytics.trackQRCodeViewed(orderNumber);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, orderNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
        className="w-full max-w-sm p-6 text-center flex flex-col items-center gap-4 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-[#054A36]">
            <QrCode className="h-5 w-5" />
            <h3 id="qr-modal-title" className="font-bold text-sm text-slate-900">
              Express Pickup Pass
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close QR Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center gap-3 w-full">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
            {qrCodeUrl ? (
              <Image
                src={qrCodeUrl}
                alt={`Order ${orderNumber} QR Code Token`}
                width={180}
                height={180}
                className="rounded-lg"
                unoptimized
              />
            ) : (
              <div className="w-[180px] h-[180px] bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold rounded-lg">
                QR Token Generated
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
              Pickup Token Number
            </span>
            <span className="text-2xl font-black text-[#054A36] tracking-wider">{orderNumber}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Show this QR code to the canteen counter vendor to collect your food order.</span>
        </div>

        <Button variant="secondary" className="w-full mt-1" onClick={onClose}>
          Close Pass
        </Button>
      </Card>
    </div>
  );
};
