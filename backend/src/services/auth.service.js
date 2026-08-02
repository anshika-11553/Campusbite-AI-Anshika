import { registerUser, loginUser } from "../repositories/auth.repository.js";
import { createCampusUser } from "../repositories/user.repository.js";
import { ROLES } from "../constants/roles.js";

const DEMO_PROFILES = {
  "student@campusbite.ai": { name: "Campus Student", role_id: ROLES.STUDENT },
  "vendor@campusbite.ai": { name: "Campus Canteen Vendor", role_id: ROLES.VENDOR },
  "chef@campusbite.ai": { name: "Campus Kitchen Chef", role_id: ROLES.CHEF },
  "admin@campusbite.ai": { name: "Campus Admin Director", role_id: ROLES.ADMIN },
};

// ==========================
// Register
// ==========================
export const register = async (userData) => {
  try {
    console.log("========== REGISTER START ==========");
    console.log("Incoming User:", {
      full_name: userData.full_name,
      email: userData.email,
    });

    // Step 1: Register in Supabase Auth
    console.log("Step 1: Creating Supabase Auth user...");

    const authData = await registerUser(userData);

    console.log("Supabase Auth Response:", authData);

    if (!authData?.user) {
      throw new Error("User registration failed in Supabase Auth");
    }

    console.log("Supabase User ID:", authData.user.id);

    // Step 2: Insert into CampusBite users table
    console.log("Step 2: Creating CampusBite user...");

    const campusUser = await createCampusUser({
      auth_user_id: authData.user.id,
      full_name: userData.full_name,
      email: userData.email,
    });

    console.log("CampusBite User Created Successfully:");
    console.log(campusUser);

    console.log("========== REGISTER SUCCESS ==========");

    return {
      user: authData.user,
      session: authData.session,
      campusUser,
    };
  } catch (error) {
    console.error("========== REGISTER FAILED ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
    console.error("Full Error:", error);

    throw error;
  }
};

// ==========================
// Login
// ==========================
export const login = async (credentials) => {
  try {
    console.log("========== LOGIN START ==========");
    console.log("Email:", credentials.email);

    const result = await loginUser(credentials);

    console.log("========== LOGIN SUCCESS ==========");

    return result;
  } catch (error) {
    console.error("========== LOGIN FAILED ==========");

    // Auto-provision demo account if first-time demo login
    const emailLower = credentials.email?.toLowerCase()?.trim();
    if (emailLower && DEMO_PROFILES[emailLower]) {
      console.log(`Auto-registering demo user: ${emailLower}...`);
      try {
        const demoInfo = DEMO_PROFILES[emailLower];
        const authData = await registerUser({
          email: emailLower,
          password: credentials.password || "123456",
          full_name: demoInfo.name,
        });

        if (authData?.user) {
          await createCampusUser({
            auth_user_id: authData.user.id,
            full_name: demoInfo.name,
            email: emailLower,
            role_id: demoInfo.role_id,
          });

          return await loginUser(credentials);
        }
      } catch (regErr) {
        console.error("Demo auto-provision error:", regErr);
      }
    }

    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
    console.error("Full Error:", error);

    throw error;
  }
};
