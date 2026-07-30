'use client';

import React, { useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import { MenuItem } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { Clock, Plus, Minus, Star, Heart, Flame, Sparkles } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number) => void;
  onToggleFavorite?: (itemId: string) => void;
}

const DEFAULT_FALLBACK_IMAGE = '/images/menu/default-food.jpg';

export const MenuItemCard: React.FC<MenuItemCardProps> = React.memo(({ item, onAddToCart, onToggleFavorite }) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <Card className="p-0 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group border-slate-200/80 hover:-translate-y-1 bg-white relative overflow-hidden rounded-2xl">
      {/* Image Banner Container */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
        <SafeImage
          src={item.imageUrl || DEFAULT_FALLBACK_IMAGE}
          fallbackSrc={DEFAULT_FALLBACK_IMAGE}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md shadow-md ${
              item.isVegetarian
                ? 'bg-emerald-600/90 text-white'
                : 'bg-red-600/90 text-white'
            }`}
          >
            {item.isVegetarian ? 'Veg 🟢' : 'Non-Veg 🔴'}
          </span>

          {item.isPopular && (
            <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-slate-950 bg-amber-400/90 backdrop-blur-md px-2 py-0.5 rounded-md shadow-md">
              <Flame className="h-3 w-3 fill-slate-950 text-slate-950" />
              Popular
            </span>
          )}

          {item.isNew && (
            <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-white bg-blue-600/90 backdrop-blur-md px-2 py-0.5 rounded-md shadow-md">
              <Sparkles className="h-3 w-3" />
              New
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={() => onToggleFavorite && onToggleFavorite(item.id)}
          className="absolute top-3 right-3 p-2 bg-white/85 hover:bg-white backdrop-blur-md text-slate-400 hover:text-red-500 rounded-full transition-all shadow-md focus:outline-none z-10"
          aria-label="Toggle favorite"
        >
          <Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#054A36] transition-colors leading-snug">
              {item.name}
            </h3>
            {item.rating && (
              <span className="flex items-center gap-0.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {item.rating}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>

          {/* Nutritional & Time Details */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold pt-1">
            <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-medium">
              {item.calories || '250 kcal'}
            </span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-medium">
              {item.protein || '8g protein'}
            </span>
          </div>
        </div>

        {/* Footer Pricing & Quantity Action */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              <Clock className="h-3 w-3" />
              <span>{item.preparationTimeMinutes} mins</span>
            </div>
            <span className="text-base font-extrabold text-slate-900">{formatCurrency(item.priceInINR)}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 text-slate-600 hover:bg-slate-200 rounded-md"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-xs font-extrabold px-1 text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 text-slate-600 hover:bg-slate-200 rounded-md"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddToCart(item, quantity)}
              leftIcon={<Plus className="h-4 w-4" />}
              disabled={!item.isAvailable}
              className="rounded-xl px-3 bg-[#054A36] hover:bg-emerald-800 font-extrabold shadow-sm"
            >
              {item.isAvailable ? 'Add' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});

MenuItemCard.displayName = 'MenuItemCard';
