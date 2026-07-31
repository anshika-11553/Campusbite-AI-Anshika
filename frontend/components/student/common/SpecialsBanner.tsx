import React from 'react';
import { MenuItem } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { Flame, Plus } from 'lucide-react';

interface SpecialsBannerProps {
  specialItem: MenuItem | null;
  onAddToCart: (item: MenuItem) => void;
}

export const SpecialsBanner: React.FC<SpecialsBannerProps> = ({ specialItem, onAddToCart }) => {
  if (!specialItem) return null;

  return (
    <Card className="p-5 bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-800 text-white rounded-2xl shadow-lg border-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div className="space-y-1.5 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <Flame className="h-3.5 w-3.5 fill-amber-200 text-amber-200" />
          <span>Today&apos;s Chef Special</span>
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">{specialItem.name}</h3>
        <p className="text-xs sm:text-sm text-amber-100/90 line-clamp-1 max-w-lg">
          {specialItem.description}
        </p>
      </div>

      <div className="flex items-center gap-4 relative z-10 shrink-0">
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-amber-200 uppercase tracking-wider font-semibold">Special Price</span>
          <span className="text-xl font-extrabold">{formatCurrency(specialItem.priceInINR)}</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAddToCart(specialItem)}
          leftIcon={<Plus className="h-4 w-4 text-slate-900" />}
          className="bg-white text-slate-900 font-bold hover:bg-amber-50 shadow-md"
        >
          Add Special
        </Button>
      </div>
    </Card>
  );
};
