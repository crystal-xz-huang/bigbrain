import type { Question, QuestionAnswer, QuestionType, User } from '@prisma/client';

/***************************************************************
                     Action Types
***************************************************************/
export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | object>;
}

/***************************************************************
                     Navigation Types
***************************************************************/

export interface NavLink {
  label: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current?: boolean;
}

/***************************************************************
                     Toast Types
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
                     Auth Types
***************************************************************/

export type AuthUser = Omit<User, 'passwordHash'>;

export interface AuthResponse extends ActionResponse {
  success: boolean;
  message: string;
  user?: AuthUser | null;
}

// Sign In
export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignInActionResponse extends ActionResponse {
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

// Sign Up
export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpActionResponse extends ActionResponse{
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

// Sign Out
export interface SignOutActionResponse  extends ActionResponse {
  success: boolean;
  message: string;
}

/***************************************************************
                     Game Types
***************************************************************/

// Create Game
export interface CreateGameFormData {
  name: string;
}

export interface CreateGameActionResponse  extends ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof CreateGameFormData]?: string[];
  };
  inputs?: {
    [K in keyof CreateGameFormData]?: string | '';
  };
}

// Delete Game
export interface DeleteGameActionResponse  extends ActionResponse {
  success: boolean;
  message: string;
}

// Update Game
export interface UpdateGameFormData {
  name: string;
  description?: string;
  image?: string;
  questions: {
    id: string;
    title: string;
    type: QuestionType;
    duration: number;
    points: number;
    hint?: string;
    answers: {
      id: string;
      title: string;
      correct: boolean;
    }[];
  }[];
}

export interface UpdateGameActionResponse extends ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof UpdateGameFormData]?: string[] | object;
  };
  game?: GameWithQuestions | null;
}

/***************************************************************
                     Question Types
***************************************************************/
export interface Answer extends QuestionAnswer {
  id: string;
  title: string;
  questionId: string;
  correct: boolean;
  createdAt?: Date;
}

export type QuestionWithAnswers = Question & {
  answers: QuestionAnswer[] | Answer[];
};

export type GameWithQuestions = Game & {
  questions: QuestionWithAnswers[] | Question[];
};

export interface CreateQuestionActionResponse extends ActionResponse {
  success: boolean;
  message: string;
  questions?: QuestionWithAnswers[] | null;
  question?: QuestionWithAnswers | null;
}

export interface DeleteQuestionActionResponse extends ActionResponse {
  success: boolean;
  message: string;
}
