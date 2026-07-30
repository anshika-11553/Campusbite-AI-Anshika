import React, { useState } from 'react';
import { Category } from '@/types/student';
import { Input } from '@/components/ui/Input';
import { Search, Filter, Leaf, Heart, History } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isVegOnly: boolean;
  onVegOnlyToggle: (vegOnly: boolean) => void;
  isFavoritesOnly: boolean;
  onFavoritesOnlyToggle: (favoritesOnly: boolean) => void;
}

export const MenuFilters: React.FC<MenuFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  isVegOnly,
  onVegOnlyToggle,
  isFavoritesOnly,
  onFavoritesOnlyToggle,
}) => {
  const [recentSearches] = useState<string[]>(['Paneer', 'Cold Coffee', 'Sandwich', 'Brownie']);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search food, combos, snacks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Veg Only Toggle */}
          <button
            type="button"
            onClick={() => onVegOnlyToggle(!isVegOnly)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 justify-center',
              isVegOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            )}
          >
            <Leaf className={cn('h-4 w-4', isVegOnly ? 'text-emerald-600' : 'text-slate-400')} />
            <span>Veg Only</span>
          </button>

          {/* Favorites Only Toggle */}
          <button
            type="button"
            onClick={() => onFavoritesOnlyToggle(!isFavoritesOnly)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 justify-center',
              isFavoritesOnly
                ? 'bg-red-50 text-red-700 border-red-300 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            )}
          >
            <Heart className={cn('h-4 w-4', isFavoritesOnly ? 'fill-red-500 text-red-500' : 'text-slate-400')} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Quick Search Suggestion Chips */}
      {!searchQuery && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <History className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-500">Popular Searches:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {recentSearches.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSearchChange(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium hover:bg-slate-200 transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Food Categories">
        <Filter className="h-4 w-4 text-slate-400 shrink-0 ml-1 mr-1" />
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#054A36]',
                isSelected
                  ? 'bg-[#054A36] text-white border-[#054A36] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
