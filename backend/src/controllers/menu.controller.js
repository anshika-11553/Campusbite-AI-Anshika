import { fetchMenuItems } from "../services/menu.service.js";

export const getMenu = async (req, res) => {
  try {
    const menuItems = await fetchMenuItems();

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error("Menu Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch menu items",
      error: error.message,
    });
  }
};
