'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';

export default function ChefStatsPage() {
  return (
    <DashboardLayout role="chief" title="Kitchen Performance & Efficiency">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-500">Dishes Prepared Today</span>
            <p className="text-2xl font-extrabold text-slate-900">184</p>
            <span className="text-xs text-emerald-600 font-semibold">+12% vs yesterday</span>
          </Card>

          <Card className="p-5 border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-500">Average Preparation Time</span>
            <p className="text-2xl font-extrabold text-slate-900">6.8 mins</p>
            <span className="text-xs text-emerald-600 font-semibold">Under 8 min SLA</span>
          </Card>

          <Card className="p-5 border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-500">Kitchen Waste Index</span>
            <p className="text-2xl font-extrabold text-slate-900">1.4%</p>
            <span className="text-xs text-emerald-600 font-semibold">Optimal Efficiency</span>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
