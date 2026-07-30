/**
 * RFC 5322 Compliant Email Validation Regex.
 * Does not restrict or hardcode any college domain.
 */
export const RFC_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  return RFC_EMAIL_REGEX.test(email.trim());
};

export const isValidPassword = (password: string): boolean => {
  return typeof password === 'string' && password.length >= 6;
};
