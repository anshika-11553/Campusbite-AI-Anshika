import express from "express";
import {
  createRazorpayOrderController,
  verifyRazorpayPaymentController,
} from "../controllers/payment.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// ==========================
// Create Razorpay Order
// ==========================
router.post(
  "/create-order",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT),
  createRazorpayOrderController
);

// ==========================
// Verify Razorpay Payment Signature
// ==========================
router.post(
  "/verify",
  authenticateUser,
  authorizeRoles(ROLES.STUDENT),
  verifyRazorpayPaymentController
);

export default router;
