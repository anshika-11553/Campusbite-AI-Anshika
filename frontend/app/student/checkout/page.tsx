'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCart } from '@/hooks/useCart';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { StudentOrder } from '@/types/student';
import { ReceiptModal } from '@/components/student/orders/ReceiptModal';
import { ShoppingBag, Clock, CheckCircle2, QrCode, Download, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function StudentCheckoutPage() {
  const router = useRouter();
  const { items, totalAmountInINR, clearCart } = useCart();
  const { placeOrder } = useOrderWorkflow();
  const { showToast } = useToast();

  const [pickupSlot, setPickupSlot] = useState<string>('Instant Pickup (10-15 mins)');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Confirmed Order State
  const [createdOrder, setCreatedOrder] = useState<StudentOrder | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  const gstAmount = Math.round(totalAmountInINR * 0.05);
  const totalWithGst = totalAmountInINR;

  const handleConfirmPaymentYes = () => {
    setIsConfirmModalOpen(false);
    setIsSubmitting(true);

    setTimeout(() => {
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
        totalAmountInINR: totalWithGst,
        pickupSlot,
        paymentMethod: 'UPI',
        estimatedPreparationTimeMinutes: 12,
      });

      clearCart();
      setCreatedOrder(order);
      setIsSubmitting(false);
      showToast(`Payment Verified! Token #${order.tokenNumber} Generated`, 'success');
    }, 400);
  };

  return (
    <DashboardLayout role="student" title="Canteen UPI QR Express Checkout">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="h-6 w-6 text-[#054A36] dark:text-emerald-400" />
              CampusBite Hackathon Express Checkout (Static UPI QR)
            </h2>
            <p className="text-xs text-slate-500">Scan merchant QR code, complete UPI payment, and generate token</p>
          </div>
        </div>

        {createdOrder ? (
          /* Payment Successful Token Display Card */
          <Card className="p-8 text-center space-y-6 border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xl rounded-2xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-12 w-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold text-emerald-800 dark:text-emerald-300 tracking-wider">
                Payment Successful & Verified
              </span>
              <h3 className="text-4xl font-black text-[#054A36] dark:text-emerald-400">
                Token #{createdOrder.tokenNumber}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                Estimated Pickup Waiting Time: <span className="font-bold text-slate-900 dark:text-white">10–12 mins</span> • Counter: <span className="font-bold text-[#054A36] dark:text-emerald-400">Counter A</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsReceiptOpen(true)}
                leftIcon={<Download className="h-5 w-5" />}
                className="bg-[#054A36] hover:bg-emerald-800 text-white font-extrabold px-6"
              >
                View & Download Official Receipt
              </Button>

              <Button
                variant="outline"
                size="lg"
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
            <p className="text-xs text-slate-500">Add delicious food items from the menu to proceed with UPI pre-order.</p>
            <Button variant="primary" onClick={() => router.push('/student/menu')}>
              Browse 35+ Menu Catalogue
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Side: Order Summary */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[#054A36] dark:text-emerald-400" />
                  Order Summary
                </h3>

                <div className="space-y-2">
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
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totalAmountInINR - gstAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5% Configured Tax)</span>
                    <span>{formatCurrency(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Amount Payable</span>
                    <span className="text-[#054A36] dark:text-emerald-400">{formatCurrency(totalWithGst)}</span>
                  </div>
                </div>
              </Card>

              {/* Pickup Time Slot */}
              <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#054A36] dark:text-emerald-400" /> Select Pickup Time Slot
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
            </div>

            {/* Right Side: Static UPI QR Code Display & Complete Payment Button */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-extrabold uppercase text-[#054A36] dark:text-emerald-400 tracking-wider">
                    Scan Canteen Merchant QR
                  </span>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>

                {/* QR Code Container */}
                <div className="p-3 bg-white border-2 border-dashed border-emerald-500 rounded-2xl inline-block shadow-inner mx-auto">
                  <Image
                    src="/payment/vendor-upi.png"
                    alt="Campus Canteen Merchant UPI QR Code"
                    width={220}
                    height={220}
                    priority
                    className="rounded-xl mx-auto object-contain"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-slate-800 dark:text-slate-200">
                    Scan this QR Code using any UPI App
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    (GPay / PhonePe / Paytm / BHIM)
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold pt-1">
                    Pay Exactly: {formatCurrency(totalWithGst)}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-400 mb-3">
                    After completing the payment, click the button below to generate your token.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setIsConfirmModalOpen(true)}
                    disabled={isSubmitting}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="w-full bg-[#054A36] hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-xl shadow-lg"
                  >
                    I Have Completed Payment
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-5 shadow-2xl rounded-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Confirm Payment Completion
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Have you successfully completed the UPI payment of <span className="font-bold text-[#054A36] dark:text-emerald-400">{formatCurrency(totalWithGst)}</span> to the canteen merchant QR code?
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="w-1/2 border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleConfirmPaymentYes}
                  className="w-1/2 bg-[#054A36] text-white font-extrabold"
                >
                  Yes, Payment Completed
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Official Receipt Modal */}
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
