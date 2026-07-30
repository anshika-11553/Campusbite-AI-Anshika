import express from "express";
import { getMenu } from "../controllers/menu.controller.js";

const router = express.Router();

// GET /api/menu
router.get("/", getMenu);

export default router;
