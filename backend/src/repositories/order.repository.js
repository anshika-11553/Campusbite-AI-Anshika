import supabase from "../config/supabase.js";

// ==========================
// Get Menu Items By IDs
// ==========================
export const getMenuItemsByIds = async (menuItemIds) => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .in("id", menuItemIds);

  if (error) {
    throw error;
  }

  return data;
};

// ==========================
// Get Today's Last Token
// ==========================
export const getTodayLastToken = async (today) => {
  const { data, error } = await supabase
    .from("daily_tokens")
    .select("*")
    .eq("token_date", today)
    .order("token_number", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  return data.length ? data[0] : null;
};

// ==========================
// Create Daily Token
// ==========================
export const createDailyToken = async (tokenData) => {
  const { data, error } = await supabase
    .from("daily_tokens")
    .insert([tokenData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// ==========================
// Create Order
// ==========================
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// ==========================
// Create Order Items
// ==========================
export const createOrderItems = async (orderItems) => {
  const { data, error } = await supabase
    .from("order_items")
    .insert(orderItems)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

// ==========================
// Get Order By ID
// ==========================
export const getOrderById = async (orderId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      daily_tokens(
        token_number,
        token_date
      ),
      order_items(
        quantity,
        unit_price,
        subtotal,
        menu_items(
          id,
          name,
          category,
          prep_time,
          image_url
        )
      )
      `,
    )
    .eq("id", orderId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data;
};

// ==========================
// Get Orders By User
// ==========================
export const getOrdersByUser = async (userId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      daily_tokens(
        token_number,
        token_date
      )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

// ==========================
// Get Active Vendor Orders
// ==========================
export const getActiveVendorOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      users(
        full_name,
        email
      ),
      daily_tokens(
        token_number,
        token_date
      ),
      order_items(
        quantity,
        unit_price,
        subtotal,
        menu_items(
          id,
          name,
          category,
          prep_time
        )
      )
      `,
    )
    .not("status", "in", '("COMPLETED","CANCELLED")')
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

// ==========================
// Update Order Status
// ==========================
export const updateOrderStatus = async (orderId, newStatus) => {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// ==========================
// Get Vendor Dashboard Data
// ==========================
export const getVendorDashboardData = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at");

  if (error) {
    throw error;
  }

  let pending_orders = 0;
  let preparing_orders = 0;
  let ready_orders = 0;
  let completed_orders = 0;
  let cancelled_orders = 0;
  let today_orders = 0;
  let today_revenue = 0;

  (orders || []).forEach((order) => {
    const isToday = new Date(order.created_at) >= todayStart;

    if (order.status === "PENDING_PAYMENT" || order.status === "PAID") {
      pending_orders++;
    } else if (order.status === "ACCEPTED" || order.status === "PREPARING") {
      preparing_orders++;
    } else if (order.status === "READY") {
      ready_orders++;
    } else if (order.status === "COMPLETED") {
      completed_orders++;
    } else if (order.status === "CANCELLED") {
      cancelled_orders++;
    }

    if (isToday) {
      today_orders++;
      if (order.status !== "CANCELLED") {
        today_revenue += Number(order.total_amount || 0);
      }
    }
  });

  return {
    pending_orders,
    preparing_orders,
    ready_orders,
    completed_orders,
    cancelled_orders,
    today_orders,
    today_revenue: Number(today_revenue.toFixed(2)),
  };
};

// ==========================
// Get Popular Menu Items Data
// ==========================
export const getPopularMenuItemsData = async () => {
  const { data: orderItems, error } = await supabase
    .from("order_items")
    .select(
      `
      quantity,
      menu_items(
        id,
        name,
        category
      )
      `
    );

  if (error) {
    throw error;
  }

  const itemsMap = {};

  (orderItems || []).forEach((item) => {
    const menuItem = item.menu_items;
    if (!menuItem) return;

    const id = menuItem.id;
    if (!itemsMap[id]) {
      itemsMap[id] = {
        menu_item_id: id,
        menu_name: menuItem.name,
        category: menuItem.category,
        total_orders: 0,
      };
    }

    itemsMap[id].total_orders += item.quantity || 1;
  });

  const popularItems = Object.values(itemsMap);

  popularItems.sort((a, b) => b.total_orders - a.total_orders);

  return popularItems;
};

// ==========================
// Get Vendor Queue Data
// ==========================
export const getVendorQueueData = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total_amount,
      estimated_wait_minutes,
      created_at,
      users(
        full_name
      ),
      daily_tokens(
        token_number
      )
      `
    )
    .not("status", "in", '("COMPLETED","CANCELLED")')
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

// ==========================
// Get Vendor Analytics Data
// ==========================
export const getVendorAnalyticsData = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total_amount,
      estimated_wait_minutes,
      created_at,
      order_items(
        quantity,
        menu_items(
          name,
          prep_time
        )
      )
      `
    );

  if (error) {
    throw error;
  }

  let total_orders = (orders || []).length;
  let today_completed_orders = 0;
  let today_revenue = 0;
  let total_wait_time = 0;
  let total_prep_time = 0;
  let prep_time_count = 0;

  const hourCounts = {};
  const itemCounts = {};

  (orders || []).forEach((order) => {
    const isToday = new Date(order.created_at) >= todayStart;

    if (isToday) {
      if (order.status === "COMPLETED") {
        today_completed_orders++;
      }
      if (order.status !== "CANCELLED") {
        today_revenue += Number(order.total_amount || 0);
      }
    }

    if (order.estimated_wait_minutes) {
      total_wait_time += Number(order.estimated_wait_minutes);
    }

    const hour = new Date(order.created_at).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;

    (order.order_items || []).forEach((item) => {
      const name = item.menu_items?.name;
      if (name) {
        itemCounts[name] = (itemCounts[name] || 0) + (item.quantity || 1);
      }
      if (item.menu_items?.prep_time) {
        total_prep_time += item.menu_items.prep_time;
        prep_time_count++;
      }
    });
  });

  let peak_hour = "N/A";
  let maxHourCount = 0;
  Object.keys(hourCounts).forEach((hourStr) => {
    if (hourCounts[hourStr] > maxHourCount) {
      maxHourCount = hourCounts[hourStr];
      const h = parseInt(hourStr, 10);
      const ampm = h >= 12 ? "PM" : "AM";
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      peak_hour = `${displayHour}:00 ${ampm}`;
    }
  });

  let most_popular_item = "N/A";
  let maxItemCount = 0;
  Object.keys(itemCounts).forEach((itemName) => {
    if (itemCounts[itemName] > maxItemCount) {
      maxItemCount = itemCounts[itemName];
      most_popular_item = itemName;
    }
  });

  const average_wait_time =
    total_orders > 0 ? Math.round(total_wait_time / total_orders) : 0;
  const average_preparation_time =
    prep_time_count > 0 ? Math.round(total_prep_time / prep_time_count) : 0;

  return {
    today_revenue: Number(today_revenue.toFixed(2)),
    today_completed_orders,
    total_orders,
    average_wait_time,
    average_preparation_time,
    most_popular_item,
    peak_hour,
  };
};






