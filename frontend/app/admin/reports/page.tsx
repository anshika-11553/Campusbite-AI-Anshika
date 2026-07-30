'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminReportsPage() {
  return (
    <DashboardLayout role="admin" title="Campus Analytics & Financial Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              Financial & Operations Reporting
            </h2>
            <p className="text-xs text-slate-500">Download system audit logs and revenue statistics</p>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export Monthly PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-500">Monthly Gross Volume</span>
            <p className="text-2xl font-extrabold text-slate-900">₹4,82,500</p>
          </Card>

          <Card className="p-5 border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-500">Active Daily Diners</span>
            <p className="text-2xl font-extrabold text-slate-900">1,240</p>
          </Card>

          <Card className="p-5 border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-500">System Uptime</span>
            <p className="text-2xl font-extrabold text-emerald-600">99.98%</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
