import {
  CountsRule,
  PASSWORD_REGEX,
  EDITING_RULES,
} from '@/lib/definitions/constants';
import type {
  AdminGamesListItemDTO,
  AnswerDTO,
  GameEditDTO,
  GamesListDTO,
  GamesListItemDTO,
  LibraryListItemDTO,
  ParsedResult,
  PlayerAnswerPayload,
  PublicGamesListItemDTO,
  QuestionDTO,
} from '@/lib/definitions/types';
import {
  AdminOwnerGamesListItemDTO,
  UserStatsDTO,
} from '@/lib/definitions/types';
import { GameSessionAnswer, QuestionType } from '@prisma/client';
import * as z from 'zod';

/***************************************************************
                      Data Input
***************************************************************/
/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file: File): Promise<string> {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('Invalid file type. Please upload a PNG, JPG, or JPEG.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise as Promise<string>;
}


/***************************************************************
                     Slug Helpers
***************************************************************/
/**
 * Convert a string to a slug format. For example, "Dog 1234" becomes "dog-1234".
 * @param {string} s - The string to convert.
 * @returns {string | null} - The slugified string or null if input is invalid.
 */
export const slugify = (s: string): string | null => {
  if (!s || typeof s !== 'string' || s.trim() === '') return null;
  return s
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Convert a slug back to a human-readable format. For example, "dog-1234" becomes "Dog 1234".
 * @param {string} slug The slug to convert.
 * @returns {string} The human-readable string.
 */
export const unslugify = (slug: string): string | null => {
  if (!slug || typeof slug !== 'string' || slug.trim() === '') return null;
  return slug
    .replace(/-/g, ' ') // replace hyphens with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letter of each word
};

/***************************************************************
                     ID Generation
***************************************************************/

/**
 * Generates a unique ID that is not already in the current list.
 * The ID will be a string of exactly `length` digits, with no leading zeros.
 * If the current list is full, it will increase the length and try again.
 *
 * @param currentList - The list of existing IDs to avoid duplicates
 * @param length - The desired length of the generated ID (default is 6)
 * @returns A unique ID as a string with exactly `length` digits (or more if needed).
 */
export function generateId(currentList: string[], length = 6): string {
  const used = new Set(currentList);
  let L = length;

  while (true) {
    const min = Math.pow(10, L - 1);
    const max = Math.pow(10, L) - 1;
    const total = max - min + 1; // number of L-digit numbers (no leading zeros)

    // How many used IDs already have this length?
    let usedOfLen = 0;
    for (const id of used) if (id.length === L) usedOfLen++;

    // If the space is exhausted, increase length and try again.
    if (usedOfLen >= total) {
      L++;
      continue;
    }

    // Try random sampling a few times (fast when space isn't too full).
    for (let tries = 0; tries < 50; tries++) {
      const candidate = String(randomNum(L));
      if (!used.has(candidate)) return candidate;
    }

    // If it's very full (random failed repeatedly), expand the length to avoid long loops.
    L++;
  }
}

/**
 * Generates a random number with exactly `L` digits.
 * @param L - The number of digits (e.g., 6 for a 6-digit number)
 * @returns A random number as a string with exactly `L` digits.
 */
const randomNum = (L: number) => {
  const min = Math.pow(10, L - 1);
  const total = Math.pow(10, L) - min; // = 9 * 10^(L-1)
  return Math.floor(Math.random() * (total + 1)) + min;
};

/***************************************************************
                      Data Validation
***************************************************************/

export const isEmptyString = (value: string): boolean => {
  return !value || value.trim() === '';
};

export const isNullOrUndefined = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
};

export const isTooLong = (text: string, maxLength: number): boolean => {
  return text.length > maxLength;
};

export const validatePassword = (password: string): boolean =>
  PASSWORD_REGEX.test(password);

export function parseFormData<T, S extends z.ZodType<T>>(
  formData: FormData,
  schema: S
): ParsedResult<T> {
  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    console.error('Pretty errors:', z.prettifyError(parsed.error));
    console.error('Treeify errors:', z.treeifyError(parsed.error));
    console.error('Flattened errors:', z.flattenError(parsed.error));
    console.error('Error issues:', parsed.error.issues);
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: z.flattenError(parsed.error).fieldErrors,
      inputs: data,
      // also return the parsed error from zod
      error: parsed.error,
    };
  }

  console.log('Parsed data:', parsed.data);
  return {
    success: true,
    inputs: data,
    // return the parsed data from zod
    data: parsed.data,
  };
}

