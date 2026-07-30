'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { studentApiService } from '@/services/api/v1/student';
import { MenuItem, Category, StudentOrder, QueueStatus } from '@/types/student';
import { useCart } from '@/hooks/useCart';
import { useDebounce } from '@/hooks/useDebounce';
import { featureFlags } from '@/config/features';

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
import { Button } from '@/components/ui/Button';

import { ShoppingBag, Utensils, History, Sparkles, Clock } from 'lucide-react';
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

export type DashboardTab = 'menu' | 'queue' | 'orders';

export default function StudentDashboardPage() {
  const { addItem, itemCount, setIsCartOpen } = useCart();

  const [activeTab, setActiveTab] = useState<DashboardTab>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeOrder, setActiveOrder] = useState<StudentOrder | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [orderHistory, setOrderHistory] = useState<StudentOrder[]>([]);

  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);
  const [isLoadingQueue, setIsLoadingQueue] = useState<boolean>(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutSlot, setCheckoutSlot] = useState<string>('Instant Pickup (10-15 mins)');
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);

  const loadDashboardData = async () => {
    setIsLoadingMenu(true);
    setIsLoadingQueue(true);
    setIsLoadingHistory(true);
    setApiError(null);

    try {
      const [menuRes, catRes, activeRes, historyRes] = await Promise.all([
        studentApiService.getMenu(),
        studentApiService.getCategories(),
        studentApiService.getActiveOrder(),
        studentApiService.getOrderHistory(),
      ]);

      if (menuRes.success) setMenuItems(menuRes.data);
      if (catRes.success) setCategories(catRes.data);
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
  };

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
  }, []);

  // Filtered Menu Memoization
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !debouncedSearchQuery ||
        item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesVeg = !isVegOnly || item.isVegetarian;

      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [menuItems, selectedCategory, debouncedSearchQuery, isVegOnly]);

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

  return (
    <DashboardLayout role="student" title="Campus Canteen Portal">
      <div className="flex flex-col gap-6">
        {/* Banner Quick Stats & Basket Trigger */}
        <div className="p-5 bg-[#054A36] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-emerald-950/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>CampusBite Smart Order</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Pre-Order Canteen Meals</h2>
            <p className="text-xs sm:text-sm text-emerald-100/80">
              Select items, choose pickup slot, and skip the counter queue!
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => setIsCartOpen(true)}
            leftIcon={<ShoppingBag className="h-4 w-4" />}
            className="w-full sm:w-auto bg-white text-[#054A36] font-bold"
          >
            View Basket ({itemCount})
          </Button>
        </div>

        {/* API Error Callout */}
        {apiError && <ApiErrorDisplay message={apiError} onRetry={loadDashboardData} />}

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none" role="tablist" aria-label="Student Dashboard Views">
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

          {/* Tab 2: Live Queue Tracker */}
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
        </div>

        {/* Tab Content 1: Menu Explorer */}
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
            />

            {isLoadingMenu ? (
              <MenuSkeleton />
            ) : (
              <MenuGrid items={filteredMenuItems} onAddToCart={addItem} />
            )}
          </div>
        )}

        {/* Tab Content 2: Live Queue Tracker */}
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

        {/* Tab Content 3: Order History */}
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
      </div>

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
