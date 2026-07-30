import supabase from "../config/supabase.js";

/**
 * Register a new user using Supabase Auth
 */
export const registerUser = async ({ email, password, full_name }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Login existing user
 */
export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};
