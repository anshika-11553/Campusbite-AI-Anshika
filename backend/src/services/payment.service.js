import {
  getOrderById,
  updateOrderStatus,
} from "../repositories/order.repository.js";

// Direct UPI / Payment helper without Razorpay SDK dependency
export const createRazorpayOrderService = async (orderId, userId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  return {
    order_id: order.id,
    amount: Math.round(Number(order.total_amount) * 100),
    currency: "INR",
  };
};

export const verifyRazorpayPaymentService = async (payload, userId) => {
  const orderId = payload?.order_id || payload?.id;
  if (!orderId) {
    const error = new Error("order_id is required");
    error.statusCode = 400;
    throw error;
  }

  const updatedOrder = await updateOrderStatus(orderId, "PAID");
  return {
    order_id: updatedOrder.id,
    status: updatedOrder.status,
    updated_at: updatedOrder.updated_at || new Date().toISOString(),
  };
};
