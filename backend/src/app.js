import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import orderRoutes from "./routes/order.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";

const app = express();

// ==========================
// Middleware
// ==========================
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// Root Route
// ==========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to CampusBite API",
    version: "v1",
  });
});

// ==========================
// Health Check
// ==========================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusBite Backend Running",
  });
});

// ==========================
// Authentication Routes
// ==========================
app.use("/api/auth", authRoutes);

// ==========================
// Menu Routes
// ==========================
app.use("/api/menu", menuRoutes);

// ==========================
// Order Routes
// ==========================
app.use("/api/orders", orderRoutes);

// ==========================
// Vendor Routes
// ==========================
app.use("/api/vendor", vendorRoutes);


// ==========================
// 404 Handler
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;

