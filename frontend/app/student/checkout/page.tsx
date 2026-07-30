'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCart } from '@/hooks/useCart';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { PaymentMethod } from '@/types/student';
import { ShoppingBag, ArrowRight, Wallet, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function StudentCheckoutPage() {
  const router = useRouter();
  const { items, totalAmountInINR, clearCart } = useCart();
  const { placeOrder } = useOrderWorkflow();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [pickupSlot, setPickupSlot] = useState<string>('Instant Pickup (10-15 mins)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      return showToast('Your cart is empty!', 'error');
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = placeOrder({
        studentId: 'std-user-1',
        studentName: 'Anshika Sharma',
        vendorName: 'Main Campus Food Court',
        items: items.map((item) => ({
          itemId: item.menuItem.id,
          itemName: item.menuItem.name,
          quantity: item.quantity,
          priceInINR: item.menuItem.priceInINR,
        })),
        totalAmountInINR,
        pickupSlot,
        paymentMethod,
        estimatedPreparationTimeMinutes: 12,
      });

      clearCart();
      setIsSubmitting(false);
      showToast(`Order Placed! Token #${created.tokenNumber}`, 'success');
      router.push('/student');
    }, 600);
  };

  return (
    <DashboardLayout role="student" title="Cart & Express Checkout">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-[#054A36]" />
              Review Order & Express Checkout
            </h2>
            <p className="text-xs text-slate-500">Confirm items, select pickup slot, and generate active token</p>
          </div>
        </div>

        {items.length === 0 ? (
          <Card className="p-8 text-center space-y-4">
            <ShoppingBag className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Your Basket is Empty</h3>
            <p className="text-xs text-slate-500">Add delicious food items from the menu to proceed.</p>
            <Button variant="primary" onClick={() => router.push('/student/menu')}>
              Browse 35+ Menu Catalogue
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Cart Items Summary */}
            <Card className="p-5 border-slate-200 space-y-3 bg-white">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Selected Basket Items</h3>
              {items.map((item) => (
                <div key={item.menuItem.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#054A36]">{item.quantity}x</span>
                    <span className="font-semibold text-slate-800">{item.menuItem.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{formatCurrency(item.menuItem.priceInINR * item.quantity)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-sm font-extrabold">
                <span>Total Amount Payable</span>
                <span className="text-[#054A36] text-base">{formatCurrency(totalAmountInINR)}</span>
              </div>
            </Card>

            {/* Pickup Slot Selection */}
            <Card className="p-5 border-slate-200 space-y-3 bg-white">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#054A36]" /> Pickup Time Slot
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['Instant Pickup (10-15 mins)', 'In 30 mins (12:30 PM)', 'In 45 mins (01:00 PM)'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setPickupSlot(slot)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      pickupSlot === slot
                        ? 'border-[#054A36] bg-emerald-50 text-[#054A36] ring-1 ring-[#054A36]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </Card>

            {/* Payment Method Selection */}
            <Card className="p-5 border-slate-200 space-y-3 bg-white">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-[#054A36]" /> Payment Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR Payment', icon: <CreditCard className="h-4 w-4" /> },
                  { id: 'CANTEEN_CARD', label: 'Canteen Wallet (₹650)', icon: <Wallet className="h-4 w-4" /> },
                  { id: 'CASH_AT_PICKUP', label: 'Cash at Counter', icon: <CheckCircle2 className="h-4 w-4" /> },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                      paymentMethod === pm.id
                        ? 'border-[#054A36] bg-emerald-50 text-[#054A36] ring-1 ring-[#054A36]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pm.icon}
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Place Order CTA */}
            <Button
              variant="primary"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full bg-[#054A36] hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-xl shadow-lg"
            >
              {isSubmitting ? 'Generating Token...' : `Confirm Order (${formatCurrency(totalAmountInINR)})`}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
