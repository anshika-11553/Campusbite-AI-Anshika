'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { User, Wallet, Award, Mail, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/constants/currency';

export default function StudentProfilePage() {
  const { user } = useAuth();

  return (
    <DashboardLayout role="student" title="Student Profile & Wallet">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-6 border-slate-200 bg-white space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-full bg-[#054A36] text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {(user?.email?.[0] || 'A').toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {user?.displayName || 'Anshika Sharma'}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {user?.email || 'student@college.edu'}
              </p>
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#054A36] text-[10px] font-extrabold">
                <ShieldCheck className="h-3 w-3" /> Verified Student ID: STD-2026-89
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-[#054A36] font-bold text-xs">
                <Wallet className="h-4 w-4" /> Canteen Meal Wallet
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(650)}</p>
              <span className="text-[10px] text-slate-400">Pre-loaded for express 1-tap checkout</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                <Award className="h-4 w-4" /> Reward Loyalty Points
              </div>
              <p className="text-2xl font-extrabold text-slate-900">340 PTS</p>
              <span className="text-[10px] text-slate-400">+10 PTS earned per ₹100 spent</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <User className="h-4 w-4 text-slate-500" /> Academic & Department Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block font-medium">Department</span>
                <span className="font-bold text-slate-800">Computer Science & Eng.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block font-medium">Academic Year</span>
                <span className="font-bold text-slate-800">3rd Year / 6th Sem</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
