import express from "express";
import {
  registerController,
  loginController,
  profileController,
} from "../controllers/auth.controller.js";

import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// ==========================
// Public Routes
// ==========================

// Register User
router.post("/register", registerController);

// Login User
router.post("/login", loginController);

// ==========================
// Protected Routes
// ==========================

// Get Logged-in User Profile (Student Only)
router.get(
  "/profile",
  authenticateUser,
  authorizeRoles("d9541cca-faee-4410-a83a-bf167661d247"),
  profileController
);

export default router;
