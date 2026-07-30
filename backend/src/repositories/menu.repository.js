import supabase from "../config/supabase.js";

export const getAllMenuItems = async () => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

export const getMenuItems = async ({ category, q } = {}) => {
  let query = supabase.from("menu_items").select("*").eq("is_available", true);

  if (category) {
    query = query.ilike("category", `%${category}%`);
  }

  if (q) {
    query = query.or(`name.ilike.%${q}%,category.ilike.%${q}%`);
  }

  const { data, error } = await query.order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};
