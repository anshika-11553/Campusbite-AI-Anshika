'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { KDSOrderCard } from '@/components/headChef/KDSOrderCard';
import { EmptyState } from '@/components/student/common/EmptyState';
import { CheckCircle } from 'lucide-react';

export default function ChefReadyPage() {
  const { orders, updateOrderStatus } = useOrderWorkflow();
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return (
    <DashboardLayout role="chief" title="Passed & Ready Dishes">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              Passed Quality Audit & Dispatched
            </h2>
            <p className="text-xs text-slate-500">Dishes ready to serve to students</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full border border-emerald-300">
            {readyOrders.length} Ready for Pickup
          </span>
        </div>

        {readyOrders.length === 0 ? (
          <EmptyState
            icon={<CheckCircle className="h-8 w-8 text-slate-400" />}
            title="Pass Counter Clear"
            description="There are currently no completed dishes waiting at the pass."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyOrders.map((order) => (
              <KDSOrderCard
                key={order.id}
                order={order}
                onStartPreparing={(id) => updateOrderStatus(id, 'PREPARING')}
                onPausePreparation={(id) => updateOrderStatus(id, 'PREPARING')}
                onResumePreparation={(id) => updateOrderStatus(id, 'PREPARING')}
                onMarkReady={(id) => updateOrderStatus(id, 'COLLECTED')}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
