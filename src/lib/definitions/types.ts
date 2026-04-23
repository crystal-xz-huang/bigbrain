import {
  UpdateGameTypeEnum,
  CategoryNameEnum,
  ToastTypeEnum,
  GameViewType,
} from '@/lib/definitions/constants';
import type {
  Question,
  QuestionAnswer,
  GameStatus,
  GameVisibility,
  QuestionType,
  Role,
} from '@prisma/client';
import * as schema from '@/lib/zod';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';

/***************************************************************
                     Constants and Types
***************************************************************/

export type UpdateGameType =
  (typeof UpdateGameTypeEnum)[keyof typeof UpdateGameTypeEnum];

/**
 * This is equivalent to:
 * type CategoryNameStrings = "Entertainment & Pop Culture" | "Geography" | "History" | "Languages" | "STEM" | "Sports" | "Trivia";
 */
export type CategoryNameStrings =
  | (typeof CategoryNameEnum)[keyof typeof CategoryNameEnum]
  | string; // string to allow for other undefined categories

/***************************************************************
                     Search Params
***************************************************************/

export type GamesListSearchParams = {
  page: string;
  sort: SortOption;
  order: OrderOption;
  query: string;
};

export type SortOption = 'name' | 'createdAt' | 'questionCount' | 'duration' | 'relevance';
export type OrderOption = 'asc' | 'desc';

/***************************************************************
                     DTOs (Data Transfer Objects)
***************************************************************/

/**
 * Auth
 */
export type SessionDTO = {
  userId: string | null; // user ID if authenticated, else null
  isAuth: boolean; // true if user is authenticated
};

export type UserDTO = {
  id: string;
  username: string; // required, non-null
  name: string | null; // required but can be null
  email: string | null; // required but nullable
  image: string | null; // required but nullable
  role: Role;
};

/**
 * Games Feed
 */
export interface PublicGameDTO {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
  categories: string[]; // array of category names
  duration: number; // total duration of all questions
  questionCount: number;
  plays: number;
}

export interface PublicGameRaw {
  id: string;
  name: string;
  image: string | null;
  createdAt: Date;
  categories: Array<{ name: string }>;
  questions: Array<{ duration: number }>; // for calculating total duration
  _count: { questions: number; sessions: number }; // for questionCount and plays
}

export interface ProtectedGameDTO extends PublicGameDTO {
  active: string | null;
  played: boolean;
}

export interface ProtectedGameRaw extends PublicGameRaw {
  sessions: Array<{ id: string; active: boolean }>; // for active and played
}

// ----- Home Feed -----
export interface GamesListItemDTO {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
  duration: number;
  questionCount: number;
  owner?: { username: string; image: string | null };
  active?: string | null;
  played?: boolean;
}

export interface GamesListItemRaw extends PublicGameRaw {
  owner: { username: string; image: string | null };
  sessions: Array<{ id: string; active: boolean }>;
}

// Types of GamesListItemDTO based on ownership and role
export interface PublicGamesListItemDTO extends GamesListItemDTO {
  owner: { username: string; image: string | null };
  active?: never;
  played?: never;
}

export interface AdminGamesListItemDTO extends GamesListItemDTO {
  owner: { username: string; image: string | null };
  active: string | null;
  played: boolean;
}

export interface AdminOwnerGamesListItemDTO extends GamesListItemDTO {
  owner?: never;
  active: string | null;
  played: boolean;
}

// ----- User Library -----
export interface LibraryListItemDTO extends ProtectedGameDTO {
  status: GameStatus;
  visibility: GameVisibility;
}

export interface LibraryListItemRaw extends ProtectedGameRaw {
  status: GameStatus;
  visibility: GameVisibility;
}

// ----- Browse -----
export interface GameResultDTO {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
  duration: number; // total duration of all questions
  questionCount: number;
  plays: number;
}

/**
 * Profile
 */
export type ProfileDTO = {
  username: string;
  image: string | null;
  games: ProfileGameDTO[];
};

export type ProfileGameDTO = PublicGameDTO;
export type ProfileGameRaw = PublicGameRaw;

/**
 * Home Feed [PUBLIC] - list of games by mostRecent, mostPopular, byCategory, byUser
 */
export type HomeFeedDTO = {
  mostRecent: GamesListDTO;
  mostPopular: GamesListDTO;
  byCategory: CategoryGamesListDTO[];
  byUser: AdminOwnerGamesListDTO | null;
};

// (1) The general list of games (for mostRecent, mostPopular)
export type GamesListDTO = {
  games: GamesListItemDTO[];
};

// (2) The list of games for a specific category
export type CategoryGamesListDTO = {
  category: CategoryNameStrings;
  total: number;
  games: GamesListItemDTO[];
};

// (3) The list of games owned by the current user
export type AdminOwnerGamesListDTO = {
  total: number;
  games: AdminOwnerGamesListItemDTO[];
};