/** Format a ZodError as a human-readable string in the following form.
 *
 * From
 *
 * ```ts
 * ZodError {
 *   issues: [
 *     {
 *       expected: 'string',
 *       code: 'invalid_type',
 *       path: [ 'username' ],
 *       message: 'Invalid input: expected string'
 *     },
 *     {
 *       expected: 'number',
 *       code: 'invalid_type',
 *       path: [ 'favoriteNumbers', 1 ],
 *       message: 'Invalid input: expected number'
 *     }
 *   ];
 * }
 * ```
 *
 * to
 *
 * ```
 * username
 *   ✖ Expected number, received string at "username
 * favoriteNumbers[0]
 *   ✖ Invalid input: expected number
 * ```
 */
export function formatZodIssues(issues: z.core.$ZodIssue[]): string {
  // Group issues by keys
  const errorMap = new Map<string, string[]>();
  const push = (key: string, msg: string) => {
    const arr = errorMap.get(key);
    if (arr) arr.push(msg);
    else errorMap.set(key, [msg]);
  };
  for (const { path, message } of issues) {
    if (typeof path[0] === 'string' && typeof path[1] === 'number') {
      // e.g. ['questions', 0, 'title'] -> question 1
      // or [ 'favoriteNumbers', 1 ] -> favourite number 2
      const label = path[0].endsWith('s') ? path[0].slice(0, -1) : path[0];
      const index = (path[1] as number) + 1;
      const key = `${label} ${index}`;
      push(key, message);
    } else {
      const key = 'general';
      push(key, message);
    }
  }
  // Format the output
  const lines: string[] = [];
  const general = errorMap.get('general');
  if (general) {
    for (const msg of general) lines.push(`✖ ${msg}`);
    errorMap.delete('general');
  }
  for (const [key, msgs] of errorMap) {
    lines.push(`✖ ${key}`);
    for (const m of msgs) lines.push(`  → ${m}`);
  }
  return lines.join('\n');
}

export function clean(tag: string): string {
  return tag.trim().replace(/\s+/g, ' ');
}

