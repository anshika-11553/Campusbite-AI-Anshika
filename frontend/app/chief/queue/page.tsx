'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { ChefHat, Flame } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ChefQueuePage() {
  return (
    <DashboardLayout role="chief" title="Head Chef Kitchen Queue">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-amber-600" />
              Master Preparation Line
            </h2>
            <p className="text-xs text-slate-500">Monitor cooking assignments & dish quality</p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">
            5 Orders In Queue
          </span>
        </div>

        <div className="space-y-3">
          {[
            { id: '#TK-410', dish: 'Paneer Thali + Gulab Jamun', quantity: '2 Meals', status: 'Queued', priority: 'High' },
            { id: '#TK-411', dish: 'Chicken Biryani + Extra Raita', quantity: '3 Meals', status: 'Queued', priority: 'Normal' },
            { id: '#TK-412', dish: 'Special Veg Dosa', quantity: '1 Meal', status: 'Queued', priority: 'Normal' },
          ].map((item, idx) => (
            <Card key={idx} className="p-4 border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-[#054A36]">{item.id}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">{item.dish}</h3>
                <span className="text-xs text-slate-500">{item.quantity}</span>
              </div>
              <Button variant="primary" size="sm" leftIcon={<Flame className="h-4 w-4" />}>
                Start Cooking
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
