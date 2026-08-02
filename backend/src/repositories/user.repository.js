import supabase from "../config/supabase.js";
import { ROLES } from "../constants/roles.js";

// ======================================
// Create User
// ======================================
export const createUser = async (userData) => {
  console.log("========== CREATE USER ==========");
  console.log("Incoming Data:", userData);

  const { data, error } = await supabase
    .from("users")
    .insert(userData)
    .select()
    .single();

  if (error) {
    console.error("========== CREATE USER ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
    console.error(error);
    throw error;
  }

  console.log("========== USER CREATED ==========");
  console.log(data);

  return data;
};

// ======================================
// Create CampusBite User
// ======================================
export const createCampusUser = async ({
  auth_user_id,
  full_name,
  email,
  role_id,
}) => {
  console.log("========== CREATE CAMPUS USER ==========");
  console.log({
    auth_user_id,
    full_name,
    email,
    role_id,
  });

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", auth_user_id)
    .maybeSingle();

  if (existingUser) {
    console.log("User already exists in users table.");
    return existingUser;
  }

  let assignedRole = role_id;
  if (!assignedRole) {
    if (email?.includes("vendor")) assignedRole = ROLES.VENDOR;
    else if (email?.includes("chef")) assignedRole = ROLES.CHEF;
    else if (email?.includes("admin")) assignedRole = ROLES.ADMIN;
    else assignedRole = ROLES.STUDENT;
  }

  return await createUser({
    auth_user_id,
    role_id: assignedRole,
    full_name,
    email,
  });
};

// ======================================
// Get User By Campus ID
// ======================================
export const getUserById = async (id) => {
  console.log("========== GET USER BY ID ==========");
  console.log("ID:", id);

  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      roles(name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("========== GET USER BY ID ERROR ==========");
    console.error(error);
    throw error;
  }

  return data;
};

// ======================================
// Get User By Auth ID
// ======================================
export const getUserByAuthId = async (authUserId) => {
  console.log("========== GET USER BY AUTH ID ==========");
  console.log("Auth User ID:", authUserId);

  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      roles(name)
    `)
    .eq("auth_user_id", authUserId)
    .single();

  if (error) {
    console.error("========== GET USER BY AUTH ID ERROR ==========");
    console.error(error);
    throw error;
  }

  return data;
};
