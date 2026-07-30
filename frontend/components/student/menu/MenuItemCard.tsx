import React from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { Clock, Plus, Star, Leaf, Heart, Flame } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onToggleFavorite?: (itemId: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = React.memo(({ item, onAddToCart, onToggleFavorite }) => {
  return (
    <Card className="p-0 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group border-slate-200/80 hover:-translate-y-1 bg-white relative overflow-hidden rounded-2xl">
      {/* Food Image Banner */}
      {item.imageUrl && (
        <div className="relative w-full h-44 overflow-hidden bg-slate-100">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span
              className={`p-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md shadow-sm ${
                item.isVegetarian
                  ? 'bg-emerald-600/90 text-white'
                  : 'bg-red-600/90 text-white'
              }`}
            >
              <Leaf className="h-3 w-3" />
              {item.isVegetarian ? 'Veg' : 'Non-Veg'}
            </span>

            {item.isTrending && (
              <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-amber-900 bg-amber-400/90 backdrop-blur-md px-1.5 py-0.5 rounded-md shadow-sm">
                <Flame className="h-3 w-3 fill-amber-900 text-amber-900" />
                Trending
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={() => onToggleFavorite && onToggleFavorite(item.id)}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white backdrop-blur-md text-slate-400 hover:text-red-500 rounded-full transition-all shadow-md focus:outline-none"
            aria-label="Toggle favorite"
          >
            <Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      )}

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#054A36] transition-colors leading-snug">
              {item.name}
            </h3>
            {item.rating && (
              <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 shrink-0">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {item.rating}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap pt-1">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Pricing & Action */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              <Clock className="h-3 w-3" />
              <span>{item.preparationTimeMinutes} mins</span>
            </div>
            <span className="text-base font-extrabold text-slate-900">{formatCurrency(item.priceInINR)}</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToCart(item)}
            leftIcon={<Plus className="h-4 w-4" />}
            disabled={!item.isAvailable}
            className="rounded-xl px-3 bg-[#054A36] hover:bg-emerald-800 font-bold"
          >
            {item.isAvailable ? 'Add' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </Card>
  );
});

MenuItemCard.displayName = 'MenuItemCard';
