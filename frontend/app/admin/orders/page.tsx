'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/constants/currency';
import { Package } from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders } = useOrderWorkflow();

  return (
    <DashboardLayout role="admin" title="Global Orders Master Ledger">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="h-6 w-6 text-purple-600" />
              All Campus Orders Audit
            </h2>
            <p className="text-xs text-slate-500">Live transaction feed across all campus outlets</p>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-extrabold rounded-full border border-purple-300">
            {orders.length} Total Orders Recorded
          </span>
        </div>

        <Card className="p-4 border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-3">Token #</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Vendor Outlet</th>
                  <th className="p-3">Items Summary</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-extrabold text-[#054A36]">#{o.tokenNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{o.orderNumber}</td>
                    <td className="p-3 font-semibold">{o.studentName}</td>
                    <td className="p-3 text-slate-600">{o.vendorName}</td>
                    <td className="p-3 max-w-xs truncate text-slate-500">
                      {o.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                    </td>
                    <td className="p-3 font-extrabold text-emerald-700">{formatCurrency(o.totalAmountInINR)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          o.status === 'COLLECTED'
                            ? 'bg-slate-200 text-slate-800'
                            : o.status === 'READY'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'PREPARING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
