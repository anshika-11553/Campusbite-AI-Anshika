'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { KDSOrderCard } from '@/components/headChef/KDSOrderCard';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/student/common/EmptyState';
import { ChefHat, Flame, Clock, CheckCircle2 } from 'lucide-react';

export default function HeadChefDashboardPage() {
  const { orders, updateOrderStatus } = useOrderWorkflow();
  const [kitchenTab, setKitchenTab] = useState<string>('INCOMING');

  const incomingKitchenOrders = orders.filter((o) => o.status === 'SENT_TO_KITCHEN');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  const displayOrders =
    kitchenTab === 'INCOMING'
      ? incomingKitchenOrders
      : kitchenTab === 'PREPARING'
      ? preparingOrders
      : kitchenTab === 'READY'
      ? readyOrders
      : orders.filter((o) => o.status === 'SENT_TO_KITCHEN' || o.status === 'PREPARING' || o.status === 'READY');

  return (
    <DashboardLayout role="chief" title="Kitchen Operations Portal (Head Chef)">
      <div className="flex flex-col gap-6">
        {/* KDS Header Banner */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-[#054A36] text-white rounded-2xl shrink-0 shadow-lg border border-emerald-400/30">
              <ChefHat className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Kitchen Order Display (KDS)</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 animate-pulse">
                  Live Operations
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Head Chef kitchen queue, prep timers, and order completion dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 text-right">
              <span className="text-[10px] text-amber-400 uppercase font-bold">Total Kitchen Tickets</span>
              <h3 className="text-xl font-extrabold text-white">
                {incomingKitchenOrders.length + preparingOrders.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Kitchen Statistics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-4 border-slate-200/80 flex items-center justify-between bg-white">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Incoming Queue</span>
              <h3 className="text-xl font-extrabold text-blue-600 mt-0.5">{incomingKitchenOrders.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
          </Card>

          <Card className="p-4 border-slate-200/80 flex items-center justify-between bg-white">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Now Preparing</span>
              <h3 className="text-xl font-extrabold text-amber-600 mt-0.5">{preparingOrders.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Flame className="h-5 w-5" />
            </div>
          </Card>

          <Card className="p-4 border-slate-200/80 flex items-center justify-between bg-white">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Ready for Pickup</span>
              <h3 className="text-xl font-extrabold text-emerald-700 mt-0.5">{readyOrders.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </Card>

          <Card className="p-4 border-slate-200/80 flex items-center justify-between bg-white">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Avg Prep Speed</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">6.5 mins</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <ChefHat className="h-5 w-5" />
            </div>
          </Card>
        </div>

        {/* KDS Kitchen Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setKitchenTab('INCOMING')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              kitchenTab === 'INCOMING'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Incoming Kitchen Queue ({incomingKitchenOrders.length})
          </button>

          <button
            type="button"
            onClick={() => setKitchenTab('PREPARING')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              kitchenTab === 'PREPARING'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Now Preparing ({preparingOrders.length})
          </button>

          <button
            type="button"
            onClick={() => setKitchenTab('READY')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              kitchenTab === 'READY'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Ready Queue ({readyOrders.length})
          </button>

          <button
            type="button"
            onClick={() => setKitchenTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              kitchenTab === 'ALL'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All KDS Tickets
          </button>
        </div>

        {/* KDS Order Cards Display */}
        {displayOrders.length === 0 ? (
          <EmptyState
            icon={<ChefHat className="h-8 w-8 text-slate-400" />}
            title="Kitchen Queue Clear"
            description="No active kitchen preparation tickets in this queue."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayOrders.map((order) => (
              <KDSOrderCard
                key={order.id}
                order={order}
                onStartPreparing={(id) =>
                  updateOrderStatus(id, 'PREPARING', { preparedBy: 'Head Chef Kitchen', isPaused: false })
                }
                onPausePreparation={(id) => updateOrderStatus(id, 'PREPARING', { isPaused: true })}
                onResumePreparation={(id) => updateOrderStatus(id, 'PREPARING', { isPaused: false })}
                onMarkReady={(id) => updateOrderStatus(id, 'READY', { pickupCounter: 'Counter A' })}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
