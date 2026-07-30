'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { BarChart3, Download, TrendingUp, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function AdminReportsPage() {
  const { orders } = useOrderWorkflow();
  const { showToast } = useToast();

  const totalGrossRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmountInINR, 0);

  const handleExportReport = () => {
    showToast('Campus Canteen Financial Audit Report exported as PDF! 📄', 'success');
  };

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
          <Button variant="primary" size="sm" onClick={handleExportReport} leftIcon={<Download className="h-4 w-4" />}>
            Export Financial Audit PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Live Gross Ecosystem Volume</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalGrossRevenue)}</p>
            <span className="text-xs text-emerald-600 font-semibold">+18.5% vs previous cycle</span>
          </Card>

          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Active Daily Diners</span>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">1,240</p>
            <span className="text-xs text-blue-600 font-semibold">Over 92% campus coverage</span>
          </Card>

          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">System SLA Uptime</span>
              <ShieldCheck className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-600">99.98%</p>
            <span className="text-xs text-emerald-600 font-semibold">Zero SLA breaches</span>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
