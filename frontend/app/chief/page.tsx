'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, ChefHat } from 'lucide-react';

export default function HeadChefDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['chief']}>
      <DashboardLayout role="chief" title="Head Chef Kitchen Operations Portal">
        <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-2xl mx-auto my-8">
          <Badge variant="emerald" className="px-3 py-1 text-xs uppercase tracking-wider">
            Phase 1 Placeholder
          </Badge>
          <div className="p-4 bg-emerald-50 rounded-full text-[#054A36]">
            <ChefHat className="h-10 w-10 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Head Chef Dashboard</h2>
          <p className="text-sm text-slate-600 max-w-md">
            Monitor kitchen operations, manage meal preparation, track cooking progress, coordinate with vendors, and ensure orders are prepared on time.
          </p>
          <div className="pt-2 text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Kitchen Operations Portal – Phase 3</span>
          </div>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
