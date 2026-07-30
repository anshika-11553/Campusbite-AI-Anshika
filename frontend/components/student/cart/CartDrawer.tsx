'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/constants/currency';
import { PICKUP_SLOTS } from '@/constants/menu';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Clock } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface CartDrawerProps {
  onProceedToCheckout: (selectedSlot: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { items, itemCount, totalAmountInINR, updateQuantity, removeItem, isCartOpen, setIsCartOpen } = useCart();
  const [selectedSlot, setSelectedSlot] = useState<string>(PICKUP_SLOTS[0].timeLabel);

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
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalAmountInINR)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Convenience Fee</span>
              <span className="font-semibold text-emerald-700">FREE</span>
            </div>
            <div className="flex items-center justify-between text-base border-t border-slate-200 pt-2">
              <span className="font-bold text-slate-900">Total Bill</span>
              <span className="font-extrabold text-[#054A36] text-lg">{formatCurrency(totalAmountInINR)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => onProceedToCheckout(selectedSlot)}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full mt-1 font-semibold text-base py-3"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
