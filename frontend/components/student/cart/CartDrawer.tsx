'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/constants/currency';
import { PICKUP_SLOTS } from '@/constants/menu';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Clock, Tag, CheckCircle2 } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { useToast } from '@/hooks/useToast';
import { CompleteYourMealWidget } from '../recommendations/CompleteYourMealDrawer';
import { SAMPLE_MENU_ITEMS } from '@/services/recommendations/recommendationEngine';

interface CartDrawerProps {
  onProceedToCheckout: (selectedSlot: string, couponCode?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { items, itemCount, totalAmountInINR, updateQuantity, removeItem, isCartOpen, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const [selectedSlot, setSelectedSlot] = useState<string>(PICKUP_SLOTS[0].timeLabel);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'CAMPUS50') {
      setDiscountAmount(50);
      setIsCouponApplied(true);
      showToast('Coupon CAMPUS50 applied! ₹50 OFF', 'success');
    } else {
      showToast('Invalid coupon code. Try CAMPUS50', 'error');
    }
  };

  const finalTotal = Math.max(0, totalAmountInINR - discountAmount);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#054A36] text-white rounded-xl">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Your Food Basket</h2>
              <p className="text-xs text-slate-500">{itemCount} items selected</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {items.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="h-8 w-8 text-slate-400" />}
              title="Your Cart is Empty"
              description="Browse the campus canteen menu and add your favorite meals to pre-order."
            />
          ) : (
            <>
              {/* Item List */}
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <Card key={item.menuItem.id} className="p-3.5 flex items-center justify-between border-slate-200/80">
                    <div className="flex flex-col gap-0.5 max-w-[60%]">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{item.menuItem.name}</h4>
                      <span className="text-xs font-semibold text-[#054A36]">
                        {formatCurrency(item.menuItem.priceInINR)} each
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, -1)}
                          className="p-1 text-slate-600 hover:bg-slate-200 rounded-md"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-extrabold px-1.5 text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, 1)}
                          className="p-1 text-slate-600 hover:bg-slate-200 rounded-md"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.menuItem.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* 🍽 Complete Your Meal Smart Cart Complementary Widget */}
              <CompleteYourMealWidget allItems={SAMPLE_MENU_ITEMS} />

              {/* Coupon Code Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-amber-600" />
                    Campus Coupon Code
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                    Use CAMPUS50
                  </span>
                </div>

                {isCouponApplied ? (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      CAMPUS50 (₹50 OFF Applied)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCouponApplied(false);
                        setDiscountAmount(0);
                      }}
                      className="text-slate-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#054A36]"
                    />
                    <Button variant="secondary" size="sm" type="submit" className="text-xs px-3">
                      Apply
                    </Button>
                  </form>
                )}
              </div>

              {/* Pickup Slot Selection */}
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#054A36]" />
                  Select Pickup Time Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#054A36]"
                >
                  {PICKUP_SLOTS.map((slot) => (
                    <option key={slot.id} value={slot.timeLabel}>
                      {slot.timeLabel}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(totalAmountInINR)}</span>
            </div>

            {isCouponApplied && (
              <div className="flex items-center justify-between text-xs text-emerald-700">
                <span>Coupon Discount (CAMPUS50)</span>
                <span className="font-bold">- {formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Convenience & Packaging Fee</span>
              <span className="font-semibold text-emerald-700">FREE</span>
            </div>

            <div className="flex items-center justify-between text-base border-t border-slate-200 pt-2 mt-1">
              <span className="font-bold text-slate-900">Total Payable</span>
              <span className="font-extrabold text-[#054A36] text-lg">{formatCurrency(finalTotal)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => onProceedToCheckout(selectedSlot, isCouponApplied ? 'CAMPUS50' : undefined)}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full mt-1 font-semibold text-base py-3 bg-[#054A36]"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
