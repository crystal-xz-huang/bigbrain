/***************************************************************
                     Helpers
***************************************************************/
export const pluralSuffix = (count: number) => count > 1 ? 's' : '';

export const isEmptyString = (value?: string) => {
  return !value || value.trim() === '';
}

export const uid = () => {
  const num = Math.floor(Math.random() * 1000000);
  return num.toString().padStart(10, '0');
}

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
export const getTotalDuration = (questions) => {
  if (!questions || questions.length === 0) {
    return '0 seconds';
  }
  // if questions exist, sum the duration of each question
  const total = questions.reduce((acc, question) => {
    // if question has no duration, return 0
    if (!question.duration) {
      return acc;
    }
    // if question has duration, add to total
    return acc + question.duration;
  }, 0);

  // if total is less than 60, return in seconds
  if (total < 60) {
    return `${total} seconds`;
  }
  // if total is greater than 60, return in minutes
  const minutes = Math.floor(total / 60);
  return `${minutes} min`;
};


export const getNumberOfQuestions = (questions) => {
  // if no questions, return 0
  if (!questions || questions.length === 0) {
    return '0 questions';
  }
  const count = questions.length;
  return `${count} question${pluralSuffix(count)}`;
};
