import { registerUser, loginUser } from "../repositories/auth.repository.js";

export const register = async (userData) => {
  return await registerUser(userData);
};

export const login = async (credentials) => {
  return await loginUser(credentials);
};
