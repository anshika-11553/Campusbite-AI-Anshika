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
