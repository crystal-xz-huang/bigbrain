import type { AnswerDTO, QuestionDTO } from '@/lib/definitions/types';
import { Field, Input, InputGroup, Label, FieldGroup } from '../fieldset';
import { MAX_ANSWER_TITLE_LENGTH } from '@/lib/definitions/constants';
import { QuestionType } from '@prisma/client';
import clsx from 'clsx';
import React from 'react';

/***************************************************************
                     Answer Inputs
***************************************************************/

type Props = {
  question: QuestionDTO;
  setQuestion: (q: QuestionDTO) => void;
  onAddAnswer: (questionId: string, correct: boolean) => void;
};

type SingleChoiceProps = Omit<Props, 'onAddAnswer'>;
type MultipleChoiceProps = Omit<Props, 'onAddAnswer'>;
type TypeAnswerProps = Props;

export default function InputQuestionAnswers({ ...props }: Props) {
  switch (props.question.type) {
    case QuestionType.SINGLE:
      return <SingleChoiceAnswersInput {...props} />;
    case QuestionType.MULTIPLE:
      return <MultipleChoiceAnswersInput {...props} />;
    case QuestionType.TYPE_ANSWER:
      return <TypeAnswersInput {...props} />;
    default:
      throw new Error('Invalid question type');
  }
}

function SingleChoiceAnswersInput({
  question,
  setQuestion,
}: SingleChoiceProps) {
  const correctAnswer = question.answers.find((a) => a.correct);
  const falseAnswers = question.answers.filter((a) => !a.correct);

  // double-check we always have 4 answers: 1 correct, 3 false
  if (!correctAnswer || falseAnswers.length !== 3) {
    throw new Error(
      'Single choice questions must have 1 correct and 3 false answers'
    );
  }

  const handleChange = (answerId: string, patch: Partial<AnswerDTO>) => {
    setQuestion({
      ...question,
      answers: question.answers.map((a) =>
        a.id === answerId ? { ...a, ...patch } : a
      ),
    });
  };

  return (
    <FieldGroup>
      {/* Correct Answer */}
      {correctAnswer && (
        <Field color="green">
          <Label>Correct answer</Label>
          <InputGroup>
            <Input
              required
              placeholder="Required"
              maxLength={MAX_ANSWER_TITLE_LENGTH}
              value={correctAnswer.title}
              onChange={(e) =>
                handleChange(correctAnswer.id, { title: e.target.value })
              }
            />
          </InputGroup>
        </Field>
      )}

      {/* False Answers (at least 1 non-empty) */}
      <Field color="red">
        <Label>False answers</Label>
        <InputGroup>
          {falseAnswers.map((a, idx) => (
            <Input
              key={idx}
              required={idx === 0} // at least 1 non-empty answer
              placeholder={idx === 0 ? 'Required' : 'Optional'}
              maxLength={MAX_ANSWER_TITLE_LENGTH}
              value={a.title}
              onChange={(e) => handleChange(a.id, { title: e.target.value })}
            />
          ))}
        </InputGroup>
      </Field>
    </FieldGroup>
  );
}

function MultipleChoiceAnswersInput({
  question,
  setQuestion,
}: MultipleChoiceProps) {
  // min 2 non-empty answers, at least 1 correct
  if (question.answers.length !== 4) {
    throw new Error('Multiple choice questions must have exactly 4 answers');
  }

  const handleChange = (answerId: string, patch: Partial<AnswerDTO>) => {
    setQuestion({
      ...question,
      answers: question.answers.map((a) =>
        a.id === answerId ? { ...a, ...patch } : a
      ),
    });
  };

  // sort questions by correct first, then by title
  const answers = [...question.answers].sort((a, b) => {
    if (a.correct === b.correct) {
      return a.title.localeCompare(b.title);
    }
    return a.correct ? -1 : 1;
  });

  return (
    <Field color="teal">
      <Label>Select the correct answer(s)</Label>
      <InputGroup>
        {answers.map((a, idx) => (
          <span
            key={idx}
            data-slot="control"
            className="w-full flex flex-row items-center space-x-3"
          >
            <CheckboxButton
              correct={a.correct}
              setCorrect={(value) => handleChange(a.id, { correct: !!value })}
            />
            <Input
              required={idx < 2} // at least 2 non-empty answers
              placeholder={idx < 2 ? 'Required' : 'Optional'}
              maxLength={MAX_ANSWER_TITLE_LENGTH}
              value={a.title}
              onChange={(e) => handleChange(a.id, { title: e.target.value })}
            />
          </span>
        ))}
      </InputGroup>
    </Field>
  );
}