/**
 * Game View [PUBLIC/PROTECTED] - detailed view of a single game
 */
export type GameViewDTO = PublicGameViewDTO | ProtectedGameViewDTO;

export type GameViewQuestionDTO =
  | PublicGameViewQuestionDTO
  | ProtectedGameViewQuestionDTO;

export type GameViewAnswerDTO =
  | PublicGameViewAnswerDTO
  | ProtectedGameViewAnswerDTO;

//----- PUBLIC -----

export interface GameViewRaw extends PublicGameRaw {
  owner: { id: string; username: string; image: string | null };
  description: string | null;
  tags: string[];
  status: GameStatus;
  visibility: GameVisibility;
  sessions: Array<{ id: string; active: boolean }>;
  questions: QuestionDTO[];
}

export interface PublicGameViewDTO extends PublicGameDTO {
  type: GameViewType.PUBLIC;
  owner: {
    username: string;
    image: string | null;
  };
  tags: string[];
  description: string | null;
  questions: PublicGameViewQuestionDTO[];
  error?: string;
}

export interface PublicGameViewQuestionDTO {
  title: string;
  image: string | null;
  duration: number;
  points: number;
  type: QuestionType;
  answers: PublicGameViewAnswerDTO[];
}

export interface PublicGameViewAnswerDTO {
  correct: boolean;
  title: string; // a random string if not owned by current user
}

//----- PROTECTED -----
export interface ProtectedGameViewDTO extends PublicGameDTO {
  type: GameViewType.PROTECTED;
  owner: {
    username: string;
    image: string | null;
  };
  tags: string[];
  description: string | null;
  questions: ProtectedGameViewQuestionDTO[];
  error?: string;
  status: GameStatus;
  visibility: GameVisibility;
}

export interface ProtectedGameViewQuestionDTO
  extends PublicGameViewQuestionDTO {
  id: string;
  hint: string | null;
  funfact: string | null;
  answers: ProtectedGameViewAnswerDTO[];
}

export interface ProtectedGameViewAnswerDTO extends PublicGameViewAnswerDTO {
  id: string;
}

/**
 * User Library [PROTECTED] - list of games owned by the current user
 */
export type LibraryListDTO = {
  total: number;
  games: LibraryListItemDTO[];
};

/**
 * Edit Game [PROTECTED] - detailed view of a single game for editing
 */
export type AnswerDTO = Omit<QuestionAnswer, 'questionId'>;

export type QuestionDTO = Omit<Question, 'gameId' | 'createdAt'> & {
  answers: AnswerDTO[];
};

export type GameEditDTO = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  categories: number[]; // array of category IDs
  tags: string[]; // array of tags
  questions: Array<QuestionDTO>;
  updatedAt: string;
};

/**
 * [PROTECTED] User Dashboard
 */
// Profile Banner
export type ProfileBannerDTO = {
  username: string;
  name: string | null;
  email: string | null;
  image: string | null;
  stats: UserStatsDTO;
};

export type UserStatsDTO = {
  createdAt: string;
  games: number;
  plays: number;
};

/**
 * [PROTECTED] Reports
 */
export type ReportsListDTO = {
  total: number;
  sessions: SessionSummaryDTO[];
};

export type SessionSummaryDTO = {
  id: string;
  gameId: string;
  startedAt: string | null;
  endedAt: string | null;
  players: number;
};

/***************************************************************
                     Actions
***************************************************************/

export type FieldErrors<T> = { [K in keyof T]?: string[] };

export interface ActionResponse<T = null> {
  success: boolean;
  message: string;
  errors?: FieldErrors<T>;
  inputs?: {
    [K in keyof T]?: string | '';
  };
}

/**
 * Authentication
 */

export type SignUpFormData = z.infer<typeof schema.SignUpSchema>;
export type SignInFormData = z.infer<typeof schema.SignInSchema>;

export type SignUpFieldErrors = { [K in keyof SignUpFormData]?: string[] };
export type SignInFieldErrors = { [K in keyof SignInFormData]?: string[] };
export type SignInActionResponse = ActionResponse<SignInFormData>;
export type SignUpActionResponse = ActionResponse<SignUpFormData>;
export type SignOutActionResponse = ActionResponse;

/**
 * Game Mutations
 */

export type CreateGameFormData = z.infer<typeof schema.CreateGameSchema>;
export type CreateGameFieldErrors = FieldErrors<CreateGameFormData>;
export type CreateGameActionResponse = ActionResponse<CreateGameFormData> & {
  gameId?: string;
};

export type UpdateGameFormData = {
  updateType: UpdateGameTypeEnum;
};

export interface UpdateGameActionResponse
  extends Omit<ActionResponse<UpdateGameFormData>, 'errors'> {
  game?: GameEditDTO;
  errors?: string;
}

