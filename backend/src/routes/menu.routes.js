import express from "express";
import { getMenu, searchMenu } from "../controllers/menu.controller.js";

const router = express.Router();

// GET /api/menu/search?q=
router.get("/search", searchMenu);

// GET /api/menu?category=
router.get("/", getMenu);

export default router;
