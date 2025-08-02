'use client';

import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/fieldset';
import { Text } from '@/components/ui/text';
import type { Answer, QuestionWithAnswers } from '@/lib/types';
import { fileToDataUrl, isEmptyString } from '@/lib/utils';
import * as Headless from '@headlessui/react';
import { PhotoIcon } from '@heroicons/react/20/solid';
import { QuestionType } from '@prisma/client';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { uid } from '@/lib/utils';

export function Fieldset({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldsetProps, 'as' | 'className'>) {
  return (
    <Headless.Fieldset
      {...props}
      className={clsx(
        className,
        'rounded-md border-1 border-zinc-950/10 dark:border-white/10 bg-zinc-950/5 dark:bg-white/5'
      )}
    />
  );
}

export function Field({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, 'as' | 'className'>) {
  return (
    <Headless.Field
      {...props}
      className={clsx(className, 'flex flex-col w-full')}
    />
  );
}

export function Header({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'col-span-full py-2 px-5 border-b border-zinc-300 dark:border-white/10 flex items-center justify-between',
        'font-bold text-sm/6 text-zinc-500 dark:text-zinc-400'
      )}
    />
  );
}

export function Label({
  className,
  invalid,
  children,
  ...props
}: {
  className?: string;
  invalid?: boolean;
  children?: React.ReactNode;
} & Omit<Headless.LabelProps, 'as' | 'className'>) {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className="flex flex-row justify-start w-full text-sm sm:text-xs font-bold text-white transform translate-y-[1px] h-[31px]"
    >
      <span
        className={clsx(
          className,
          'relative rounded-t-md inline-block px-3 py-2.5 leading-none'
        )}
      >
        {children}
        {invalid && <ErrorIcon />}
      </span>
    </Headless.Label>
  );
}

export function InputGroup({
  children,
  className,
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="control"
      className={clsx(className, 'rounded-b-xl rounded-tr-xl relative p-1')}
    >
      {children}
    </div>
  );
}

export function Input({
  className,
  maxLength = 75,
  value,
  onChange,
  ...props
}: {
  className?: string;
  maxLength?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<Headless.InputProps, 'as' | 'className'>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    const event = {
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!maxLength || e.target.value.length <= maxLength) {
      onChange(e);
    }
  };

  return (
    <div
      data-slot="control"
      className="relative isolate block w-full my-0 mb-0 text-left"
    >
      <div
        data-slot="buttons"
        className="z-1 right-2 top-1/2 absolute flex flex-row items-center justify-center pl-2 space-x-1 transform -translate-y-1/2"
      >
        {maxLength && (
          <CharacterCountdown maxLength={maxLength} value={value} />
        )}
        <ClearButton onClick={handleClear} />
      </div>

      {/* Input field */}
      <Headless.Input
        ref={inputRef}
        {...props}
        value={value}
        onChange={handleChange}
        className={clsx(
          className,
          // Basic layout
          'py-3 w-full mb-0 z-0 px-0 pl-3 pr-24 outline-none',
          // Typography
          'text-left font-medium text-base/6 sm:text-sm/6 text-black placeholder-black/50',
          // Border
          'border-none rounded-lg',
          // Background color
          'bg-white hover:bg-white focus:bg-white',
          // Shadow
          'shadow-inner-hard-1',
          // Focus state
          'focus:placeholder-black/0 focus:outline-none',
          // Disabled state
          'disabled:brightness-75'
        )}
      />
    </div>
  );
}

export function Textarea({
  className,
  maxLength,
  value,
  onChange,
  ...props
}: {
  className?: string;
  maxLength?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
} & Omit<Headless.TextareaProps, 'as' | 'className'>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClear = () => {
    const event = {
      target: { value: '' },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(event);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!maxLength || e.target.value.length <= maxLength) {
      onChange(e);
    }
  };

  return (
    <div className={clsx(className, 'rounded-b-xl rounded-tr-xl p-1')}>
      <div data-slot="control" className="relative">
        {/* Buttons */}
        <div className="z-1 right-2 top-2 absolute flex flex-row items-center justify-center pl-2 space-x-1">
          {maxLength && (
            <CharacterCountdown maxLength={maxLength} value={value} />
          )}
          <ClearButton onClick={handleClear} />
        </div>

        <Headless.Textarea
          ref={textareaRef}
          {...props}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className="font-medium pl-4 pr-20 py-3 w-full outline-none text-base/6 sm:text-sm/6 text-black bg-white hover:bg-white-hover focus:bg-white border-0 rounded-lg placeholder-black/50 focus:placeholder-black/0 text-left shadow-inner-hard-1 disabled:brightness-75 min-h-[4.5rem] block m-0"
        />
      </div>
    </div>
  );
}

