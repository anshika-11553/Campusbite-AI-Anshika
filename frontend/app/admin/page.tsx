'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin" title="Admin Operations Portal">
        <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-2xl mx-auto my-8">
          <Badge variant="slate" className="px-3 py-1 text-xs uppercase tracking-wider">
            Phase 1 Placeholder
          </Badge>
          <div className="p-4 bg-slate-100 rounded-full text-slate-700">
            <Clock className="h-10 w-10 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h2>
          <p className="text-sm text-slate-600 max-w-md">
            Canteen operational controls, vendor assignments, user management, and daily logistics supervision will be unlocked in Phase 2.
          </p>
          <div className="pt-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Coming Soon – Phase 2
          </div>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
