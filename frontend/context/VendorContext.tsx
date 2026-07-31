'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { VendorPaymentProfile } from '@/types/vendor';

interface VendorContextType {
  vendorProfiles: VendorPaymentProfile[];
  currentVendor: VendorPaymentProfile;
  getVendorByNameOrId: (vendorNameOrId: string) => VendorPaymentProfile;
  updateVendorPaymentProfile: (vendorId: string, updates: Partial<VendorPaymentProfile>) => void;
}

const DEFAULT_VENDOR_PROFILES: VendorPaymentProfile[] = [
  {
    vendorId: 'vend-101',
    vendorName: 'Ramesh Sharma',
    outletName: 'Main Campus Food Court',
    upiId: 'maincampus.canteen@upi',
    qrCodeUrl: '/payment/vendor-upi.png',
    isQrActive: true,
    phone: '+91 98765 43210',
    email: 'canteen.main@college.edu',
    accountHolderName: 'Main Campus Food Court Pvt Ltd',
    updatedAt: new Date().toISOString(),
  },
  {
    vendorId: 'vend-102',
    vendorName: 'Venkatesh Iyer',
    outletName: 'South Express Food Hub',
    upiId: 'southexpress@okaxis',
    qrCodeUrl: '/payment/vendor-upi.png',
    isQrActive: true,
    phone: '+91 98123 45678',
    email: 'south.express@college.edu',
    accountHolderName: 'Venkatesh South Caterers',
    updatedAt: new Date().toISOString(),
  },
  {
    vendorId: 'vend-103',
    vendorName: 'Suresh Gupta',
    outletName: 'North Canteen & Juice Corner',
    upiId: 'northcanteen@paytm',
    qrCodeUrl: '/payment/vendor-upi.png',
    isQrActive: true,
    phone: '+91 97890 12345',
    email: 'north.canteen@college.edu',
    accountHolderName: 'Gupta Refreshments',
    updatedAt: new Date().toISOString(),
  },
];

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendorProfiles, setVendorProfiles] = useState<VendorPaymentProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusbite_vendor_profiles');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fallback to default
        }
      }
    }
    return DEFAULT_VENDOR_PROFILES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('campusbite_vendor_profiles', JSON.stringify(vendorProfiles));
    }
  }, [vendorProfiles]);

  const currentVendor = vendorProfiles[0];

  const getVendorByNameOrId = (nameOrId: string): VendorPaymentProfile => {
    const found = vendorProfiles.find(
      (v) => v.vendorId === nameOrId || v.outletName.toLowerCase().includes(nameOrId.toLowerCase()) || v.vendorName.toLowerCase().includes(nameOrId.toLowerCase())
    );
    return found || currentVendor;
  };

  const updateVendorPaymentProfile = (vendorId: string, updates: Partial<VendorPaymentProfile>) => {
    setVendorProfiles((prev) =>
      prev.map((v) => (v.vendorId === vendorId ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v))
    );
  };

  return (
    <VendorContext.Provider
      value={{
        vendorProfiles,
        currentVendor,
        getVendorByNameOrId,
        updateVendorPaymentProfile,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = (): VendorContextType => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
};
