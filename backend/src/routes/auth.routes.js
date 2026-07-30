import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Register User
router.post("/register", registerController);

// Login User
router.post("/login", loginController);

export default router;
