'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Utensils, Flame, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function VendorKitchenQueuePage() {
  return (
    <DashboardLayout role="vendor" title="Kitchen Preparation Queue">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Utensils className="h-6 w-6 text-amber-600" />
              Kitchen Live Workstation
            </h2>
            <p className="text-xs text-slate-500">Track preparation progress for active orders</p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">
            2 In Preparation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: '#TK-399', dish: '2x Paneer Butter Masala + Naan', status: 'Cooking', est: '5 min left', chef: 'Chef Suresh' },
            { id: '#TK-400', dish: '1x Chicken Biryani + Raita', status: 'Plating', est: '2 min left', chef: 'Chef Ramesh' },
          ].map((item, idx) => (
            <Card key={idx} className="p-5 border-amber-200 bg-amber-50/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-lg text-slate-900">{item.id}</span>
                <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 animate-pulse" /> {item.status}
                </span>
              </div>
              <p className="font-bold text-base text-slate-800">{item.dish}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                <span>Assigned: {item.chef}</span>
                <span className="font-semibold text-amber-700">{item.est}</span>
              </div>
              <Button variant="primary" size="sm" className="w-full" leftIcon={<CheckCircle className="h-4 w-4" />}>
                Mark Order Ready for Pickup
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
