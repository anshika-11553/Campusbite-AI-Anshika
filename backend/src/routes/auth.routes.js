import express from "express";
import {
  registerController,
  loginController,
  profileController,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

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

// Get Logged-in User Profile
router.get("/profile", authenticateUser, profileController);

export default router;
