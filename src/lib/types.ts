/***************************************************************
                      Auth
***************************************************************/
export type FieldErrors = Record<string, string[]>;

export type Provider = {
  id: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface SignInFormData {
  email: string;
  password: string;
  redirectTo: string;
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
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  redirectTo: string;
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