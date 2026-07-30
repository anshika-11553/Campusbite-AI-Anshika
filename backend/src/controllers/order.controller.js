import {
  placeOrder,
  getStudentOrderHistory,
  getStudentOrderDetails,
  updateOrderStatusService,
} from "../services/order.service.js";

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

// ==========================
// Get Student Order History Controller
// ==========================
export const getStudentOrderHistoryController = async (req, res) => {
  try {
    const orders = await getStudentOrderHistory(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Order history fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get Student Order History Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Student Order Details Controller
// ==========================
export const getStudentOrderDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await getStudentOrderDetails(id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Get Student Order Details Error:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Order Status Controller
// ==========================
export const updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await updateOrderStatusService(id, status);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};




