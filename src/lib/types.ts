import type {
  Game,
  Question,
  QuestionAnswer,
  User,
  GameSession,
  GameSessionQuestion,
  Player,
  GameSessionAnswer,
  QuestionType,
} from '@prisma/client';

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
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current?: boolean;
}

export interface NavButton {
  label: string;
  trigger: React.ComponentType<{ children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>,'button'> }>;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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

export interface SignUpActionResponse extends ActionResponse {
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
export interface SignOutActionResponse extends ActionResponse {
  success: boolean;
  message: string;
}

/***************************************************************
                     Game Types
***************************************************************/
export type AdminGame = Game & {
  owner: User;
  questions: Question[];
  active: string | null;
  oldSessions: string[];
};

export type AdminGames = AdminGame[];

export type QuestionWithAnswers = Question & {
  answers: QuestionAnswer[];
};

export type GameWithQuestions = Game & {
  owner: User;
  questions: (Question & { answers: QuestionAnswer[] })[];
};

// Create Game
export interface CreateGameFormData {
  name: string;
}

export interface CreateGameActionResponse extends ActionResponse {
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
export interface DeleteGameActionResponse extends ActionResponse {
  success: boolean;
  message: string;
}

export type UpdateGameFormData = {
  name: string;
  description?: string;
  image?: string | null;
  questions: {
    title: string;
    type: QuestionType;
    duration: number;
    points: number;
    hint?: string;
    image?: string | null;
    answers: {
      title: string;
      correct: boolean;
    }[];
  }[];
};

export interface UpdateGameActionResponse extends ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof UpdateGameFormData]?: string[] | object;
  };
  game?: GameWithQuestions | null;
}

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

/***************************************************************
                     Session
***************************************************************/

export type AdminSession = GameSession & {
  host: User;
  players: Player[];
  questions: (GameSessionQuestion & { answers: GameSessionAnswer[] })[];
};

export type PlayerSession = GameSession & {
  host: User;
  players: Player[];
  questions: (GameSessionQuestion & {
    answers: Omit<GameSessionAnswer, 'correct'>[];
  })[];
};

export type PlayerQuestion = Pick<
  GameSessionQuestion,
  'id' | 'type' | 'duration' | 'points' | 'title'
> & {
  answers: Array<Pick<GameSessionAnswer, 'id' | 'title'>>; // no `correct`
  startedAt?: string;
};

export type PlayerJoinActionResponse = ActionResponse & {
  success: boolean;
  message: string;
  session?: PlayerSession | null;
};

export enum MutationType {
  'START' = 'START',
  'ADVANCE' = 'ADVANCE',
  'END' = 'END',
}

export interface StartGameActionResponse extends ActionResponse {
  success: boolean;
  message: string;
  sessionId?: string;
  pin?: string;
}

export interface MutateSessionActionResponse extends ActionResponse {
  success: boolean;
  message: string;
  session?: AdminSession | null;
}

export interface LockSessionActionResponse extends ActionResponse {
  success: boolean;
  message: string;
  locked?: boolean;
}

/***************************************************************
                     Player
***************************************************************/

export type PlayerAnswerPayload =
  | { selectedAnswerIds: string[]; text?: undefined } // SINGLE/MULTIPLE
  | { selectedAnswerIds?: undefined; text: string }; // TYPE_ANSWER

interface EnterPinFormData {
  pin: string;
}

export interface VerifySessionPinActionResponse extends ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof EnterPinFormData]?: string[];
  };
  inputs?: {
    [K in keyof EnterPinFormData]?: string | '';
  };
}

interface PlayerJoinFormData {
  name: string;
  image?: string | null;
}

export interface CreatePlayerActionResponse extends ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof PlayerJoinFormData]?: string[];
  };
  inputs?: {
    [K in keyof PlayerJoinFormData]?: string | '';
  };
}