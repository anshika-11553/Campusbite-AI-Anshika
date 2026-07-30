export interface VendorPaymentProfile {
  vendorId: string;
  vendorName: string;
  outletName: string;
  upiId: string;
  qrCodeUrl: string;
  isQrActive: boolean;
  phone: string;
  email: string;
  accountHolderName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  updatedAt: string;
}
