'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { CheckCircle } from 'lucide-react';

export default function ChefReadyPage() {
  return (
    <DashboardLayout role="chief" title="Passed & Ready Dishes">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              Passed Quality Audit
            </h2>
            <p className="text-xs text-slate-500">Dishes ready to serve to students</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: '#TK-405', dish: 'Veg Thali Deluxe', passedBy: 'Head Chef Vikrant', time: '1 min ago' },
            { id: '#TK-406', dish: 'Paneer Masala + Rice', passedBy: 'Head Chef Vikrant', time: '3 min ago' },
          ].map((item, i) => (
            <Card key={i} className="p-5 border-emerald-200 bg-emerald-50/20 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-emerald-800 text-lg">{item.id}</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{item.dish}</p>
                <p className="text-xs text-slate-500 mt-1">Verified: {item.passedBy}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
                Dispatched
              </span>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
