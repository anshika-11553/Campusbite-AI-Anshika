import express from "express";
import {
  placeOrderController,
  getStudentOrderHistoryController,
  getStudentOrderDetailsController,
  updateOrderStatusController,
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
  authorizeRoles(ROLES.STUDENT),
  placeOrderController
);

// ==========================
// Get Student Order History
// ==========================
router.get(
  "/",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT),
  getStudentOrderHistoryController
);

// ==========================
// Get Student Order Details
// ==========================
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT),
  getStudentOrderDetailsController
);

// ==========================
// Update Order Status
// ==========================
router.patch(
  "/:id/status",
  authenticateUser,
  authorizeRoles(ROLES.VENDOR, ROLES.ADMIN),
  updateOrderStatusController
);

export default router;



