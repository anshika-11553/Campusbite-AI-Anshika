'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency } from '@/constants/currency';
import { PAYMENT_METHODS } from '@/constants/menu';
import { PaymentMethod, StudentOrder } from '@/types/student';
import { studentApiService } from '@/services/api/v1/student';
import { useToast } from '@/hooks/useToast';
import { analytics } from '@/services/analytics';
import { X, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { sanitizeInput } from '@/utils/sanitizer';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: string;
  onOrderSuccess: (order: StudentOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedSlot,
  onOrderSuccess,
}) => {
  const { items, totalAmountInINR, clearCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Accessible Focus Trap & Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      analytics.trackCheckoutStarted(items.length, totalAmountInINR);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, items.length, totalAmountInINR]);

  if (!isOpen) return null;

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (items.length === 0) {
      setValidationError('Your cart is empty.');
      return;
    }
    if (!selectedSlot) {
      setValidationError('Please select a valid pickup slot.');
      return;
    }
    if (!paymentMethod) {
      setValidationError('Please select a payment method.');
      return;
    }
    if (specialInstructions.length > 200) {
      setValidationError('Special instructions must be under 200 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedInstructions = sanitizeInput(specialInstructions);
      const res = await studentApiService.placeOrder({
        items,
        pickupSlot: selectedSlot,
        paymentMethod,
        specialInstructions: sanitizedInstructions,
      });

      if (res.success) {
        showToast('Pre-order confirmed successfully!', 'success', 'Order Placed');
        analytics.trackOrderPlaced(res.data.id, res.data.totalAmountInINR);
        clearCart();
        setIsCartOpen(false);
        onClose();
        onOrderSuccess(res.data);
      } else {
        throw new Error(res.message || 'Failed to place order.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout failed due to network error.';
      setValidationError(msg);
      showToast(msg, 'error', 'Checkout Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#054A36]" />
            <h2 id="checkout-title" className="font-bold text-base text-slate-900">
              Confirm Pre-Order Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close checkout modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmOrder} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {validationError && (
            <Alert variant="error" title="Checkout Error">
              {validationError}
            </Alert>
          )}

          {/* Slot Summary */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-semibold">
            <span>Pickup Time Slot:</span>
            <span>{selectedSlot}</span>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 gap-2">
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-50/50 border-[#054A36] ring-1 ring-[#054A36]'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{pm.label}</h4>
                      <p className="text-[11px] text-slate-500">{pm.description}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-[#054A36] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <Input
            label="Kitchen Special Instructions (Optional)"
            placeholder="e.g., Less spicy, no onions, extra green chutney..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            maxLength={200}
            helperText={`${specialInstructions.length}/200 characters`}
          />

          {/* Total Amount Breakdown */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Instant Canteen Pre-order Token</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Payable</span>
              <span className="text-lg font-extrabold text-[#054A36]">
                {formatCurrency(totalAmountInINR)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting} className="w-1/3">
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-2/3 py-3 text-sm font-semibold"
            >
              Pay & Confirm Pre-order ({formatCurrency(totalAmountInINR)})
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
