'use client';

import React from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types/student';
import { recommendationService } from '@/services/recommendations/recommendationService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { Plus, UtensilsCrossed, Star } from 'lucide-react';

interface CompleteYourMealProps {
  allItems: MenuItem[];
}

export const CompleteYourMealWidget: React.FC<CompleteYourMealProps> = ({ allItems }) => {
  const { items: cartItems, addItem } = useCart();
  const { showToast } = useToast();

  if (cartItems.length === 0) return null;

  const rawCartMenuItems: MenuItem[] = cartItems.map((ci) => ci.menuItem);
  const complementaryRecommendations = recommendationService.getCompleteYourMeal(rawCartMenuItems, allItems);

  if (complementaryRecommendations.length === 0) return null;

  const defaultImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';

  return (
    <Card className="p-4 bg-slate-900 text-white space-y-3 rounded-2xl border-slate-800 shadow-xl">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-sm flex items-center gap-2 text-emerald-400">
          <UtensilsCrossed className="h-4 w-4" />
          🍽 Complete Your Meal (Frequently Bought Together)
        </h4>
        <span className="text-[10px] text-slate-400 font-semibold">AI Pairings</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {complementaryRecommendations.map((rec) => {
          const item = rec.item;
          return (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-2 hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-700">
                  <Image src={item.imageUrl || defaultImg} alt={item.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-extrabold text-xs text-white truncate">{item.name}</h5>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="font-bold text-emerald-400">{formatCurrency(item.priceInINR)}</span>
                    <span className="text-slate-400 flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      {item.rating || 4.8}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  addItem(item);
                  showToast(`Added ${item.name} to complete your meal!`, 'success');
                }}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] py-1 px-2.5 shrink-0 rounded-lg"
              >
                Add
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
