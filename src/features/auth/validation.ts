export type AuthErrors = { name?: string; email?: string; password?: string; confirm?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(email: string, password: string): AuthErrors {
  const errors: AuthErrors = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email';
  if (!password) errors.password = 'Password is required';
  return errors;
}

export function validateSignUp(name: string, email: string, password: string, confirm: string): AuthErrors {
  const errors = validateLogin(email, password);
  if (!name.trim()) errors.name = 'Name is required';
  if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (confirm !== password) errors.confirm = 'Passwords do not match';
  return errors;
}