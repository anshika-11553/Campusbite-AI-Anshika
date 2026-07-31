'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { studentApiService } from '@/services/api/v1/student';
import {
  MenuItem,
  Category,
  StudentStats,
  CanteenNotification,
  StudentAnalytics,
} from '@/types/student';
import { useCart } from '@/hooks/useCart';
import { useDebounce } from '@/hooks/useDebounce';
import { featureFlags } from '@/config/features';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';

import { HeroSection } from '@/components/student/common/HeroSection';
import { StatsOverview } from '@/components/student/common/StatsOverview';
import { SpecialsBanner } from '@/components/student/common/SpecialsBanner';
import { RecommendationCarousel } from '@/components/student/common/RecommendationCarousel';
import { NotificationsDrawer } from '@/components/student/common/NotificationsDrawer';
import { AnalyticsWidget } from '@/components/student/common/AnalyticsWidget';
import { StudentProfileModal } from '@/components/student/profile/StudentProfileModal';

import { MenuFilters, FoodTypeFilter, SortOption } from '@/components/student/menu/MenuFilters';
import { MenuGrid } from '@/components/student/menu/MenuGrid';
import { TokenCard } from '@/components/student/tracker/TokenCard';
import { OrderHistoryList } from '@/components/student/orders/OrderHistoryList';
import { CartDrawer } from '@/components/student/cart/CartDrawer';
import { EmptyState } from '@/components/student/common/EmptyState';

import { MenuSkeleton } from '@/components/student/skeletons/MenuSkeleton';
import { OrderHistorySkeleton } from '@/components/student/skeletons/OrderHistorySkeleton';
import { ApiErrorDisplay } from '@/components/student/common/ApiErrorDisplay';
import { useToast } from '@/hooks/useToast';

import { Utensils, History, Clock, PieChart, Sparkles } from 'lucide-react';
import { analytics } from '@/services/analytics';

// Lazy Load Checkout Modal
const CheckoutModal = dynamic(
  () => import('@/components/student/cart/CheckoutModal').then((mod) => mod.CheckoutModal),
  { ssr: false }
);

export type DashboardTab = 'menu' | 'queue' | 'orders' | 'analytics';

