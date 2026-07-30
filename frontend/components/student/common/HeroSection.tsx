'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { StudentOrder, StudentStats } from '@/types/student';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { Bell, ShoppingBag, Sparkles, User as UserIcon, Award, Wallet, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  activeOrder: StudentOrder | null;
  stats: StudentStats | null;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  onOpenCart: () => void;
  itemCount: number;
  onExploreMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeOrder,
  stats,
  unreadNotificationCount,
  onOpenNotifications,
  onOpenCart,
  itemCount,
  onExploreMenu,
}) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const studentName = user?.displayName || user?.email?.split('@')[0] || 'Anshika Sharma';

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-[#054A36] via-emerald-900 to-[#032e22] text-white rounded-3xl flex flex-col justify-between gap-6 shadow-xl relative overflow-hidden">
      {/* Subtle Shimmer Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Top Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
            <UserIcon className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>CampusBite AI Canteen Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, {studentName}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-lg">
              Pre-order delicious meals with instant two-digit tokens and zero canteen queue waiting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Notification Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300"
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-900 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* View Basket Button */}
          <Button
            variant="secondary"
            onClick={onOpenCart}
            leftIcon={<ShoppingBag className="h-4 w-4 text-[#054A36]" />}
            className="bg-white text-[#054A36] font-extrabold shadow-md hover:bg-slate-50 py-3 rounded-2xl"
          >
            View Basket ({itemCount})
          </Button>
        </div>
      </div>

      {/* Hero Bottom Row: Active Token & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 relative z-10">
        {/* Active Token Card */}
        {activeOrder ? (
          <div className="p-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 font-extrabold flex flex-col items-center justify-center shrink-0 shadow-md">
              <span className="text-[8px] uppercase tracking-wider">TOKEN</span>
              <span className="text-lg">#{activeOrder.tokenNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200">Active Token</span>
              <h4 className="font-extrabold text-sm text-white line-clamp-1">{activeOrder.status}</h4>
              <p className="text-[10px] text-emerald-100/70">Position #{activeOrder.queuePosition || 1} in queue</p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200">No Active Order</span>
              <h4 className="font-extrabold text-sm text-white">Pre-order Now</h4>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={onExploreMenu}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              className="text-xs bg-emerald-400 text-slate-950 font-extrabold hover:bg-emerald-300"
            >
              Explore Menu
            </Button>
          </div>
        )}

        {/* Reward Points */}
        <div className="p-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-200">Reward Points</span>
            <h4 className="font-extrabold text-lg text-white">{stats?.rewardPoints || 340} PTS</h4>
            <p className="text-[10px] text-emerald-100/70">Redeem on next pre-order</p>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="p-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-400/20 text-emerald-300 shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-200">Canteen Wallet</span>
            <h4 className="font-extrabold text-lg text-white">{formatCurrency(stats?.walletBalanceInINR || 650)}</h4>
            <p className="text-[10px] text-emerald-100/70">Available Balance</p>
          </div>
        </div>
      </div>
    </div>
  );
};
