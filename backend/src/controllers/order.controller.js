import {
  placeOrder,
  getUserOrders,
  getOrderDetails,
  getVendorOrders,
  updateOrderStatusService,
  verifyPickupPinService,
  regeneratePickupPinService,
  getPickupPinService,
} from "../services/order.service.js";

// ==========================
// Place Order Controller
// ==========================
export const placeOrderController = async (req, res) => {
  try {
    const { items, payment_method, is_preorder, preorder_date, preorder_slot, group_token } = req.body;
    const userId = req.user.id;

    const order = await placeOrder(userId, items, payment_method, {
      is_preorder,
      preorder_date,
      preorder_slot,
      group_token,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get User Orders Controller
// ==========================
export const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await getUserOrders(userId);

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders || [],
    });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
    });
  }
};

// ==========================
// Get Order Details Controller
// ==========================
export const getOrderDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderDetails(id);

    return res.status(200).json({
      success: true,
      message: "Order details retrieved successfully",
      data: order || null,
    });
  } catch (error) {
    console.error("Get Order Details Error:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Vendor Orders Controller
// ==========================
export const getVendorOrdersController = async (req, res) => {
  try {
    const orders = await getVendorOrders();

    return res.status(200).json({
      success: true,
      message: "Vendor orders retrieved successfully",
      data: orders || [],
    });
  } catch (error) {
    console.error("Get Vendor Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
    });
  }
};

// ==========================
// Update Order Status Controller
// ==========================
export const updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_method } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await updateOrderStatusService(
      id,
      status,
      req.user?.role_id,
      req.user?.id,
      payment_method
    );

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

// ==========================
// Verify Pickup PIN Controller
// ==========================
export const verifyPickupPinController = async (req, res) => {
  try {
    const { id } = req.params;
    const { pin } = req.body;
    const vendorId = req.user?.id || "vendor-counter";

    if (!pin) {
      return res.status(400).json({
        success: false,
        message: "6-digit Pickup PIN is required",
      });
    }

    const result = await verifyPickupPinService(id, pin, vendorId);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error("Verify Pickup PIN Error:", error);
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to verify pickup PIN",
    });
  }
};

// ==========================
// Regenerate Pickup PIN Controller
// ==========================
export const regeneratePickupPinController = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.id || "vendor-counter";

    const newPinRecord = await regeneratePickupPinService(id, vendorId);

    return res.status(200).json({
      success: true,
      message: "New Pickup PIN generated successfully",
      data: newPinRecord,
    });
  } catch (error) {
    console.error("Regenerate Pickup PIN Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to regenerate PIN",
    });
  }
};

// ==========================
// Get Pickup PIN Details Controller
// ==========================
export const getPickupPinController = async (req, res) => {
  try {
    const { id } = req.params;
    const pinRecord = await getPickupPinService(id);

    return res.status(200).json({
      success: true,
      message: "Pickup PIN details retrieved successfully",
      data: pinRecord,
    });
  } catch (error) {
    console.error("Get Pickup PIN Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve PIN details",
    });
  }
};
