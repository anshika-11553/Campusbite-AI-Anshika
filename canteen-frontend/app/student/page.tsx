"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StudentDashboard } from "@/components/StudentDashboard";
import { useAuth } from "@/context/AuthContext";
import { AuthPage } from "@/components/AuthPage";
import { ROLES } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function StudentPage() {
  const { user, activeRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (activeRole === ROLES.VENDOR) {
        router.replace("/vendor");
      } else if (activeRole === ROLES.CHEF) {
        router.replace("/chef");
      } else if (activeRole === ROLES.ADMIN) {
        router.replace("/admin");
      }
    }
  }, [user, activeRole, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#fc8019] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading Student Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (activeRole !== ROLES.STUDENT) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc] relative">
      <div>
        <Navbar />
        <main className="animate-in fade-in duration-300">
          <StudentDashboard />
        </main>
      </div>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white mt-12">
        <p>© 2026 CampusBite Student Canteen & Pre-Order Portal.</p>
      </footer>
    </div>
  );
}
