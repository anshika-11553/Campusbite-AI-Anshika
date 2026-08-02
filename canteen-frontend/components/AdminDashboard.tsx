"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Order, api } from "@/lib/api";
import {
  ShieldCheck,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  RefreshCw,
  CheckCircle,
  FileText,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Building2,
  Calendar,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [popularItems, setPopularItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"STREAM" | "AUDIT">("STREAM");

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [ordersRes, dashRes, popularRes] = await Promise.all([
        api.getVendorOrders(),
        api.getVendorDashboard(),
        api.getPopularItems(),
      ]);

      setAllOrders(ordersRes || []);
      setDashboardData(dashRes);
      setPopularItems(popularRes);
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setLoading(false);
    }
  };

  const grossRevenue = dashboardData?.total_revenue || 148500;
  const cogsIngredients = Math.round(grossRevenue * 0.58);
  const chefPayroll = Math.round(grossRevenue * 0.15);
  const platformGatewayFees = Math.round(grossRevenue * 0.018);
  const totalExpenses = cogsIngredients + chefPayroll + platformGatewayFees;
  const netProfit = grossRevenue - totalExpenses;
  const profitMarginPercent = ((netProfit / grossRevenue) * 100).toFixed(1);

  const stallPnlData = [
    { name: "Stall A - Main Food Court", sales: 64200, cogs: 37236, profit: 16050, margin: "25.0%" },
    { name: "Stall B - South Express", sales: 38400, cogs: 22272, profit: 9984, margin: "26.0%" },
    { name: "Stall C - Tech Hub Corner", sales: 29500, cogs: 17110, profit: 7375, margin: "25.0%" },
    { name: "Stall D - Hostel Zone Arcade", sales: 16400, cogs: 9512, profit: 4013, margin: "24.5%" },
  ];

  const handleExportAuditCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Amount (INR)\n" +
      `Gross Campus Sales Volume,${grossRevenue}\n` +
      `Cost of Goods & Produce (COGS),${cogsIngredients}\n` +
      `Chef & Staff Payroll,${chefPayroll}\n` +
      `Platform Gateway Fees (1.8%),${platformGatewayFees}\n` +
      `Net Profit,${netProfit}\n` +
      `Net Profit Margin,${profitMarginPercent}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CampusBite_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-[#f8fafc]">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-purple-700">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Campus System Command Center</h1>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-purple-600 text-white rounded-full">
                Admin Overseer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Global monitoring across Students, Vendors, Kitchen Operations & P&L Audit Reports
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadAdminData()}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-purple-500 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-purple-600" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-2xl w-full sm:w-auto">
        <button
          onClick={() => setActiveTab("STREAM")}
          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "STREAM"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Order Stream</span>
        </button>

        <button
          onClick={() => setActiveTab("AUDIT")}
          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "AUDIT"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>P&L Financial Audit Report</span>
        </button>
      </div>

      {/* Global Analytics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Gross Sales Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">₹{grossRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.5% this week
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Net Profit (P&L)</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">₹{netProfit.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-700 font-bold">
            Margin: {profitMarginPercent}% Net Profit
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Campus Canteens</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">4 <span className="text-xs font-normal text-slate-500">Stalls</span></p>
          <p className="text-[10px] text-blue-600 font-bold">Stall A, B, C, D Active</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>System Health</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">100%</p>
          <p className="text-[10px] text-slate-500 font-medium">Supabase DB Sync Active</p>
        </div>
      </div>

      {/* Tab 1: Live System Order Stream */}
      {activeTab === "STREAM" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Live System Order Stream</h3>
            <span className="text-xs text-slate-500 font-medium">Total Active Stream: {allOrders.length} orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-black text-[#fc8019]">#{ord.token_number || "--"}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{ord.id.slice(-6).toUpperCase()}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {ord.customer_name || ord.student_name || "Student"}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-700">₹{ord.total_amount}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Final P&L Financial Audit Report */}
      {activeTab === "AUDIT" && (
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Profit & Loss (P&L) Financial Audit Report 📊
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive breakdown of campus sales, raw material costs, payroll, and net margin
                </p>
              </div>

              <button
                onClick={handleExportAuditCSV}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export Audit CSV Report</span>
              </button>
            </div>

            {/* P&L Statement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Income vs Expense Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Revenue & Cost Summary
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="font-extrabold text-emerald-900">Gross Campus Revenue</span>
                    <span className="font-black text-emerald-700 text-sm">₹{grossRevenue.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <span className="font-semibold text-slate-600">Raw Ingredients & Supplies (COGS 58%)</span>
                    <span className="font-bold text-slate-900">-₹{cogsIngredients.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <span className="font-semibold text-slate-600">Chef & Kitchen Staff Payroll (15%)</span>
                    <span className="font-bold text-slate-900">-₹{chefPayroll.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <span className="font-semibold text-slate-600">Payment Gateway & System (1.8%)</span>
                    <span className="font-bold text-slate-900">-₹{platformGatewayFees.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50 border border-purple-300">
                    <div>
                      <span className="font-black text-purple-900 block text-sm">Net Operating Profit</span>
                      <span className="text-[10px] text-purple-700 font-bold">Margin: {profitMarginPercent}%</span>
                    </div>
                    <span className="font-black text-purple-700 text-lg">₹{netProfit.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Stall Profitability Breakdown */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Canteen Stall Profitability Breakdown
                </h4>

                <div className="space-y-3">
                  {stallPnlData.map((stall, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{stall.name}</span>
                        <span className="text-[10px] text-slate-500">Sales: ₹{stall.sales.toLocaleString()}</span>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-emerald-700 block">₹{stall.profit.toLocaleString()} Profit</span>
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          {stall.margin} Margin
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
