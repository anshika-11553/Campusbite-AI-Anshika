import {
  getVendorOrders,
  getVendorDashboard,
  getPopularItems,
  getVendorQueue,
  getVendorAnalytics,
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

// ==========================
// Get Popular Items Controller
// ==========================
export const getPopularItemsController = async (req, res) => {
  try {
    const items = await getPopularItems();

    return res.status(200).json({
      success: true,
      message: "Popular items fetched successfully",
      data: items,
    });
  } catch (error) {
    console.error("Get Popular Items Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Vendor Queue Controller
// ==========================
export const getVendorQueueController = async (req, res) => {
  try {
    const queue = await getVendorQueue();

    return res.status(200).json({
      success: true,
      message: "Vendor queue fetched successfully",
      data: queue,
    });
  } catch (error) {
    console.error("Get Vendor Queue Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Vendor Analytics Controller
// ==========================
export const getVendorAnalyticsController = async (req, res) => {
  try {
    const analytics = await getVendorAnalytics();

    return res.status(200).json({
      success: true,
      message: "Vendor analytics fetched successfully",
      data: analytics,
    });
  } catch (error) {
    console.error("Get Vendor Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




