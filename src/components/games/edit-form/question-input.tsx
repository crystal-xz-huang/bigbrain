'use client';

import {
  Field,
  Input,
  InputGroup,
  Label,
} from '@/components/games/edit-form/input';
import type { Answer } from '@/lib/types';
import { isEmptyString } from '@/lib/utils';
import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

export function QuestionFieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(className, 'p-4 gap-4 flex flex-col items-start')}
    />
  );
}

export function QuestionField({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, 'as' | 'className'>) {
  return (
    <Headless.Field
      {...props}
      className={clsx(
        className,
        'flex items-center justify-between gap-3 px-4 py-2 bg-black/10 dark:bg-black/30 rounded-lg'
      )}
    />
  );
}

export function QuestionLabel({
  className,
  ...props
}: { className?: string } & Omit<Headless.LabelProps, 'as' | 'className'>) {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className={clsx(
        className,
        'text-base/6 text-zinc-950 select-none data-disabled:opacity-50 sm:text-sm/6 dark:text-white',
        'font-bold text-sm sm:text-xs whitespace-nowrap'
      )}
    />
  );
}

/***************************************************************
                     Answer Input Components
***************************************************************/
type AnswerInputProps = {
  answers: Answer[];
  handleChange: (
    id: string,
    key: keyof Answer,
    value: string | boolean
  ) => void;
};

export function SingleAnswerInput({ answers, handleChange }: AnswerInputProps) {
  const correctAnswer = answers.find((a) => a.correct);
  const falseAnswers = answers.filter((a) => !a.correct);

  return (
    <>
      {/* Correct Answer */}
      {correctAnswer && (
        <Field>
          <Label
            htmlFor="correct-answer"
            className="bg-correct"
            invalid={isEmptyString(correctAnswer.title || '')}
          >
            Correct answer
          </Label>
          <InputGroup id="correct-answer" className="bg-correct">
            <Input
              placeholder="Required"
              maxLength={75}
              value={correctAnswer.title || ''}
              onChange={(e) =>
                handleChange(correctAnswer.id, 'title', e.target.value)
              }
            />
          </InputGroup>
        </Field>
      )}

      {/* False Answers (at least 1 non-empty) */}
      <Field>
        <Label
          htmlFor="false-answers"
          className="bg-false"
          invalid={
            falseAnswers.filter((a) => !isEmptyString(a.title)).length < 1
          }
        >
          False answers
        </Label>
        <InputGroup
          id="false-answers"
          className="bg-false flex flex-col gap-y-2"
        >
          {falseAnswers.map((a, idx) => (
            <Input
              key={idx}
              placeholder={idx === 0 ? 'Required' : 'Optional'}
              maxLength={75}
              value={a.title}
              onChange={(e) => handleChange(a.id, 'title', e.target.value)}
            />
          ))}
        </InputGroup>
      </Field>
    </>
  );
}

export function MultipleAnswerInput({
  answers,
  handleChange,
}: AnswerInputProps) {
  return (
    <Field>
      <Label
        htmlFor="answers"
        className="bg-neutral"
        invalid={
          // At least 1 correct answer and 2 non-empty answers
          answers.filter((a) => a.correct).length < 1 ||
          answers.filter((a) => !isEmptyString(a.title)).length < 2
        }
      >
        Select the correct answer(s)
      </Label>
      <InputGroup
        id="answers"
        className="bg-neutral flex flex-col items-start space-y-3"
      >
        {answers.map((a, idx) => (
          <div
            key={idx}
            className="w-full flex flex-row items-center space-x-3"
          >
            <CheckboxButton
              correct={a.correct}
              setCorrect={(value) => handleChange(a.id, 'correct', value)}
            />
            <Input
              placeholder={idx < 2 ? 'Required' : 'Optional'}
              maxLength={75}
              value={a.title}
              onChange={(e) => handleChange(a.id, 'title', e.target.value)}
            />
          </div>
        ))}
      </InputGroup>
    </Field>
  );
}

export function TypeAnswerInput({
  answers,
  handleChange,
  addNewAnswer,
}: AnswerInputProps & { addNewAnswer: () => void }) {
  return (
    <Field>
      <Label
        htmlFor="answers"
        className="bg-correct"
        invalid={isEmptyString(answers[0].title)}
      >
        Answer
      </Label>
      <InputGroup
        id="answers"
        className="bg-correct flex flex-col items-start gap-y-1 "
      >
        {answers.map((a, idx) => (
          <div key={idx} className="w-full">
            <Input
              placeholder={idx === 0 ? 'Required' : 'Optional'}
              maxLength={75}
              value={a.title}
              onChange={(e) => handleChange(a.id, 'title', e.target.value)}
            />
            {a.title.length > 20 && (
              <Hint>Long answers can be very challenging to type</Hint>
            )}
          </div>
        ))}
        {answers.length < 10 && <AddAnswerButton onClick={addNewAnswer} />}
      </InputGroup>
    </Field>
  );
}

/***************************************************************
                     Helper Components
***************************************************************/

function AddAnswerButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="cursor-pointer group disabled:opacity-50 relative flex flex-row items-center justify-center w-full my-3 overflow-hidden text-sm font-bold leading-none text-center text-white bg-transparent rounded-lg"
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
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        className,
        'px-1 pb-2 italic font-medium text-right text-white/75 text-sm/6'
      )}
    >
      {children}
    </div>
  );
}
