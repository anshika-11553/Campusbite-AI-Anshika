"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { AuthPage } from "@/components/AuthPage";
import { StudentDashboard } from "@/components/StudentDashboard";
import { VendorDashboard } from "@/components/VendorDashboard";

export default function Home() {
  const { user, activeRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#fc8019] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading CampusBite System...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderDashboard = () => {
    switch (activeRole) {
      case ROLES.VENDOR:
        return <VendorDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc] relative">
      <div>
        <Navbar />
        <main className="animate-in fade-in duration-300">
          {renderDashboard()}
        </main>
      </div>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white mt-12">
        <p>© 2026 CampusBite Canteen Queue & Pre-Order System.</p>
      </footer>
    </div>
  );
}
