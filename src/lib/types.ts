/***************************************************************
                      Auth
***************************************************************/
export type FieldErrors = Record<string, string[]>;

export type Provider = {
  id: string;
  name: string;
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
