import express from "express";
import {
  getVendorOrdersController,
  getVendorDashboardController,
} from "../controllers/vendor.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// ==========================
// Get Vendor Active Orders
// ==========================
router.get(
  "/orders",
  authenticateUser,
  authorizeRoles(ROLES.VENDOR, ROLES.ADMIN),
  getVendorOrdersController
);

// ==========================
// Get Vendor Dashboard Metrics
// ==========================
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles(ROLES.VENDOR, ROLES.ADMIN),
  getVendorDashboardController
);

export default router;

