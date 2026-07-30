import { PaymentMethod } from '@/types/student';

export interface PaymentRequest {
  orderId: string;
  amountInINR: number;
  paymentMethod: PaymentMethod | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING';
  studentId: string;
  studentName: string;
  studentEmail?: string;
  gatewayProvider?: 'RAZORPAY' | 'STRIPE' | 'SIMULATED';
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  orderId: string;
  amountInINR: number;
  paymentMethod: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  transactionTimestamp: string;
  gatewayProvider: string;
  receiptNumber: string;
  message: string;
}

export interface IPaymentService {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  verifyPaymentSignature(paymentId: string, orderId: string, signature?: string): Promise<boolean>;
}

class PaymentService implements IPaymentService {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Simulated async gateway latency (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    const paymentId = `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const receiptNumber = `REC-CB-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      success: true,
      paymentId,
      orderId: request.orderId,
      amountInINR: request.amountInINR,
      paymentMethod: request.paymentMethod,
      status: 'SUCCESS',
      transactionTimestamp: new Date().toISOString(),
      gatewayProvider: request.gatewayProvider || 'SIMULATED_RAZORPAY',
      receiptNumber,
      message: 'Payment completed successfully. Gateway authorization approved.',
    };
  }

  async verifyPaymentSignature(paymentId: string, orderId: string): Promise<boolean> {
    return !!(paymentId && orderId);
  }
}

export const paymentService = new PaymentService();
