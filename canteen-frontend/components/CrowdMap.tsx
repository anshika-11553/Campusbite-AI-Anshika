"use client";

import React, { useState } from "react";
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

export interface StallInfo {
  id: string;
  name: string;
  location: string;
  queueLength: number;
  avgWaitMins: number;
  status: "LOW" | "MODERATE" | "HIGH";
  popularDishes: string[];
}

interface CrowdMapProps {
  selectedStallId: string;
  onSelectStall: (stallId: string) => void;
}

export const INITIAL_STALLS: StallInfo[] = [
  {
    id: "stall-a",
    name: "Stall A - Main Food Court",
    location: "North Academic Block",
    queueLength: 28,
    avgWaitMins: 22,
    status: "HIGH",
    popularDishes: ["Paneer Roll", "Chole Bhature"],
  },
  {
    id: "stall-b",
    name: "Stall B - South Block Express",
    location: "Science Complex, Floor 1",
    queueLength: 3,
    avgWaitMins: 4,
    status: "LOW",
    popularDishes: ["Cold Coffee", "Cheese Samosa"],
  },
  {
    id: "stall-c",
    name: "Stall C - Tech Hub Snack Corner",
    location: "Engineering Library Lawn",
    queueLength: 11,
    avgWaitMins: 10,
    status: "MODERATE",
    popularDishes: ["Chilli Garlic Noodles", "Peri Peri Fries"],
  },
  {
    id: "stall-d",
    name: "Stall D - Hostel Arcade Canteen",
    location: "Hostel Zone 3 Courtyard",
    queueLength: 1,
    avgWaitMins: 2,
    status: "LOW",
    popularDishes: ["Veg Momos", "Kullad Chai"],
  },
];

export const CrowdMap: React.FC<CrowdMapProps> = ({ selectedStallId, onSelectStall }) => {
  const [stalls] = useState<StallInfo[]>(INITIAL_STALLS);
  const activeStall = stalls.find((s) => s.id === selectedStallId) || stalls[0];

  const getStatusConfig = (status: "LOW" | "MODERATE" | "HIGH") => {
    switch (status) {
      case "HIGH":
        return {
          bg: "bg-red-50 border-red-200 text-red-700",
          badgeBg: "bg-red-600 text-white",
          text: "Heavy Crowded • Longer Delays 🔴",
        };
      case "MODERATE":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-800",
          badgeBg: "bg-amber-500 text-white",
          text: "Moderate Queue • 10 min wait 🟡",
        };
      case "LOW":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          badgeBg: "bg-emerald-600 text-white",
          text: "Fast Express Queue • Quick Pickup 🟢",
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

      {/* High Crowding Smart Reroute Alert */}
      {activeStall.status === "HIGH" && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-red-900 uppercase tracking-wide">
                ⚠️ High Crowding Alert: {activeStall.name}
              </h4>
              <p className="text-xs text-red-700 mt-0.5">
                Current queue has <strong>{activeStall.queueLength} students</strong> (~{activeStall.avgWaitMins} mins wait).
                AI recommends switching to <strong>Stall D (Hostel Zone)</strong> for 2-minute instant pickup!
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectStall("stall-d")}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shrink-0 flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
          >
            <span>Reroute to Stall D (2 min wait)</span>
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
