export type PaymentVerificationStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface PaymentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  vendorId: string;
  vendorName: string;
  outletName: string;
  amountInINR: number;
  upiId: string;
  status: PaymentVerificationStatus;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  transactionId?: string;
}

export interface IPaymentVerificationService {
  createPendingPaymentRecord(
    orderId: string,
    orderNumber: string,
    studentId: string,
    studentName: string,
    vendorId: string,
    vendorName: string,
    outletName: string,
    amountInINR: number,
    upiId: string
  ): PaymentRecord;

  verifyPaymentByVendor(paymentId: string, vendorId: string): { success: boolean; message: string; record?: PaymentRecord };
  getPendingPaymentsForVendor(vendorId: string): PaymentRecord[];
  getAllPaymentLogs(): PaymentRecord[];
}
