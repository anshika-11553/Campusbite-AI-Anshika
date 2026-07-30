import React from 'react';
import { Category } from '@/types/student';
import { Input } from '@/components/ui/Input';
import { Search, Filter, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isVegOnly: boolean;
  onVegOnlyToggle: (vegOnly: boolean) => void;
}

export const MenuFilters: React.FC<MenuFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  isVegOnly,
  onVegOnlyToggle,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="bg-white"
          />
        </div>

        <button
          type="button"
          onClick={() => onVegOnlyToggle(!isVegOnly)}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 w-full sm:w-auto justify-center',
            isVegOnly
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          )}
        >
          <Leaf className={cn('h-4 w-4', isVegOnly ? 'text-emerald-600' : 'text-slate-400')} />
          <span>Veg Only</span>
        </button>
      </div>

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
