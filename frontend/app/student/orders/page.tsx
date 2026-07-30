'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { OrderHistoryList } from '@/components/student/orders/OrderHistoryList';
import { History } from 'lucide-react';

export default function StudentOrdersPage() {
  const { orders, placeOrder } = useOrderWorkflow();

  const handleReorder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      placeOrder({
        studentId: target.studentId,
        studentName: target.studentName || 'Anshika Sharma',
        vendorName: target.vendorName,
        items: target.items,
        totalAmountInINR: target.totalAmountInINR,
        pickupSlot: target.pickupSlot,
        paymentMethod: target.paymentMethod,
        estimatedPreparationTimeMinutes: 10,
      });
    }
  };

  return (
    <DashboardLayout role="student" title="Order History & Receipts">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <History className="h-6 w-6 text-[#054A36]" />
              Your Canteen Pre-Orders History
            </h2>
            <p className="text-xs text-slate-500">Track past tokens, receipts, and reorder favorite meals</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-[#054A36] text-xs font-extrabold rounded-full border border-emerald-300">
            {orders.length} Total Orders
          </span>
        </div>

        <OrderHistoryList orders={orders} onReorder={handleReorder} />
      </div>
    </DashboardLayout>
  );
}