function TypeAnswersInput({
  question,
  setQuestion,
  onAddAnswer,
}: TypeAnswerProps) {
  // At least 1 non-empty answer
  if (question.answers.length < 1) {
    throw new Error('Type answer questions must have at least 1 answer');
  }

  const handleChange = (answerId: string, patch: Partial<AnswerDTO>) => {
    setQuestion({
      ...question,
      answers: question.answers.map((a) =>
        a.id === answerId ? { ...a, ...patch } : a
      ),
    });
  };

  return (
    <Field color="green">
      <Label>Answer</Label>
      <InputGroup>
        {question.answers.map((a, idx) => (
          <div data-slot='control' key={idx} className="flex flex-col w-full">
            <Input
              required={idx === 0} // at least 1 non-empty answer
              placeholder={idx === 0 ? 'Required' : 'Optional'}
              maxLength={MAX_ANSWER_TITLE_LENGTH}
              value={a.title}
              onChange={(e) => handleChange(a.id, { title: e.target.value })}
              aria-describedby={`hint-${idx}`}
            />
            {a.title.length > 20 && (
              <Hint id={`hint-${idx}`}>Long answers can be very challenging to type</Hint>
            )}
          </div>
        ))}
        {question.answers.length < 10 && ( // Max 10 answers
          <AddAnswerButton onClick={() => onAddAnswer(question.id, true)} />
        )}
      </InputGroup>
    </Field>
  );
}

/***************************************************************
                     Components
***************************************************************/

function AddAnswerButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="cursor-pointer group disabled:opacity-50 relative flex flex-row items-center justify-center w-full my-3 overflow-hidden text-sm font-bold leading-none text-center text-white bg-transparent rounded-lg"
      {...props}
    >
      <span className="font-bold underline">Add other accepted answer</span>
    </button>
  );
}

function CheckboxButton({
  correct,
  setCorrect,
}: {
  correct: boolean;
  setCorrect: (checked: boolean) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCorrect(!correct);
  };

  return (
    <button
      className="relative flex group text-lg font-black leading-6 text-black py-3 touch-manipulation cursor-pointer pointer-events-auto px-3 ml-2 rounded-none"
      type="button"
      onClick={handleClick}
    >
      <div className="-inset-1 absolute z-0 rounded-[0.625rem]" />
      <div className="absolute inset-x-0 top-0 bottom-0 transform group-active:translate-y-0.5 group-active:bottom-0.5 z-1 p-0 rounded-none">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 overflow-hidden shadow-hard-0.5 rounded-[0.75rem]" />
          <div
            className={clsx(
              'top-1 absolute inset-x-0 bottom-0 overflow-hidden rounded-[0.4375rem]',
              correct ? 'bg-correct' : 'bg-false'
            )}
          >
            <div className="bg-black/30 absolute inset-0" />
          </div>
          <div
            className={clsx(
              'bottom-1 absolute inset-x-0 top-0 overflow-hidden group-active:bottom-0.5 rounded-[0.4375rem]',
              correct ? 'bg-correct' : 'bg-false'
            )}
          >
            <div className="group-hover:bg-white/20 bg-white/0 absolute inset-0" />
          </div>
        </div>
      </div>
      <div className="relative flex flex-row gap-x-4 items-center w-full min-h-full pointer-events-none z-2 transform -translate-y-0.5 group-active:translate-y-0 rounded-none">
        <div className="flex flex-col flex-1 items-center">
          <div className="relative">
            {correct ? (
              // Checkmark icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 text-white fill-transparent scale-[1.5]"
              >
                <rect width={24} height={24} rx="5.336" />
                <path
                  d="m12.52 17.02 6.17-9.528a4.431 4.43 0 0 0 .25-.465 1.37 1.37 0 0 0 .095-.488 1.084 1.084 0 0 0-.405-.881 1.453 1.453 0 0 0-.917-.334 1.322 1.322 0 0 0-1.12.727l-5.372 8.6-2.502-3.11a1.727 1.727 0 0 0-.512-.464 1.286 1.286 0 0 0-.595-.143 1.191 1.191 0 0 0-.894.381 1.191 1.191 0 0 0-.37.905 1.489 1.489 0 0 0 .37.977l3.204 3.895a1.977 1.977 0 0 0 .608.524 1.56 1.56 0 0 0 .726.179 1.465 1.465 0 0 0 1.263-.775z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              // X icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                className="w-6 text-white fill-transparent scale-[1.2]"
              >
                <path
                  fill="currentColor"
                  d="m16.4 20-9.09-9.08a2.65 2.65 0 0 1 0-3.58 2.63 2.63 0 0 1 3.58 0L20 16.4l9.07-9.08a2.542 2.542 0 0 1 3.59 3.6L23.6 20l9.07 9.08a2.54 2.54 0 0 1-3.59 3.59L20 23.6l-9.09 9.09a2.553 2.553 0 0 1-3.61-3.61z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function Hint({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-live="polite"
      className={clsx(
        className,
        'px-1 pb-2 italic font-medium text-right text-white/75 text-sm/6'
      )}
      {...props}
    />
  );
}
