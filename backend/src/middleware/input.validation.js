// ==========================================
// Input Validation & Sanitization Middleware
// ==========================================

export const validateOrderPayload = (req, res, next) => {
  const { items } = req.body || {};

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Order items array is required and cannot be empty",
      errorCode: "INVALID_ORDER_ITEMS",
      timestamp: new Date().toISOString(),
    });
  }

  for (const item of items) {
    if (!item.menu_item_id && !item.id) {
      return res.status(400).json({
        success: false,
        message: "Each order item must specify a valid menu_item_id",
        errorCode: "MISSING_MENU_ITEM_ID",
        timestamp: new Date().toISOString(),
      });
    }

    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order item quantity must be a positive integer greater than 0",
        errorCode: "INVALID_QUANTITY",
        timestamp: new Date().toISOString(),
      });
    }
  }

  next();
};

export const validateOrderStatusPayload = (req, res, next) => {
  const { status } = req.body || {};
  const VALID_STATUSES = [
    "PLACED",
    "PENDING_PAYMENT",
    "PAID",
    "ACCEPTED",
    "IN_KITCHEN",
    "PREPARING",
    "READY",
    "COLLECTED",
    "COMPLETED",
    "CANCELLED",
  ];

  if (!status || typeof status !== "string" || !VALID_STATUSES.includes(status.trim())) {
    return res.status(400).json({
      success: false,
      message: `Invalid order status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      errorCode: "INVALID_STATUS",
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

export const validatePinVerificationPayload = (req, res, next) => {
  const { pin } = req.body || {};

  if (!pin || typeof pin !== "string" || pin.trim().length !== 6 || !/^\d{6}$/.test(pin.trim())) {
    return res.status(400).json({
      success: false,
      message: "Pickup PIN must be a valid 6-digit numeric string",
      errorCode: "INVALID_PICKUP_PIN",
      timestamp: new Date().toISOString(),
    });
  }

  next();
};
