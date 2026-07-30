import supabase from "../config/supabase.js";
import { ROLES } from "../constants/roles.js";

// ==========================
// Create User
// ==========================
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from("users")
    .insert(userData)
    .select()
    .single();

  if (error) throw error;

  return data;
};

// ==========================
// Create CampusBite User
// ==========================
export const createCampusUser = async ({
  auth_user_id,
  full_name,
  email,
}) => {
  return await createUser({
    auth_user_id,
    role_id: process.env.STUDENT_ROLE_ID || ROLES.STUDENT,
    full_name,
    email,
  });
};

// ==========================
// Get User By Campus ID
// ==========================
export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      *,
      roles(name)
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

// ==========================
// Get User By Auth ID
// ==========================
export const getUserByAuthId = async (authUserId) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      *,
      roles(name)
      `
    )
    .eq("auth_user_id", authUserId)
    .single();

  if (error) throw error;

  return data;
};
