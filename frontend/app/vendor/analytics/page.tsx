'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/constants/currency';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Users, Clock } from 'lucide-react';

export default function VendorAnalyticsPage() {
  const { orders } = useOrderWorkflow();

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmountInINR, 0);

  const completedCount = orders.filter((o) => o.status === 'COLLECTED' || o.status === 'READY').length;

  return (
    <DashboardLayout role="vendor" title="Outlet Analytics">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Live Outlet Revenue</span>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalRevenue)}</p>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +14.2% vs yesterday
            </span>
          </Card>

          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Total Orders</span>
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
            <span className="text-xs text-slate-500">{completedCount} Completed / Ready</span>
          </Card>

          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Avg Prep Time</span>
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">7.4 min</p>
            <span className="text-xs text-emerald-600 font-semibold">-1.2 min faster</span>
          </Card>

          <Card className="p-5 border-slate-200/80 space-y-2 bg-white">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Customer Rating</span>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">4.8 / 5.0</p>
            <span className="text-xs text-slate-500">Based on 94 reviews</span>
          </Card>
        </div>

        <Card className="p-6 border-slate-200/80 space-y-4 bg-white">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#054A36]" />
            Top Selling Dishes Today
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Paneer Butter Masala Combo', count: 48, revenue: '₹6,720' },
              { name: 'Cold Coffee with Ice Cream', count: 42, revenue: '₹2,520' },
              { name: 'Chicken Biryani', count: 36, revenue: '₹6,480' },
              { name: 'Classic Veg Cheese Grill Sandwich', count: 28, revenue: '₹1,960' },
            ].map((dish, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-sm text-slate-900">{dish.name}</span>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="text-slate-500">{dish.count} sold</span>
                  <span className="text-[#054A36]">{dish.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
