'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Bell, ShoppingBag, Sparkles, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WelcomeHeaderProps {
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  onOpenCart: () => void;
  itemCount: number;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  unreadNotificationCount,
  onOpenNotifications,
  onOpenCart,
  itemCount,
}) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const studentName = user?.displayName || user?.email?.split('@')[0] || 'Student';

  return (
    <div className="p-5 sm:p-6 bg-[#054A36] text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-emerald-950/10 relative overflow-hidden">
      {/* Background Subtle Shimmer Glow */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
          <UserIcon className="h-6 w-6" />
        </div>

        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>CampusBite Smart Canteen</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {getGreeting()}, {studentName}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            What would you like to pre-order for your next campus break?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end relative z-10">
        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-900 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* View Cart Button */}
        <Button
          variant="secondary"
          onClick={onOpenCart}
          leftIcon={<ShoppingBag className="h-4 w-4 text-[#054A36]" />}
          className="bg-white text-[#054A36] font-bold shadow-md hover:bg-slate-50"
        >
          View Basket ({itemCount})
        </Button>
      </div>
    </div>
  );
};