export function ImageInput({
  value,
  onChange,
  invalid,
  ...props
}: {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  invalid?: boolean;
} & Omit<Headless.InputProps, 'as' | 'className' | 'type'>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      onChange({
        target: { value: dataUrl },
      } as React.ChangeEvent<HTMLInputElement>);
      setError('');
    } catch (err) {
      console.error('Failed to read file:', err);
      onChange({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
      setError((err as Error).message || 'Failed to load image');
    }
  }

  return (
    <>
      <div className="flex items-center gap-x-3">
        <div>
          {value ? (
            <div className="relative size-32">
              <Image
                fill
                alt="game thumbnail"
                src={value}
                className="rounded-lg object-cover"
              />
              <ClearButton
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-zinc-950/80 dark:bg-zinc-100/90"
              />
            </div>
          ) : (
            <PhotoIcon
              aria-hidden="true"
              className="text-zinc-300 dark:text-zinc-500 size-32"
            />
          )}
        </div>
        <div>
          <input
            ref={fileInputRef}
            {...props}
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            className="sr-only"
            onChange={handleFileChange}
            aria-describedby="game-image-error"
          />
          <Button
            outline
            type="button"
            className="text-sm/6 sm:text-xs/6"
            onClick={() => fileInputRef.current?.click()}
          >
            {value ? 'Change image' : 'Upload image'}
          </Button>

          <Text className="mt-2 text-xs/5 sm:text-xs/5">
            JPG, JPEG or PNG. Max size 2MB.
          </Text>
        </div>
      </div>
      {(invalid || error) && (
        <ErrorMessage id="game-image-error">
          Failed to upload image
        </ErrorMessage>
      )}
    </>
  );
}

/***************************************************************
                     Edit Question Form
***************************************************************/

