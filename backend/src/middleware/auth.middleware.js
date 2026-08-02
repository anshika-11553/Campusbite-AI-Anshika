import supabase from "../config/supabase.js";
import { ROLES } from "../constants/roles.js";

export const authenticateUser = async (req, res, next) => {
  try {
    // ==========================
    // Get Bearer Token
    // ==========================
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    // ==========================
    // Verify JWT
    // ==========================
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // ==========================
    // Get User from Database
    // ==========================
    let { data: campusUser, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || !campusUser) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    // Auto-sync role_id based on email pattern
    const email = (campusUser.email || user.email || "").toLowerCase();
    let expectedRoleId = campusUser.role_id;

    if (email.includes("vendor")) {
      expectedRoleId = ROLES.VENDOR;
    } else if (email.includes("chef")) {
      expectedRoleId = ROLES.CHEF;
    } else if (email.includes("admin")) {
      expectedRoleId = ROLES.ADMIN;
    }

    if (expectedRoleId && expectedRoleId !== campusUser.role_id) {
      await supabase
        .from("users")
        .update({ role_id: expectedRoleId })
        .eq("id", campusUser.id);

      campusUser.role_id = expectedRoleId;
    }

    req.user = campusUser;

    next();
  } catch (error) {
    console.error("Auth Middleware Notice:", error.message);

    return res.status(401).json({
      success: false,
      message: "Authentication failed. Invalid or expired token.",
      errorCode: "UNAUTHORIZED",
      timestamp: new Date().toISOString(),
    });
  }
};
