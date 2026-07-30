import React from 'react';
import { MenuItem } from '@/types/student';
import { MenuItemCard } from './MenuItemCard';
import { EmptyState } from '../common/EmptyState';
import { UtensilsCrossed } from 'lucide-react';

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onToggleFavorite?: (itemId: string) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items, onAddToCart, onToggleFavorite }) => {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<UtensilsCrossed className="h-8 w-8 text-slate-400" />}
        title="No Food Items Found"
        description="Try adjusting your search criteria or category filters to discover canteen meals."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
