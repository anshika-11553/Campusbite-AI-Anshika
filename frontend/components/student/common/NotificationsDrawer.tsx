'use client';

import React from 'react';
import { CanteenNotification } from '@/types/student';
import { X, Bell, Tag, Clock, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CanteenNotification[];
  onMarkAllRead: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#054A36] text-white rounded-xl">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">Canteen updates & offers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close notifications"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">
              No new canteen notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <Card
                key={n.id}
                className={`p-3.5 border-slate-200/80 flex items-start gap-3 transition-all ${
                  !n.isRead ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    n.type === 'order'
                      ? 'bg-emerald-100 text-emerald-800'
                      : n.type === 'promo'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {n.type === 'promo' ? <Tag className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onMarkAllRead}
              className="text-xs font-semibold text-[#054A36] hover:underline flex items-center gap-1"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
            <span className="text-xs text-slate-400">{notifications.length} total</span>
          </div>
        )}
      </div>
    </div>
  );
};
