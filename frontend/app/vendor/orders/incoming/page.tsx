'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { VendorOrderCard } from '@/components/vendor/VendorOrderCard';
import { EmptyState } from '@/components/student/common/EmptyState';
import { Inbox } from 'lucide-react';

export default function VendorIncomingOrdersPage() {
  const { orders, updateOrderStatus } = useOrderWorkflow();
  const incomingOrders = orders.filter((o) => o.status === 'PENDING');

  return (
    <DashboardLayout role="vendor" title="Incoming Orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Inbox className="h-6 w-6 text-[#054A36]" />
              Live Incoming Orders Queue
            </h2>
            <p className="text-xs text-slate-500">Approve or accept new orders from campus students</p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full border border-amber-300">
            {incomingOrders.length} Pending Orders
          </span>
        </div>

        {incomingOrders.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-8 w-8 text-slate-400" />}
            title="No Incoming Pending Orders"
            description="There are currently no new student pre-orders awaiting vendor approval."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomingOrders.map((order) => (
              <VendorOrderCard
                key={order.id}
                order={order}
                onAccept={(id) => updateOrderStatus(id, 'ACCEPTED', { acceptedBy: 'Vendor Counter' })}
                onReject={(id) => updateOrderStatus(id, 'CANCELLED')}
                onForwardToKitchen={(id) => updateOrderStatus(id, 'SENT_TO_KITCHEN')}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
