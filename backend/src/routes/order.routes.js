import express from "express";
import {
  placeOrderController,
  getUserOrdersController,
  getOrderDetailsController,
  updateOrderStatusController,
  verifyPickupPinController,
  regeneratePickupPinController,
  getPickupPinController,
} from "../controllers/order.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// ==========================
// Place Order
// ==========================
router.post(
  "/",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT, ROLES.VENDOR, ROLES.CHEF, ROLES.ADMIN),
  placeOrderController
);

// ==========================
// Get Student Order History
// ==========================
router.get(
  "/",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT, ROLES.VENDOR, ROLES.CHEF, ROLES.ADMIN),
  getUserOrdersController
);

// ==========================
// Get Student Order Details
// ==========================
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT, ROLES.VENDOR, ROLES.CHEF, ROLES.ADMIN),
  getOrderDetailsController
);

// ==========================
// Update Order Status
// ==========================
router.patch(
  "/:id/status",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT, ROLES.VENDOR, ROLES.CHEF, ROLES.ADMIN),
  updateOrderStatusController
);

// ==========================
// CampusSecure Pickup Verification Routes
// ==========================
router.post(
  "/:id/verify-pickup-pin",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT, ROLES.VENDOR, ROLES.CHEF, ROLES.ADMIN),
  verifyPickupPinController
);

router.post(
  "/:id/regenerate-pickup-pin",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT, ROLES.VENDOR, ROLES.CHEF, ROLES.ADMIN),
  regeneratePickupPinController
);

router.get(
  "/:id/pickup-pin",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT, ROLES.VENDOR, ROLES.CHEF, ROLES.ADMIN),
  getPickupPinController
);

export default router;



