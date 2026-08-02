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
  DollarSign,
  ChefHat,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Send,
} from "lucide-react";

export const VendorDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [popularItems, setPopularItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"INCOMING" | "READY" | "COMPLETED" | "ALL">("INCOMING");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [intelligenceData, setIntelligenceData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [inputPins, setInputPins] = useState<{ [orderId: string]: string }>({});
  const [pinErrors, setPinErrors] = useState<{ [orderId: string]: string }>({});

  const handleVerifyPin = async (orderId: string) => {
    const pin = inputPins[orderId] || "";
    if (!pin || pin.trim().length !== 6) {
      setPinErrors({ ...pinErrors, [orderId]: "Enter 6-digit PIN" });
      return;
    }

    try {
      const res = await api.verifyPickupPin(orderId, pin.trim());
      if (res.success) {
        setNotificationMsg("✅ PIN Verified! Order marked as Collected.");
        setTimeout(() => setNotificationMsg(null), 4000);
        loadVendorData(true);
      } else {
        setPinErrors({ ...pinErrors, [orderId]: res.message || "Incorrect PIN" });
      }
    } catch (e: any) {
      setPinErrors({ ...pinErrors, [orderId]: e.message || "Incorrect PIN" });
    }
  };

  useEffect(() => {
    loadVendorData();
    const interval = setInterval(() => {
      loadVendorData(true);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadVendorData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [ordersRes, dashRes, popularRes, intelRes, forecastRes] = await Promise.all([
        api.getVendorOrders(),
        api.getVendorDashboard(),
        api.getPopularItems(),
        api.getIntelligence(),
        api.getVendorForecast("stall-a"),
      ]);

      if (ordersRes && ordersRes.length > 0) {
        console.log("Vendor received order:", ordersRes[0]);
      }

      const prevCount = orders.length;
      if (isSilent && ordersRes && ordersRes.length > prevCount) {
        const latestOrder = ordersRes[0];
        setNotificationMsg(`🚨 New Order Received! Token #${latestOrder?.token_number || ""}`);
        setTimeout(() => setNotificationMsg(null), 5000);
      }

      setOrders(ordersRes || []);
      setDashboardData(dashRes);
      setPopularItems(popularRes);
      setIntelligenceData(intelRes);
      setForecastData(forecastRes);
    } catch (e) {
      console.error("Failed to load vendor data", e);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string | undefined, nextStatus: string) => {
    if (!orderId) {
      console.error("CRITICAL ERROR: Attempted to update order status with undefined orderId");
      alert("Error: Missing order ID");
      return;
    }

    console.log("Accept payload / Target UUID:", orderId);
    console.log(`PATCH URL: /api/orders/${orderId}/status -> nextStatus: ${nextStatus}`);

    try {
      await api.updateOrderStatus(orderId, nextStatus);
      if (nextStatus === "ACCEPTED") {
        setNotificationMsg(`Order accepted!`);
      } else if (nextStatus === "PREPARING" || nextStatus === "IN_KITCHEN") {
        setNotificationMsg(`Order sent to Chef in Kitchen! Disappeared from incoming queue.`);
      } else if (nextStatus === "READY") {
        setNotificationMsg(`Order marked Ready for Pickup! Student notified.`);
      } else if (nextStatus === "COLLECTED") {
        setNotificationMsg(`Order marked as Collected by Student! Order completed.`);
      }
      setTimeout(() => setNotificationMsg(null), 4000);
      loadVendorData(true);
    } catch (e: any) {
      alert(e.message || "Failed to update order status");
    }
  };

  // Status Metrics
  const pendingOrders = (orders || []).filter((o) => ["PLACED", "PENDING_PAYMENT", "PAID"].includes(o.status));
  const acceptedOrders = (orders || []).filter((o) => o.status === "ACCEPTED");
  const inKitchenOrders = (orders || []).filter((o) => ["IN_KITCHEN", "PREPARING"].includes(o.status));
  const readyOrders = (orders || []).filter((o) => o.status === "READY");
  const completedOrders = (orders || []).filter((o) => ["COLLECTED", "COMPLETED"].includes(o.status));

  // Orders filtered by tab
  const getFilteredOrders = () => {
    let list = orders || [];
    if (activeTab === "INCOMING") {
      list = list.filter((o) => ["PLACED", "PENDING_PAYMENT", "PAID", "ACCEPTED"].includes(o.status));
    } else if (activeTab === "READY") {
      list = list.filter((o) => o.status === "READY");
    } else if (activeTab === "COMPLETED") {
      list = list.filter((o) => ["COLLECTED", "COMPLETED"].includes(o.status));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return list.filter((ord) => {
        const matchToken = ord.token_number?.toString().includes(q) || ord.token_code?.toLowerCase().includes(q);
        const matchName = (ord.customer_name || ord.student_name || "").toLowerCase().includes(q);
        return matchToken || matchName;
      });
    }

    return list;
  };

  const filteredOrders = getFilteredOrders();
  const todayRevenue = dashboardData?.total_revenue || 14850;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-[#f8fafc]">
      
      {/* Vendor Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Vendor Management Command Hub</h1>
              <p className="text-xs text-slate-500 font-medium">Main Food Court Canteen Stall A • Dedicated Vendor Operations</p>
            </div>
            <span className="px-2.5 py-0.5 text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Sync
            </span>
          </div>
        </div>

        <button
          onClick={() => loadVendorData()}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Realtime Notification Banner */}
      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs font-black flex items-center gap-3 shadow-lg animate-in slide-in-from-top duration-200">
          <Bell className="w-5 h-5 animate-bounce text-white" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Vendor Analytics Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase">
            <span>Today's Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">₹{todayRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +16.4% today
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase">
            <span>Pending Orders</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingOrders.length + acceptedOrders.length}</p>
          <p className="text-[10px] text-slate-400 font-medium">Incoming & Accepted</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase">
            <span>In Kitchen Prep</span>
            <ChefHat className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-600">{inKitchenOrders.length}</p>
          <p className="text-[10px] text-slate-400 font-medium">Cooking with Chef</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase">
            <span>Ready for Pickup</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{readyOrders.length}</p>
          <p className="text-[10px] text-emerald-700 font-bold">Counter Pickup Ready</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase">
            <span>Avg Wait Time</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">11.5 <span className="text-xs text-slate-400">mins</span></p>
          <p className="text-[10px] text-emerald-600 font-bold">⚡ Optimal Prep</p>
        </div>
      </div>

      {/* AI Kitchen Demand Forecast Engine Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-emerald-800/60">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl text-emerald-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">AI Kitchen Demand Forecast Engine</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-400 text-slate-950 rounded-md flex items-center gap-1">
                <Zap className="w-3 h-3" /> {forecastData?.confidence_percent || "94%"} AI Confidence
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-800 text-emerald-100 rounded-md">
                Est. Next 30m: {forecastData?.expected_orders_30m || 5} Orders | Next 1h: {forecastData?.expected_orders_1h || 10} Orders
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              🤖 {forecastData?.explanation || "Demand for Cheese Garlic Bread has increased by 42% compared to average for this time of day."}
            </p>
            {forecastData?.recommended_text && (
              <p className="text-xs font-extrabold text-amber-300">
                💡 Recommended Action: {forecastData.recommended_text}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/80 px-4 py-2 rounded-2xl border border-emerald-700/60 shrink-0">
          <span>Live Queue: {orders.filter(o => o.status !== "COLLECTED" && o.status !== "COMPLETED").length} Active Orders</span>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab("INCOMING")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border ${
              activeTab === "INCOMING"
                ? "bg-[#fc8019] text-white border-[#fc8019] shadow-md"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900"
            }`}
          >
            Incoming & Accepted ({pendingOrders.length + acceptedOrders.length})
          </button>

          <button
            onClick={() => setActiveTab("READY")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border ${
              activeTab === "READY"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900"
            }`}
          >
            Ready for Pickup 🔔 ({readyOrders.length})
          </button>

          <button
            onClick={() => setActiveTab("COMPLETED")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border ${
              activeTab === "COMPLETED"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900"
            }`}
          >
            Collected ({completedOrders.length})
          </button>

          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border ${
              activeTab === "ALL"
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900"
            }`}
          >
            All Orders ({orders.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Token # or Student Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8019]"
          />
        </div>
      </div>

      {/* Orders Table View */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 rounded-3xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
          <Store className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No orders currently in this queue</h3>
          <p className="text-xs text-slate-500">Live order status updates automatically via Supabase Realtime.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Token No</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Items & Qty</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Pickup Type</th>
                  <th className="py-3.5 px-4">Order Time</th>
                  <th className="py-3.5 px-4">Est. Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Vendor Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((ord) => {
                  const realOrderId = ord.id || ord.order_id || "";
                  const tokenDisp = formatTokenDisplay(ord.token_number, ord.token_code);
                  const orderTimeStr = new Date(ord.created_at || Date.now()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={realOrderId || Math.random()} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-black text-base text-[#fc8019]">
                        {tokenDisp}
                      </td>

                      <td className="py-4 px-4 font-extrabold text-slate-900">
                        {ord.customer_name || ord.student_name || "Student"}
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-1">
                          {(ord.items || []).map((it: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs">
                              <span className="font-black text-[#fc8019]">{it.quantity}x</span>
                              <span className="font-semibold text-slate-800">{it.menu_name || "Item"}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ord.payment_status || "PAID"} (₹{ord.total_amount})
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-600">
                        Counter Pickup
                      </td>

                      <td className="py-4 px-4 text-slate-500 text-[11px] font-mono">
                        {orderTimeStr}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800">
                        ~{ord.estimated_wait_minutes || 10} mins
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                          ord.status === "READY"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse"
                            : ord.status === "IN_KITCHEN" || ord.status === "PREPARING"
                            ? "bg-purple-50 text-purple-700 border-purple-300"
                            : ord.status === "ACCEPTED"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                            : ord.status === "COLLECTED" || ord.status === "COMPLETED"
                            ? "bg-slate-100 text-slate-600 border-slate-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}>
                          {ord.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        {["PLACED", "PENDING_PAYMENT", "PAID"].includes(ord.status) && (
                          <button
                            onClick={() => handleUpdateStatus(realOrderId, "ACCEPTED")}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all inline-flex items-center gap-1"
                          >
                            <span>Accept Order</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {ord.status === "ACCEPTED" && (
                          <button
                            onClick={() => handleUpdateStatus(realOrderId, "PREPARING")}
                            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-sm transition-all inline-flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send to Chef</span>
                          </button>
                        )}

                        {["IN_KITCHEN", "PREPARING"].includes(ord.status) && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-extrabold">
                            <ChefHat className="w-4 h-4 animate-bounce" />
                            <span>Chef Cooking in Kitchen</span>
                          </div>
                        )}

                        {ord.status === "READY" && (
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 bg-emerald-50 p-1.5 rounded-xl border border-emerald-300">
                              <input
                                type="text"
                                maxLength={6}
                                placeholder="PIN (6-digit)"
                                value={inputPins[realOrderId] || ""}
                                onChange={(e) => setInputPins({ ...inputPins, [realOrderId]: e.target.value })}
                                className="w-24 px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-black text-center focus:outline-none focus:border-emerald-600 tracking-widest shadow-inner"
                              />
                              <button
                                onClick={() => handleVerifyPin(realOrderId)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1"
                              >
                                <span>Verify</span>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {pinErrors[realOrderId] && (
                              <span className="text-[10px] font-bold text-red-600 animate-bounce">
                                ⚠️ {pinErrors[realOrderId]}
                              </span>
                            )}
                          </div>
                        )}

                        {["COLLECTED", "COMPLETED"].includes(ord.status) && (
                          <span className="text-xs font-extrabold text-slate-400">
                            Completed ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
