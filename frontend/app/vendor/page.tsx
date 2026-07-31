'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { VendorOrderCard } from '@/components/vendor/VendorOrderCard';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/student/common/EmptyState';
import { formatCurrency } from '@/constants/currency';
import { Store, Search, Clock, CheckCircle2, Flame, ShoppingBag } from 'lucide-react';

export default function VendorDashboardPage() {
  const { orders, updateOrderStatus } = useOrderWorkflow();
  const [filterTab, setFilterTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOrders = orders.filter((order) => {
    const matchesTab = filterTab === 'ALL' ? true : order.status === filterTab;
    const matchesSearch =
      !searchQuery ||
      order.tokenNumber.includes(searchQuery) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.studentName && order.studentName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const acceptedCount = orders.filter((o) => o.status === 'ACCEPTED').length;
  const kitchenCount = orders.filter((o) => o.status === 'SENT_TO_KITCHEN' || o.status === 'PREPARING').length;
  const readyCount = orders.filter((o) => o.status === 'READY').length;
  const totalRevenueInINR = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmountInINR, 0);

  return (
    <DashboardLayout role="vendor" title="Vendor Management Portal">
      <div className="flex flex-col gap-6">
        {/* Banner Header */}
        <div className="p-6 bg-[#054A36] text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/10 border border-white/20 rounded-2xl shrink-0">
              <Store className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Main Campus Food Court</h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-0.5">
                Incoming student pre-orders & token dispatch management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/15 text-right">
              <span className="text-[10px] text-emerald-200 uppercase font-bold">Today&apos;s Revenue</span>
              <h3 className="text-lg font-extrabold">{formatCurrency(totalRevenueInINR)}</h3>
            </div>
          </div>
        </div>

        {/* Vendor Order Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-4 border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Pending Orders</span>
              <h3 className="text-xl font-extrabold text-amber-600 mt-0.5">{pendingCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </Card>

          <Card className="p-4 border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Accepted</span>
              <h3 className="text-xl font-extrabold text-blue-600 mt-0.5">{acceptedCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </Card>

          <Card className="p-4 border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">In Kitchen</span>
              <h3 className="text-xl font-extrabold text-orange-600 mt-0.5">{kitchenCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
              <Flame className="h-5 w-5" />
            </div>
          </Card>

          <Card className="p-4 border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Ready for Pickup</span>
              <h3 className="text-xl font-extrabold text-emerald-700 mt-0.5">{readyCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search token #, order #, student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
            {['ALL', 'PENDING', 'ACCEPTED', 'SENT_TO_KITCHEN', 'PREPARING', 'READY', 'COLLECTED'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterTab === tab
                    ? 'bg-[#054A36] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab === 'ALL' ? 'All Orders' : tab.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Order Cards Grid */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8 text-slate-400" />}
            title="No Vendor Orders Found"
            description="There are currently no student pre-orders matching your filter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <VendorOrderCard
                key={order.id}
                order={order}
                onAccept={(id) => updateOrderStatus(id, 'ACCEPTED', { acceptedBy: 'Vendor Counter' })}
                onReject={(id) => updateOrderStatus(id, 'CANCELLED')}
                onForwardToKitchen={(id) => updateOrderStatus(id, 'SENT_TO_KITCHEN')}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
