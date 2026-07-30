'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Store, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function VendorProfilePage() {
  return (
    <DashboardLayout role="vendor" title="Vendor Outlet Profile">
      <div className="max-w-3xl space-y-6">
        <Card className="p-6 space-y-6 border-slate-200">
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="p-4 bg-[#054A36] rounded-2xl text-white">
              <Store className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Main Campus Canteen Outlet</h2>
              <p className="text-xs text-slate-500 font-medium">Licensed Vendor ID: #VND-88214</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Location</span>
              <p className="font-semibold text-slate-800 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#054A36]" /> Student Activity Center, Ground Floor
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Operating Hours</span>
              <p className="font-semibold text-slate-800 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#054A36]" /> 08:00 AM – 09:30 PM Daily
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="md">Edit Outlet Details</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
