'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/fieldset';
import type { HeadingProps } from '@/components/ui/heading';
import { Subheading } from '@/components/ui/heading';
import { Link } from '@/components/ui/link';
import {
  Checkbox,
  CheckboxField,
  CheckboxGroup,
} from '@/components/ui/styled/checkbox';
import { Text } from '@/components/ui/text';
import { routes } from '@/lib/routes';
import { QuestionWithAnswers } from '@/lib/types';
import { PlusIcon } from '@heroicons/react/16/solid';
import { CheckIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { useState } from 'react';

export default function Questions({
  questions,
}: {
  questions: QuestionWithAnswers[];
}) {
  const [showQuestions, setShowQuestions] = useState(true);
  const [showAnswers, setShowAnswers] = useState(true);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center mt-10">
        <SquaresPlusIcon className="mx-auto size-12" />
        <Subheading level={3} className="mt-2">
          No questions added
        </Subheading>
        <Text className="mt-1">Get started by creating a new question</Text>
        <Button type="button" className="mt-6" color="accent">
          <PlusIcon aria-hidden="true" className="size-5" />
          New Question
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Toggle Checkbox */}
      <CheckboxGroup className="font-bold text-black">
        <CheckboxField>
          <Checkbox
            name="toggle"
            value="show_questions"
            checked={showQuestions}
            onChange={setShowQuestions}
          />
          <Label className="text-base">Show questions</Label>
        </CheckboxField>
        <CheckboxField>
          <Checkbox
            name="toggle"
            value="show_answers"
            checked={showAnswers}
            onChange={setShowAnswers}
          />
          <Label className="text-base">Show answers</Label>
        </CheckboxField>
      </CheckboxGroup>

      {/* Questions */}
      <CardWrapper>
        {questions.map((q, idx) => (
          <Card
            key={q.id}
            href={routes.game.question.edit(q.gameId, q.id)}
            color={q.answers.length === 0 ? 'error' : 'default'}
          >
            <CardHeader>{idx}</CardHeader>
            <CardContent>
              <CardTitle className={showQuestions ? '' : 'blur-sm select-none'}>
                {q.title}
              </CardTitle>
              <AnswerList className={showAnswers ? '' : 'blur-sm select-none'}>
                {q.answers.map((answer) => (
                  <AnswerItem
                    key={answer.id}
                    value={answer.title}
                    isCorrect={answer.correct}
                  />
                ))}
              </AnswerList>
            </CardContent>
            {q.description && <CardFooter>{q.description}</CardFooter>}
          </Card>
        ))}
      </CardWrapper>
    </div>
  );
}

/***************************************************************
                     Card Components
***************************************************************/
function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row w-[calc(100%+1rem)] flex-wrap items-stretch -mx-2">
      {children}
    </div>
  );
}

const colors = {
  default: 'bg-black/10 dark:bg-white/90',
  error: 'bg-error/10 dark:bg-error/30',
};

function Card({
  color = 'default',
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  color?: keyof typeof colors;
}) {
  return (
    <div className="xl:w-1/4 lg:w-1/3 md:w-1/2 w-full px-2 mb-4">
      <Link
        {...props}
        className={clsx(
          className,
          colors[color],
          'font-sans tracking-wide font-black leading-tight relative z-0 flex flex-col w-full h-full py-4 overflow-hidden text-base rounded-lg justify-start items-start text-left text-black'
        )}
      >
        {children}
      </Link>
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="z-2 absolute top-0 left-0 size-12 overflow-hidden">
      <div className="left-1/2 top-1/2 absolute whitespace-nowrap tracking-normal transform -translate-x-1/2 -translate-y-1/2 text-2xl">
        {children}
      </div>
    </div>
  );
}

function CardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-grow-0 w-full mx-4 space-y-4 mt-10 mb-5">
      {children}
    </div>
  );
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-end flex-grow w-full">
      <div className="relative w-full h-[1px] bg-black opacity-10 mb-4" />
      <div className="text-sm font-normal leading-4 opacity-70 px-4 min-h-12">
        {children}
      </div>
    </div>
  );
}

function CardTitle({ className, level = 2, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;
  return (
    <Element
      {...props}
      className={clsx(className, 'font-black leading-tight')}
    />
  );
}

function AnswerList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx(className, 'flex flex-col space-y-1')}>{children}</div>
  );
}

function AnswerItem({
  value,
  isCorrect = false,
}: {
  value: string;
  isCorrect?: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex flex-row items-center space-x-2 text-base',
        isCorrect ? 'font-bold text-success' : 'font-medium text-error'
      )}
    >
      {isCorrect ? (
        <CheckIcon className="flex flex-shrink-0 size-4 stroke-4" />
      ) : (
        <div className="flex flex-shrink-0 size-4" />
      )}
      <p>{value}</p>
    </div>
  );
}
