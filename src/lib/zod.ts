import { MutationType } from '@/lib/definitions/types';
import {
  generateDefaultGameName,
  isEmptyString,
  isNullOrUndefined,
  pluralize,
  validatePassword,
  cleanTags,
} from '@/lib/utils';
import { GameStatus, GameVisibility, QuestionType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import PluralRules from '@/lib/generators/PluralRules';

import * as z from 'zod';

// primitives
const Image = z.string().nullable();
const Number = z.coerce.number().int();
const String = z.coerce.string().trim();

/***************************************************************
                      Helpers
***************************************************************/

const string = (opts?: {
  minLength?: number;
  maxLength?: number;
  name?: string;
}): z.ZodString => {
  let schema = z.string().trim();
  const field = opts?.name ?? 'Field';
  if (opts?.minLength) {
    // minLength is inclusive in Zod
    if (opts.minLength > 1) {
      schema = schema.min(
        opts.minLength,
        `${field} must be ${opts.minLength} characters or more`
      );
    } else {
      schema = schema.min(opts.minLength, `${field} is required`);
    }
  }
  if (opts?.maxLength) {
    // maxLength is inclusive in Zod
    schema = schema.max(
      opts.maxLength,
      `${field} must be ${opts.maxLength} characters or less`
    );
  }
  return schema;
};

/***************************************************************
                      Sign In / Sign Up
***************************************************************/

import {
  CountsRule,
  MAX_NAME_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  PUBLISH_RULES,
  QuestionPoint,
} from '@/lib/definitions/constants';

const Name = string({ minLength: 1, maxLength: MAX_NAME_LENGTH, name: 'Name' });

const Email = z.email({
  error: (iss) =>
    isNullOrUndefined(iss.input)
      ? 'Email is required'
      : 'Invalid email address',
});

const Password = string({ minLength: 1, name: 'Password' });

const ConfirmPassword = string();

const SignUpEmail = Email.refine(
  async (email) => {
    // Verify email does not already exist in the database
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    return !existing;
  },
  {
    error:
      'An account with this email address already exists. Please log in instead.',
  }
);

export const SignInSchema = z
  .object({
    email: Email,
    password: Password,
  })
  .refine(
    async (data) => {
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });
      return !!existing;
    },
    {
      error: 'No account found with this email address. Please sign up first.',
      path: ['email'],
      abort: true,
    }
  )
  .refine(
    async (data) => {
      // Verify password is correct for the given email
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
        select: { passwordHash: true },
      });
      if (!existing?.passwordHash) return false;
      const passwordsMatch = await bcrypt.compare(
        data.password,
        existing.passwordHash
      );
      return passwordsMatch;
    },
    {
      error: 'Invalid credentials. Please try again.',
      path: ['password'],
    }
  );

export const SignUpSchema = z
  .object({
    name: Name,
    email: Email,
    password: Password,
    confirmPassword: ConfirmPassword,
  })
  .superRefine((data, ctx) => {
    const emptyPassword = isEmptyString(data.password);
    const emptyConfirmPassword = isEmptyString(data.confirmPassword);
    const invalidPassword = !emptyPassword && !validatePassword(data.password);
    const notMatching = data.password !== data.confirmPassword;

    if (invalidPassword) {
      ctx.addIssue({
        code: 'custom',
        message: "Password doesn't meet requirements",
        path: ['password'],
      });
    }
    if (emptyConfirmPassword && emptyPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Confirm password is required',
        path: ['confirmPassword'],
      });
    }
    if (notMatching && !emptyPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Both passwords must match',
        path: ['confirmPassword'],
      });
    }
  });

/***************************************************************
                      Username
***************************************************************/

export const Username = string({
  minLength: MIN_USERNAME_LENGTH,
  maxLength: MAX_USERNAME_LENGTH,
  name: 'Username',
})
  .regex(
    /^[a-zA-Z0-9._]+$/,
    'Username can only contain alphanumeric characters, underscores and dots'
  )
  .refine((username) => {
    // ensure username is not a default generated one (cuid)
    return !z.cuid().safeParse(username).success;
  }, 'Username must be different from the default generated username')
  .refine(async (username) => {
    // ensure username is different from current one
    const user = await getUserOrNull();
    return user ? user.username !== username : true;
  }, 'The new username must be different from the current one.')
  .refine(async (username) => {
    // verify that username does not already exist in the database
    const existing = await prisma.user.findUnique({ where: { username } });
    return !existing;
  }, 'This username is already taken. Please choose another one.');

