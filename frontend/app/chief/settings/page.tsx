'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Sliders } from 'lucide-react';

export default function ChefSettingsPage() {
  return (
    <DashboardLayout role="chief" title="Kitchen Operations Settings">
      <div className="max-w-3xl space-y-6">
        <Card className="p-6 space-y-4 border-slate-200">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
            <Sliders className="h-5 w-5 text-amber-600" />
            Kitchen Safety & Controls
          </h3>
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Enable Peak-Hour High Capacity Workflow</span>
              <input type="checkbox" defaultChecked className="rounded text-amber-600 focus:ring-amber-600 h-4 w-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Require Dual Audit for Out-of-Stock Ingredients</span>
              <input type="checkbox" defaultChecked className="rounded text-amber-600 focus:ring-amber-600 h-4 w-4" />
            </label>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
