import { getAllMenuItems } from "../repositories/menu.repository.js";

export const fetchMenuItems = async () => {
  return await getAllMenuItems();
};