export function QuestionAnswersInput({
  question,
  setQuestion,
}: {
  question: QuestionWithAnswers;
  setQuestion: (question: QuestionWithAnswers) => void;
}) {
  const handleChange = (
    id: string,
    key: keyof Answer,
    value: string | boolean
  ) => {
    const updatedAnswers = question.answers.map((a) =>
      a.id === id ? { ...a, [key]: value } : a
    );
    setQuestion({ ...question, answers: updatedAnswers });
  };

  if (question.type === QuestionType.SINGLE) {
    const correctAnswer = question.answers.find((a) => a.correct);
    const falseAnswers = question.answers.filter((a) => !a.correct);

    return (
      <>
        {/* Correct Answer */}
        <Field>
          <Label
            htmlFor="correct-answer"
            className="bg-correct"
            invalid={isEmptyString(correctAnswer?.title || '')}
          >
            Correct answer
          </Label>
          <InputGroup id="correct-answer" className="bg-correct">
            <Input
              placeholder="Required"
              maxLength={75}
              value={correctAnswer?.title || ''}
              onChange={(e) =>
                correctAnswer &&
                handleChange(correctAnswer.id, 'title', e.target.value)
              }
            />
          </InputGroup>
        </Field>

        {/* False Answers */}
        <Field>
          <Label
            htmlFor="false-answers"
            className="bg-false"
            invalid={falseAnswers.every((a) => isEmptyString(a.title))}
          >
            False answers
          </Label>
          <InputGroup
            id="false-answers"
            className="bg-false flex flex-col gap-y-2"
          >
            {falseAnswers.map((answer, idx) => (
              <Input
                key={idx}
                placeholder={idx === 0 ? 'Required' : 'Optional'}
                maxLength={75}
                value={answer.title}
                onChange={(e) =>
                  handleChange(answer.id, 'title', e.target.value)
                }
              />
            ))}
          </InputGroup>
        </Field>
      </>
    );
  }

  if (question.type === QuestionType.MULTIPLE) {
    return (
      <Field>
        <Label
          htmlFor="answers"
          className="bg-neutral"
          invalid={question.answers.every((a) => isEmptyString(a.title))}
        >
          Select the correct answer(s)
        </Label>
        <InputGroup
          id="answers"
          className="bg-neutral flex flex-col items-start space-y-3"
        >
          {question.answers.map((answer, idx) => (
            <div
              key={idx}
              className="w-full flex flex-row items-center space-x-3"
            >
              <CheckboxButton
                correct={answer.correct}
                setCorrect={(value) =>
                  handleChange(answer.id, 'correct', value)
                }
              />
              <Input
                placeholder={idx === 0 ? 'Required' : 'Optional'}
                maxLength={75}
                value={answer.title}
                onChange={(e) =>
                  handleChange(answer.id, 'title', e.target.value)
                }
              />
            </div>
          ))}
        </InputGroup>
      </Field>
    );
  }

  if (question.type === QuestionType.TYPE_ANSWER) {
    return (
      <Field>
        <Label
          htmlFor="answers"
          className="bg-correct"
          invalid={question.answers.every((a) => isEmptyString(a.title))}
        >
          Answer
        </Label>
        <InputGroup
          id="answers"
          className="bg-correct flex flex-col items-start gap-y-1 "
        >
          {question.answers.map((answer, idx) => (
            <Input
              key={idx}
              placeholder={idx === 0 ? 'Required' : 'Optional'}
              maxLength={75}
              value={answer.title}
              onChange={(e) => handleChange(answer.id, 'title', e.target.value)}
            />
          ))}
          {question.answers.length < 10 && (
            <AddAnswerButton
              onClick={() =>
                setQuestion({
                  ...question,
                  answers: [
                    ...question.answers,
                    {
                      id: uid(),
                      title: '',
                      correct: true,
                      questionId: question.id,
                      createdAt: new Date(),
                    },
                  ],
                })
              }
            />
          )}
        </InputGroup>
      </Field>
    );
  }
  return null;
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
      className="group disabled:opacity-50 relative flex flex-row items-center justify-center w-full my-3 overflow-hidden text-sm font-bold leading-none text-center text-white bg-transparent rounded-lg"
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
                viewBox="0 0 40 40"
                className="w-6 text-white fill-transparent scale-[1.2]"
              >
                <path
                  fill="currentColor"
                  d="m16.4 20-9.09-9.08a2.65 2.65 0 0 1 0-3.58 2.63 2.63 0 0 1 3.58 0L20 16.4l9.07-9.08a2.542 2.542 0 0 1 3.59 3.6L23.6 20l9.07 9.08a2.54 2.54 0 0 1-3.59 3.59L20 23.6l-9.09 9.09a2.553 2.553 0 0 1-3.61-3.61z"
                />
              </svg>
            ) : (
              // X icon
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
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function CharacterCountdown({
  maxLength,
  value,
}: {
  maxLength: number;
  value: string;
}) {
  return (
    <div className="bg-black/20 min-w-[2rem] h-6 flex flex-col justify-center items-center rounded-full pr-3 pl-3">
      <div
        className={clsx(
          'whitespace-nowrap text-xs font-black leading-none select-none',
          maxLength - value.length <= 0 ? 'text-red-500' : 'text-black/50'
        )}
      >
        {maxLength - value.length}
      </div>
    </div>
  );
}

function ClearButton({
  className,
  ...props
}: {
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Headless.Button
      type="button"
      aria-label="Clear input"
      className={clsx(
        className,
        'bg-black/20 min-w-[1.5rem] h-6 flex flex-col justify-center items-center rounded-full pr-0 pl-0 cursor-pointer'
      )}
      tabIndex={-1}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        className="w-4 h-4 text-black opacity-50"
      >
        <path
          fill="currentColor"
          d="m16.4 20-9.09-9.08a2.65 2.65 0 0 1 0-3.58 2.63 2.63 0 0 1 3.58 0L20 16.4l9.07-9.08a2.542 2.542 0 0 1 3.59 3.6L23.6 20l9.07 9.08a2.54 2.54 0 0 1-3.59 3.59L20 23.6l-9.09 9.09a2.553 2.553 0 0 1-3.61-3.61z"
        />
      </svg>
    </Headless.Button>
  );
}

function ErrorIcon({ className, ...props }: { className?: string }) {
  return (
    <div
      data-slot="error"
      {...props}
      className={clsx(
        className,
        'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-1 flex flex-col items-center justify-center bg-error size-5 rounded-full text-sm font-black text-white font-sans pointer-events-none'
      )}
    >
      <span>!</span>
    </div>
  );
}
