import {
  getMenuItemsByIds,
  getTodayLastToken,
  createDailyToken,
  createOrder,
  createOrderItems,
} from "../repositories/order.repository.js";

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
const estimateWaitTime = (items) => {
  let totalPrepTime = 0;

  items.forEach((item) => {
    totalPrepTime += item.prep_time * item.quantity;
  });

  return Math.max(15, totalPrepTime);
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
  const estimatedWaitMinutes = estimateWaitTime(orderItems);

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

  // ==========================
  // Return Response
  // ==========================
  return {
  order_id: order.id,
  token_number: token.token_number,
  total_amount: totalAmount,
  estimated_wait_minutes: estimatedWaitMinutes,
  status: order.status,
  created_at: order.created_at,
  items: orderItems,
};
};
