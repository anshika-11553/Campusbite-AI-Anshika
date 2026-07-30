'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { KDSOrderCard } from '@/components/headChef/KDSOrderCard';
import { EmptyState } from '@/components/student/common/EmptyState';
import { ChefHat } from 'lucide-react';

export default function ChefQueuePage() {
  const { orders, updateOrderStatus } = useOrderWorkflow();
  const kitchenOrders = orders.filter((o) => o.status === 'SENT_TO_KITCHEN' || o.status === 'PREPARING');

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
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full border border-amber-300">
            {kitchenOrders.length} Orders In Queue
          </span>
        </div>

        {kitchenOrders.length === 0 ? (
          <EmptyState
            icon={<ChefHat className="h-8 w-8 text-slate-400" />}
            title="Kitchen Queue Clear"
            description="There are currently no active kitchen preparation tickets in this queue."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kitchenOrders.map((order) => (
              <KDSOrderCard
                key={order.id}
                order={order}
                onStartPreparing={(id) =>
                  updateOrderStatus(id, 'PREPARING', { preparedBy: 'Head Chef Kitchen', isPaused: false })
                }
                onPausePreparation={(id) => updateOrderStatus(id, 'PREPARING', { isPaused: true })}
                onResumePreparation={(id) => updateOrderStatus(id, 'PREPARING', { isPaused: false })}
                onMarkReady={(id) => updateOrderStatus(id, 'READY', { pickupCounter: 'Counter A' })}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
