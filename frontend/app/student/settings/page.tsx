'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function StudentSettingsPage() {
  return (
    <DashboardLayout role="student" title="Account Settings">
      <div className="max-w-3xl space-y-6">
        <Card className="p-6 space-y-4 border-slate-200">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
            <Bell className="h-5 w-5 text-[#054A36]" />
            Notification Preferences
          </h3>
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Order Live Status Alerts</span>
              <input type="checkbox" defaultChecked className="rounded text-[#054A36] focus:ring-[#054A36] h-4 w-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>SMS Ready-for-Pickup Notifications</span>
              <input type="checkbox" defaultChecked className="rounded text-[#054A36] focus:ring-[#054A36] h-4 w-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Promotions & Loyalty Reward Updates</span>
              <input type="checkbox" className="rounded text-[#054A36] focus:ring-[#054A36] h-4 w-4" />
            </label>
          </div>
        </Card>

        <Card className="p-6 space-y-4 border-slate-200">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
            <Shield className="h-5 w-5 text-[#054A36]" />
            Security & Authentication
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-slate-900">Password</p>
              <p className="text-xs text-slate-500">Last changed 30 days ago</p>
            </div>
            <Button variant="outline" size="sm">Change Password</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
