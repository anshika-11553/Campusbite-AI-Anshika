'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { studentApiService } from '@/services/api/v1/student';
import { MenuItem } from '@/types/student';
import { useCart } from '@/hooks/useCart';
import { MenuGrid } from '@/components/student/menu/MenuGrid';
import { MenuSkeleton } from '@/components/student/skeletons/MenuSkeleton';
import { Heart } from 'lucide-react';

export default function StudentFavoritesPage() {
  const { addItem } = useCart();
  const [favoriteItems, setFavoriteItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await studentApiService.getMenu();
        if (res.success) {
          setFavoriteItems(res.data.filter((i) => i.isFavorite));
        }
      } catch {
        // Fallback handled
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardLayout role="student" title="Favorite Items">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
              Your Favorite Food Items
            </h2>
            <p className="text-xs text-slate-500">Quickly reorder items you love with one tap</p>
          </div>
          <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-extrabold rounded-full border border-red-200">
            {favoriteItems.length} Favorite Dishes
          </span>
        </div>

        {isLoading ? (
          <MenuSkeleton />
        ) : (
          <MenuGrid
            items={favoriteItems}
            onAddToCart={addItem}
            onToggleFavorite={(id) => setFavoriteItems((prev) => prev.filter((i) => i.id !== id))}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
