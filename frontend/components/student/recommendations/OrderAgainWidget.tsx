'use client';

import React, { useState } from 'react';
import { getFoodImageByName } from '@/lib/FoodImageMap';
import { StudentOrder } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { Clock, RefreshCw, PartyPopper, CheckCircle2 } from 'lucide-react';

interface OrderAgainWidgetProps {
  lastOrder?: StudentOrder;
}

export const OrderAgainWidget: React.FC<OrderAgainWidgetProps> = ({ lastOrder }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [isReminderDismissed, setIsReminderDismissed] = useState(false);

  const handleReorderLastOrder = () => {
    if (!lastOrder) return;
    lastOrder.items.forEach((orderItem) => {
      addItem({
        id: orderItem.itemId,
        name: orderItem.itemName,
        description: 'Reordered item from previous meal',
        priceInINR: orderItem.priceInINR,
        category: 'main_course',
        imageUrl: getFoodImageByName(orderItem.itemName),
        isAvailable: true,
        preparationTimeMinutes: 10,
        isPopular: true,
        isVegetarian: true,
        rating: 4.9,
      });
    });
    showToast(`Reordered ${lastOrder.items.length} items from Order #${lastOrder.orderNumber}!`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* ⏰ Order Again Reminder Banner */}
      {!isReminderDismissed && (
        <Card className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-amber-300 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-2xl shrink-0 shadow-md">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                ⏰ Time for Lunch?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You usually place your afternoon canteen order around 1:00 PM. Would you like to order your usual meal?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReminderDismissed(true)}
              className="text-xs border-slate-300 dark:border-slate-700"
            >
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleReorderLastOrder}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs"
            >
              Order Again
            </Button>
          </div>
        </Card>
      )}

      {/* 🔄 Reorder Last Order Card & 🎉 Active Festival Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reorder Last Order Card */}
        {lastOrder && (
          <Card className="p-4 border-emerald-200 dark:border-emerald-950 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-[#054A36] dark:text-emerald-400" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">🔄 Reorder Last Order</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Order #{lastOrder.orderNumber}</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                {lastOrder.items.map((i) => `${i.itemName} (x${i.quantity})`).join(', ')}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Date: {new Date(lastOrder.createdAt).toLocaleDateString()}</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(lastOrder.totalAmountInINR)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleReorderLastOrder}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              className="bg-[#054A36] hover:bg-emerald-800 text-white font-extrabold text-xs w-full"
            >
              Add Entire Last Order to Cart
            </Button>
          </Card>
        )}

        {/* 🎉 Active Campus Festival Banner */}
        <Card className="p-4 bg-gradient-to-br from-purple-700 via-purple-800 to-slate-900 text-white flex flex-col justify-between space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 uppercase tracking-wider">
              <PartyPopper className="h-3 w-3" /> Campus Food Festival
            </span>
            <span className="text-[10px] text-purple-200 font-semibold">Special Offer Active</span>
          </div>

          <div>
            <h4 className="font-black text-base text-amber-300">Monsoon Combo Craze 🎉</h4>
            <p className="text-xs text-purple-100 leading-relaxed">
              Get a complimentary Brownie Sundae with any Cheese Garlic Bread Toast combo order today!
            </p>
          </div>

          <div className="text-[10px] text-purple-200 flex items-center gap-1 font-bold">
            <span>✨ Auto-applied at checkout for all active students</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
