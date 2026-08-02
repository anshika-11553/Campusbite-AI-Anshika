"use client";

import React, { useState, useEffect } from "react";
import { Order, api } from "@/lib/api";
import {
  ChefHat,
  Flame,
  CheckCircle2,
  Clock,
  RefreshCw,
  BellRing,
  UtensilsCrossed,
  Timer,
} from "lucide-react";

export const ChefDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

  useEffect(() => {
    loadKitchenQueue();
    const interval = setInterval(() => {
      loadKitchenQueue(true);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const loadKitchenQueue = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const allOrders: Order[] = await api.getVendorOrders();
      const kitchenOrders = (allOrders || []).filter((o: Order) =>
        ["ACCEPTED", "PREPARING", "READY"].includes(o.status)
      );
      setOrders(kitchenOrders);
    } catch (e) {
      console.error("Failed to load kitchen queue", e);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const handleChefAction = async (orderId: string, targetStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, targetStatus);
      setLastActionMsg(`Token #${orderId.slice(-4)} marked as ${targetStatus}!`);
      setTimeout(() => setLastActionMsg(null), 3000);
      loadKitchenQueue(true);
    } catch (e: any) {
      alert(e.message || "Chef action failed");
    }
  };

  const preparingOrders = (orders || []).filter((o) => o.status === "PREPARING");
  const acceptedOrders = (orders || []).filter((o) => o.status === "ACCEPTED");
  const readyOrders = (orders || []).filter((o) => o.status === "READY");

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-[#f8fafc]">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Kitchen Display System (KDS)</h1>
              <span className="px-2.5 py-0.5 text-xs font-extrabold bg-amber-500 text-white rounded-full shadow-sm">
                Chef Screen
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Live order prep & counter placement station</p>
          </div>
        </div>

        <button
          onClick={() => loadKitchenQueue()}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-amber-400 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-amber-600" />
          <span>Refresh KDS Queue</span>
        </button>
      </div>

      {lastActionMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-extrabold flex items-center gap-3 shadow-sm animate-in slide-in-from-top duration-150">
          <BellRing className="w-5 h-5 text-amber-600 animate-bounce" />
          <span>{lastActionMsg}</span>
        </div>
      )}

      {/* 3 Kitchen Queues Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Incoming Accepted Orders (Pending Prep) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Timer className="w-4 h-4 text-indigo-600" />
              <span>Incoming Queue</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-black text-xs">
              {acceptedOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {acceptedOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-indigo-200 rounded-3xl p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Token</span>
                    <span className="text-3xl font-black text-indigo-700">#{ord.token_number || "--"}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Est. {ord.estimated_wait_minutes || 10}m
                  </span>
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {(ord.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-900 font-extrabold">
                        {it.quantity}x {it.menu_name}
                      </span>
                      <span className="text-slate-400 text-[10px]">{it.category}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleChefAction(ord.id, "PREPARING")}
                  className="w-full py-3 rounded-xl bg-[#fc8019] hover:bg-[#e5700e] text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Flame className="w-4 h-4" />
                  <span>Start Preparing Now</span>
                </button>
              </div>
            ))}
            {acceptedOrders.length === 0 && (
              <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl text-xs text-slate-400 font-medium">
                No orders waiting for prep start.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Cooking in Progress (PREPARING) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#fc8019] animate-pulse" />
              <span>Cooking in Progress</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#fc8019] font-black text-xs">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {preparingOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border-2 border-orange-300 rounded-3xl p-5 space-y-4 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#fc8019] block uppercase">COOKING TOKEN</span>
                    <span className="text-4xl font-black text-slate-900">#{ord.token_number || "--"}</span>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-orange-100 text-[#fc8019] border border-orange-300 rounded-full animate-pulse">
                    On Stove 🔥
                  </span>
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {(ord.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-900 font-extrabold text-sm">
                        {it.quantity}x {it.menu_name}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleChefAction(ord.id, "READY")}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <BellRing className="w-4 h-4" />
                  <span>Mark Ready & Placed at Counter 🔔</span>
                </button>
              </div>
            ))}
            {preparingOrders.length === 0 && (
              <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl text-xs text-slate-400 font-medium">
                No orders currently cooking on stove.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Placed at Counter (READY) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Placed at Counter (Ready)</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {readyOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-emerald-300 rounded-3xl p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 block uppercase">READY TOKEN</span>
                    <span className="text-3xl font-black text-emerald-700">#{ord.token_number || "--"}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Awaiting Pickup
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-semibold">
                  {(ord.items || []).map((i: any) => `${i.quantity}x ${i.menu_name}`).join(", ")}
                </div>
              </div>
            ))}
            {readyOrders.length === 0 && (
              <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl text-xs text-slate-400 font-medium">
                No orders currently waiting at counter.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
