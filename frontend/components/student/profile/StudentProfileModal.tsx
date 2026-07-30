'use client';

import React, { useState } from 'react';
import { StudentStats } from '@/types/student';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { User, Wallet, Award, Utensils, Store, ShieldCheck, Heart, Plus, Bell, Check } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StudentStats | null;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ isOpen, onClose, stats }) => {
  const { showToast } = useToast();
  const [dietaryPref, setDietaryPref] = useState<'veg' | 'non_veg' | 'all'>('all');
  const [topUpAmount, setTopUpAmount] = useState<number>(200);

  const handleTopUp = () => {
    showToast(`Successfully added ${formatCurrency(topUpAmount)} to Canteen Wallet! 💳`, 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Campus Profile" size="md">
      <div className="space-y-5 py-1">
        {/* Profile Identity Card */}
        <div className="p-4 bg-gradient-to-r from-[#054A36] to-emerald-800 text-white rounded-2xl flex items-center gap-4 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-white shrink-0 font-extrabold text-xl shadow-inner">
            <User className="h-8 w-8 text-emerald-200" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              <ShieldCheck className="h-3 w-3" />
              <span>Verified Student ID: CS-2024-892</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">Anshika Sharma</h3>
            <p className="text-xs text-emerald-100/80">B.Tech Computer Science & Engineering (3rd Year)</p>
          </div>
        </div>

        {/* Wallet & Points Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">Canteen Wallet</span>
              <Wallet className="h-4 w-4 text-emerald-700" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">{formatCurrency(stats?.walletBalanceInINR || 650)}</span>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setTopUpAmount(100)}
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                  topUpAmount === 100 ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-800 border-emerald-300'
                }`}
              >
                +₹100
              </button>
              <button
                type="button"
                onClick={() => setTopUpAmount(200)}
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                  topUpAmount === 200 ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-800 border-emerald-300'
                }`}
              >
                +₹200
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleTopUp}
                leftIcon={<Plus className="h-3 w-3" />}
                className="text-[10px] bg-emerald-700 hover:bg-emerald-800 py-1 px-2 ml-auto"
              >
                Top Up
              </Button>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800">Reward Points</span>
              <Award className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">{stats?.rewardPoints || 340} PTS</span>
            <p className="text-[10px] text-amber-700/80 font-medium">Earn +10 PTS on every ₹100 spent</p>
          </div>
        </div>

        {/* Dietary Preference Selector */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Utensils className="h-3.5 w-3.5 text-slate-700" />
            Dietary Preference Filter
          </h4>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setDietaryPref('all')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                dietaryPref === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Items 🍽️
            </button>
            <button
              type="button"
              onClick={() => setDietaryPref('veg')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                dietaryPref === 'veg'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Veg Only 🟢
            </button>
            <button
              type="button"
              onClick={() => setDietaryPref('non_veg')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                dietaryPref === 'non_veg'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Non-Veg 🔴
            </button>
          </div>
        </div>

        {/* Preferred Outlets & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700 shrink-0">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Favorite Category</span>
              <h5 className="font-extrabold text-xs text-slate-900">{stats?.favoriteCategory || 'Main Course 🍛'}</h5>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 shrink-0">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Favorite Vendor</span>
              <h5 className="font-extrabold text-xs text-slate-900">{stats?.favoriteVendor || 'Main Campus Food Court'}</h5>
            </div>
          </div>
        </div>

        {/* Notifications Preference */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="h-4 w-4 text-slate-600" />
            <div>
              <h5 className="font-bold text-xs text-slate-900">Order SMS & Toast Notifications</h5>
              <p className="text-[10px] text-slate-500">Receive instant token status updates</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
            <Check className="h-3 w-3" /> Enabled
          </span>
        </div>

        <div className="pt-2">
          <Button variant="secondary" onClick={onClose} className="w-full rounded-xl font-bold">
            Close Profile
          </Button>
        </div>
      </div>
    </Modal>
  );
};
