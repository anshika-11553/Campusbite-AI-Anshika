'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { KDSOrderCard } from '@/components/headChef/KDSOrderCard';
import { EmptyState } from '@/components/student/common/EmptyState';
import { Flame } from 'lucide-react';

export default function ChefPreparingPage() {
  const { orders, updateOrderStatus } = useOrderWorkflow();
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');

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
          <span className="px-3 py-1 bg-amber-500 text-white text-xs font-extrabold rounded-full">
            {preparingOrders.length} Active Cooking
          </span>
        </div>

        {preparingOrders.length === 0 ? (
          <EmptyState
            icon={<Flame className="h-8 w-8 text-slate-400" />}
            title="No Active Preparation Tickets"
            description="There are currently no orders actively cooking on the stations."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {preparingOrders.map((order) => (
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