export type CreateQuestionFormData = z.infer<
  typeof schema.CreateQuestionSchema
>;

export interface CreateQuestionActionResponse
  extends ActionResponse<CreateQuestionFormData> {
  question?: QuestionDTO | null;
}

export interface CloneQuestionActionResponse extends ActionResponse {
  question?: QuestionDTO | null;
}

export type UpdateUsernameFormData = z.infer<
  typeof schema.UpdateUsernameSchema
>;
export type UpdateUsernameFieldErrors = FieldErrors<UpdateUsernameFormData>;
export type UpdateUsernameActionResponse =
  ActionResponse<UpdateUsernameFormData> & {
    username?: string;
  };

/**
 * Game Session
 */
export enum MutationType {
  'START' = 'START',
  'ADVANCE' = 'ADVANCE',
  'END' = 'END',
}

// export type AdminSession = GameSession & {
//   host: User;
//   players: Player[];
//   questions: (GameSessionQuestion & { answers: GameSessionAnswer[] })[];
// };

// export type PlayerSession = GameSession & {
//   host: User;
//   players: Player[];
//   questions: (GameSessionQuestion & {
//     answers: Omit<GameSessionAnswer, 'correct'>[];
//   })[];
// };

// export type PlayerQuestion = Pick<
//   GameSessionQuestion,
//   'id' | 'type' | 'duration' | 'points' | 'title'
// > & {
//   answers: Array<Pick<GameSessionAnswer, 'id' | 'title'>>;
//   startedAt?: string;
// };

// export type PlayerJoinActionResponse = ActionResponse & {
//   success: boolean;
//   message: string;
//   session?: PlayerSession | null;
// };

// export interface StartGameActionResponse extends ActionResponse {
//   success: boolean;
//   message: string;
//   sessionId?: string;
//   pin?: string;
// }

// export interface MutateSessionActionResponse extends ActionResponse {
//   success: boolean;
//   message: string;
//   session?: AdminSession | null;
// }

// export interface LockSessionActionResponse extends ActionResponse {
//   success: boolean;
//   message: string;
//   locked?: boolean;
// }

/**
 * Player
 */
export type PlayerAnswerPayload =
  | { selectedAnswerIds: string[]; text?: undefined } // SINGLE/MULTIPLE
  | { selectedAnswerIds?: undefined; text: string }; // TYPE_ANSWER

export type EnterPinFormData = {
  pin: string;
};

export type VerifySessionPinActionResponse = ActionResponse<EnterPinFormData>;

interface PlayerJoinFormData {
  name: string;
  image?: string | null;
}

export type CreatePlayerActionResponse = ActionResponse<PlayerJoinFormData>;

/***************************************************************
                     Component Types
***************************************************************/

/**
 * Navigation
 */
export type NavLink =
  | {
      label: string;
      href: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      image?: never;
    }
  | {
      label: string;
      href: string;
      image: StaticImport | string;
      icon?: never;
    };

export type NavButton = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href?: never;
  image?: never;
};

export type NavItem = NavLink | NavButton;

/**
 * Toast
 */

export type ToastType = (typeof ToastTypeEnum)[keyof typeof ToastTypeEnum]; // "success" | "error" | "info" | "warning"

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
                     Database Seed Templates
***************************************************************/

import type { Prisma, PrismaClient } from '@prisma/client';

export type DB = Prisma.TransactionClient | PrismaClient;

export type QuestionSeedTemplate = {
  title: string;
  image?: string | null;
  hint?: string | null;
  funfact?: string | null;
  duration?: number;
  points?: number;
  type: QuestionType;
  answers: {
    title: string;
    correct: boolean;
  }[];
};

export type GameSeedTemplate = {
  name: string;
  image?: string;
  description?: string;
  categories: CategoryNameStrings[];
  visibility?: GameVisibility;
  status?: GameStatus;
  tags?: string[];
  questions: {
    title: string;
    image?: string | null;
    hint?: string | null;
    funfact?: string | null;
    duration?: number;
    points?: number;
    type: QuestionType;
    answers: {
      title: string;
      correct: boolean;
    }[];
  }[];
};

export type UserSeedTemplate = {
  username: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

/***************************************************************
                     Miscellaneous
***************************************************************/

import * as z from 'zod';

export type ParsedResult<T> = ParsedResultSuccess<T> | ParsedResultError<T>;

type ParsedResultSuccess<T> = z.ZodSafeParseSuccess<T> & {
  message?: never;
  errors?: never;
  inputs: Record<string, FormDataEntryValue>;
};

type ParsedResultError<T> = z.ZodSafeParseError<T> & {
  message: string;
  inputs: Record<string, FormDataEntryValue>;
  errors: {
    [P in keyof T]?: string[] | undefined;
  };
};