export const UpdateUsernameSchema = z.object({
  username: Username,
});

/***************************************************************
                      Create Game
***************************************************************/

import {
  MAX_GAME_DESCRIPTION_LENGTH,
  MAX_GAME_NAME_LENGTH,
} from '@/lib/definitions/constants';

export const CreateGameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter a name to create your game')
    .max(
      MAX_GAME_NAME_LENGTH,
      `Name must be ${MAX_GAME_NAME_LENGTH} characters or less`
    ),
});

export const CreateQuestionSchema = z.strictObject({
  type: z.enum(QuestionType, 'Invalid question type'),
});

/***************************************************************
                     Publish Game
***************************************************************/

import {
  MIN_CATEGORIES,
  MAX_CATEGORIES,
  MAX_QUESTION_TITLE_LENGTH as MAX_QUESTION_LENGTH,
  MAX_QUESTION_HINT_LENGTH as MAX_HINT_LENGTH,
  MAX_QUESTION_FUNFACT_LENGTH as MAX_FUNFACT_LENGTH,
  MAX_ANSWER_TITLE_LENGTH as MAX_ANSWER_LENGTH,
  MIN_QUESTION_DURATION as MIN_DURATION,
  MAX_QUESTION_DURATION as MAX_DURATION,
  DEFAULT_QUESTION_DURATION as DEFAULT_DURATION,
} from '@/lib/definitions/constants';
import { getUserOrNull } from '@/lib/data/auth';

const Answer = z.object({
  id: z.cuid(),
  title: string({ maxLength: MAX_ANSWER_LENGTH, name: 'Answer' }).prefault(''),
  correct: z.coerce.boolean(),
});

const Question = z.object({
  id: z.cuid(),
  title: string({
    minLength: 1,
    maxLength: MAX_QUESTION_LENGTH,
    name: 'Question',
  }),
  image: Image,
  hint: z.nullable(string({ maxLength: MAX_HINT_LENGTH, name: 'Hint' })),
  funfact: z.nullable(
    string({ maxLength: MAX_FUNFACT_LENGTH, name: 'Fun fact' })
  ),
  duration: Number.min(
    MIN_DURATION,
    `Duration must ${MIN_DURATION} seconds or more`
  )
    .max(MAX_DURATION, `Duration must be ${MAX_DURATION} seconds or less`)
    .prefault(DEFAULT_DURATION),
  points: Number.min(QuestionPoint.NONE)
    .max(QuestionPoint.TRIPLE)
    .prefault(QuestionPoint.STANDARD),
  type: z.enum(QuestionType),
});

const Game = z.object({
  id: z.cuid(),
  name: string({ maxLength: MAX_GAME_NAME_LENGTH, name: 'Name' }),
  description: z.nullable(
    string({ maxLength: MAX_GAME_DESCRIPTION_LENGTH, name: 'Description' })
  ),
  image: Image,
  visibility: z.enum(GameVisibility),
  categories: z
    .array(z.number())
    .min(MIN_CATEGORIES, `At least ${MIN_CATEGORIES} category is required`)
    .max(
      MAX_CATEGORIES,
      `A maximum of ${MAX_CATEGORIES} categories can be selected`
    ),
  tags: z
    .array(z.string())
    .prefault([])
    .transform((arr) => cleanTags(arr)),
});

/***************************************************************
                     Publish Game Schema
***************************************************************/

export const PublishQuestion = Question.extend({
  answers: z.array(Answer),
})
  .superRefine((question, ctx) => {
    console.log('question', question);
    const r = PUBLISH_RULES[question.type];
    const answers = question.answers.filter((a) => a.title.trim() !== '');

    // No duplicate answers allowed
    const titles = answers.map((a) => a.title);
    if (new Set(titles).size !== titles.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['answers'],
        message: 'No duplicate answers allowed',
      });
    }

    // Counts
    if (answers.length < r.min) {
      const missing = r.min - answers.length;
      ctx.addIssue({
        code: 'custom',
        path: ['answers'],
        message: `${pluralize(missing, 'answer')} missing`,
      });
    } else if (r.max && answers.length > r.max) {
      ctx.addIssue({
        code: 'custom',
        path: ['answers'],
        message: `Maximum of ${r.max} answers allowed`,
      });
    }

    // Correctness
    const trues = answers.filter((a) => a.correct).length;
    if (r.correct === CountsRule.EXACTLY_ONE) {
      // SINGLE CHOICE
      if (trues !== 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['answers'],
          message: 'Correct answer required',
        });
      }
    } else if (r.correct === CountsRule.AT_LEAST_ONE) {
      // MULTIPLE CHOICE
      if (trues < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['answers'],
          message: 'Correct answer not selected',
        });
      }
    } else if (r.correct === CountsRule.ALL) {
      // TYPE ANSWER
      if (trues !== answers.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['answers'],
          message: 'All answers must be all correct for Type Answer',
        });
      }
    }

    // Falseness
    const falses = answers.filter((a) => !a.correct).length;
    if (r.false === CountsRule.AT_LEAST_ONE) {
      // SINGLE CHOICE
      if (falses < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['answers'],
          message: 'False answer required',
        });
      }
    } else if (r.false === CountsRule.NONE) {
      // TYPE ANSWER
      if (falses > 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['answers'],
          message: 'No false answers allowed for Type Answer',
        });
      }
    }
  })
  .transform((question) => {
    // Drop all empty answers
    return {
      ...question,
      answers: question.answers.filter((a) => a.title.trim() !== ''),
    };
  });

