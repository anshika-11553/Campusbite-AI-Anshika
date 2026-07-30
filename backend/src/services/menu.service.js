import {
  getAllMenuItems,
  getMenuItems,
} from "../repositories/menu.repository.js";

export const fetchMenuItems = async (filters = {}) => {
  if (filters.category || filters.q) {
    return await getMenuItems(filters);
  }
  return await getAllMenuItems();
};
