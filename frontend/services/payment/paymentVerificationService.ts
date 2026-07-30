import { PaymentRecord, IPaymentVerificationService } from '@/types/payment';

const STORAGE_KEY = 'campusbite_payment_records';

class PaymentVerificationService implements IPaymentVerificationService {
  private getRecordsFromStorage(): PaymentRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveRecordsToStorage(records: PaymentRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to persist payment records:', e);
    }
  }

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
  ): PaymentRecord {
    const existing = this.getRecordsFromStorage();

    // Check duplicate
    const found = existing.find((r) => r.orderId === orderId);
    if (found) return found;

    const record: PaymentRecord = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderId,
      orderNumber,
      studentId,
      studentName,
      vendorId,
      vendorName,
      outletName,
      amountInINR,
      upiId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    const updated = [record, ...existing];
    this.saveRecordsToStorage(updated);
    return record;
  }

  verifyPaymentByVendor(paymentId: string, vendorId: string): { success: boolean; message: string; record?: PaymentRecord } {
    const records = this.getRecordsFromStorage();
    let targetRecord: PaymentRecord | undefined;

    const updated = records.map((r) => {
      if (r.id === paymentId || r.orderId === paymentId) {
        if (r.status === 'PAID') {
          targetRecord = r;
          return r;
        }
        const verified: PaymentRecord = {
          ...r,
          status: 'PAID',
          verifiedAt: new Date().toISOString(),
          verifiedBy: vendorId,
          transactionId: `TXN-${Date.now()}`,
        };
        targetRecord = verified;
        return verified;
      }
      return r;
    });

    if (!targetRecord) {
      return { success: false, message: 'Payment record not found' };
    }

    this.saveRecordsToStorage(updated);
    return { success: true, message: 'Payment verified & marked PAID successfully!', record: targetRecord };
  }

  getPendingPaymentsForVendor(vendorId: string): PaymentRecord[] {
    const records = this.getRecordsFromStorage();
    return records.filter((r) => r.vendorId === vendorId || r.outletName.toLowerCase().includes(vendorId.toLowerCase()) || vendorId === 'all');
  }

  getAllPaymentLogs(): PaymentRecord[] {
    return this.getRecordsFromStorage();
  }

  getPaymentStatusByOrderId(orderId: string): PaymentRecord | undefined {
    return this.getRecordsFromStorage().find((r) => r.orderId === orderId);
  }
}

export const paymentVerificationService = new PaymentVerificationService();
