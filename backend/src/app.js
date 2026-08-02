import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import orderRoutes from "./routes/order.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// Disable x-powered-by header
app.disable("x-powered-by");

// ==========================
// Helmet Security Headers
// ==========================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    noSniff: true,
    xssFilter: true,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// ==========================
// CORS Configuration
// ==========================
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local dev testing
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==========================
// Compression & Parser Middleware
// ==========================
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ==========================
// Rate Limiters
// ==========================
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again after 1 minute.",
    errorCode: "TOO_MANY_REQUESTS",
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many payment requests, please try again after 1 minute.",
    errorCode: "TOO_MANY_REQUESTS",
    timestamp: new Date().toISOString(),
  },
});

const orderLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: "Rate limit exceeded for order APIs. Max 60 requests per minute.",
    errorCode: "TOO_MANY_REQUESTS",
    timestamp: new Date().toISOString(),
  },
});

const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: {
    success: false,
    message: "Rate limit exceeded for AI & analytics APIs. Max 120 requests per minute.",
    errorCode: "TOO_MANY_REQUESTS",
    timestamp: new Date().toISOString(),
  },
});

// ==========================
// Root Route & Health Check
// ==========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to CampusBite Secure Production API",
    version: "v1",
    status: "HEALTHY",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusBite Backend Running",
    timestamp: new Date().toISOString(),
  });
});

// ==========================
// Routes with Protection Rate Limiters
// ==========================
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderLimiter, orderRoutes);
app.use("/api/vendor", orderLimiter, vendorRoutes);
app.use("/api/payment", paymentLimiter, paymentRoutes);
app.use("/api/analytics", analyticsLimiter, analyticsRoutes);

// ==========================
// 404 Handler
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    errorCode: "NOT_FOUND",
    timestamp: new Date().toISOString(),
  });
});

// ==========================
// Global Centralized Error Handler
// ==========================
app.use((err, req, res, next) => {
  console.error("Unhandled Security Server Error:", err.message);

  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "An unexpected server error occurred." : err.message,
    errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
    timestamp: new Date().toISOString(),
  });
});

export default app;

