import React, { useState } from 'react';
import { Category } from '@/types/student';
import { Input } from '@/components/ui/Input';
import { Search, Filter, History, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FoodTypeFilter = 'all' | 'veg' | 'non_veg';
export type SortOption = 'default' | 'price_low' | 'price_high' | 'rating' | 'prep_time';

interface MenuFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  foodType: FoodTypeFilter;
  onFoodTypeChange: (type: FoodTypeFilter) => void;
  isFavoritesOnly: boolean;
  onFavoritesOnlyToggle: (favoritesOnly: boolean) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  quickFilter: string | null;
  onQuickFilterToggle: (filter: string) => void;
}

export const MenuFilters: React.FC<MenuFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  foodType,
  onFoodTypeChange,
  isFavoritesOnly,
  onFavoritesOnlyToggle,
  sortOption,
  onSortChange,
  quickFilter,
  onQuickFilterToggle,
}) => {
  const [recentSearches] = useState<string[]>(['Biryani', 'Cold Coffee', 'Sandwich', 'Brownie', 'Burger']);

  const quickFilters = [
    { id: 'popular', label: 'Popular ⭐' },
    { id: 'new', label: 'New 🆕' },
    { id: 'budget', label: 'Budget (<₹100) 💰' },
    { id: 'healthy', label: 'Healthy 🥗' },
    { id: 'quick', label: 'Quick (<10 min) ⚡' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search 35+ canteen meals, snacks, drinks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-slate-400" />}
            className="bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        {/* Veg / Non-Veg / All Radio Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={() => onFoodTypeChange('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all',
              foodType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onFoodTypeChange('veg')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1',
              foodType === 'veg' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'
            )}
          >
            <span>Veg 🟢</span>
          </button>
          <button
            type="button"
            onClick={() => onFoodTypeChange('non_veg')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1',
              foodType === 'non_veg' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-red-700'
            )}
          >
            <span>Non-Veg 🔴</span>
          </button>
        </div>

        {/* Sort & Favorites Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent font-bold text-slate-700 focus:outline-none"
            >
              <option value="default">Sort By: Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated ⭐</option>
              <option value="prep_time">Prep Time ⚡</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => onFavoritesOnlyToggle(!isFavoritesOnly)}
            className={cn(
              'px-3 py-2 rounded-xl border text-xs font-extrabold transition-all',
              isFavoritesOnly
                ? 'bg-red-50 text-red-700 border-red-300 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            )}
          >
            {isFavoritesOnly ? '❤️ Favorites' : '🤍 Favorites'}
          </button>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Quick Filters:</span>
        {quickFilters.map((qf) => {
          const isSelected = quickFilter === qf.id;
          return (
            <button
              key={qf.id}
              type="button"
              onClick={() => onQuickFilterToggle(qf.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0',
                isSelected
                  ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              )}
            >
              {qf.label}
            </button>
          );
        })}
      </div>

      {/* Search Suggestion Chips */}
      {!searchQuery && (
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-slate-100">
          <History className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-500">Recent Searches:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {recentSearches.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSearchChange(chip)}
                className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium hover:bg-slate-200 transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1" role="tablist" aria-label="Food Categories">
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
                'px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 border shrink-0',
                isSelected
                  ? 'bg-[#054A36] text-white border-[#054A36] shadow-sm scale-105'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
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
