import { GameStatus, GameVisibility, QuestionType } from '@prisma/client';

export const PRISMA_UNIQUE_CONSTRAINT_ERROR = 'P2002' as const;

export enum UpdateGameTypeEnum {
  SAVE = 'SAVE',
  PUBLISH = 'PUBLISH',
}

export enum CategoryNameEnum {
  ENTERTAINMENT = 'Entertainment',
  GEOGRAPHY = 'Geography',
  HISTORY = 'History',
  LANGUAGES = 'Languages',
  STEM = 'STEM',
  SPORTS = 'Sports',
  TRIVIA = 'Trivia',
}

export enum ToastTypeEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export enum GameViewType {
  PUBLIC = 'PUBLIC',
  PROTECTED = 'PROTECTED',
}

/***************************************************************
                     Limits
***************************************************************/

export const MIN_USERNAME_LENGTH = 4 as const;
export const MAX_USERNAME_LENGTH = 25 as const;

export const MAX_NAME_LENGTH = 75 as const;
export const MIN_PASSWORD_LENGTH = 8 as const;

export const MAX_GAME_NAME_LENGTH = 75 as const;
export const MAX_GAME_DESCRIPTION_LENGTH = 250 as const;

export const MAX_QUESTION_TITLE_LENGTH = 250 as const;
export const MAX_QUESTION_HINT_LENGTH = 120 as const;
export const MAX_QUESTION_FUNFACT_LENGTH = 300 as const;

export const MIN_QUESTION_DURATION = 20 as const; // 20 seconds
export const MAX_QUESTION_DURATION = 240 as const; // 4 minutes
export const DEFAULT_QUESTION_DURATION = 20 as const;

export const MAX_ANSWER_TITLE_LENGTH = 120 as const;

export const MIN_CATEGORIES = 1 as const;
export const MAX_CATEGORIES = 2 as const;

export const SESSION_PIN_LENGTH = 6 as const;
export const PLAYER_NAME_MAX_LENGTH = 25 as const;

/***************************************************************
                     Question Configs
***************************************************************/

export enum QuestionPoint {
  NONE = 0,
  STANDARD = 1,
  DOUBLE = 2,
  TRIPLE = 3,
}

export enum CountsRule {
  NONE = 'none',
  EXACTLY_ONE = 'exactlyOne',
  AT_LEAST_ONE = 'atLeastOne',
  ALL = 'all',
}

export const EDITING_RULES = {
  [QuestionType.SINGLE]: {
    min: 4,
    max: 4,
    correct: CountsRule.EXACTLY_ONE,
  },
  [QuestionType.MULTIPLE]: {
    min: 4,
    max: 4,
    correct: CountsRule.AT_LEAST_ONE,
  },
  [QuestionType.TYPE_ANSWER]: {
    min: 1,
    max: 10,
    correct: CountsRule.ALL,
  },
};

export const PUBLISH_RULES = {
  [QuestionType.SINGLE]: {
    min: 2,
    max: 4,
    correct: CountsRule.EXACTLY_ONE,
    false: CountsRule.AT_LEAST_ONE,
  },
  [QuestionType.MULTIPLE]: {
    min: 2,
    max: 4,
    correct: CountsRule.AT_LEAST_ONE,
    false: undefined,
  },
  [QuestionType.TYPE_ANSWER]: {
    min: 1,
    max: 10,
    correct: CountsRule.ALL,
    false: CountsRule.NONE,
  },
};

/***************************************************************
                     Validation
***************************************************************/

/**
 * Password:
 * At least 8 characters
 * At least one uppercase letter
 * At least one lowercase letter
 * At least one number
 * At least one special character
 * No spaces allowed
 */
export const PASSWORD_REGEX = new RegExp(
  `^(?=\\S{${MIN_PASSWORD_LENGTH},}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()\\-_=+{};:,<.>])`
);

/**
 * Username:
 * 4-25 characters long
 * Alphanumeric characters, underscores, dots allowed
 */
export const USERNAME_REGEX = new RegExp(
  `^(?=.{${MIN_USERNAME_LENGTH},${MAX_USERNAME_LENGTH}}$)[a-zA-Z0-9._]+$`
);

/***************************************************************
                      Database Constants
***************************************************************/

/* Columns to select for user queries */
export const SELECT_USER_COLUMNS = {
  id: true,
  username: true,
  name: true,
  email: true,
  image: true,
  role: true,
} as const;

/* Columns to select for game queries */
export const ORDER_BY_MOST_RECENT = { createdAt: 'desc' } as const;
export const ORDER_BY_QUESTIONS = { createdAt: 'asc' } as const;
export const ORDER_BY_ANSWERS = { id: 'asc' } as const;

export const WHERE_PUBLIC = {
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
} as const;

export const SELECT_GAME_COLUMNS_WITHOUT_OWNER = {
  id: true,
  name: true,
  image: true,
  createdAt: true,
  categories: { select: { name: true } },
  // for question and plays count
  _count: { select: { questions: true, sessions: true } },
  // for duration count
  questions: { select: { duration: true } },
} as const;

export const SELECT_GAME_COLUMNS = {
  ...SELECT_GAME_COLUMNS_WITHOUT_OWNER,
  owner: { select: { username: true, image: true } },
} as const;

export const SELECT_GAME_COLUMNS_FOR_OWNER = {
  ...SELECT_GAME_COLUMNS_WITHOUT_OWNER,
  status: true,
  visibility: true,
  sessions: {
    select: { id: true, active: true },
    orderBy: ORDER_BY_MOST_RECENT,
    take: 1,
  },
};

export const SELECT_GAME_COLUMNS_FOR_FEED = {
  ...SELECT_GAME_COLUMNS,
  sessions: {
    select: { id: true, active: true },
    orderBy: ORDER_BY_MOST_RECENT,
    take: 1,
  },
} as const;

export const SELECT_GAME_COLUMNS_FOR_VIEWER = {
  id: true,
  name: true,
  image: true,
  createdAt: true,
  status: true,
  owner: { select: { id: true, username: true, image: true } },
  _count: { select: { questions: true, sessions: true } },
  sessions: {
    select: { id: true, active: true },
    orderBy: ORDER_BY_MOST_RECENT,
    take: 1,
  },
  description: true,
  categories: { select: { name: true } },
  tags: true,
  visibility: true,
  questions: {
    orderBy: ORDER_BY_QUESTIONS,
    select: {
      id: true,
      title: true,
      image: true,
      hint: true,
      funfact: true,
      duration: true,
      points: true,
      type: true,
      answers: {
        orderBy: ORDER_BY_ANSWERS,
        select: { id: true, title: true, correct: true },
      },
    },
  },
} as const;

export const SELECT_GAME_COLUMNS_FOR_EDIT = {
  id: true,
  ownerId: true,
  name: true,
  image: true,
  description: true,
  updatedAt: true,
  categories: { select: { id: true } },
  tags: true,
  visibility: true,
  questions: {
    orderBy: ORDER_BY_QUESTIONS,
    select: {
      id: true,
      title: true,
      image: true,
      hint: true,
      funfact: true,
      duration: true,
      points: true,
      type: true,
      answers: {
        orderBy: ORDER_BY_ANSWERS,
        select: { id: true, title: true, correct: true },
      },
    },
  },
} as const;
