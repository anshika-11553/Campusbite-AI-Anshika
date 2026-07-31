'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/constants/currency';
import { ShieldCheck, Users, Store, ChefHat, Package, BarChart3, Clock, CheckCircle2, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { orders } = useOrderWorkflow();

  const activeOrdersCount = orders.filter((o) => o.status !== 'COLLECTED' && o.status !== 'CANCELLED').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'COLLECTED').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmountInINR, 0);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin" title="Admin System Portal">
        <div className="flex flex-col gap-6">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-purple-800/40 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-purple-500/20 text-purple-300 rounded-2xl shrink-0 ring-1 ring-purple-400/30">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">System Operations & Multi-Portal Control</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                    Admin Level 1
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-purple-200/80 mt-0.5">
                  Unified supervision across Student, Vendor, and Head Chef food court ecosystem
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="px-4 py-2 bg-purple-900/40 rounded-xl border border-purple-700/50 text-right">
                <span className="text-[10px] text-purple-300 uppercase font-bold">Total Ecosystem Revenue</span>
                <h3 className="text-xl font-extrabold text-white">{formatCurrency(totalRevenue)}</h3>
              </div>
            </div>
          </div>

          {/* Quick Role Portal Switcher Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Link
              href="/student"
              className="p-4 bg-white border border-slate-200/80 hover:border-emerald-500/50 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Portal Access</span>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700">Student Portal</h4>
              </div>
            </Link>

            <Link
              href="/vendor"
              className="p-4 bg-white border border-slate-200/80 hover:border-teal-500/50 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Outlet Access</span>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700">Vendor Outlet</h4>
              </div>
            </Link>

            <Link
              href="/chief"
              className="p-4 bg-white border border-slate-200/80 hover:border-amber-500/50 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ChefHat className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">KDS Operations</span>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-700">Head Chef KDS</h4>
              </div>
            </Link>

            <Link
              href="/admin/reports"
              className="p-4 bg-white border border-slate-200/80 hover:border-purple-500/50 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Analytics</span>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-700">System Reports</h4>
              </div>
            </Link>
          </div>

          {/* Ecosystem System Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-4 border-slate-200/80 flex items-center justify-between bg-white">
              <div>
                <span className="text-[11px] font-semibold text-slate-500">Active Queue Tokens</span>
                <h3 className="text-xl font-extrabold text-amber-600 mt-0.5">{activeOrdersCount}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Ticket className="h-5 w-5" />
              </div>
            </Card>

            <Card className="p-4 border-slate-200/80 flex items-center justify-between bg-white">
              <div>
                <span className="text-[11px] font-semibold text-slate-500">Completed Orders</span>
                <h3 className="text-xl font-extrabold text-emerald-700 mt-0.5">{completedOrdersCount}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </Card>

            <Card className="p-4 border-slate-200/80 flex items-center justify-between bg-white">
              <div>
                <span className="text-[11px] font-semibold text-slate-500">Active Canteen Outlets</span>
                <h3 className="text-xl font-extrabold text-blue-600 mt-0.5">3 Outlets</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Store className="h-5 w-5" />
              </div>
            </Card>

            <Card className="p-4 border-slate-200/80 flex items-center justify-between bg-white">
              <div>
                <span className="text-[11px] font-semibold text-slate-500">System Uptime</span>
                <h3 className="text-xl font-extrabold text-purple-600 mt-0.5">99.9%</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Clock className="h-5 w-5" />
              </div>
            </Card>
          </div>

          {/* Live Orders Audit Log */}
          <Card className="p-6 border-slate-200/80 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-700" />
                Live System Orders Audit Trail
              </h3>
              <Badge variant="slate" className="text-xs font-bold bg-purple-100 text-purple-800">
                {orders.length} Total Tickets
              </Badge>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#054A36]">Token #{ord.tokenNumber}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="font-bold text-xs text-slate-800">Order #{ord.orderNumber}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-medium text-slate-600">{ord.studentName}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {ord.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-slate-900">{formatCurrency(ord.totalAmountInINR)}</span>
                    <span
                      className={`px-3 py-1 text-xs font-extrabold rounded-full ${
                        ord.status === 'COLLECTED'
                          ? 'bg-slate-200 text-slate-800'
                          : ord.status === 'READY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'PREPARING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
