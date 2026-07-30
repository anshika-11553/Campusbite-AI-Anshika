'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { CheckCircle, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function VendorReadyOrdersPage() {
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
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
            4 Ready at Counter
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: '#TK-395', student: 'Priya Sharma', items: '1x Cold Coffee, 1x Brownie', counter: 'Counter 2' },
            { id: '#TK-396', student: 'Amit Verma', items: '2x Samosa Pav', counter: 'Counter 1' },
            { id: '#TK-397', student: 'Sneha Roy', items: '1x Chicken Frankie', counter: 'Counter 2' },
            { id: '#TK-398', student: 'Vikas Kumar', items: '1x Masala Dosa', counter: 'Counter 3' },
          ].map((item, idx) => (
            <Card key={idx} className="p-5 border-emerald-200 bg-emerald-50/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xl text-[#054A36]">{item.id}</span>
                <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
                  {item.counter}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm text-slate-900">{item.student}</p>
                <p className="text-xs text-slate-600">{item.items}</p>
              </div>
              <Button variant="primary" size="sm" className="w-full" leftIcon={<UserCheck className="h-4 w-4" />}>
                Handover & Complete Order
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
