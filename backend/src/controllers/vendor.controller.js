import {
  getVendorOrders,
  getVendorDashboard,
} from "../services/order.service.js";

// ==========================
// Get Vendor Active Orders Controller
// ==========================
export const getVendorOrdersController = async (req, res) => {
  try {
    const orders = await getVendorOrders();

    return res.status(200).json({
      success: true,
      message: "Vendor orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get Vendor Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Vendor Dashboard Controller
// ==========================
export const getVendorDashboardController = async (req, res) => {
  try {
    const metrics = await getVendorDashboard();

    return res.status(200).json({
      success: true,
      message: "Vendor dashboard metrics fetched successfully",
      data: metrics,
    });
  } catch (error) {
    console.error("Get Vendor Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

