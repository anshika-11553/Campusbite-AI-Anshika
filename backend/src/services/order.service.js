import {
  getMenuItemsByIds,
  getTodayLastToken,
  createDailyToken,
  createOrder,
  createOrderItems,
  getOrdersByUser,
  getOrderById,
  getActiveVendorOrders,
  updateOrderStatus,
  getVendorDashboardData,
  getPopularMenuItemsData,
  getVendorQueueData,
  getVendorAnalyticsData,
  createPickupPinData,
  getPickupPinData,
  updatePickupPinData,
  logOrderEventData,
} from "../repositories/order.repository.js";
import { ROLES } from "../constants/roles.js";
import { calculatePickupPredictionService } from "./analytics.service.js";
import { updateArrivalAccuracy } from "../repositories/analytics.repository.js";

// ==========================
// Validate Order Items
// ==========================
const validateItems = (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  items.forEach((item) => {
    if (!item.menu_item_id) {
      throw new Error("Menu Item ID is required");
    }

    if (!item.quantity) {
      throw new Error("Quantity is required");
    }

    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
  });
};

// ==========================
// Merge Duplicate Menu Items
// ==========================
const mergeDuplicateItems = (items) => {
  const merged = {};

  items.forEach((item) => {
    if (merged[item.menu_item_id]) {
      merged[item.menu_item_id].quantity += item.quantity;
    } else {
      merged[item.menu_item_id] = {
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
      };
    }
  });

  return Object.values(merged);
};

// ==========================
// Generate Daily Token
// ==========================
const generateDailyToken = async () => {
  const today = new Date().toISOString().split("T")[0];

  let retries = 3;

  while (retries > 0) {
    try {
      const lastToken = await getTodayLastToken(today);

      const nextToken = lastToken ? lastToken.token_number + 1 : 1;

      if (nextToken > 999) {
        throw new Error("Maximum daily token limit reached");
      }

      const token = await createDailyToken({
        token_date: today,
        token_number: nextToken,
      });

      return token;
    } catch (error) {
      // Retry only if duplicate token is generated
      if (error.code === "23505") {
        retries--;
        continue;
      }

      throw error;
    }
  }

  throw new Error("Unable to generate token. Please try again.");
};

// ==========================
// Estimate Waiting Time
// ==========================
const estimateWaitTime = async (items) => {
  let totalPrepTime = 0;

  items.forEach((item) => {
    totalPrepTime += (item.prep_time || 5) * item.quantity;
  });

  try {
    const activeOrders = await getVendorQueueData();
    const queueBuffer = (activeOrders || []).length * 2;
    return Math.max(15, totalPrepTime + queueBuffer);
  } catch (error) {
    return Math.max(15, totalPrepTime);
  }
};

// ==========================
// Place Order Service
// ==========================
export const placeOrder = async (userId, items) => {
  // ==========================
  // Validate Input
  // ==========================
  validateItems(items);

  // ==========================
  // Merge Duplicate Items
  // ==========================
  const mergedItems = mergeDuplicateItems(items);

  // ==========================
  // Fetch Menu Items
  // ==========================
  const menuItems = await getMenuItemsByIds(
    mergedItems.map((item) => item.menu_item_id),
  );

  if (menuItems.length !== mergedItems.length) {
    throw new Error("One or more menu items do not exist");
  }

  // ==========================
  // Calculate Total Amount
  // ==========================
  let totalAmount = 0;

  const orderItems = [];

  mergedItems.forEach((item) => {
    const menu = menuItems.find(
      (menuItem) => menuItem.id === item.menu_item_id,
    );

    if (!menu) {
      throw new Error("Menu item not found");
    }

    if (!menu.is_available) {
      throw new Error(`${menu.name} is currently unavailable`);
    }

    const subtotal = Number(
  (Number(menu.price) * Number(item.quantity)).toFixed(2)
);

totalAmount = Number((totalAmount + subtotal).toFixed(2));
    orderItems.push({
  menu_item_id: menu.id,
  menu_name: menu.name,
  category: menu.category,
  quantity: item.quantity,
  unit_price: Number(menu.price),
  subtotal,
  prep_time: menu.prep_time,
});
  });

  // ==========================
  // Generate Token
  // ==========================
  const token = await generateDailyToken();

  // ==========================
  // Estimate Waiting Time
  // ==========================
  const estimatedWaitMinutes = await estimateWaitTime(orderItems);

  // ==========================
  // Create Order
  // ==========================
  const order = await createOrder({
    user_id: userId,
    token_id: token.id,
    total_amount: totalAmount,
    estimated_wait_minutes: estimatedWaitMinutes,
  });

  // ==========================
  // Prepare Order Items
  // ==========================
  const orderItemsToInsert = orderItems.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal,
  }));

  // ==========================
  // Save Order Items
  // ==========================
  await createOrderItems(orderItemsToInsert);

  // Helper for formatted token code (e.g. CB001)
  const tokenCode = `CB${String(token.token_number).padStart(3, "0")}`;

  // Calculate initial queue position
  const activeQueue = await getVendorQueueData();
  const queuePosition = activeQueue.length ? activeQueue.length : 1;

  // ==========================
  // Calculate AI Smart Pickup Prediction
  // ==========================
  let prediction = null;
  try {
    prediction = await calculatePickupPredictionService(orderItems, order.id);
  } catch (err) {
    console.log("Pickup Prediction calculation notice:", err.message);
  }

  // ==========================
  // Return Response
  // ==========================
  return {
    id: order.id,
    order_id: order.id,
    token_number: token.token_number,
    token_code: tokenCode,
    queue_position: queuePosition,
    total_amount: totalAmount,
    estimated_wait_minutes: prediction ? prediction.predicted_wait_minutes : estimatedWaitMinutes,
    predicted_ready_time: prediction ? prediction.predicted_ready_time : null,
    recommended_pickup_time: prediction ? prediction.recommended_pickup_time : null,
    prediction,
    status: order.status,
    created_at: order.created_at,
    items: orderItems,
  };
};

