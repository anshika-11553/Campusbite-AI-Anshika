'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCart } from '@/hooks/useCart';
import { useOrderWorkflow } from '@/context/OrderWorkflowContext';
import { useVendor } from '@/context/VendorContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/constants/currency';
import { StudentOrder } from '@/types/student';
import { ReceiptModal } from '@/components/student/orders/ReceiptModal';
import { ShoppingBag, Clock, CheckCircle2, QrCode, Download, ArrowRight, ShieldCheck, AlertCircle, Store } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

import { paymentVerificationService } from '@/services/payment/paymentVerificationService';
import { PaymentRecord } from '@/types/payment';

export default function StudentCheckoutPage() {
  const router = useRouter();
  const { items, totalAmountInINR, clearCart } = useCart();
  const { placeOrder } = useOrderWorkflow();
  const { getVendorByNameOrId } = useVendor();
  const { showToast } = useToast();

  const [pickupSlot, setPickupSlot] = useState<string>('Instant Pickup (10-15 mins)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Payment Verification State
  const [paymentRecord, setPaymentRecord] = useState<PaymentRecord | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Confirmed Order State
  const [createdOrder, setCreatedOrder] = useState<StudentOrder | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  // Determine active outlet profile
  const selectedOutletName = items[0]?.menuItem.category ? 'Main Campus Food Court' : 'Main Campus Food Court';
  const vendorProfile = getVendorByNameOrId(selectedOutletName);

  const gstAmount = Math.round(totalAmountInINR * 0.05);
  const totalWithGst = totalAmountInINR;

  const isQrAvailable = Boolean(vendorProfile?.qrCodeUrl && vendorProfile?.isQrActive);

  // Create PENDING Payment record when student views QR
  const handleInitiatePayment = () => {
    if (!isQrAvailable) return;

    const tempOrderId = `ord-${Date.now()}`;
    const tempOrderNum = `CB-${Math.floor(1000 + Math.random() * 9000)}`;

    const record = paymentVerificationService.createPendingPaymentRecord(
      tempOrderId,
      tempOrderNum,
      'std-user-1',
      'Anshika Sharma',
      vendorProfile.vendorId,
      vendorProfile.vendorName,
      vendorProfile.outletName,
      totalWithGst,
      vendorProfile.upiId
    );

    setPaymentRecord(record);
    showToast('Payment initiated with status PENDING. Waiting for Vendor verification...', 'info');
  };

  // Poll / Check payment verification status
  const handleCheckVendorVerification = () => {
    if (!paymentRecord) return;
    setIsVerifying(true);
    setTimeout(() => {
      const updatedRecord = paymentVerificationService.getPaymentStatusByOrderId(paymentRecord.orderId);
      if (updatedRecord && updatedRecord.status === 'PAID') {
        setPaymentRecord(updatedRecord);
        showToast('Payment Verified by Vendor! You can now generate your pickup token.', 'success');
      } else {
        showToast('Payment is still PENDING vendor verification. Please ask vendor to verify in their dashboard.', 'warning');
      }
      setIsVerifying(false);
    }, 400);
  };

  // Generate Token once payment status = PAID
  const handleGenerateToken = () => {
    if (!paymentRecord || paymentRecord.status !== 'PAID') return;
    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        studentId: 'std-user-1',
        studentName: 'Anshika Sharma',
        vendorName: vendorProfile.outletName,
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
      showToast(`Token #${order.tokenNumber} Generated & synced across all dashboards!`, 'success');
    }, 400);
  };

  return (
    <DashboardLayout role="student" title="Vendor Direct UPI Express Checkout">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="h-6 w-6 text-[#054A36] dark:text-emerald-400" />
              Direct Vendor UPI QR Payment
            </h2>
            <p className="text-xs text-slate-500">Scan outlet-specific QR code, complete payment to vendor, and generate token</p>
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
                Payment Received by {vendorProfile.outletName}
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
            <p className="text-xs text-slate-500">Add delicious food items from the menu to proceed with vendor UPI pre-order.</p>
            <Button variant="primary" onClick={() => router.push('/student/menu')}>
              Browse 35+ Menu Catalogue
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Side: Order Summary & Outlet Profile */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-[#054A36] dark:text-emerald-400" />
                    Order Summary
                  </h3>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Store className="h-3.5 w-3.5 text-emerald-600" />
                    {vendorProfile.outletName}
                  </span>
                </div>

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

            {/* Right Side: Vendor Specific QR Code Display & Payment Verification Lock */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="text-left">
                    <span className="text-[10px] font-extrabold uppercase text-[#054A36] dark:text-emerald-400 tracking-wider block">
                      Vendor Outlet Payment QR
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {vendorProfile.outletName}
                    </h4>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>

                {/* EMPTY STATE: Vendor Has Not Uploaded QR */}
                {!isQrAvailable ? (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl space-y-3 my-2">
                    <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                      <QrCode className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        No Payment QR Uploaded Yet
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        This canteen vendor has not uploaded their personal payment QR code. Pre-orders cannot be placed at this time.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold inline-block">
                      PAYMENT DISABLED
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Live Vendor QR Code Image Container */}
                    <div className="p-3 bg-white border-2 border-dashed border-emerald-500 rounded-2xl inline-block shadow-inner mx-auto">
                      <Image
                        src={vendorProfile.qrCodeUrl}
                        alt={`${vendorProfile.outletName} UPI QR Code`}
                        width={220}
                        height={220}
                        unoptimized
                        priority
                        className="rounded-xl mx-auto object-contain"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="font-extrabold text-slate-800 dark:text-slate-200">
                        Scan Vendor QR using GPay / PhonePe / Paytm
                      </p>
                      <p className="font-mono text-[11px] text-[#054A36] dark:text-emerald-400 font-bold">
                        UPI ID: {vendorProfile.upiId}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold pt-1">
                        Pay Exactly: {formatCurrency(totalWithGst)}
                      </p>
                    </div>
                  </>
                )}

                {/* PAYMENT STATUS & TOKEN GENERATION ACTIONS */}
                {isQrAvailable && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    {!paymentRecord ? (
                      <div>
                        <p className="text-[11px] text-slate-400 mb-2">
                          After transferring ₹{totalWithGst} to {vendorProfile.vendorName}, click below to create a payment verification record.
                        </p>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleInitiatePayment}
                          className="w-full bg-[#054A36] hover:bg-emerald-800 text-white font-extrabold py-3 rounded-xl shadow-md"
                        >
                          I Have Transferred UPI Payment
                        </Button>
                      </div>
                    ) : paymentRecord.status === 'PENDING' ? (
                      <div className="space-y-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            Payment Status: PENDING
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Ref: {paymentRecord.orderNumber}</span>
                        </div>
                        <p className="text-[11px] text-amber-800 dark:text-amber-400 text-left">
                          Waiting for vendor verification... Student cannot generate token until vendor confirms payment in dashboard.
                        </p>

                        {/* DISABLED BUTTON WITH TOOLTIP INDICATOR */}
                        <div className="pt-1 flex gap-2">
                          <Button
                            variant="primary"
                            size="md"
                            disabled
                            title="Waiting for payment verification..."
                            className="w-2/3 opacity-50 cursor-not-allowed bg-slate-400 text-white font-bold text-xs"
                          >
                            Waiting for Vendor Verification...
                          </Button>
                          <Button
                            variant="outline"
                            size="md"
                            onClick={handleCheckVendorVerification}
                            disabled={isVerifying}
                            className="w-1/3 text-xs border-amber-400 text-amber-800 font-bold"
                          >
                            {isVerifying ? 'Checking...' : 'Check Verification'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* PAYMENT STATUS = PAID: ENABLE GENERATE TOKEN */
                      <div className="space-y-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            Payment Status: VERIFIED & PAID
                          </span>
                        </div>

                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleGenerateToken}
                          disabled={isSubmitting}
                          rightIcon={<ArrowRight className="h-4 w-4" />}
                          className="w-full bg-[#054A36] hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-xl shadow-lg animate-bounce [animation-duration:2s]"
                        >
                          Generate Token & Confirm Order
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
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
