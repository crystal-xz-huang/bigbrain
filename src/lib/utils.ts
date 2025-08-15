import type {
  GameWithQuestions,
  PlayerAnswerPayload,
  QuestionWithAnswers,
} from '@/lib/types';
import {
  GameSessionAnswer,
  Question,
  QuestionAnswer,
  QuestionType,
} from '@prisma/client';

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
                     ID Generation
***************************************************************/

const randNum = (max: number) =>
  Math.floor(Math.random() * (max - 100000) + 100000);

export const uid = () => {
  const num = Math.floor(Math.random() * 1000000);
  return num.toString().padStart(10, '0');
};

export const generateId = (currentList: string[], max = 999999999) => {
  let R = randNum(max);
  while (currentList.includes(R.toString())) {
    R = randNum(max);
  }
  return R.toString();
};

/***************************************************************
                      Data Validation
***************************************************************/

export const isEmptyString = (value?: string): boolean => {
  return !value || value.trim() === '';
};

export const isNullOrUndefined = (value?: any): boolean => {
  return value === null || value === undefined || isEmptyString(value);
};

export const isTooLong = (text: string, maxLength: number): boolean => {
  return text.length > maxLength;
};

/***************************************************************
                     String Transformation
***************************************************************/

export const pluralSuffix = (count: number): string => (count > 1 ? 's' : '');

export const ordinalSuffix = (num: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
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
                     Date / Time
***************************************************************/

const timeAgo = (timestamp: string | number | Date) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();

  return {
    seconds: Math.floor(diff / 1000),
    minutes: Math.floor(diff / (1000 * 60)),
    hours: Math.floor(diff / (1000 * 60 * 60)),
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    weeks: Math.floor(diff / (1000 * 60 * 60 * 24 * 7)),
  };
};

export const formatLastUpdated = (date: Date) => {
  const diff = timeAgo(date);

  // less than 1 minute ago
  if (diff.minutes < 1) {
    return 'just now';
  }
  // less than 1 hour ago
  else if (diff.minutes < 60) {
    return `${diff.minutes} min${pluralSuffix(diff.minutes)} ago`;
  }
  // less than 24 hours ago
  else if (diff.hours < 24) {
    return `${diff.hours}h ago`;
  }
  // default to days
  return `${diff.days} day${pluralSuffix(diff.days)} ago`;
};

/**
 * Formats a total time in seconds into a human-readable string.
 * @param total - Total time in seconds
 * @returns A formatted string representing the time in minutes and seconds.
 */
export const formatTime = (total: number) => {
  if (total < 60) {
    return `${total} sec${pluralSuffix(total)}`;
  }
  // if total is greater than 60, return in minutes
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes} min${pluralSuffix(minutes)} ${seconds} sec${pluralSuffix(
    seconds
  )}`;
};

export const addMs = (date: Date, ms: number): Date => {
  return new Date(date.getTime() + ms);
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

export const generateUserStats = (stats: {
  joinedAt: Date | undefined;
  totalGames: number;
}) => {
  return [
    {
      label: 'joined',
      value:
        stats?.joinedAt?.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        }) || 'N/A',
    },
    { label: 'games', value: stats?.totalGames || 0 },
  ];
};

/***************************************************************
                     Game Helpers
***************************************************************/
/**
 * Calculates the total duration of all questions in a game.
 * @param questions - Array of questions
 * @returns Total duration in seconds
 */
export const totalDuration = (questions: Question[]) => {
  if (!questions || questions.length === 0) return 0;
  return questions.reduce((acc, question) => {
    if (!question.duration) return acc;
    return acc + question.duration;
  }, 0);
};

/**
 * Calculates the total number of questions in a game.
 * @param questions - Array of questions
 * @returns Total number of questions
 */
export const totalNumberOfQuestions = (questions: Question[]) => {
  if (!questions || questions.length === 0) return 0;
  return questions.length;
};

/**
 * Creates a new answer object with a unique ID.
 * @param questionId - The ID of the question this answer belongs to
 * @param correct - Whether the answer is correct
 * @returns A new answer object
 */
export const newAnswer = (
  questionId: string,
  correct: boolean
): QuestionAnswer => {
  return {
    id: uid(),
    title: '',
    questionId,
    correct,
  };
};

/**
 * Generates answers for a question based on its type.
 * @param question - The question object
 * @param type - The new type to change to
 * @return {Answer[]}
 */
export const generateAnswersForQuestionType = (
  question: QuestionWithAnswers,
  type: QuestionType
) => {
  switch (type) {
    case QuestionType.SINGLE:
      // Ensure 1 correct answer and 3 false answers
      let correctAnswer = question.answers.find((a) => a.correct);
      const falseAnswers = question.answers.filter((a) => !a.correct);

      if (!correctAnswer) correctAnswer = newAnswer(question.id, true);
      if (falseAnswers.length !== 3) {
        while (falseAnswers.length < 3) {
          falseAnswers.push(newAnswer(question.id, false));
        }
        falseAnswers.splice(3);
      }

      return [correctAnswer, ...falseAnswers];
      break;

    case QuestionType.MULTIPLE:
      // Ensure exactly 4 answers with at least one correct
      const a = question.answers.slice(0, 4);
      while (a.length < 4) {
        a.push(newAnswer(question.id, false));
      }
      if (!a.some((a) => a.correct)) a[0].correct = true;

      return a;
      break;

    case QuestionType.TYPE_ANSWER:
      const totalCount = question.answers.length;
      const validAnswers = question.answers.filter(
        (a) => !isEmptyString(a.title)
      );

      let updatedAnswers;
      if (validAnswers.length === 0 && totalCount > 0) {
        updatedAnswers = question.answers.slice(0, 1);
      } else if (validAnswers.length === 0 && totalCount === 0) {
        updatedAnswers = [newAnswer(question.id, true)];
      } else {
        updatedAnswers = validAnswers;
      }
      return updatedAnswers;
      break;

    default:
      console.error('Invalid question type:', type);
      return question.answers;
      break;
  }
};

export const isValidGame = (game: GameWithQuestions) => {
  return (
    game &&
    game.questions &&
    game.questions.length > 0 &&
    game.questions.every(
      (q) =>
        q.answers &&
        q.answers.length > 0 &&
        q.answers.every((a) => !isNullOrUndefined(a.title))
    )
  );
};

export const isInvalidGame = (game: GameWithQuestions) => {
  return (
    !game.questions ||
    game.questions.length === 0 ||
    game.questions.some(
      (q) =>
        !q.answers ||
        q.answers.length === 0 ||
        q.answers.some((a) => isNullOrUndefined(a.title))
    )
  );
};

export const generateGameErrorMessage = (game: GameWithQuestions) => {
  if (!game.questions || game.questions.length === 0) {
    return 'Missing questions';
  }

  const answerCount = game.questions.filter(
    (q) =>
      !q.answers ||
      q.answers.length === 0 ||
      q.answers.some((a) => isNullOrUndefined(a.title))
  ).length;

  if (answerCount > 0) {
    return `${answerCount} answer${pluralSuffix(answerCount)} missing`;
  }

  return '';
};

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
