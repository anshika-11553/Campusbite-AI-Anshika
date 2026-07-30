import { placeOrder } from "../services/order.service.js";

// ==========================
// Place Order Controller
// ==========================
export const placeOrderController = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items) {
      return res.status(400).json({
        success: false,
        message: "Items are required",
      });
    }

    const result = await placeOrder(req.user.id, items);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Place Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

