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
} from "../repositories/order.repository.js";
import { ROLES } from "../constants/roles.js";

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
  // Return Response
  // ==========================
  return {
    order_id: order.id,
    token_number: token.token_number,
    token_code: tokenCode,
    queue_position: queuePosition,
    total_amount: totalAmount,
    estimated_wait_minutes: estimatedWaitMinutes,
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

  // Sort by Token Number ASC, then Created Time ASC
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
  userRoleId = null
) => {
  const VALID_STATUSES = [
    "PENDING_PAYMENT",
    "PAID",
    "ACCEPTED",
    "PREPARING",
    "READY",
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

  if (userRoleId === ROLES.CHIEF && newStatus === "CANCELLED") {
    const error = new Error("Chef is not authorized to cancel orders");
    error.statusCode = 403;
    throw error;
  }

  const order = await getOrderById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const ALLOWED_TRANSITIONS = {
    PENDING_PAYMENT: ["PAID", "CANCELLED"],
    PAID: ["ACCEPTED", "CANCELLED"],
    ACCEPTED: ["PREPARING", "CANCELLED"],
    PREPARING: ["READY", "CANCELLED"],
    READY: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
  };

  const allowedNext = ALLOWED_TRANSITIONS[order.status] || [];

  if (!allowedNext.includes(newStatus)) {
    const error = new Error(
      `Cannot transition order status from '${order.status}' to '${newStatus}'`
    );
    error.statusCode = 400;
    throw error;
  }

  const updatedOrder = await updateOrderStatus(orderId, newStatus);


  return {
    order_id: updatedOrder.id,
    old_status: order.status,
    new_status: updatedOrder.status,
    updated_at: updatedOrder.updated_at || new Date().toISOString(),
  };
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








