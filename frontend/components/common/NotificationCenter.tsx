'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, Gift, AlertCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export interface NotificationItem {
  id: string;
  type: 'ORDER_ACCEPTED' | 'PREPARING' | 'READY' | 'CANCELLED' | 'OFFER' | 'REWARD';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const NotificationCenter: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      type: 'READY',
      title: 'Order Ready for Pickup! 🍳',
      message: 'Token #04 Paneer Butter Masala Combo is hot and ready at Counter A.',
      timestamp: '2 mins ago',
      isRead: false,
    },
    {
      id: 'n-2',
      type: 'ORDER_ACCEPTED',
      title: 'Order Accepted by Vendor 🏪',
      message: 'Main Campus Canteen accepted your pre-order token #04.',
      timestamp: '10 mins ago',
      isRead: true,
    },
    {
      id: 'n-3',
      type: 'REWARD',
      title: '+50 Bonus Loyalty Points! ⭐',
      message: 'You earned 50 bonus reward points for completing your order.',
      timestamp: '1 hour ago',
      isRead: true,
    },
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <Card className="p-4 shadow-2xl border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#054A36] dark:text-emerald-400" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Notification Center</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllRead}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                !n.isRead
                  ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/40'
                  : 'bg-slate-50 border-slate-100 dark:bg-slate-850 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                  {n.type === 'READY' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  {n.type === 'PREPARING' && <Clock className="h-3.5 w-3.5 text-amber-500" />}
                  {n.type === 'REWARD' && <Gift className="h-3.5 w-3.5 text-purple-600" />}
                  {n.type === 'CANCELLED' && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
                  {n.title}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{n.message}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
