import React from 'react';
import { StudentStats } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/constants/currency';
import { ShoppingCart, Calendar, PiggyBank, Clock, Award, Wallet, Utensils, Store } from 'lucide-react';

interface StatsOverviewProps {
  stats: StudentStats | null;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    {
      label: 'Active Orders',
      value: stats.activeOrders,
      subtext: 'In kitchen queue',
      icon: <ShoppingCart className="h-5 w-5 text-[#054A36]" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders || 18,
      subtext: 'Lifetime orders',
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Money Saved',
      value: formatCurrency(stats.moneySavedInINR),
      subtext: 'Via campus combos',
      icon: <PiggyBank className="h-5 w-5 text-amber-600" />,
      bg: 'bg-amber-50',
    },
    {
      label: 'Wait Time Saved',
      value: `${stats.waitTimeSavedMinutes} mins`,
      subtext: 'Queue time avoided',
      icon: <Clock className="h-5 w-5 text-purple-600" />,
      bg: 'bg-purple-50',
    },
    {
      label: 'Reward Points',
      value: `${stats.rewardPoints} PTS`,
      subtext: 'Redeem on next order',
      icon: <Award className="h-5 w-5 text-amber-600" />,
      bg: 'bg-amber-50',
    },
    {
      label: 'Canteen Wallet',
      value: formatCurrency(stats.walletBalanceInINR),
      subtext: 'Available balance',
      icon: <Wallet className="h-5 w-5 text-emerald-700" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Top Category',
      value: stats.favoriteCategory || 'Main Course',
      subtext: 'Most ordered',
      icon: <Utensils className="h-5 w-5 text-orange-600" />,
      bg: 'bg-orange-50',
    },
    {
      label: 'Favorite Food Court',
      value: stats.favoriteVendor || 'Main Canteen',
      subtext: 'Preferred outlet',
      icon: <Store className="h-5 w-5 text-teal-600" />,
      bg: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {statItems.map((item, idx) => (
        <Card
          key={idx}
          className="p-3 flex flex-col justify-between border-slate-200/80 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white"
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[10px] font-semibold text-slate-500 line-clamp-1">{item.label}</span>
            <div className={`p-1 rounded-lg ${item.bg} shrink-0`}>{item.icon}</div>
          </div>
          <div>
            <span className="text-base font-extrabold text-slate-900 tracking-tight line-clamp-1">{item.value}</span>
            <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">{item.subtext}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
