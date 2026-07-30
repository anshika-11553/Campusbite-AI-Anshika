import supabaseAuth from "../config/supabaseAuth.js";

/**
 * Register a new user using Supabase Auth
 */
export const registerUser = async ({ email, password, full_name }) => {
  const { data, error } = await supabaseAuth.auth.signUp({
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
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};
