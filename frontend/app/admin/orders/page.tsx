'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Package } from 'lucide-react';

export default function AdminOrdersPage() {
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
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-300">
            348 Today
          </span>
        </div>

        <Card className="p-4 border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 uppercase">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Outlet</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { id: '#TK-402', student: 'Rohan Sharma', outlet: 'Main Canteen', total: '₹220', status: 'In Prep' },
                  { id: '#TK-403', student: 'Ananya Gupta', outlet: 'South Express', total: '₹180', status: 'Ready' },
                  { id: '#TK-404', student: 'Karan Patel', outlet: 'Main Canteen', total: '₹140', status: 'Completed' },
                ].map((o, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-extrabold text-slate-900">{o.id}</td>
                    <td className="p-3 font-semibold">{o.student}</td>
                    <td className="p-3">{o.outlet}</td>
                    <td className="p-3 font-bold text-emerald-700">{o.total}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-full font-bold">
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
