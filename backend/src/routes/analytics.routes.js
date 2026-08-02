import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  getCampusIntelligenceController,
  processChatbotQueryController,
  predictPickupController,
  calculateSlotOptimizationController,
  calculateVendorForecastController,
  calculateStallRecommendationController,
  calculateAdminOperationsBrainController,
  calculateArrivalPredictionController,
} from "../controllers/analytics.controller.js";

const router = Router();

// ==========================================
// Get Campus Intelligence Metrics (Public / Authenticated)
// ==========================================
router.get("/intelligence", getCampusIntelligenceController);

// ==========================================
// Process Chatbot Query (Authenticated)
// ==========================================
router.post("/chatbot", authenticateUser, processChatbotQueryController);

// ==========================================
// Predict Smart Pickup Time (Public / Authenticated)
// ==========================================
router.post("/predict-pickup", predictPickupController);

// ==========================================
// AI Slot Optimization Engine (Public / Authenticated)
// ==========================================
router.post("/slot-optimization", calculateSlotOptimizationController);

// ==========================================
// AI Kitchen Demand Forecast Engine (Public / Authenticated)
// ==========================================
router.post("/vendor-forecast", calculateVendorForecastController);

// ==========================================
// AI Stall Recommendation Engine (Public / Authenticated)
// ==========================================
router.post("/stall-recommendation", calculateStallRecommendationController);

// ==========================================
// AI Campus Operations Brain Engine (Public / Authenticated)
// ==========================================
router.post("/admin-brain", calculateAdminOperationsBrainController);

// ==========================================
// AI Arrival Assistant Engine (Public / Authenticated)
// ==========================================
router.post("/arrival-prediction", calculateArrivalPredictionController);

export default router;
