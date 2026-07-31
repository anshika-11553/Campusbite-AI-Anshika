'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { Card } from '@/components/ui/Card';
import { Flame, Clock, CheckCircle2, ChefHat, BarChart3 } from 'lucide-react';

export default function ChefStatsPage() {
  const { orders } = useOrderWorkflow();

  const totalKitchenTickets = orders.filter((o) => o.status !== 'CANCELLED').length;
  const readyOrCollectedCount = orders.filter((o) => o.status === 'READY' || o.status === 'COLLECTED').length;
  const preparingCount = orders.filter((o) => o.status === 'PREPARING').length;

  return (
    <DashboardLayout role="chief" title="Kitchen Performance & Efficiency">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-[#054A36]" />
              Live Kitchen Analytics & Performance
            </h2>
            <p className="text-xs text-slate-500">Real-time prep speed, completion rates, and throughput</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full border border-emerald-300">
            High Efficiency Mode
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Kitchen Tickets</span>
              <ChefHat className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{totalKitchenTickets}</p>
            <span className="text-xs text-purple-600 font-semibold">Active Canteen Queue</span>
          </Card>

          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Dishes Prepared & Served</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-700">{readyOrCollectedCount}</p>
            <span className="text-xs text-emerald-600 font-semibold">Completed Orders</span>
          </Card>

          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Currently Cooking</span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold text-amber-600">{preparingCount}</p>
            <span className="text-xs text-amber-600 font-semibold">Active Workstations</span>
          </Card>

          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Avg Prep Speed</span>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">6.5 mins</p>
            <span className="text-xs text-emerald-600 font-semibold">Under 8 min Target SLA</span>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
