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



