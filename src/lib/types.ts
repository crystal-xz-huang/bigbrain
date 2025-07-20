import type React from 'react';
import type { User, Game as PrismaGame, Question } from '@prisma/client';

/***************************************************************
                      Auth
***************************************************************/
export type AuthUser = Omit<User, 'passwordHash'>;

export type FieldErrors = Record<string, string[]>;

export type Provider = {
  id: string;
  name: string;
};

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser | null;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignInActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof SignInFormData]?: string[];
  };
  inputs?: {
    [K in keyof SignInFormData]?: string | '';
  };
  user?: AuthUser | null;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof SignUpFormData]?: string[];
  };
  inputs?: {
    [K in keyof SignUpFormData]?: string | '';
  };
  user?: AuthUser | null;
}

export interface SignOutActionResponse {
  success: boolean;
  message: string;
}

/***************************************************************
                      Toast
***************************************************************/
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface ToastOptions {
  duration?: number;
  replace?: boolean;
}
export interface ToastContextType {
  addToast: (
    type: ToastType,
    message: string,
    description?: string,
    options?: ToastOptions
  ) => void;
}

export type ToastInput =
  | string
  | {
      message?: string;
      description?: string;
      options?: ToastOptions;
    };

/***************************************************************
                      Navigation
***************************************************************/
export interface NavLink {
  label: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current?: boolean;
}

export interface TabLink {
  name: string;
  href: string;
  current?: boolean;
}

/***************************************************************
                      Game
***************************************************************/
export type Game = PrismaGame & {
  questions: Question[] | [];
  owner?: User;
}

export interface CreateGameInput {
  name: string;
  description?: string;
  image?: string;
}

export interface CreateGameActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof CreateGameInput]?: string[];
  };
  inputs?: {
    [K in keyof CreateGameInput]?: string | '';
  };
  game?: Game | null;
}

export interface DeleteGameActionResponse {
  success: boolean;
  message: string;
}
