'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { ChefHat } from 'lucide-react';

export default function ChefProfilePage() {
  return (
    <DashboardLayout role="chief" title="Head Chef Profile">
      <div className="max-w-3xl space-y-6">
        <Card className="p-6 space-y-6 border-slate-200">
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="p-4 bg-amber-600 rounded-2xl text-white">
              <ChefHat className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Head Chef Vikrant Sharma</h2>
              <p className="text-xs text-slate-500 font-medium">Executive Campus Kitchen Director</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">Managing kitchen workflows, food quality assurance, hygiene protocols, and culinary staff training across all campus food outlets.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
