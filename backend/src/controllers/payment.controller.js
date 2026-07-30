import {
  createRazorpayOrderService,
  verifyRazorpayPaymentService,
} from "../services/payment.service.js";

// ==========================
// Create Razorpay Order Controller
// ==========================
export const createRazorpayOrderController = async (req, res) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required",
      });
    }

    const data = await createRazorpayOrderService(order_id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      data,
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Verify Razorpay Payment Controller
// ==========================
export const verifyRazorpayPaymentController = async (req, res) => {
  try {
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const data = await verifyRazorpayPaymentService(
      { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature },
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully and order status updated to PAID",
      data,
    });
  } catch (error) {
    console.error("Verify Razorpay Payment Error:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
