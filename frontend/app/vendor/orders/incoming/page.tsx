'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Inbox, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function VendorIncomingOrdersPage() {
  return (
    <DashboardLayout role="vendor" title="Incoming Orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Inbox className="h-6 w-6 text-[#054A36]" />
              Live Incoming Orders Queue
            </h2>
            <p className="text-xs text-slate-500">Approve or accept new orders from campus students</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-[#054A36] text-xs font-bold rounded-full border border-emerald-300">
            3 Pending Orders
          </span>
        </div>

        <div className="space-y-4">
          {[
            { id: '#TK-402', student: 'Rohan Sharma', items: '1x Veg Biryani, 1x Cold Coffee', total: '₹220', time: '2 min ago' },
            { id: '#TK-403', student: 'Ananya Gupta', items: '2x Cheese Grilled Sandwich, 1x Fresh Lime', total: '₹180', time: '4 min ago' },
            { id: '#TK-404', student: 'Karan Patel', items: '1x Chicken Frankie, 1x Thums Up', total: '₹140', time: '6 min ago' },
          ].map((order, idx) => (
            <Card key={idx} className="p-5 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-[#054A36]">{order.id}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="font-bold text-sm text-slate-800">{order.student}</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {order.time}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600">{order.items}</p>
                <span className="text-xs font-bold text-slate-900">Total: {order.total}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-initial text-red-600 border-red-200 hover:bg-red-50">
                  Decline
                </Button>
                <Button variant="primary" size="sm" className="flex-1 sm:flex-initial" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
                  Accept & Start
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
