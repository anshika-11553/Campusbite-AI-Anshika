'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Sliders } from 'lucide-react';

export default function VendorSettingsPage() {
  return (
    <DashboardLayout role="vendor" title="Vendor Outlet Settings">
      <div className="max-w-3xl space-y-6">
        <Card className="p-6 space-y-4 border-slate-200">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
            <Sliders className="h-5 w-5 text-[#054A36]" />
            Kitchen Order Controls
          </h3>
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Auto-Accept Incoming Student Orders</span>
              <input type="checkbox" defaultChecked className="rounded text-[#054A36] focus:ring-[#054A36] h-4 w-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Sound Alert on New Order Arrival</span>
              <input type="checkbox" defaultChecked className="rounded text-[#054A36] focus:ring-[#054A36] h-4 w-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Enable Express Pre-Order Pickup Slots</span>
              <input type="checkbox" defaultChecked className="rounded text-[#054A36] focus:ring-[#054A36] h-4 w-4" />
            </label>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
