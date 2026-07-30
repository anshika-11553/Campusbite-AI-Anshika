import express from "express";
import { placeOrderController } from "../controllers/order.controller.js";
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

export default router;
