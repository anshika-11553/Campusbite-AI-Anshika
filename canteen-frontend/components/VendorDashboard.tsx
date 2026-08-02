"use client";

import React, { useState, useEffect } from "react";
import { Order, api, formatTokenDisplay } from "@/lib/api";
import {
  Store,
  Clock,
  CheckCircle,
  TrendingUp,
  Flame,
  Bell,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  ChefHat,
  ChevronRight,
} from "lucide-react";

export const VendorDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [popularItems, setPopularItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    loadVendorData();
    const interval = setInterval(() => {
      loadVendorData(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadVendorData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [ordersRes, dashRes, popularRes] = await Promise.all([
        api.getVendorOrders(),
        api.getVendorDashboard(),
        api.getPopularItems(),
      ]);

      const prevCount = orders.length;
      if (isSilent && ordersRes.length > prevCount) {
        setNotificationMsg("🚨 New order received! Token #" + (ordersRes[0]?.token_number || ""));
        setTimeout(() => setNotificationMsg(null), 5000);
      }

      setOrders(ordersRes || []);
      setDashboardData(dashRes);
      setPopularItems(popularRes);
    } catch (e) {
      console.error("Failed to load vendor data", e);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, nextStatus);
      setNotificationMsg(`Order #${orderId.slice(-4)} updated to ${nextStatus}`);
      setTimeout(() => setNotificationMsg(null), 3000);
      loadVendorData(true);
    } catch (e: any) {
      alert(e.message || "Failed to update order status");
    }
  };

  const filteredOrders = (orders || []).filter((ord) => {
    if (filterStatus !== "ALL" && ord.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchToken = ord.token_number?.toString().includes(q);
      const matchName = ord.customer_name?.toLowerCase().includes(q) || ord.student_name?.toLowerCase().includes(q);
      return matchToken || matchName;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-[#f8fafc]">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Vendor Order Command Hub</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Accept orders, manage prep status, and view sales performance</p>
        </div>

        <button
          onClick={() => loadVendorData()}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-3 shadow-sm animate-in slide-in-from-top duration-200">
          <Bell className="w-5 h-5 text-emerald-600 animate-bounce" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Metric Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">₹{dashboardData?.total_revenue || 14850}</p>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% today
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Orders</span>
            <Flame className="w-4 h-4 text-[#fc8019]" />
          </div>
          <p className="text-2xl font-black text-[#fc8019]">{orders.filter((o: Order) => ["PAID", "ACCEPTED", "PREPARING"].includes(o.status)).length}</p>
          <p className="text-[10px] text-slate-500 font-medium">In kitchen queue</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Completed Orders</span>
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{dashboardData?.completed_orders || 132}</p>
          <p className="text-[10px] text-slate-500 font-medium">Served today</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Avg Preparation</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">8.5 <span className="text-xs font-normal text-slate-500">mins</span></p>
          <p className="text-[10px] text-emerald-600 font-bold">⚡ Optimal Speed</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["ALL", "PAID", "ACCEPTED", "PREPARING", "READY", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                filterStatus === st
                  ? "bg-[#fc8019] text-white border-[#fc8019] shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Token # or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8019]"
          />
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-60 rounded-3xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
          <Store className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching orders in queue</h3>
          <p className="text-xs text-slate-500">Waiting for incoming student requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className={`bg-white border rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all shadow-sm ${
                ord.status === "PAID"
                  ? "border-emerald-400 shadow-md"
                  : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">TOKEN NUMBER</span>
                    <span className="text-3xl font-black text-[#fc8019]">
                      {formatTokenDisplay(ord.token_number, ord.token_code)}
                    </span>
                    {ord.queue_position && (
                      <span className="text-[10px] font-extrabold text-slate-500 block mt-0.5">
                        Queue #{ord.queue_position}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 text-[11px] font-extrabold bg-slate-100 text-slate-800 rounded-full border border-slate-200">
                      {ord.status}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                      {ord.customer_name || ord.student_name || "Student"}
                    </p>
                  </div>
                </div>

                <div className="my-3 space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {(ord.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-800 font-bold">
                        {it.quantity}x {it.menu_name || "Item"}
                      </span>
                      <span className="text-slate-500 font-medium">₹{it.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500 font-semibold">Total Amount</span>
                  <span className="text-base font-black text-slate-900">₹{ord.total_amount}</span>
                </div>

                {ord.status === "PAID" && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, "ACCEPTED")}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    Accept Order & Send to Kitchen
                  </button>
                )}

                {ord.status === "ACCEPTED" && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, "PREPARING")}
                    className="w-full py-2.5 rounded-xl bg-[#fc8019] hover:bg-[#e5700e] text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    Start Preparation (PREPARING)
                  </button>
                )}

                {ord.status === "PREPARING" && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, "READY")}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    Mark Ready at Counter (READY)
                  </button>
                )}

                {ord.status === "READY" && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, "COMPLETED")}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    Mark Delivered (COMPLETED)
                  </button>
                )}

                {ord.status === "COMPLETED" && (
                  <div className="text-center py-2 text-xs font-bold text-slate-400">
                    Order Fulfilled ✓
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
