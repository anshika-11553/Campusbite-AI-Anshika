import { register, login } from "../services/auth.service.js";

// ==========================
// Register Controller
// ==========================
export const registerController = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const result = await register({
      full_name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("========== REGISTER ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
    console.error("Full Error:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
      code: error.code || null,
      details: error.details || null,
    });
  }
};

// ==========================
// Login Controller
// ==========================
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await login({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("========== LOGIN ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
    console.error("Full Error:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
      code: error.code || null,
      details: error.details || null,
    });
  }
};

// ==========================
// Profile Controller
// ==========================
export const profileController = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: req.user,
    });
  } catch (error) {
    console.error("========== PROFILE ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
