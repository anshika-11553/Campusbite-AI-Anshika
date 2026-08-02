"use client";

import React, { useState, useEffect } from "react";
import { Order, api } from "@/lib/api";
import {
  QrCode,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Info,
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
  const [studentUpiId, setStudentUpiId] = useState("student@oksbi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
  }, []);

  const orderId = order?.id || order?.order_id || "";
  const canteenVpa = "campusbite@oksbi";
  const tokenDisplay = order.token_code || (order.token_number ? `#${order.token_number}` : "--");
  const upiUri = `upi://pay?pa=${canteenVpa}&pn=CampusBite&am=${order.total_amount}&cu=INR&tn=${encodeURIComponent(`CampusBite Order ${tokenDisplay}`)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(canteenVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiUri);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLaunchUpiApp = () => {
    if (isMobile) {
      window.location.href = upiUri;
    } else {
      handleCopyLink();
    }
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      // Direct status update to backend without Razorpay or verification signatures
      await api.updateOrderStatus(orderId, "PAID", method);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 1600);
    } catch (e: any) {
      console.error("Payment error:", e);
      alert(e.message || "Failed to update payment status. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">CampusBite Checkout</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-600" /> Direct Payment
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Order ID: #{orderId ? orderId.slice(-6).toUpperCase() : "N/A"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          
          {/* Order Summary & Token Preview */}
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] font-extrabold text-[#fc8019] uppercase tracking-wider">Token Number</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{tokenDisplay}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Amount</p>
              <p className="text-2xl font-black text-emerald-700 mt-0.5">₹{order.total_amount}</p>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">
                {method === "CASH" ? "Order Confirmed!" : "Payment Successful!"}
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                {method === "CASH"
                  ? "Please pay exact cash at the canteen counter upon token pickup."
                  : "Payment recorded! Order dispatched directly to the canteen kitchen queue."}
              </p>
            </div>
          ) : (
            <>
              {/* Payment Method Selector */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("UPI")}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      method === "UPI"
                        ? "bg-orange-50 border-[#fc8019] text-slate-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <QrCode className={`w-5 h-5 ${method === "UPI" ? "text-[#fc8019]" : "text-slate-400"}`} />
                    <div>
                      <div className="text-xs font-bold">UPI Payment</div>
                      <div className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("CASH")}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      method === "CASH"
                        ? "bg-emerald-50 border-emerald-600 text-slate-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Banknote className={`w-5 h-5 ${method === "CASH" ? "text-emerald-600" : "text-slate-400"}`} />
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
                  
                  {/* Mobile App Launcher / Desktop Friendly Card */}
                  {isMobile ? (
                    <button
                      type="button"
                      onClick={handleLaunchUpiApp}
                      className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Open GPay / PhonePe / Paytm App</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </button>
                  ) : (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-center space-y-1">
                      <span className="text-xs font-black text-purple-900 flex items-center justify-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-purple-600" />
                        Open this payment on your phone
                      </span>
                      <p className="text-[11px] text-purple-700 font-medium leading-relaxed">
                        Scan the QR code below using GPay, PhonePe, or Paytm app.
                      </p>
                    </div>
                  )}

                  {/* QR Code Graphic */}
                  <div className="text-center space-y-2">
                    <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-md border border-slate-200">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}`}
                        alt="UPI QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-slate-700">
                      UPI VPA ID: <span className="font-black text-[#fc8019]">{canteenVpa}</span>
                    </p>
                  </div>

                  {/* Quick Copy Helpers */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="flex-1 py-2 px-2 bg-white border border-slate-300 rounded-xl text-[10px] font-bold text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors shadow-xs"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? "Copied UPI ID!" : "Copy UPI ID"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 py-2 px-2 bg-white border border-slate-300 rounded-lg text-[10px] font-bold text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors shadow-xs"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? "Copied Link!" : "Copy Payment Link"}</span>
                    </button>
                  </div>

                  {/* UPI VPA ID Textbox */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Your UPI ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={studentUpiId}
                      onChange={(e) => setStudentUpiId(e.target.value)}
                      placeholder="student@oksbi"
                      className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fc8019]"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center space-y-2">
                  <div className="p-3 rounded-full bg-emerald-100 text-emerald-700 w-12 h-12 mx-auto flex items-center justify-center">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">Pay Cash at Counter</h5>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    Please pay exact cash <strong className="text-slate-900">₹{order.total_amount}</strong> at the counter upon pickup. Your token <strong className="text-[#fc8019]">{tokenDisplay}</strong> will be activated for kitchen prep.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className={`w-full py-3.5 px-4 font-black rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 ${
                  method === "CASH"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                    : "bg-[#fc8019] hover:bg-[#e5700e] text-white shadow-orange-500/20"
                }`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {method === "CASH" ? `Confirm Cash Order ₹${order.total_amount}` : `I Have Paid ₹${order.total_amount}`}
                    </span>
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
