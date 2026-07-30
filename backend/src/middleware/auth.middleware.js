import supabase from "../config/supabase.js";

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
    const { data: campusUser, error: profileError } = await supabase
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

    req.user = campusUser;

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
