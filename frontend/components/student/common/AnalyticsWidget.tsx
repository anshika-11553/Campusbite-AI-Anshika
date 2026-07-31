import React from 'react';
import { StudentAnalytics } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/constants/currency';
import { PieChart, TrendingUp, Store, BarChart2 } from 'lucide-react';

interface AnalyticsWidgetProps {
  analytics: StudentAnalytics | null;
}

export const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ analytics }) => {
  if (!analytics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Monthly Spending Breakdown */}
      <Card className="p-4 sm:p-5 border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-[#054A36]" />
            <h4 className="font-bold text-sm text-slate-900">Monthly Spending</h4>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400">By Category</span>
        </div>

        <div className="space-y-2.5">
          {analytics.monthlySpending.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">{item.categoryName}</span>
                <span className="font-bold text-slate-900">{formatCurrency(item.amountInINR)}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#054A36] rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Most Ordered & Favorite Vendor */}
      <Card className="p-4 sm:p-5 border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <h4 className="font-bold text-sm text-slate-900">Campus Insights</h4>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800">Top Food Category</span>
              <h5 className="font-extrabold text-sm text-slate-900 mt-0.5">{analytics.mostOrderedCategory}</h5>
            </div>
            <BarChart2 className="h-5 w-5 text-emerald-700" />
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-800">Favorite Food Outlet</span>
              <h5 className="font-extrabold text-sm text-slate-900 mt-0.5">{analytics.favoriteVendor}</h5>
            </div>
            <Store className="h-5 w-5 text-amber-700" />
          </div>
        </div>
      </Card>

      {/* Weekly Pre-Order Activity */}
      <Card className="p-4 sm:p-5 border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-blue-600" />
            <h4 className="font-bold text-sm text-slate-900">Weekly Pre-Orders</h4>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Activity</span>
        </div>

        <div className="flex items-end justify-between gap-2 pt-4 h-24">
          {analytics.weeklyActivity.map((w, idx) => {
            const heightPercent = Math.min((w.ordersCount / 5) * 100, 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-full bg-slate-100 h-16 rounded-lg flex items-end overflow-hidden">
                  <div
                    className="w-full bg-[#054A36] rounded-t-lg transition-all duration-500 hover:bg-emerald-600"
                    style={{ height: `${Math.max(heightPercent, 15)}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-500">{w.day}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
