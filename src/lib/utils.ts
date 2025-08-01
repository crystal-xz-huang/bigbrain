import type { Question } from '@prisma/client';

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

const randNum = (max: number) =>
  Math.floor(Math.random() * (max - 100000) + 100000);

/***************************************************************
                     Helper Functions
***************************************************************/

export const isEmptyString = (value?: string) => {
  return !value || value.trim() === '';
};

export const pluralSuffix = (count: number) => (count > 1 ? 's' : '');

/***************************************************************
                     Date / Time
***************************************************************/

const timeAgo = (timestamp: string | number | Date) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();

  return{
    seconds: Math.floor((diff) / 1000),
    minutes: Math.floor((diff) / (1000 * 60)),
    hours: Math.floor((diff) / (1000 * 60 * 60)),
    days: Math.floor((diff) / (1000 * 60 * 60 * 24)),
    weeks: Math.floor((diff) / (1000 * 60 * 60 * 24 * 7)),
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

/***************************************************************
                     User
***************************************************************/
export const getInitials = (name: string) => {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.toUpperCase();
};

/***************************************************************
                     Game
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
