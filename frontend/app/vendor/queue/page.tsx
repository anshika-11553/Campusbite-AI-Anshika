'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { VendorOrderCard } from '@/components/vendor/VendorOrderCard';
import { EmptyState } from '@/components/student/common/EmptyState';
import { Utensils } from 'lucide-react';

export default function VendorKitchenQueuePage() {
  const { orders, updateOrderStatus } = useOrderWorkflow();
  const kitchenOrders = orders.filter((o) => o.status === 'SENT_TO_KITCHEN' || o.status === 'PREPARING');

  return (
    <DashboardLayout role="vendor" title="Kitchen Preparation Queue">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Utensils className="h-6 w-6 text-amber-600" />
              Kitchen Live Workstation
            </h2>
            <p className="text-xs text-slate-500">Track preparation progress for active orders in kitchen</p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full border border-amber-300">
            {kitchenOrders.length} In Kitchen Queue
          </span>
        </div>

        {kitchenOrders.length === 0 ? (
          <EmptyState
            icon={<Utensils className="h-8 w-8 text-slate-400" />}
            title="Kitchen Queue Clear"
            description="There are currently no active student pre-orders being cooked in the kitchen."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kitchenOrders.map((order) => (
              <VendorOrderCard
                key={order.id}
                order={order}
                onAccept={(id) => updateOrderStatus(id, 'ACCEPTED')}
                onReject={(id) => updateOrderStatus(id, 'CANCELLED')}
                onForwardToKitchen={(id) => updateOrderStatus(id, 'PREPARING')}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