export default function StudentDashboardPage() {
  const { addItem, itemCount, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const { orders, placeOrder, updateOrderStatus, getActiveStudentOrder } = useOrderWorkflow();

  const [activeTab, setActiveTab] = useState<DashboardTab>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [notifications, setNotifications] = useState<CanteenNotification[]>([]);
  const [analyticsData, setAnalyticsData] = useState<StudentAnalytics | null>(null);

  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Advanced Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [foodType, setFoodType] = useState<FoodTypeFilter>('all');
  const [isFavoritesOnly, setIsFavoritesOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutSlot, setCheckoutSlot] = useState<string>('Instant Pickup (10-15 mins)');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const activeOrder = getActiveStudentOrder();

  const loadDashboardData = useCallback(async () => {
    setIsLoadingMenu(true);
    setIsLoadingHistory(true);
    setApiError(null);

    try {
      const [menuRes, catRes, statsRes, notifRes, analyticsRes] = await Promise.all([
        studentApiService.getMenu(),
        studentApiService.getCategories(),
        studentApiService.getStudentStats(),
        studentApiService.getNotifications(),
        studentApiService.getStudentAnalytics(),
      ]);

      if (menuRes.success) setMenuItems(menuRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (statsRes.success) setStats(statsRes.data);
      if (notifRes.success) setNotifications(notifRes.data);
      if (analyticsRes.success) setAnalyticsData(analyticsRes.data);
    } catch {
      setApiError('Failed to synchronize canteen data. Please check network.');
    } finally {
      setIsLoadingMenu(false);
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        await loadDashboardData();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [loadDashboardData]);

  // Special Item & Carousels
  const specialItem = useMemo(() => {
    return menuItems.find((i) => i.isSpecial) || menuItems[0] || null;
  }, [menuItems]);

  const recommendedItems = useMemo(() => {
    return menuItems.filter((i) => i.rating! >= 4.8 || i.isPopular);
  }, [menuItems]);

  const trendingItems = useMemo(() => {
    return menuItems.filter((i) => i.isTrending);
  }, [menuItems]);

  const bestSellers = useMemo(() => {
    return menuItems.filter((i) => i.isPopular);
  }, [menuItems]);

  const chefsChoice = useMemo(() => {
    return menuItems.filter((i) => i.isSpecial);
  }, [menuItems]);

  const campusSpecials = useMemo(() => {
    return menuItems.filter((i) => i.isHealthy || i.isQuick);
  }, [menuItems]);

  // Multi-Criteria Filtered & Sorted Menu Items
  const filteredMenuItems = useMemo(() => {
    const result = menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !debouncedSearchQuery ||
        item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesFoodType =
        foodType === 'all'
          ? true
          : foodType === 'veg'
          ? item.isVegetarian
          : !item.isVegetarian;

      const matchesFavorite = !isFavoritesOnly || item.isFavorite;

      // Quick Filters
      let matchesQuick = true;
      if (quickFilter === 'popular') matchesQuick = !!item.isPopular;
      if (quickFilter === 'new') matchesQuick = !!item.isNew;
      if (quickFilter === 'budget') matchesQuick = item.priceInINR <= 100;
      if (quickFilter === 'healthy') matchesQuick = !!item.isHealthy;
      if (quickFilter === 'quick') matchesQuick = item.preparationTimeMinutes <= 10;

      return matchesCategory && matchesSearch && matchesFoodType && matchesFavorite && matchesQuick;
    });

    // Sorting
    if (sortOption === 'price_low') {
      result.sort((a, b) => a.priceInINR - b.priceInINR);
    } else if (sortOption === 'price_high') {
      result.sort((a, b) => b.priceInINR - a.priceInINR);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === 'prep_time') {
      result.sort((a, b) => a.preparationTimeMinutes - b.preparationTimeMinutes);
    }

    return result;
  }, [menuItems, selectedCategory, debouncedSearchQuery, foodType, isFavoritesOnly, quickFilter, sortOption]);

  const handleToggleFavorite = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextState = !item.isFavorite;
          showToast(
            nextState ? `${item.name} added to favorites ❤️` : `${item.name} removed from favorites`,
            'info'
          );
          return { ...item, isFavorite: nextState };
        }
        return item;
      })
    );
    studentApiService.toggleFavoriteItem(itemId);
  };

  const handleQuickFilterToggle = (filterId: string) => {
    setQuickFilter((prev) => (prev === filterId ? null : filterId));
  };

  const handleProceedToCheckout = (slot: string) => {
    setCheckoutSlot(slot);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setActiveTab('queue');
  };

  const handleReorder = async (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      placeOrder({
        studentId: target.studentId,
        studentName: target.studentName || 'Anshika Sharma',
        vendorName: target.vendorName,
        items: target.items,
        totalAmountInINR: target.totalAmountInINR,
        pickupSlot: target.pickupSlot,
        paymentMethod: target.paymentMethod,
        estimatedPreparationTimeMinutes: 10,
      });
      setActiveTab('queue');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.', 'success');
  };

  return (
    <DashboardLayout role="student" title="Campus Canteen Portal">
      <div className="flex flex-col gap-6">
        {/* Premium Hero Section */}
        <HeroSection
          activeOrder={activeOrder}
          stats={stats}
          unreadNotificationCount={unreadCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          itemCount={itemCount}
          onExploreMenu={() => setActiveTab('menu')}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Enhanced 8-Metric Statistics Grid */}
        <StatsOverview stats={stats} />

        {/* Today's Special Banner */}
        <SpecialsBanner specialItem={specialItem} onAddToCart={addItem} />

        {/* Horizontal Recommendation Carousels */}
        <RecommendationCarousel title="Recommended For You" items={recommendedItems} onAddToCart={addItem} />
        <RecommendationCarousel title="Trending Today" items={trendingItems} onAddToCart={addItem} />
        <RecommendationCarousel title="Best Sellers ⭐" items={bestSellers} onAddToCart={addItem} />
        <RecommendationCarousel title="Chef's Choice 👨‍🍳" items={chefsChoice} onAddToCart={addItem} />
        <RecommendationCarousel title="Campus Quick Specials ⚡" items={campusSpecials} onAddToCart={addItem} />

        {/* API Error Display */}
        {apiError && <ApiErrorDisplay message={apiError} onRetry={loadDashboardData} />}

        {/* Navigation Tabs */}
        <div
          className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none"
          role="tablist"
          aria-label="Student Portal Navigation"
        >
          {/* Tab 1: Menu Explorer */}
          <button
            role="tab"
            aria-selected={activeTab === 'menu'}
            onClick={() => {
              setActiveTab('menu');
              analytics.trackCategoryFilter('menu-tab');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 shrink-0 ${
              activeTab === 'menu'
                ? 'bg-[#054A36] text-white shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Utensils className="h-4 w-4" />
            <span>35+ Food Catalogue</span>
          </button>

          {/* Tab 2: Live Token Tracker */}
          {featureFlags.enableQueueTracking && (
            <button
              role="tab"
              aria-selected={activeTab === 'queue'}
              onClick={() => {
                setActiveTab('queue');
                analytics.trackCategoryFilter('queue-tab');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 shrink-0 relative ${
                activeTab === 'queue'
                  ? 'bg-[#054A36] text-white shadow-sm scale-[1.02]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Live Token Tracker</span>
              {activeOrder && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping absolute top-2 right-2" />
              )}
            </button>
          )}

          {/* Tab 3: Order History */}
          {featureFlags.enableOrderHistory && (
            <button
              role="tab"
              aria-selected={activeTab === 'orders'}
              onClick={() => {
                setActiveTab('orders');
                analytics.trackCategoryFilter('orders-tab');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-[#054A36] text-white shadow-sm scale-[1.02]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Order History</span>
            </button>
          )}

          {/* Tab 4: Spending Analytics */}
          <button
            role="tab"
            aria-selected={activeTab === 'analytics'}
            onClick={() => {
              setActiveTab('analytics');
              analytics.trackCategoryFilter('analytics-tab');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-[#054A36] text-white shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PieChart className="h-4 w-4" />
            <span>Spending Analytics</span>
          </button>
        </div>

        {/* Tab 1: 35+ Food Catalogue & Advanced Filters */}
        {activeTab === 'menu' && (
          <div className="space-y-5 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
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
              onQuickFilterToggle={handleQuickFilterToggle}
            />

            {isLoadingMenu ? (
              <MenuSkeleton />
            ) : (
              <MenuGrid
                items={filteredMenuItems}
                onAddToCart={addItem}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </div>
        )}

        {/* Tab 2: Live Token Tracker */}
        {activeTab === 'queue' && featureFlags.enableQueueTracking && (
          <div className="space-y-5 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
            {activeOrder ? (
              <TokenCard
                order={activeOrder}
                onConfirmCollection={(id) => updateOrderStatus(id, 'COLLECTED')}
              />
            ) : (
              <EmptyState
                icon={<Clock className="h-8 w-8 text-slate-400" />}
                title="No Active Queue Tokens"
                description="You currently have no active canteen pre-orders in preparation."
                actionLabel="Browse 35+ Food Catalogue"
                onAction={() => setActiveTab('menu')}
              />
            )}
          </div>
        )}

        {/* Tab 3: Order History */}
        {activeTab === 'orders' && featureFlags.enableOrderHistory && (
          <div className="space-y-4 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
            <h3 className="text-base font-bold text-slate-900">Your Past Pre-Orders</h3>
            {isLoadingHistory ? (
              <OrderHistorySkeleton />
            ) : (
              <OrderHistoryList orders={orders} onReorder={handleReorder} />
            )}
          </div>
        )}

        {/* Tab 4: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-4 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#054A36]" />
              <h3 className="text-base font-bold text-slate-900">Your Campus Canteen Analytics</h3>
            </div>
            <AnalyticsWidget analytics={analyticsData} />
          </div>
        )}
      </div>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={handleProceedToCheckout} />

      {/* Checkout Modal */}
      {featureFlags.enableCheckout && isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedSlot={checkoutSlot}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        stats={stats}
      />
    </DashboardLayout>
  );
}
