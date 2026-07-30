import React from 'react';
import { MenuItem } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { Clock, Plus, Star, Leaf } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = React.memo(({ item, onAddToCart }) => {
  return (
    <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 group border-slate-200/80">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`p-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                item.isVegetarian
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <Leaf className="h-3 w-3" />
              {item.isVegetarian ? 'Veg' : 'Non-Veg'}
            </span>
            {item.rating && (
              <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {item.rating}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>{item.preparationTimeMinutes} mins</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-[#054A36] transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Price</span>
          <span className="text-base font-extrabold text-slate-900">{formatCurrency(item.priceInINR)}</span>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAddToCart(item)}
          leftIcon={<Plus className="h-4 w-4" />}
          disabled={!item.isAvailable}
          className="rounded-xl px-3"
        >
          {item.isAvailable ? 'Add' : 'Out of Stock'}
        </Button>
      </div>
    </Card>
  );
});

MenuItemCard.displayName = 'MenuItemCard';
