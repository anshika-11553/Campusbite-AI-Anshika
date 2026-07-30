'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Flame, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ChefPreparingPage() {
  return (
    <DashboardLayout role="chief" title="Active Preparing Stations">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Flame className="h-6 w-6 text-amber-500 animate-pulse" />
              Active Cooking Stations
            </h2>
            <p className="text-xs text-slate-500">Live prep status on burner & assembly stations</p>
          </div>
          <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
            3 Active Cooking
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { station: 'Station 1 - Tandoor & Curries', item: '#TK-408: Butter Chicken (2 Portions)', timer: '4 min remaining' },
            { station: 'Station 2 - South Indian & Dosa', item: '#TK-409: Masala Dosa + Medu Vada', timer: '2 min remaining' },
          ].map((st, i) => (
            <Card key={i} className="p-5 border-amber-200 bg-amber-50/20 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">{st.station}</span>
              <p className="font-extrabold text-slate-900 text-base">{st.item}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                <span className="font-semibold text-amber-700 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {st.timer}
                </span>
                <Button variant="primary" size="sm" leftIcon={<CheckCircle className="h-4 w-4" />}>
                  Ready for Pass
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