export function normalize(tag: string): string {
  return tag.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function cleanTags(tags: string[]): string[] {
  const cleaned = tags.map((t) => t.trim().replace(/\s+/g, ' ').toLowerCase());
  return Array.from(new Set(cleaned)).filter(Boolean); // Remove empty strings
}

/***************************************************************
                     String Transformation
***************************************************************/

export type CaseType = 'lower' | 'upper' | 'capitalized' | 'sentence' | 'title';

export const convertCase = (str: string, caseType: CaseType) => {
  switch (caseType) {
    case 'lower':
      // lower case
      return str.toLowerCase();
    case 'upper':
      // UPPER CASE
      return str.toUpperCase();
    case 'capitalized':
      // Capitalized Case: first letter of each word uppercase, rest lowercase
      return str.replace(
        /\w\S*/g,
        (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
      );
    case 'title':
      // Title Case (same as Capitalized for simplicity):
      return str.replace(
        /\w\S*/g,
        (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
      );
    case 'sentence':
      // Sentence case: first letter uppercase, rest lowercase
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    default:
      return str;
  }
};

/**
 * Pluralizes a word based on the given number.
 * If no custom plural form is provided, it defaults to the singular word + s.
 *
 * @param n The number to base the pluralization on
 * @param word The singular form of the word
 * @param plural The plural form of the word (optional, defaults to word + 's')
 * @returns The singular or plural form of the word based on the number
 * @example
 * pluralize(0, 'cat') // returns '0 cats'
 * pluralize(1, 'cat') // returns '1 cat'
 * pluralize(2, 'person', 'people') // returns '2 people'
 */
export const pluralize = (
  n: number,
  word: string,
  plural = word + 's'
): string => {
  // If the value is 1 or -1, return the singular form of the word
  const _pluralize = (n: number, w: string, plural = w + 's') =>
    [1, -1].includes(Number(n)) ? word : plural;
  return `${n} ${_pluralize(n, word, plural)}`;
};

/**
 *
 * @param n The number to base the pluralization on
 * @example
 * formatCardinals(0) // returns 'zero'
 * formatCardinals(1) // returns 'one'
 * formatCardinals(2) // returns 'two'
 * formatCardinals(3) // returns 'few'
 * formatCardinals(11) // returns 'many'
 */
export const formatCardinals = (n: number): string => {
  const arCardinalRules = new Intl.PluralRules('ar-EG');
  return arCardinalRules.select(n);
};

/**
 * Formats a number with its ordinal suffix.
 * @param n The number to format
 * @returns The number with its ordinal suffix (e.g., 1st, 2nd, 3rd, 4th)
 * @example
 * formatOrdinals(1) // returns "1st"
 * formatOrdinals(2) // returns "2nd"
 * @tutorial https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
 */
export const formatOrdinals = (n: number): string => {
  const enOrdinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' });
  const suffixes = new Map([
    ['one', 'st'],
    ['two', 'nd'],
    ['few', 'rd'],
    ['other', 'th'],
  ]);
  const rule = enOrdinalRules.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
};

/**
 * Splits a string into `split` parts.
 * @param string - The string to split
 * @param split  - The number of parts to split the string into (default is 2)
 * @returns An array containing the two parts of the string.
 */
export const splitString = (string: string, split = 2): string[] => {
  const length = string.length;
  const partLength = Math.ceil(length / split);
  return Array.from({ length: split }, (_, i) =>
    string.slice(i * partLength, (i + 1) * partLength)
  );
};

/**
 * Splits an array into `split` parts.
 * @param array - The array to split
 * @param split - The number of parts to split the array into (default is 2)
 * @returns An array of arrays, each containing a part of the original array.
 */
export const splitArray = <T>(array: T[], split = 2): T[][] => {
  const result: T[][] = [];
  const minSize = Math.floor(array.length / split);
  let remainder = array.length % split;

  let start = 0;
  for (let i = 0; i < split; i++) {
    const size = minSize + (remainder > 0 ? 1 : 0);
    remainder--;
    result.push(array.slice(start, start + size));
    start += size;
  }

  return result;
};

/***************************************************************
                     String Generation
***************************************************************/

/**
 * Generates a default game name
 * @returns A string in the format "Untitled Draft MM/DD/YYYY HH:MM AM/PM"
 */
export const generateDefaultGameName = (): string => {
  const now = new Date();
  return `Untitled Draft ${now.toLocaleDateString()} ${now.toLocaleTimeString(
    [],
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }
  )}`;
};

/**
 * Generates a random alphanumeric string of a specified length.
 * @param length - The length of the random string to generate
 * @returns A random alphanumeric string of the specified length
 */
export const generateRandomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/***************************************************************
                     Date / Time
***************************************************************/

const TIME_UNITS_IN_MS = {
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  days: 1000 * 60 * 60 * 24,
  weeks: 1000 * 60 * 60 * 24 * 7,
  months: 1000 * 60 * 60 * 24 * 30,
  years: 1000 * 60 * 60 * 24 * 365,
} as const;

const getTimeUnits = (ms: number) => {
  return {
    seconds: Math.floor(ms / TIME_UNITS_IN_MS.seconds),
    minutes: Math.floor(ms / TIME_UNITS_IN_MS.minutes),
    hours: Math.floor(ms / TIME_UNITS_IN_MS.hours),
    days: Math.floor(ms / TIME_UNITS_IN_MS.days),
    weeks: Math.floor(ms / TIME_UNITS_IN_MS.weeks),
    months: Math.floor(ms / TIME_UNITS_IN_MS.months),
    years: Math.floor(ms / TIME_UNITS_IN_MS.years),
  };
};

const getTimeUnitsFromNow = (timestamp: string | Date) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();
  return getTimeUnits(diff);
};

// format as "MMM DD, YYYY"
export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date to show how long ago it was updated.
 *
 * @param date The date to format (ISO string or Date object)
 * @returns A human-readable string representing how long ago the update was.
 * @example Returns "Saved just now" or "Last edit was saved 1 minute ago, 2 hours ago, 3 days ago, 1 week ago, on MM/DD/YYYY"
 */
export const formatLastUpdated = (timestamp: string | Date): string => {
  const diff = getTimeUnitsFromNow(timestamp);
  const prefix = diff.minutes < 1 ? 'Saved ' : 'Last edit was saved ';
  const suffix = ' ago';
  // less than 1 minute ago
  if (diff.minutes < 1) {
    return `${prefix} just now`;
  }
  // less than 1 hour ago
  else if (diff.minutes < 60) {
    return prefix + pluralize(diff.minutes, 'minute') + suffix;
  }
  // less than 24 hours ago
  else if (diff.hours < 24) {
    return prefix + pluralize(diff.hours, 'hour') + suffix;
  }
  // less than 1 week ago
  else if (diff.days < 7) {
    return prefix + pluralize(diff.days, 'day') + suffix;
  }
  // less than 1 month ago
  else if (diff.weeks < 4) {
    return prefix + pluralize(diff.weeks, 'week') + suffix;
  }
  // default to date string if more than 1 month ago
  return prefix + `on ${new Date(timestamp).toLocaleDateString()}`;
};

/**
 * Formats the given time in seconds to a string in the format "Xm Ys".
 * @param seconds - The time in seconds to format
 * @returns {string} A string representing the formatted time
 * @example
 * formatDuration(45) // returns "45s"
 * formatDuration(200) // returns "3m 20s"
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
};

/***************************************************************
                     User Helpers
***************************************************************/

export const getInitials = (name: string) => {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.toUpperCase();
};

export const generateUserStats = (stats: UserStatsDTO) => {
  return [
    {
      label: 'joined',
      value: stats.createdAt
        ? new Date(stats.createdAt).toLocaleDateString('default', {
            month: 'short',
            year: 'numeric',
          })
        : 'N/A',
    },
    { label: 'games', value: stats.games },
    { label: 'plays', value: stats.plays },
  ];
};

export const generateAvatarProps = (user: {
  name: string | null;
  image: string | null;
}) => {
  if (!user.name) return null;
  return user.image
    ? {
        src: user.image,
        alt: `${user.name}'s profile picture`,
      }
    : {
        alt: `${user.name}'s profile picture`,
        initials: getInitials(user.name),
      };
};

/***************************************************************
                     Game Helpers
***************************************************************/

export const isAdminGame = (
  item: GamesListItemDTO
): item is AdminGamesListItemDTO => {
  return 'active' in item && 'played' in item;
}

export const isPublicGame = (
  item: GamesListItemDTO
): item is PublicGamesListItemDTO => {
  return !('active' in item) && !('played' in item);
};

export const isAdminOwnerGame = (
  item: GamesListItemDTO
): item is AdminOwnerGamesListItemDTO => {
  return !('owner' in item) && 'active' in item && 'played' in item;
};

export const isLibraryGame = (
  item: GamesListItemDTO | LibraryListItemDTO
): item is LibraryListItemDTO => {
  return !('owner' in item) && 'status' in item && 'visibility' in item;
};

export const generateGameCardBadgeText = (game: GamesListItemDTO) => {
  if (isPublicGame(game)) return undefined;
  // Admin view
  if (game.active) return 'In progress';
  if (game.played) return 'Played';
  return '';
};

export const newAnswer = (correct: boolean): AnswerDTO => ({
  id: crypto.randomUUID(),
  title: '',
  correct,
});

export const normalizeQuestionForEditing = (q: QuestionDTO): QuestionDTO => {
  const r = EDITING_RULES[q.type];
  let answers = (q.answers ?? []).map((a) => ({ ...a }));

  // pad to min
  while (answers.length < r.min) answers.push(newAnswer(false));
  // trim to max
  if (r.max && answers.length > r.max) answers = answers.slice(0, r.max);

  // correctness rules
  switch (r.correct) {
    case CountsRule.EXACTLY_ONE: {
      let idx = answers.findIndex((a) => a.correct);
      if (idx === -1) idx = 0; // ensure one exists
      answers = answers.map((a, i) => ({ ...a, correct: i === idx }));
      break;
    }
    case CountsRule.AT_LEAST_ONE: {
      if (!answers.some((a) => a.correct)) answers[0].correct = true;
      break;
    }
    case CountsRule.ALL: {
      answers = answers.map((a) => ({ ...a, correct: true }));
      break;
    }
  }

  return { ...q, answers };
};

export const generateAnswersForQuestionType = (
  question: QuestionDTO,
  type: QuestionType
): AnswerDTO[] => {
  const next = normalizeQuestionForEditing({ ...question, type });
  return next.answers;
};

export const normalizeGameForEditing = (game: GameEditDTO): GameEditDTO => {
  return {
    ...game,
    questions: game.questions.map(normalizeQuestionForEditing),
  };
};

// export const isValidGame = (game: GameWithQuestions) => {
//   return (
//     game &&
//     game.questions &&
//     game.questions.length > 0 &&
//     game.questions.every(
//       (q) =>
//         q.answers &&
//         q.answers.length > 0 &&
//         q.answers.every((a) => !isNullOrUndefined(a.title))
//     )
//   );
// };

// export const isInvalidGame = (game: GameWithQuestions) => {
//   return (
//     !game.questions ||
//     game.questions.length === 0 ||
//     game.questions.some(
//       (q) =>
//         !q.answers ||
//         q.answers.length === 0 ||
//         q.answers.some((a) => isNullOrUndefined(a.title))
//     )
//   );
// };

// export const generateGameErrorMessage = (game: GameWithQuestions) => {
//   if (!game.questions || game.questions.length === 0) {
//     return 'Missing questions';
//   }

//   const answerCount = game.questions.filter(
//     (q) =>
//       !q.answers ||
//       q.answers.length === 0 ||
//       q.answers.some((a) => isNullOrUndefined(a.title))
//   ).length;

//   if (answerCount > 0) {
//     return `${answerCount} answer${pluralSuffix(answerCount)} missing`;
//   }

//   return '';
// };

/***************************************************************
                     Pagination
***************************************************************/

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

/***************************************************************
                     Player Helpers
***************************************************************/

export const validatePlayerSelection = (
  payload: PlayerAnswerPayload,
  questionType: QuestionType,
  answers: GameSessionAnswer[]
) => {
  let selectedIds: string[] = [];
  const validIds = new Set(answers.map((a) => a.id));

  if (
    'selectedAnswerIds' in payload &&
    Array.isArray(payload.selectedAnswerIds)
  ) {
    selectedIds = [...new Set(payload.selectedAnswerIds)].filter((id) =>
      validIds.has(id)
    );
  } else if ('text' in payload && typeof payload.text === 'string') {
    const norm = payload.text.trim().toLowerCase();
    const match = answers.find((a) => a.title.trim().toLowerCase() === norm);
    if (match) selectedIds = [match.id];
  }

  if (
    questionType === QuestionType.SINGLE ||
    questionType === QuestionType.TYPE_ANSWER
  ) {
    selectedIds = selectedIds.slice(0, 1);
  }

  return selectedIds;
};

export const gradePlayerSelection = (
  selection: string[],
  questionType: QuestionType,
  answers: GameSessionAnswer[]
) => {
  const correctSet = new Set(answers.filter((a) => a.correct).map((a) => a.id));
  const selectedSet = new Set(selection);

  let correct = true;
  if (questionType === QuestionType.MULTIPLE) {
    correct =
      selectedSet.size === correctSet.size &&
      [...selectedSet].every((id) => correctSet.has(id));
  } else {
    const [only] = selection;
    correct = !!only && correctSet.has(only);
  }

  return correct;
};