export const PublishGameSchema = Game.extend({
  name: string({
    minLength: 1,
    maxLength: MAX_GAME_NAME_LENGTH,
    name: 'Game name',
  }),
  questions: z
    .array(PublishQuestion)
    .min(1, 'At least one question is required'),
});

export type PublishGameFormData = z.infer<typeof PublishGameSchema>;

export function groupQuestionErrors(
  error: z.ZodError
): Record<number, string[]> {
  const grouped: Record<number, string[]> = {};
  for (const issue of error.issues) {
    // path like ["questions", 2, "answers"] or ["questions", 1, "title"]
    const [field, index] = issue.path;
    if (field === 'questions' && typeof index === 'number') {
      const msg = issue.message;
      if (!grouped[index]) grouped[index] = [];
      grouped[index].push(msg);
    }
  }
  return grouped;
}

/***************************************************************
                     Save Game Schema
***************************************************************/

const DraftAnswer = Answer.extend({
  title: String.prefault(''),
});

const DraftQuestion = Question.extend({
  title: String.prefault(''),
  answers: z.array(DraftAnswer),
});

export const SaveGameSchema = Game.extend({
  name: String.transform((s) => s || generateDefaultGameName()),
  categories: z.array(z.number()).prefault([]),
  questions: z.array(DraftQuestion),
});

export type SaveGameFormData = z.infer<typeof SaveGameSchema>;

/***************************************************************
                     Game Schema
***************************************************************/

const CategoryName = z.object({
  name: z.string(),
});

export const ViewGameSchema = z
  .looseObject({
    id: z.cuid(),
    name: z.string(),
    image: Image,
    description: z.string().nullable(),
    status: z.enum(GameStatus),
    visibility: z.enum(GameVisibility),
    categories: z.array(CategoryName),
    createdAt: z.union([z.iso.datetime(), z.date()]),
    questions: z.array(DraftQuestion).min(1, 'Missing questions'),
  })
  .superRefine((game, ctx) => {
    const rules = new PluralRules('cardinal', { case: 'sentence' });
    const questions = game.questions.filter((q) => q.title.trim() !== '');
    const emptyQuestions = game.questions.length - questions.length;
    if (emptyQuestions > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['questions'],
        message: `${rules.format(emptyQuestions, 'question')} empty`,
        abort: true,
      });
    }

    const missingAnswers = game.questions.reduce((acc, q) => {
      const answers = q.answers.filter((a) => a.title.trim() !== '');
      const r = PUBLISH_RULES[q.type];
      if (answers.length < r.min) {
        return acc + (r.min - answers.length);
      }
      return acc;
    }, 0);
    if (missingAnswers > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['questions'],
        message: `${rules.format(missingAnswers, 'answer')} missing`,
      });
    }
  });

/***************************************************************
                      Session
***************************************************************/

export const mutationTypeSchema = z.object({
  mutationType: z.enum(MutationType),
});

export const sessionPinSchema = z.object({
  pin: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((v) => /^[0-9]{6}$/.test(v), 'Pin must be 6 digits'),
});

// export const playerSchema = z.object({
//   name: z
//     .string()
//     .trim()
//     .min(1, 'Name is required')
//     .max(
//       PLAYER_NAME_MAX_LENGTH,
//       `Name must be less than ${PLAYER_NAME_MAX_LENGTH} characters`
//     ),
//   image: z.url().or(z.string().startsWith('/avatars/')),
// });
