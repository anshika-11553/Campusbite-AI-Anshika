"use client";

import React, { useState } from "react";
import { Order, api } from "@/lib/api";
import {
  QrCode,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  X,
} from "lucide-react";

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  onClose,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<"UPI" | "CASH">("UPI");
  const [upiId, setUpiId] = useState("student@upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await api.verifyPayment(order.id, method);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    } catch (e) {
      console.error("Payment error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">CampusBite Checkout</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-600" /> Secure Payment
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Order ID: #{order.id.slice(-6).toUpperCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Order Summary & Token Preview */}
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#fc8019] uppercase tracking-wider">Token Number</p>
              <p className="text-3xl font-black text-slate-900 mt-0.5">#{order.token_number || "--"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-600">Total Amount</p>
              <p className="text-2xl font-black text-emerald-700 mt-0.5">₹{order.total_amount}</p>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">Payment Verified!</h4>
              <p className="text-xs text-slate-600">
                Order dispatched directly to the canteen vendor live queue.
              </p>
            </div>
          ) : (
            <>
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Gateway Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("UPI")}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      method === "UPI"
                        ? "bg-orange-50 border-[#fc8019] text-slate-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <QrCode className={`w-6 h-6 ${method === "UPI" ? "text-[#fc8019]" : "text-slate-400"}`} />
                    <div>
                      <div className="text-xs font-bold">UPI / QR Code</div>
                      <div className="text-[10px] text-slate-500">GPay, PhonePe</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("CASH")}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      method === "CASH"
                        ? "bg-emerald-50 border-emerald-600 text-slate-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Banknote className={`w-6 h-6 ${method === "CASH" ? "text-emerald-600" : "text-slate-400"}`} />
                    <div>
                      <div className="text-xs font-bold">Cash at Counter</div>
                      <div className="text-[10px] text-slate-500">Pay on pickup</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic View based on method */}
              {method === "UPI" ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-700 font-bold">Scan QR Code to Pay</span>
                    <span className="text-[10px] text-[#fc8019] font-extrabold bg-orange-100 px-2 py-0.5 rounded-md">
                      Instant Approval
                    </span>
                  </div>

                  {/* QR Code Graphic */}
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl flex items-center justify-center shadow-md border border-slate-200">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=campusbite@upi%26pn=CampusBite%26am=${order.total_amount}`}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Enter UPI VPA ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-[#fc8019]"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 w-12 h-12 mx-auto flex items-center justify-center">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">Cash on Delivery / Pickup</h5>
                  <p className="text-xs text-slate-600">
                    Your token number <strong className="text-slate-900">#{order.token_number}</strong> will be activated immediately. Please hand exact cash ₹{order.total_amount} at the counter.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-[#fc8019] hover:bg-[#e5700e] text-white font-black rounded-xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Payment ₹{order.total_amount}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
