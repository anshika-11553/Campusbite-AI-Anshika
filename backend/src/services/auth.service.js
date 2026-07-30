import { registerUser, loginUser } from "../repositories/auth.repository.js";
import { createCampusUser } from "../repositories/user.repository.js";

// ==========================
// Register
// ==========================
export const register = async (userData) => {
  // Step 1: Register user in Supabase Auth
  const authData = await registerUser(userData);

  if (!authData.user) {
    throw new Error("User registration failed");
  }

  // Step 2: Insert into CampusBite users table
  try {
    const campusUser = await createCampusUser({
      auth_user_id: authData.user.id,
      full_name: userData.full_name,
      email: userData.email,
    });

    console.log("Campus user created successfully:", campusUser);

    return authData;
  } catch (error) {
    console.error("Error creating CampusBite user:");
    console.error(error);

    throw error;
  }
};

// ==========================
// Login
// ==========================
export const login = async (credentials) => {
  return await loginUser(credentials);
};
