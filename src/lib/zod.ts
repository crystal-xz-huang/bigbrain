import z, { object, string } from 'zod';

/***************************************************************
                      Sign In / Sign Up
***************************************************************/
const name = string()
  .trim()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters');

const email = string()
  .trim()
  .min(1, 'Email is required')
  .email('Invalid email address');

const password = string()
  .trim()
  .min(1, 'Password is required')
  .min(8, 'Password must be more than 8 characters')
  .max(32, 'Password must be less than 32 characters');

const confirmPassword = string().trim().min(1, 'Confirm password is required');

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
  message: 'Both passwords must match',
  path: ['confirmPassword'],
});

export type SignInFormInput = z.infer<typeof signInSchema>;
export type SignUpFormInput = z.infer<typeof signUpSchema>;

/***************************************************************
                      Account Settings
***************************************************************/
const bio = string()
  .trim()
  .max(300, { message: 'Bio must be at most 300 characters' })
  .optional();

const image = string()
  .trim()
  .url({ message: 'Invalid image URL' })
  .optional();


/***************************************************************
                      Game Creation
***************************************************************/
const gameName = string()
  .trim()
  .min(1, 'Please enter a name to create your game')

const gameDescription = string()
  .trim()
  .max(500, 'Description must be less than 500 characters')
  .optional();

const gameImage = string()
  .trim()
  .url({ message: 'Invalid image URL' })
  .optional();

export const createGameSchema = object({
  name: gameName,
  description: gameDescription,
  image: gameImage,
})
