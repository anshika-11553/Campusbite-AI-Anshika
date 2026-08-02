import {
  getCampusIntelligenceService,
  processChatbotQueryService,
  calculatePickupPredictionService,
  calculateSlotOptimizationService,
  calculateVendorForecastService,
  calculateStallRecommendationService,
  calculateAdminOperationsBrainService,
  calculateArrivalPredictionService,
} from "../services/analytics.service.js";

// ==========================================
// Get Campus Intelligence Data Controller
// ==========================================
export const getCampusIntelligenceController = async (req, res) => {
  try {
    const stallId = req.query.stallId || null;
    const intelligence = await getCampusIntelligenceService(stallId);
    return res.status(200).json({
      success: true,
      message: "Campus intelligence metrics calculated successfully",
      data: intelligence,
    });
  } catch (error) {
    console.error("Get Campus Intelligence Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate campus intelligence",
    });
  }
};

// ==========================================
// Process Role-Based Chatbot Query Controller
// ==========================================
export const processChatbotQueryController = async (req, res) => {
  try {
    const { query, roleId } = req.body;
    const answer = await processChatbotQueryService(
      query || "",
      roleId || req.user?.role_id
    );

    return res.status(200).json({
      success: true,
      message: "Chatbot query processed successfully",
      data: {
        answer,
        query,
      },
    });
  } catch (error) {
    console.error("Chatbot Query Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process chatbot query",
    });
  }
};

// ==========================================
// Predict Smart Pickup Time Controller
// ==========================================
export const predictPickupController = async (req, res) => {
  try {
    const { items, orderId } = req.body;
    const prediction = await calculatePickupPredictionService(items || [], orderId || null);

    return res.status(200).json({
      success: true,
      message: "Smart pickup prediction calculated successfully",
      data: prediction,
    });
  } catch (error) {
    console.error("Predict Pickup Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate pickup prediction",
    });
  }
};

// ==========================================
// Calculate AI Slot Optimization Controller
// ==========================================
export const calculateSlotOptimizationController = async (req, res) => {
  try {
    const { date } = req.body || {};
    const optimization = await calculateSlotOptimizationService(date || null);

    return res.status(200).json({
      success: true,
      message: "AI slot optimization calculated successfully",
      data: optimization,
    });
  } catch (error) {
    console.error("Slot Optimization Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate slot optimization",
    });
  }
};

// ==========================================
// Calculate AI Kitchen Demand Forecast Controller
// ==========================================
export const calculateVendorForecastController = async (req, res) => {
  try {
    const { vendorId } = req.body || {};
    const forecast = await calculateVendorForecastService(vendorId || "stall-a");

    return res.status(200).json({
      success: true,
      message: "AI kitchen demand forecast calculated successfully",
      data: forecast,
    });
  } catch (error) {
    console.error("Vendor Forecast Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate vendor demand forecast",
    });
  }
};

// ==========================================
// Calculate AI Stall Recommendation Controller
// ==========================================
export const calculateStallRecommendationController = async (req, res) => {
  try {
    const { selectedStallId, menuItemId } = req.body || {};
    const userId = req.user?.id || null;
    const rec = await calculateStallRecommendationService(selectedStallId || "stall-a", menuItemId || null, userId);

    return res.status(200).json({
      success: true,
      message: "AI stall recommendation calculated successfully",
      data: rec,
    });
  } catch (error) {
    console.error("Stall Recommendation Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate stall recommendation",
    });
  }
};

// ==========================================
// Calculate AI Campus Operations Brain Controller
// ==========================================
export const calculateAdminOperationsBrainController = async (req, res) => {
  try {
    const report = await calculateAdminOperationsBrainService();
    return res.status(200).json({
      success: true,
      message: "AI Campus Operations Brain calculated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Admin Brain Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate AI Campus Operations Brain",
    });
  }
};

// ==========================================
// Calculate AI Arrival Assistant Controller
// ==========================================
export const calculateArrivalPredictionController = async (req, res) => {
  try {
    const { orderId, stallId } = req.body || {};
    const userId = req.user?.id || null;
    const arrival = await calculateArrivalPredictionService(orderId || null, stallId || "stall-a", userId);

    return res.status(200).json({
      success: true,
      message: "AI arrival assistant prediction calculated successfully",
      data: arrival,
    });
  } catch (error) {
    console.error("Arrival Assistant Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate AI arrival assistant prediction",
    });
  }
};