// Helper function to format token codes
const formatTokenCode = (tokenNumber) => {
  if (tokenNumber === null || tokenNumber === undefined) return null;
  return `CB${String(tokenNumber).padStart(3, "0")}`;
};

// ==========================
// Get Student Order History Service
// ==========================
export const getStudentOrderHistory = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const [orders, activeQueue] = await Promise.all([
    getOrdersByUser(userId),
    getVendorQueueData().catch(() => []),
  ]);

  return orders.map((order) => {
    const tokenNum = order.daily_tokens ? order.daily_tokens.token_number : null;
    const tokenCode = formatTokenCode(tokenNum);

    // Calculate queue position if active
    let queuePosition = null;
    if (["PAID", "ACCEPTED", "PREPARING"].includes(order.status)) {
      const idx = activeQueue.findIndex((o) => o.id === order.id);
      queuePosition = idx !== -1 ? idx + 1 : 1;
    } else if (order.status === "READY") {
      queuePosition = 0;
    }

    return {
      id: order.id,
      order_id: order.id,
      token_number: tokenNum,
      token_code: tokenCode,
      queue_position: queuePosition,
      status: order.status,
      total_amount: Number(order.total_amount),
      created_at: order.created_at,
      estimated_wait_minutes: order.estimated_wait_minutes,
    };
  });
};

// ==========================
// Get Student Order Details Service
// ==========================
export const getStudentOrderDetails = async (orderId, userId) => {
  if (!orderId) {
    const error = new Error("Order ID is required");
    error.statusCode = 400;
    throw error;
  }

  const [order, activeQueue] = await Promise.all([
    getOrderById(orderId),
    getVendorQueueData().catch(() => []),
  ]);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.user_id !== userId) {
    const error = new Error("Access denied to this order");
    error.statusCode = 403;
    throw error;
  }

  const tokenNum = order.daily_tokens ? order.daily_tokens.token_number : null;
  const tokenCode = formatTokenCode(tokenNum);

  let queuePosition = null;
  if (["PAID", "ACCEPTED", "PREPARING"].includes(order.status)) {
    const idx = activeQueue.findIndex((o) => o.id === order.id);
    queuePosition = idx !== -1 ? idx + 1 : 1;
  } else if (order.status === "READY") {
    queuePosition = 0;
  }

  const items = (order.order_items || []).map((item) => ({
    menu_item_id: item.menu_items?.id || null,
    menu_name: item.menu_items?.name || "Unknown Item",
    category: item.menu_items?.category || null,
    quantity: item.quantity,
    unit_price: Number(item.unit_price),
    subtotal: Number(item.subtotal),
    estimated_prep_time: item.menu_items?.prep_time || 0,
  }));

  return {
    order_id: order.id,
    token_number: tokenNum,
    token_code: tokenCode,
    queue_position: queuePosition,
    status: order.status,
    total_amount: Number(order.total_amount),
    estimated_wait_minutes: order.estimated_wait_minutes,
    created_at: order.created_at,
    items,
  };
};

