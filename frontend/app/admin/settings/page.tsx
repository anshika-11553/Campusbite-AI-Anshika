'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <DashboardLayout role="admin" title="Global System Settings">
      <div className="max-w-3xl space-y-6">
        <Card className="p-6 space-y-4 border-slate-200">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
            <Shield className="h-5 w-5 text-purple-600" />
            Security & Global Portal Policy
          </h3>
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Require University Single Sign-On (SSO)</span>
              <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-600 h-4 w-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Enable AI Queue Time Prediction Engine</span>
              <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-600 h-4 w-4" />
            </label>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
