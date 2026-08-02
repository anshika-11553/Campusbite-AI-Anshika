"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
  TrendingUp,
} from "lucide-react";

import { api } from "@/lib/api";

export interface StallInfo {
  id: string;
  name: string;
  location: string;
  queueLength: number;
  avgWaitMins: number;
  status: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  popularDishes: string[];
}

interface CrowdMapProps {
  selectedStallId: string;
  onSelectStall: (stallId: string) => void;
}

export const INITIAL_STALLS: StallInfo[] = [
  {
    id: "stall-a",
    name: "Stall A - Beverages & Snacks",
    location: "North Academic Block",
    queueLength: 0,
    avgWaitMins: 3,
    status: "LOW",
    popularDishes: ["Cold Coffee", "Cheese Samosa"],
  },
  {
    id: "stall-b",
    name: "Stall B - Main Course Express",
    location: "Central Dining Hall",
    queueLength: 0,
    avgWaitMins: 5,
    status: "LOW",
    popularDishes: ["Paneer Roll", "Chole Bhature"],
  },
  {
    id: "stall-c",
    name: "Stall C - Tech Hub Noodle Corner",
    location: "Engineering Complex, Floor 1",
    queueLength: 0,
    avgWaitMins: 4,
    status: "LOW",
    popularDishes: ["Chilli Garlic Noodles", "Peri Peri Fries"],
  },
  {
    id: "stall-d",
    name: "Stall D - South Indian & Shakes",
    location: "Library Courtyard Lawn",
    queueLength: 0,
    avgWaitMins: 2,
    status: "LOW",
    popularDishes: ["Masala Dosa", "Mango Lassi"],
  },
];

export const CrowdMap: React.FC<CrowdMapProps> = ({ selectedStallId, onSelectStall }) => {
  const [stalls, setStalls] = useState<StallInfo[]>(INITIAL_STALLS);
  const [stallRec, setStallRec] = useState<any>(null);

  useEffect(() => {
    const fetchCrowdData = async () => {
      const intel = await api.getIntelligence();
      if (intel && Array.isArray(intel.stallMetrics) && intel.stallMetrics.length > 0) {
        setStalls(intel.stallMetrics);
      }
    };

    fetchCrowdData();
    const interval = setInterval(fetchCrowdData, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    api.getStallRecommendation(selectedStallId).then((res) => {
      if (res) setStallRec(res);
    });
  }, [selectedStallId]);

  const activeStall = stalls.find((s) => s.id === selectedStallId) || stalls[0];

  const getStatusConfig = (status: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" | string) => {
    switch (status) {
      case "CRITICAL":
        return {
          bg: "bg-red-100 border-red-300 text-red-800",
          badgeBg: "bg-red-700 text-white font-black",
          text: "CRITICAL QUEUE • Extreme Delays 🔴",
        };
      case "HEAVY":
      case "BUSY":
      case "HIGH":
        return {
          bg: "bg-orange-50 border-orange-200 text-orange-800",
          badgeBg: "bg-orange-600 text-white font-black",
          text: "HEAVY CROWD • Longer Wait 🟠",
        };
      case "MODERATE":
      case "MEDIUM":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-800",
          badgeBg: "bg-amber-500 text-white font-black",
          text: "MODERATE QUEUE • ~10 min wait 🟡",
        };
      case "FAST QUEUE":
      case "LOW":
      default:
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          badgeBg: "bg-emerald-600 text-white font-black",
          text: "FAST QUEUE • Quick Pickup 🟢",
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-[#fc8019]">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Live Campus Canteen Crowding Map 📍
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Real-time stall queue congestion & AI smart rerouter
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-extrabold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Queue Radar Active</span>
        </div>
      </div>

      {/* AI Stall Recommendation Engine Guidance Banner */}
      {stallRec && stallRec.is_faster_alternate_available && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-600 text-white rounded-xl shadow-sm">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-purple-900 uppercase tracking-wider">AI Stall Recommendation Engine</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-purple-600 text-white rounded-md">
                  ~{stallRec.time_saved_minutes} mins faster
                </span>
              </div>
              <p className="text-xs text-purple-950 font-bold">
                {stallRec.reason}
              </p>
              <p className="text-xs text-purple-700 font-semibold">
                Estimated Ready Time: <span className="font-black text-slate-900">{stallRec.estimated_ready}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectStall(stallRec.recommended_stall_id || "stall-d")}
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shrink-0 flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
          >
            <span>Switch to {stallRec.recommended_stall?.split(" - ")[0] || "Stall D"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of 4 Campus Stalls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stalls.map((stall) => {
          const config = getStatusConfig(stall.status);
          const isSelected = stall.id === selectedStallId;

          return (
            <div
              key={stall.id}
              onClick={() => onSelectStall(stall.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                isSelected
                  ? "bg-orange-50/70 border-[#fc8019] shadow-md ring-2 ring-[#fc8019]/20"
                  : "bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white"
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-extrabold bg-[#fc8019] text-white rounded-md">
                  Active Stall
                </span>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 pr-12">
                  <MapPin className="w-3.5 h-3.5 text-[#fc8019]" />
                  <span className="truncate">{stall.name}</span>
                </div>

                <p className="text-[10px] text-slate-500 font-medium">{stall.location}</p>

                <div className={`p-2 rounded-xl text-[11px] font-bold border ${config.bg} flex items-center justify-between`}>
                  <span>{config.text}</span>
                </div>
              </div>

              {/* Queue Length & Time Metrics */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-700 font-bold">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>{stall.queueLength} in Queue</span>
                </div>

                <div className="flex items-center gap-1 text-slate-700 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#fc8019]" />
                  <span>~{stall.avgWaitMins} mins</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