// ==========================
// Get Vendor Active Orders Service
// ==========================
export const getVendorOrders = async () => {
  const orders = await getActiveVendorOrders();

  // Task 1: Exclude unpaid PENDING_PAYMENT / PLACED orders from Vendor/Chef active queues
  const paidOrders = (orders || []).filter(
    (o) => !["PENDING_PAYMENT", "PLACED"].includes(o.status)
  );

  // Task 3: Sort created_at DESC (Newest orders always first)
  paidOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return paidOrders.map((order, index) => {
    const tokenNum = order.daily_tokens ? order.daily_tokens.token_number : null;
    return {
      id: order.id,
      order_id: order.id,
      token_number: tokenNum,
      token_code: formatTokenCode(tokenNum),
      queue_position: index + 1,
      student_name: order.users?.full_name || "Unknown Student",
      student_email: order.users?.email || "Unknown Email",
      total_amount: Number(order.total_amount),
      estimated_wait_minutes: order.estimated_wait_minutes,
      status: order.status,
      created_at: order.created_at,
      items: (order.order_items || []).map((item) => ({
        menu_item_id: item.menu_items?.id || null,
        menu_name: item.menu_items?.name || "Unknown Item",
        category: item.menu_items?.category || null,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        subtotal: Number(item.subtotal),
        prep_time: item.menu_items?.prep_time || 0,
      })),
    };
  });
};

