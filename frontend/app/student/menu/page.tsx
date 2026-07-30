'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { studentApiService } from '@/services/api/v1/student';
import { MenuItem, Category } from '@/types/student';
import { useCart } from '@/hooks/useCart';
import { MenuFilters, FoodTypeFilter, SortOption } from '@/components/student/menu/MenuFilters';
import { MenuGrid } from '@/components/student/menu/MenuGrid';
import { MenuSkeleton } from '@/components/student/skeletons/MenuSkeleton';
import { ApiErrorDisplay } from '@/components/student/common/ApiErrorDisplay';
import { UtensilsCrossed, Sparkles } from 'lucide-react';

export default function StudentMenuPage() {
  const { addItem } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [foodType, setFoodType] = useState<FoodTypeFilter>('all');
  const [isFavoritesOnly, setIsFavoritesOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [menuRes, catRes] = await Promise.all([
          studentApiService.getMenu(),
          studentApiService.getCategories(),
        ]);
        if (isMounted) {
          if (menuRes.success) setMenuItems(menuRes.data);
          if (catRes.success) setCategories(catRes.data);
        }
      } catch {
        if (isMounted) setApiError('Failed to load menu catalogue. Please retry.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const result = menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFoodType =
        foodType === 'all'
          ? true
          : foodType === 'veg'
          ? item.isVegetarian
          : !item.isVegetarian;

      const matchesFavorite = !isFavoritesOnly || item.isFavorite;

      let matchesQuick = true;
      if (quickFilter === 'popular') matchesQuick = !!item.isPopular;
      if (quickFilter === 'new') matchesQuick = !!item.isNew;
      if (quickFilter === 'budget') matchesQuick = item.priceInINR <= 100;
      if (quickFilter === 'healthy') matchesQuick = !!item.isHealthy;
      if (quickFilter === 'quick') matchesQuick = item.preparationTimeMinutes <= 10;

      return matchesCategory && matchesSearch && matchesFoodType && matchesFavorite && matchesQuick;
    });

    if (sortOption === 'price_low') result.sort((a, b) => a.priceInINR - b.priceInINR);
    if (sortOption === 'price_high') result.sort((a, b) => b.priceInINR - a.priceInINR);
    if (sortOption === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortOption === 'prep_time') result.sort((a, b) => a.preparationTimeMinutes - b.preparationTimeMinutes);

    return result;
  }, [menuItems, selectedCategory, searchQuery, foodType, isFavoritesOnly, quickFilter, sortOption]);

  return (
    <DashboardLayout role="student" title="35+ Food Catalogue Explorer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-[#054A36]" />
              Campus Food Menu Explorer
            </h2>
            <p className="text-xs text-slate-500">Browse 35+ fresh canteen offerings with instant pre-ordering</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-[#054A36] text-xs font-extrabold rounded-full border border-emerald-300 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            35+ Fresh Items
          </span>
        </div>

        <MenuFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          foodType={foodType}
          onFoodTypeChange={setFoodType}
          isFavoritesOnly={isFavoritesOnly}
          onFavoritesOnlyToggle={setIsFavoritesOnly}
          sortOption={sortOption}
          onSortChange={setSortOption}
          quickFilter={quickFilter}
          onQuickFilterToggle={(fId) => setQuickFilter((prev) => (prev === fId ? null : fId))}
        />

        {apiError && <ApiErrorDisplay message={apiError} onRetry={() => window.location.reload()} />}

        {isLoading ? (
          <MenuSkeleton />
        ) : (
          <MenuGrid
            items={filteredItems}
            onAddToCart={addItem}
            onToggleFavorite={(itemId) => {
              setMenuItems((prev) =>
                prev.map((i) => (i.id === itemId ? { ...i, isFavorite: !i.isFavorite } : i))
              );
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
