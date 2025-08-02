import z, { object, string } from 'zod';
import { QuestionType } from '@prisma/client';

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
                      Game Creation
***************************************************************/
const answerSchema = object({
  title: z.string().max(75, 'Answer must be less than 75 characters'), // allow empty for now
  correct: z.coerce.boolean(),
});

const questionSchema = object({
  title: z.string().trim().min(1, 'Question cannot be empty').max(75, 'Question must be less than 75 characters'),
  type: z.nativeEnum(QuestionType),
  duration: z.number().int().min(5, 'Duration must be at least 5 seconds'),
  points: z.number().int().min(0, 'Points must be a non-negative integer'),
  answers: z.array(answerSchema),
}).superRefine((data, ctx) => {
  const validAnswers = data.answers.filter(a => a.title.trim() !== '');
  const correct = validAnswers.filter(a => a.correct).length;
  const total = validAnswers.length;

  switch (data.type) {
    case QuestionType.MULTIPLE:
      if (correct < 1) {
        ctx.addIssue({
          path: ['answers'],
          message:
            'Multiple choice must have at least one correct answer',
          code: z.ZodIssueCode.custom,
        });
      }

      if (total < 2) {
        ctx.addIssue({
          path: ['answers'],
          message: 'Multiple choice must have at least 2 answers',
          code: z.ZodIssueCode.custom,
        });
      }
      break;

    case QuestionType.SINGLE:
      if (correct !== 1) {
        ctx.addIssue({
          path: ['answers'],
          message:
            'Single choice must have exactly one correct answer',
          code: z.ZodIssueCode.custom,
        });
      }

      if (total < 2 || correct >= total) {
        ctx.addIssue({
          path: ['answers'],
          message:
            'Single choice must have at least one false answer.',
          code: z.ZodIssueCode.custom,
        });
      }
      break;

    case QuestionType.TYPE_ANSWER:
      if (total < 1) {
        ctx.addIssue({
          path: ['answers'],
          message: 'Type answer must have at least one answer',
          code: z.ZodIssueCode.custom,
        })
      }
      break;
    }
});

export const createGameSchema = object({
  name: string().trim().min(1, 'Please enter a name to create your game'),
});

export const updateGameSchema = object({
  name: string().trim().min(1, 'Game name cannot be empty').max(75, 'Game name must be less than 75 characters'),
  description: string().trim().max(250, 'Game description must be less than 250 characters').optional(),
  image: string().nullable().optional(),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

// Group the errors by question index
export function groupQuestionErrors(error: z.ZodError): Record<number, string[]> {
  const grouped: Record<number, string[]> = {};

  for (const issue of error.issues) {
    const [field, index, ...rest] = issue.path;

    if (field === 'questions' && typeof index === 'number') {
      const msg = issue.message;
      if (!grouped[index]) grouped[index] = [];
      grouped[index].push(msg);
    }
  }

  return grouped;
}