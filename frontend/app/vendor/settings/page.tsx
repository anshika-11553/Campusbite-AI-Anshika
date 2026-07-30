'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useVendor } from '@/context/VendorContext';
import { useToast } from '@/hooks/useToast';
import { paymentVerificationService } from '@/services/payment/paymentVerificationService';
import { PaymentRecord } from '@/types/payment';
import { QrCode, Upload, Trash2, RefreshCw, Save, Store, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function VendorSettingsPage() {
  const { currentVendor, updateVendorPaymentProfile } = useVendor();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [vendorName, setVendorName] = useState<string>(currentVendor.vendorName);
  const [outletName, setOutletName] = useState<string>(currentVendor.outletName);
  const [upiId, setUpiId] = useState<string>(currentVendor.upiId);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(currentVendor.qrCodeUrl);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB max
    if (file.size > 5 * 1024 * 1024) {
      return showToast('Image file size exceeds 5MB limit. Please choose a smaller image.', 'error');
    }

    // Validate image format
    const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      return showToast('Unsupported format. Please upload PNG, JPG, JPEG, or WEBP.', 'error');
    }

    // Read base64 data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setQrCodeUrl(reader.result);
        showToast('New UPI QR Code image loaded! Click Save Changes to activate.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQr = () => {
    setQrCodeUrl('');
    showToast('Payment QR Code removed. Student checkout will display "No Payment QR Uploaded Yet".', 'warning');
  };

  const handleSaveChanges = () => {
    if (!outletName.trim()) {
      return showToast('Outlet Name is required.', 'error');
    }
    if (!upiId.trim()) {
      return showToast('UPI VPA Handle ID is required.', 'error');
    }

    setIsSaving(true);
    setTimeout(() => {
      updateVendorPaymentProfile(currentVendor.vendorId, {
        vendorName,
        outletName,
        upiId,
        qrCodeUrl,
        isQrActive: true,
      });
      setIsSaving(false);
      showToast('Vendor UPI Payment Settings updated successfully!', 'success');
    }, 400);
  };

  return (
    <DashboardLayout role="vendor" title="Vendor Payment & Outlet Settings">
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="h-6 w-6 text-[#054A36] dark:text-emerald-400" />
              Vendor Personal Payment & QR Management
            </h2>
            <p className="text-xs text-slate-500">Configure your outlet&apos;s custom UPI ID and payment QR code for student checkout</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveChanges}
            disabled={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
            className="bg-[#054A36] text-white font-extrabold"
          >
            {isSaving ? 'Saving...' : 'Save Payment Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Outlet & Merchant Credentials */}
          <div className="md:col-span-7 space-y-4">
            <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Store className="h-4 w-4 text-[#054A36] dark:text-emerald-400" />
                Outlet & Licensee Information
              </h3>

              <Input
                label="Vendor Name (Licensee)"
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
                required
              />

              <Input
                label="Canteen Outlet Name"
                type="text"
                value={outletName}
                onChange={(e) => setOutletName(e.target.value)}
                leftIcon={<Store className="h-4 w-4" />}
                required
              />

              <Input
                label="Merchant UPI VPA Handle ID"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="vendor@upi or merchant@okaxis"
                leftIcon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
                helperText="Students will see this UPI handle when paying directly to your outlet."
                required
              />
            </Card>

            <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Active Canteen Outlet Privileges
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4">
                <li>Direct student-to-vendor UPI settlement without intermediary holds.</li>
                <li>Custom QR code rendering on Student Express Checkout screen.</li>
                <li>Token verification system prevents duplicate order pickup calls.</li>
              </ul>
            </Card>
          </div>

          {/* Right Column: Personal UPI QR Upload & Preview */}
          <div className="md:col-span-5 space-y-4">
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-extrabold uppercase text-[#054A36] dark:text-emerald-400 tracking-wider">
                  Live Vendor Payment QR
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>

              {/* QR Image Preview Container */}
              <div className="p-3 bg-white border-2 border-dashed border-emerald-500 rounded-2xl inline-block shadow-inner mx-auto">
                <Image
                  src={qrCodeUrl}
                  alt={`${outletName} Personal UPI QR Code`}
                  width={200}
                  height={200}
                  unoptimized
                  className="rounded-xl mx-auto object-contain"
                />
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">{outletName}</p>
                <p className="font-mono text-[11px] text-[#054A36] dark:text-emerald-400">{upiId}</p>
                <p className="text-[10px] text-slate-400">Supported Formats: PNG, JPG, JPEG, WEBP</p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleQrUpload}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<Upload className="h-3.5 w-3.5" />}
                  className="text-xs font-bold border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                >
                  Upload QR
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveQr}
                  leftIcon={<Trash2 className="h-3.5 w-3.5 text-red-500" />}
                  className="text-xs text-red-600 hover:bg-red-50"
                >
                  Reset Default
                </Button>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                className="w-full text-xs font-semibold"
              >
                Replace QR Code Image
              </Button>
            </Card>
          </div>
        </div>

        {/* 💳 Payment Verification Section */}
        <Card className="p-6 border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Payment Verification Queue
              </h3>
              <p className="text-xs text-slate-500">
                Confirm student UPI payments before issuing pickup tokens (`PENDING` → `PAID`)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-extrabold">
              Live Verification Queue
            </span>
          </div>

          <VendorPaymentVerificationTable vendorId={currentVendor.vendorId} />
        </Card>
      </div>
    </DashboardLayout>
  );
}

function VendorPaymentVerificationTable({ vendorId }: { vendorId: string }) {
  const { showToast } = useToast();
  const [payments, setPayments] = useState<PaymentRecord[]>(() =>
    paymentVerificationService.getPendingPaymentsForVendor(vendorId)
  );

  const handleVerify = (payId: string) => {
    const res = paymentVerificationService.verifyPaymentByVendor(payId, vendorId);
    if (res.success) {
      showToast(res.message, 'success');
      setPayments(paymentVerificationService.getPendingPaymentsForVendor(vendorId));
    }
  };

  const pendingList = payments.filter((p) => p.status === 'PENDING');

  if (pendingList.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
        <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
        <p className="font-bold text-slate-700 dark:text-slate-300">All Student Payments Verified!</p>
        <p className="text-[11px] text-slate-400">No pending UPI verification requests in queue.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
      {pendingList.map((p) => (
        <div key={p.id} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">{p.studentName}</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                {p.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Order #{p.orderNumber} • Amount: <strong className="text-slate-900 dark:text-white">₹{p.amountInINR}</strong> • {new Date(p.createdAt).toLocaleTimeString()}
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleVerify(p.id)}
            leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shrink-0"
          >
            Verify Payment (Mark PAID)
          </Button>
        </div>
      ))}
    </div>
  );
}
