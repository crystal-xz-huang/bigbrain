import z, { object, string } from 'zod';

/***************************************************************
                      Sign In / Sign Up
***************************************************************/
export const name = string()
  .trim()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters');

export const email = string()
  .trim()
  .min(1, 'Email is required')
  .email('Invalid email address')

export const password = string()
  .trim()
  .min(1, 'Password is required')
  .min(8, 'Password must be more than 8 characters')
  .max(32, 'Password must be less than 32 characters');

export const confirmPassword = string()
  .trim()
  .nonempty('Confirm password is required');

export const signInSchema = object({
  email: email,
  password: password,
});

export const signUpSchema = object({
  name: name,
  email: email,
  password: password,
  confirmPassword: confirmPassword,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Both passwords must match",
  path: ['confirmPassword'],
});

export type SignInFormInput = z.infer<typeof signInSchema>;
export type SignUpFormInput = z.infer<typeof signUpSchema>;