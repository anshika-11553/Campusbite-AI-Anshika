import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import {
  getOrderById,
  updateOrderStatus,
} from "../repositories/order.repository.js";

// ==========================
// Create Razorpay Order Service
// ==========================
export const createRazorpayOrderService = async (orderId, userId) => {
  if (!orderId) {
    const error = new Error("Order ID is required");
    error.statusCode = 400;
    throw error;
  }

  const order = await getOrderById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.user_id !== userId) {
    const error = new Error("Access denied to this order");
    error.statusCode = 403;
    throw error;
  }

  if (order.status !== "PENDING_PAYMENT") {
    const error = new Error(
      `Cannot initiate payment for order in '${order.status}' status`
    );
    error.statusCode = 400;
    throw error;
  }

  const amountInPaise = Math.round(Number(order.total_amount) * 100);

  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: `receipt_${order.id.replace(/-/g, "").slice(0, 20)}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  return {
    razorpay_order_id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    order_id: order.id,
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  };
};

// ==========================
// Verify Razorpay Payment Service
// ==========================
export const verifyRazorpayPaymentService = async (
  { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature },
  userId
) => {
  if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    const error = new Error(
      "Missing required payment verification details: order_id, razorpay_order_id, razorpay_payment_id, and razorpay_signature are required"
    );
    error.statusCode = 400;
    throw error;
  }

  const order = await getOrderById(order_id);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.user_id !== userId) {
    const error = new Error("Access denied to this order");
    error.statusCode = 403;
    throw error;
  }

  if (order.status !== "PENDING_PAYMENT") {
    const error = new Error(
      `Cannot verify payment for order in '${order.status}' status`
    );
    error.statusCode = 400;
    throw error;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    const error = new Error("Invalid payment signature");
    error.statusCode = 400;
    throw error;
  }

  const updatedOrder = await updateOrderStatus(order_id, "PAID");

  return {
    order_id: updatedOrder.id,
    status: updatedOrder.status,
    razorpay_payment_id,
    updated_at: updatedOrder.updated_at || new Date().toISOString(),
  };
};
