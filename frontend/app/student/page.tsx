'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { studentApiService } from '@/services/api/v1/student';
import {
  MenuItem,
  Category,
  StudentOrder,
  QueueStatus,
  StudentStats,
  CanteenNotification,
  StudentAnalytics,
} from '@/types/student';
import { useCart } from '@/hooks/useCart';
import { useDebounce } from '@/hooks/useDebounce';
import { featureFlags } from '@/config/features';

import { WelcomeHeader } from '@/components/student/common/WelcomeHeader';
import { StatsOverview } from '@/components/student/common/StatsOverview';
import { SpecialsBanner } from '@/components/student/common/SpecialsBanner';
import { NotificationsDrawer } from '@/components/student/common/NotificationsDrawer';
import { AnalyticsWidget } from '@/components/student/common/AnalyticsWidget';

import { MenuFilters } from '@/components/student/menu/MenuFilters';
import { MenuGrid } from '@/components/student/menu/MenuGrid';
import { QueueTracker } from '@/components/student/tracker/QueueTracker';
import { OrderHistoryList } from '@/components/student/orders/OrderHistoryList';
import { CartDrawer } from '@/components/student/cart/CartDrawer';
import { EmptyState } from '@/components/student/common/EmptyState';

import { MenuSkeleton } from '@/components/student/skeletons/MenuSkeleton';
import { QueueTrackerSkeleton } from '@/components/student/skeletons/QueueTrackerSkeleton';
import { OrderHistorySkeleton } from '@/components/student/skeletons/OrderHistorySkeleton';
import { ApiErrorDisplay } from '@/components/student/common/ApiErrorDisplay';
import { useToast } from '@/hooks/useToast';

import { Utensils, History, Clock, PieChart, Sparkles } from 'lucide-react';
import { analytics } from '@/services/analytics';

// Lazy Load Heavy Modals
const CheckoutModal = dynamic(
  () => import('@/components/student/cart/CheckoutModal').then((mod) => mod.CheckoutModal),
  { ssr: false }
);

const QRPickupModal = dynamic(
  () => import('@/components/student/tracker/QRPickupModal').then((mod) => mod.QRPickupModal),
  { ssr: false }
);

export type DashboardTab = 'menu' | 'queue' | 'orders' | 'analytics';