// ==========================
// Update Order Status Service
// ==========================
export const updateOrderStatusService = async (
  orderId,
  newStatus,
  userRoleId = null,
  userId = null,
  paymentMethod = null
) => {
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

  if (
    !newStatus ||
    typeof newStatus !== "string" ||
    !VALID_STATUSES.includes(newStatus)
  ) {
    const error = new Error(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  const order = await getOrderById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  // Authorization Checks
  if (userRoleId === ROLES.STUDENT) {
    if (userId && order.user_id !== userId) {
      const error = new Error("Forbidden: You can only update your own order status");
      error.statusCode = 403;
      throw error;
    }
    if (!["PAID", "PENDING_PAYMENT", "PLACED"].includes(newStatus)) {
      const error = new Error("Forbidden: Students are only allowed to update payment status");
      error.statusCode = 403;
      throw error;
    }
  }

  if (userRoleId === ROLES.CHEF && newStatus === "CANCELLED") {
    const error = new Error("Chef is not authorized to cancel orders");
    error.statusCode = 403;
    throw error;
  }

  // Idempotent status check
  if (order.status === newStatus) {
    return {
      id: order.id,
      order_id: order.id,
      old_status: order.status,
      new_status: order.status,
      status: order.status,
      updated_at: order.updated_at || new Date().toISOString(),
    };
  }

  const ALLOWED_TRANSITIONS = {
    PLACED: ["PAID", "ACCEPTED", "IN_KITCHEN", "PREPARING", "READY", "COLLECTED", "COMPLETED", "CANCELLED"],
    PENDING_PAYMENT: ["PAID", "ACCEPTED", "IN_KITCHEN", "PREPARING", "READY", "COLLECTED", "COMPLETED", "CANCELLED"],
    PAID: ["ACCEPTED", "IN_KITCHEN", "PREPARING", "READY", "COLLECTED", "COMPLETED", "CANCELLED"],
    ACCEPTED: ["IN_KITCHEN", "PREPARING", "READY", "COLLECTED", "COMPLETED", "CANCELLED"],
    IN_KITCHEN: ["PREPARING", "READY", "COLLECTED", "COMPLETED", "CANCELLED"],
    PREPARING: ["READY", "COLLECTED", "COMPLETED", "CANCELLED"],
    READY: ["COLLECTED", "COMPLETED", "CANCELLED"],
    COLLECTED: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
  };

  const allowedNext = ALLOWED_TRANSITIONS[order.status] || [];

  if (!allowedNext.includes(newStatus)) {
    console.log(`Status transition warning: Attempted '${order.status}' -> '${newStatus}' for order ${orderId}`);
  }

  const updatedOrder = await updateOrderStatus(orderId, newStatus);

  logOrderEventData(updatedOrder.id, `ORDER_${newStatus}`, userId || null, userRoleId || "VENDOR");

  if (newStatus === "READY") {
    updateArrivalAccuracy(updatedOrder.id);
    
    // Generate unique 6-digit numeric PIN
    const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
    await createPickupPinData(updatedOrder.id, generatedPin);
    logOrderEventData(updatedOrder.id, "PIN_GENERATED", userId || null, "SYSTEM", { pin: generatedPin });
  }

  return {
    id: updatedOrder.id,
    order_id: updatedOrder.id,
    old_status: order.status,
    new_status: updatedOrder.status,
    status: updatedOrder.status,
    updated_at: updatedOrder.updated_at || new Date().toISOString(),
  };
};

// ==========================
// CampusSecure Pickup PIN Verification Service
// ==========================
export const verifyPickupPinService = async (orderId, inputPin, vendorId = null) => {
  const pinRecord = await getPickupPinData(orderId);
  if (!pinRecord) {
    throw new Error("No active pickup PIN found for this order. Please ask Vendor to generate PIN.");
  }

  if (pinRecord.is_verified) {
    return { success: true, message: "Order PIN already verified.", is_verified: true };
  }

  if (pinRecord.verification_attempts >= 5) {
    logOrderEventData(orderId, "PIN_VERIFICATION_LOCKED", vendorId, "VENDOR", { attempts: pinRecord.verification_attempts });
    throw new Error("Verification locked due to 5 failed attempts. Please wait 5 minutes or regenerate PIN.");
  }

  const now = new Date();
  if (now > new Date(pinRecord.expires_at)) {
    await updatePickupPinData(pinRecord.id, { status: "EXPIRED" });
    logOrderEventData(orderId, "PIN_EXPIRED", vendorId, "SYSTEM");
    throw new Error("Pickup PIN has expired (20 minute limit). Please regenerate a new PIN.");
  }

  if (pinRecord.pickup_pin !== inputPin?.trim()) {
    const newAttempts = (pinRecord.verification_attempts || 0) + 1;
    await updatePickupPinData(pinRecord.id, { verification_attempts: newAttempts });
    logOrderEventData(orderId, "PIN_VERIFICATION_FAILED", vendorId, "VENDOR", { inputPin, attempts: newAttempts });
    
    const attemptsRemaining = 5 - newAttempts;
    const error = new Error(`Incorrect PIN. ${attemptsRemaining} attempt(s) remaining.`);
    error.statusCode = 400;
    throw error;
  }

  // PIN Verified successfully!
  await updatePickupPinData(pinRecord.id, {
    is_verified: true,
    verified_at: now.toISOString(),
    verified_by_vendor: vendorId || "vendor-counter",
    status: "VERIFIED",
  });

  try {
    await supabase.from("orders").update({ pin_verified: true }).eq("id", orderId);
  } catch (e) {}

  // Update order status to COLLECTED
  const updatedOrder = await updateOrderStatus(orderId, "COLLECTED");
  logOrderEventData(orderId, "PIN_VERIFIED", vendorId, "VENDOR", { pin: inputPin });
  logOrderEventData(orderId, "ORDER_COLLECTED", vendorId, "VENDOR");

  return {
    success: true,
    message: "Order PIN verified successfully! Order marked as Collected.",
    order: updatedOrder,
  };
};

// ==========================
// Regenerate Expired Pickup PIN Service
// ==========================
export const regeneratePickupPinService = async (orderId, vendorId = null) => {
  const existingRecord = await getPickupPinData(orderId);
  if (existingRecord) {
    await updatePickupPinData(existingRecord.id, { status: "REGENERATED" });
  }

  const newPin = Math.floor(100000 + Math.random() * 900000).toString();
  const newRecord = await createPickupPinData(orderId, newPin);
  logOrderEventData(orderId, "PIN_REGENERATED", vendorId, "VENDOR", { newPin });

  return newRecord;
};

// ==========================
// Get Active Pickup PIN Service
// ==========================
export const getPickupPinService = async (orderId) => {
  let pinRecord = await getPickupPinData(orderId);
  
  // Auto-generate fallback PIN if missing for READY order
  if (!pinRecord) {
    const order = await getOrderById(orderId);
    if (order && ["READY", "READY_FOR_PICKUP"].includes(order.status)) {
      const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
      pinRecord = await createPickupPinData(orderId, generatedPin);
    }
  }

  return pinRecord;
};

// ==========================
// Get Vendor Dashboard Service
// ==========================
export const getVendorDashboard = async () => {
  return await getVendorDashboardData();
};

// ==========================
// Get Popular Items Service
// ==========================
export const getPopularItems = async () => {
  return await getPopularMenuItemsData();
};

// ==========================
// Get Vendor Queue Service
// ==========================
export const getVendorQueue = async () => {
  const orders = await getVendorQueueData();

  // Sort by token_number ASC
  orders.sort((a, b) => {
    const tokenA = a.daily_tokens?.token_number ?? Infinity;
    const tokenB = b.daily_tokens?.token_number ?? Infinity;

    if (tokenA !== tokenB) {
      return tokenA - tokenB;
    }

    return new Date(a.created_at) - new Date(b.created_at);
  });

  return orders.map((order, index) => {
    const tokenNum = order.daily_tokens ? order.daily_tokens.token_number : null;
    return {
      order_id: order.id,
      token_number: tokenNum,
      token_code: formatTokenCode(tokenNum),
      queue_position: index + 1,
      status: order.status,
      estimated_wait_minutes: order.estimated_wait_minutes,
      created_at: order.created_at,
      customer_name: order.users?.full_name || "Unknown Customer",
      total_amount: Number(order.total_amount),
    };
  });
};

// ==========================
// Get Vendor Analytics Service
// ==========================
export const getVendorAnalytics = async () => {
  return await getVendorAnalyticsData();
};

// Aliases for controller compatibility
export const getOrderDetails = getStudentOrderDetails;
export const getUserOrders = getStudentOrderHistory;








