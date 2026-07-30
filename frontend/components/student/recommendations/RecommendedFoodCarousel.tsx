'use client';

import React from 'react';
import Image from 'next/image';
import { RecommendedFoodItem } from '@/services/recommendations/recommendationEngine';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { Plus, Star, Sparkles, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface RecommendedFoodCarouselProps {
  title: string;
  subtitle?: string;
  items: RecommendedFoodItem[];
  isLoading?: boolean;
}

export const RecommendedFoodCarousel: React.FC<RecommendedFoodCarouselProps> = ({
  title,
  subtitle,
  items,
  isLoading = false,
}) => {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (recommended: RecommendedFoodItem) => {
    addItem(recommended.item);
    showToast(`Added ${recommended.item.name} to cart!`, 'success');
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="w-64 h-72 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500 fill-amber-400" />
            {title}
          </h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
      >
        {items.map((recItem) => {
          const food = recItem.item;
          return (
            <Card
              key={food.id}
              className="w-64 sm:w-72 shrink-0 snap-start p-4 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              {/* Image & Recommendation Badge */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}
                  alt={food.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badge Overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                    <span>{recItem.badgeIcon}</span>
                    <span>{recItem.badge}</span>
                  </span>
                </div>

                {/* Veg / Non-Veg Badge */}
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border shadow-sm ${
                    food.isVegetarian
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'bg-red-50 border-red-500 text-red-700'
                  }`}
                >
                  {food.isVegetarian ? 'VEG' : 'NON-VEG'}
                </span>
              </div>

              {/* Title, Rating & Description */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#054A36] dark:group-hover:text-emerald-400 transition-colors">
                    {food.name}
                  </h4>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md shrink-0">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {food.rating || 4.8}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-1">{food.description}</p>

                {/* Reason Tag */}
                <div className="pt-1 flex items-center gap-1 text-[10px] text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                  <Info className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{recItem.reason}</span>
                </div>
              </div>

              {/* Footer Price & Add CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Price</span>
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    {formatCurrency(food.priceInINR)}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddToCart(recItem)}
                  leftIcon={<Plus className="h-4 w-4" />}
                  className="bg-[#054A36] hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl py-2 px-3 shadow"
                >
                  Add
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