export default function StudentDashboardPage() {
  const { addItem, itemCount, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<DashboardTab>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeOrder, setActiveOrder] = useState<StudentOrder | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [orderHistory, setOrderHistory] = useState<StudentOrder[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [notifications, setNotifications] = useState<CanteenNotification[]>([]);
  const [analyticsData, setAnalyticsData] = useState<StudentAnalytics | null>(null);

  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);
  const [isLoadingQueue, setIsLoadingQueue] = useState<boolean>(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [isFavoritesOnly, setIsFavoritesOnly] = useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Drawer / Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutSlot, setCheckoutSlot] = useState<string>('Instant Pickup (10-15 mins)');
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  const loadDashboardData = useCallback(async () => {
    setIsLoadingMenu(true);
    setIsLoadingQueue(true);
    setIsLoadingHistory(true);
    setApiError(null);

    try {
      const [menuRes, catRes, activeRes, historyRes, statsRes, notifRes, analyticsRes] =
        await Promise.all([
          studentApiService.getMenu(),
          studentApiService.getCategories(),
          studentApiService.getActiveOrder(),
          studentApiService.getOrderHistory(),
          studentApiService.getStudentStats(),
          studentApiService.getNotifications(),
          studentApiService.getStudentAnalytics(),
        ]);

      if (menuRes.success) setMenuItems(menuRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (statsRes.success) setStats(statsRes.data);
      if (notifRes.success) setNotifications(notifRes.data);
      if (analyticsRes.success) setAnalyticsData(analyticsRes.data);

      if (activeRes.success && activeRes.data) {
        setActiveOrder(activeRes.data);
        const queueRes = await studentApiService.getQueueStatus(activeRes.data.id);
        if (queueRes.success) setQueueStatus(queueRes.data);
      }
      if (historyRes.success) setOrderHistory(historyRes.data);
    } catch {
      setApiError('Failed to synchronize canteen data. Please check network.');
    } finally {
      setIsLoadingMenu(false);
      setIsLoadingQueue(false);
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

  // Special Item for Banner
  const specialItem = useMemo(() => {
    return menuItems.find((i) => i.isSpecial) || menuItems[0] || null;
  }, [menuItems]);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !debouncedSearchQuery ||
        item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesVeg = !isVegOnly || item.isVegetarian;
      const matchesFavorite = !isFavoritesOnly || item.isFavorite;

      return matchesCategory && matchesSearch && matchesVeg && matchesFavorite;
    });
  }, [menuItems, selectedCategory, debouncedSearchQuery, isVegOnly, isFavoritesOnly]);

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

  const handleProceedToCheckout = (slot: string) => {
    setCheckoutSlot(slot);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: StudentOrder) => {
    setActiveOrder(newOrder);
    setQueueStatus({
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      currentStep: 1,
      totalSteps: 4,
      statusText: 'Order Placed & Awaiting Confirmation',
      estimatedWaitMinutes: newOrder.estimatedPreparationTimeMinutes,
      queuePosition: 4,
    });
    setOrderHistory((prev) => [newOrder, ...prev]);
    setActiveTab('queue');
  };

  const handleReorder = async (orderId: string) => {
    const res = await studentApiService.reorder(orderId);
    if (res.success) {
      handleOrderSuccess(res.data);
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
        {/* Welcome Header Banner */}
        <WelcomeHeader
          unreadNotificationCount={unreadCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          itemCount={itemCount}
        />

        {/* Quick Stats Grid */}
        <StatsOverview stats={stats} />

        {/* Today's Special Banner */}
        <SpecialsBanner specialItem={specialItem} onAddToCart={addItem} />

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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 ${
              activeTab === 'menu'
                ? 'bg-[#054A36] text-white shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Utensils className="h-4 w-4" />
            <span>Menu Explorer</span>
          </button>

          {/* Tab 2: Live Queue */}
          {featureFlags.enableQueueTracking && (
            <button
              role="tab"
              aria-selected={activeTab === 'queue'}
              onClick={() => {
                setActiveTab('queue');
                analytics.trackCategoryFilter('queue-tab');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 relative ${
                activeTab === 'queue'
                  ? 'bg-[#054A36] text-white shadow-sm scale-[1.02]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Live Queue</span>
              {activeOrder && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 ${
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-[#054A36] text-white shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PieChart className="h-4 w-4" />
            <span>Spending Analytics</span>
          </button>
        </div>

        {/* Tab 1: Menu Explorer */}
        {activeTab === 'menu' && (
          <div className="space-y-5 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
            <MenuFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isVegOnly={isVegOnly}
              onVegOnlyToggle={setIsVegOnly}
              isFavoritesOnly={isFavoritesOnly}
              onFavoritesOnlyToggle={setIsFavoritesOnly}
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

        {/* Tab 2: Live Queue Tracker */}
        {activeTab === 'queue' && featureFlags.enableQueueTracking && (
          <div className="space-y-5 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
            {isLoadingQueue ? (
              <QueueTrackerSkeleton />
            ) : activeOrder ? (
              <QueueTracker
                queueStatus={queueStatus}
                onOpenQRModal={() => setIsQRModalOpen(true)}
              />
            ) : (
              <EmptyState
                icon={<Clock className="h-8 w-8 text-slate-400" />}
                title="No Active Queue Orders"
                description="You currently have no active canteen pre-orders in preparation."
                actionLabel="Browse Menu Explorer"
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
              <OrderHistoryList orders={orderHistory} onReorder={handleReorder} />
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

      {/* Express QR Pickup Pass Modal */}
      {featureFlags.enableQRCode && isQRModalOpen && activeOrder && (
        <QRPickupModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          orderNumber={activeOrder.orderNumber}
          qrCodeUrl={activeOrder.qrCodeUrl}
        />
      )}
    </DashboardLayout>
  );
}
