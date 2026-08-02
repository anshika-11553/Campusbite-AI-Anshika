import express from "express";
import {
  getVendorOrdersController,
  getVendorDashboardController,
  getPopularItemsController,
  getVendorQueueController,
  getVendorAnalyticsController,
} from "../controllers/vendor.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// ==========================
// Get Vendor Active Orders (Vendor, Chef, Admin)
// ==========================
router.get(
  "/orders",
  authenticateUser,
  authorizeRoles(ROLES.VENDOR, ROLES.CHEF, ROLES.ADMIN),
  getVendorOrdersController
);

// ==========================
// Get Vendor Dashboard Metrics (Vendor, Admin)
// ==========================
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles(ROLES.VENDOR, ROLES.ADMIN),
  getVendorDashboardController
);

// ==========================
// Get Popular Items (Vendor, Admin)
// ==========================
router.get(
  "/popular-items",
  authenticateUser,
  authorizeRoles(ROLES.VENDOR, ROLES.ADMIN),
  getPopularItemsController
);

// ==========================
// Get Vendor Live Queue (Vendor, Chef, Admin)
// ==========================
router.get(
  "/queue",
  authenticateUser,
  authorizeRoles(ROLES.VENDOR, ROLES.CHEF, ROLES.ADMIN),
  getVendorQueueController
);

// ==========================
// Get Vendor Analytics (Vendor, Admin)
// ==========================
router.get(
  "/analytics",
  authenticateUser,
  authorizeRoles(ROLES.VENDOR, ROLES.ADMIN),
  getVendorAnalyticsController
);

export default router;




