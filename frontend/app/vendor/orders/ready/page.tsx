'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { VendorOrderCard } from '@/components/vendor/VendorOrderCard';
import { EmptyState } from '@/components/student/common/EmptyState';
import { CheckCircle } from 'lucide-react';

export default function VendorReadyOrdersPage() {
  const { orders, updateOrderStatus } = useOrderWorkflow();
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return (
    <DashboardLayout role="vendor" title="Ready Orders Counter">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              Express Dispatch Counter
            </h2>
            <p className="text-xs text-slate-500">Orders ready for student pickup or token call out</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full border border-emerald-300">
            {readyOrders.length} Ready at Counter
          </span>
        </div>

        {readyOrders.length === 0 ? (
          <EmptyState
            icon={<CheckCircle className="h-8 w-8 text-slate-400" />}
            title="Express Pickup Counter Clear"
            description="There are currently no completed pre-orders waiting at the counter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyOrders.map((order) => (
              <VendorOrderCard
                key={order.id}
                order={order}
                onAccept={(id) => updateOrderStatus(id, 'ACCEPTED')}
                onReject={(id) => updateOrderStatus(id, 'CANCELLED')}
                onForwardToKitchen={(id) => updateOrderStatus(id, 'COLLECTED')}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
