'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCart } from '@/hooks/useCart';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { PaymentMethod, StudentOrder } from '@/types/student';
import { paymentService } from '@/services/payment/paymentService';
import { ReceiptModal } from '@/components/student/orders/ReceiptModal';
import { ShoppingBag, ArrowRight, Wallet, CreditCard, Clock, CheckCircle2, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function StudentCheckoutPage() {
  const router = useRouter();
  const { items, totalAmountInINR, clearCart } = useCart();
  const { placeOrder } = useOrderWorkflow();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING'>('UPI');
  const [pickupSlot, setPickupSlot] = useState<string>('Instant Pickup (10-15 mins)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Confirmed Order State for Receipt Modal
  const [createdOrder, setCreatedOrder] = useState<StudentOrder | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  const handleProcessPaymentAndOrder = async () => {
    if (items.length === 0) {
      return showToast('Your cart is empty!', 'error');
    }

    setIsSubmitting(true);
    showToast('Authorizing payment gateway & verifying token security...', 'info');

    try {
      const orderId = `ord-${Date.now()}`;
      const payResult = await paymentService.processPayment({
        orderId,
        amountInINR: totalAmountInINR,
        paymentMethod: paymentMethod as PaymentMethod,
        studentId: 'std-user-1',
        studentName: 'Anshika Sharma',
        gatewayProvider: 'RAZORPAY',
      });

      if (payResult.success) {
        const order = placeOrder({
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
          paymentMethod: (paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD' || paymentMethod === 'NET_BANKING') ? 'UPI' : (paymentMethod as PaymentMethod),
          estimatedPreparationTimeMinutes: 12,
        });

        // Set payment metadata
        order.paymentId = payResult.paymentId;
        order.receiptNumber = payResult.receiptNumber;

        clearCart();
        setCreatedOrder(order);
        setIsReceiptOpen(true);
      }
    } catch {
      showToast('Payment failed. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="student" title="Cart & Express Checkout">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-[#054A36] dark:text-emerald-400" />
              5-Step Payment & Token Checkout
            </h2>
            <p className="text-xs text-slate-500">Review items, authorize payment, generate token & download receipt</p>
          </div>
        </div>

        {/* Step Progress Stepper */}
        <div className="grid grid-cols-5 gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-[10px] font-bold text-center">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-[#054A36] dark:text-emerald-400 shadow-xs">1. Review</div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-[#054A36] dark:text-emerald-400 shadow-xs">2. Slot</div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-[#054A36] dark:text-emerald-400 shadow-xs">3. Payment</div>
          <div className="p-2 rounded-xl bg-[#054A36] text-white shadow-xs">4. Token</div>
          <div className="p-2 rounded-xl text-slate-400">5. Confirmed</div>
        </div>

        {createdOrder ? (
          <Card className="p-6 text-center space-y-5 border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold text-emerald-800 dark:text-emerald-300 tracking-wider">
                Payment Authorized & Verified
              </span>
              <h3 className="text-3xl font-extrabold text-[#054A36] dark:text-emerald-400 mt-1">
                Token #{createdOrder.tokenNumber}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Estimated Pickup Wait Time: <span className="font-bold">10-12 mins</span> • Counter: <span className="font-bold">Counter A</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => setIsReceiptOpen(true)}
                leftIcon={<Download className="h-4 w-4" />}
                className="bg-[#054A36] text-white font-extrabold"
              >
                View & Download Official Receipt
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/student')}
                className="border-slate-300 dark:border-slate-700"
              >
                Back to Student Dashboard
              </Button>
            </div>
          </Card>
        ) : items.length === 0 ? (
          <Card className="p-8 text-center space-y-4">
            <ShoppingBag className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Basket is Empty</h3>
            <p className="text-xs text-slate-500">Add delicious food items from the menu to proceed.</p>
            <Button variant="primary" onClick={() => router.push('/student/menu')}>
              Browse 35+ Menu Catalogue
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Cart Items Summary */}
            <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Step 1: Selected Basket Items
              </h3>
              {items.map((item) => (
                <div key={item.menuItem.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#054A36] dark:text-emerald-400">{item.quantity}x</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.menuItem.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(item.menuItem.priceInINR * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold">
                <span>Total Amount Payable (Incl. GST)</span>
                <span className="text-[#054A36] dark:text-emerald-400 text-base">{formatCurrency(totalAmountInINR)}</span>
              </div>
            </Card>

            {/* Pickup Slot Selection */}
            <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#054A36] dark:text-emerald-400" /> Step 2: Pickup Time Slot
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['Instant Pickup (10-15 mins)', 'In 30 mins (12:30 PM)', 'In 45 mins (01:00 PM)'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setPickupSlot(slot)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      pickupSlot === slot
                        ? 'border-[#054A36] bg-emerald-50 dark:bg-emerald-950/40 text-[#054A36] dark:text-emerald-300 ring-1 ring-[#054A36]'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </Card>

            {/* Payment Gateway Method Selection */}
            <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-[#054A36] dark:text-emerald-400" /> Step 3: Payment Method
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Razorpay / UPI Ready
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: <CreditCard className="h-4 w-4" /> },
                  { id: 'CREDIT_CARD', label: 'Credit Card', icon: <CreditCard className="h-4 w-4" /> },
                  { id: 'DEBIT_CARD', label: 'Debit Card', icon: <CreditCard className="h-4 w-4" /> },
                  { id: 'NET_BANKING', label: 'Net Banking', icon: <Wallet className="h-4 w-4" /> },
                  { id: 'CANTEEN_CARD', label: 'Meal Wallet', icon: <Wallet className="h-4 w-4" /> },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 text-center ${
                      paymentMethod === pm.id
                        ? 'border-[#054A36] bg-emerald-50 dark:bg-emerald-950/40 text-[#054A36] dark:text-emerald-300 ring-1 ring-[#054A36]'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pm.icon}
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Authorize & Place Order CTA */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleProcessPaymentAndOrder}
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full bg-[#054A36] hover:bg-emerald-800 text-white font-extrabold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              {isSubmitting ? 'Authorizing Payment Gateway...' : `Authorize Payment & Generate Token (${formatCurrency(totalAmountInINR)})`}
            </Button>
          </div>
        )}

        {/* Receipt Modal Trigger */}
        {createdOrder && (
          <ReceiptModal
            order={createdOrder}
            isOpen={isReceiptOpen}
            onClose={() => setIsReceiptOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
