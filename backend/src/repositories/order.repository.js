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
          image_url
        )
      )
      `,
    )
    .eq("id", orderId)
    .single();

  if (error) {
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
