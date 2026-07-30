'use client';

import React from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { Star, Plus, Flame } from 'lucide-react';

interface RecommendationCarouselProps {
  title: string;
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({ title, items, onAddToCart }) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500 fill-amber-400" />
          {title}
        </h3>
        <span className="text-xs font-semibold text-[#054A36] hover:underline cursor-pointer">View All</span>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth">
        {items.map((item) => (
          <Card
            key={item.id}
            className="w-64 shrink-0 p-0 border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden rounded-2xl bg-white flex flex-col justify-between"
          >
            {/* Image Header */}
            <div className="relative w-full h-36 bg-slate-100 overflow-hidden">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="256px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-emerald-800/10 flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}

              {/* Veg / Non-Veg Badge */}
              <span
                className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white shadow-sm ${
                  item.isVegetarian ? 'bg-emerald-600' : 'bg-red-600'
                }`}
              >
                {item.isVegetarian ? 'Veg 🟢' : 'Non-Veg 🔴'}
              </span>

              {item.rating && (
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-[10px] font-bold text-amber-700 flex items-center gap-1 shadow-sm">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {item.rating}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#054A36] transition-colors truncate">
                  {item.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">{item.calories || '250 kcal'}</span>
                  <span className="font-extrabold text-sm text-slate-900">{formatCurrency(item.priceInINR)}</span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAddToCart(item)}
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                  className="bg-[#054A36] text-xs font-bold px-2.5 rounded-xl"
                >
                  Add
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
