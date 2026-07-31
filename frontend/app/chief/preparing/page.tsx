'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { KDSOrderCard } from '@/components/headChef/KDSOrderCard';
import { EmptyState } from '@/components/student/common/EmptyState';
import { Card } from '@/components/ui/Card';
import { Flame, CheckCircle2, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export const COOKING_STAGES = [
  'Accepted',
  'Ingredients Collected',
  'Cooking',
  'Half Prepared',
  'Garnishing',
  'Packaging',
  'Ready for Pickup',
] as const;

export default function ChefPreparingPage() {
  const { orders, updateOrderStatus } = useOrderWorkflow();
  const { showToast } = useToast();
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');

  // Track sub-stages for each preparing order
  const [orderStageMap, setOrderStageMap] = useState<Record<string, number>>({});

  const getStageIndex = (orderId: string) => orderStageMap[orderId] ?? 2; // Default to 'Cooking' (index 2)

  const handleAdvanceStage = (orderId: string) => {
    const currentIndex = getStageIndex(orderId);
    if (currentIndex < COOKING_STAGES.length - 1) {
      const nextIndex = currentIndex + 1;
      setOrderStageMap((prev) => ({ ...prev, [orderId]: nextIndex }));
      const nextStageName = COOKING_STAGES[nextIndex];
      showToast(`Token stage updated to: ${nextStageName}`, 'info');

      if (nextIndex === COOKING_STAGES.length - 1) {
        updateOrderStatus(orderId, 'READY', { pickupCounter: 'Counter A' });
      }
    }
  };

  return (
    <DashboardLayout role="chief" title="Active Preparing Stations">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="h-6 w-6 text-amber-500 animate-pulse" />
              Active Cooking Stations & Workflow Progress
            </h2>
            <p className="text-xs text-slate-500">Track 7-stage visual preparation progress from ingredients to packaging</p>
          </div>
          <span className="px-3 py-1 bg-amber-500 text-white text-xs font-extrabold rounded-full">
            {preparingOrders.length} Active Cooking
          </span>
        </div>

        {preparingOrders.length === 0 ? (
          <EmptyState
            icon={<Flame className="h-8 w-8 text-slate-400" />}
            title="No Active Preparation Tickets"
            description="There are currently no orders actively cooking on the stations."
          />
        ) : (
          <div className="space-y-6">
            {preparingOrders.map((order) => {
              const stageIdx = getStageIndex(order.id);
              const progressPct = Math.round(((stageIdx + 1) / COOKING_STAGES.length) * 100);

              return (
                <Card key={order.id} className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
                  {/* Ticket Header & Advance Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-extrabold text-base rounded-xl">
                        Token #{order.tokenNumber}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {order.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                        </h3>
                        <span className="text-xs text-slate-400">Order #{order.orderNumber} • {order.vendorName}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdvanceStage(order.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <span>Advance Stage ({COOKING_STAGES[stageIdx]})</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* 7-Stage Visual Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Current Stage: <span className="text-amber-600 font-extrabold">{COOKING_STAGES[stageIdx]}</span>
                      </span>
                      <span className="font-extrabold text-amber-600">{progressPct}% Complete</span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Step Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1 pt-1">
                      {COOKING_STAGES.map((st, i) => (
                        <div
                          key={st}
                          className={`p-1.5 rounded-lg text-[10px] font-bold text-center border transition-all ${
                            i === stageIdx
                              ? 'bg-amber-50 border-amber-400 text-amber-900 ring-1 ring-amber-400'
                              : i < stageIdx
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-850 dark:border-slate-800'
                          }`}
                        >
                          {i < stageIdx ? (
                            <CheckCircle2 className="h-3 w-3 mx-auto text-emerald-600 mb-0.5" />
                          ) : (
                            <span className="block text-[9px] text-slate-400">Stage {i + 1}</span>
                          )}
                          <span className="truncate block">{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KDS Card Details */}
                  <div className="pt-2">
                    <KDSOrderCard
                      order={order}
                      onStartPreparing={(id) =>
                        updateOrderStatus(id, 'PREPARING', { preparedBy: 'Head Chef Kitchen', isPaused: false })
                      }
                      onPausePreparation={(id) => updateOrderStatus(id, 'PREPARING', { isPaused: true })}
                      onResumePreparation={(id) => updateOrderStatus(id, 'PREPARING', { isPaused: false })}
                      onMarkReady={(id) => updateOrderStatus(id, 'READY', { pickupCounter: 'Counter A' })}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
