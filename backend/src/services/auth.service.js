import { registerUser, loginUser } from "../repositories/auth.repository.js";
import { createCampusUser } from "../repositories/user.repository.js";

// ==========================
// Register
// ==========================
export const register = async (userData) => {
  // Step 1: Create user in Supabase Auth
  const authData = await registerUser(userData);

  if (!authData.user) {
    throw new Error("User registration failed");
  }

  // Step 2: Create user in CampusBite users table
  await createCampusUser({
    auth_user_id: authData.user.id,
    full_name: userData.full_name,
    email: userData.email,
  });

  return authData;
};

// ==========================
// Login
// ==========================
export const login = async (credentials) => {
  return await loginUser(credentials);
};
