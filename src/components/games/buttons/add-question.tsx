'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useToast } from '@/hooks/toast';
import { createQuestionAction } from '@/lib/actions';
import type {
  CreateQuestionActionResponse,
  QuestionWithAnswers,
} from '@/lib/types';
import * as Headless from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { QuestionType } from '@prisma/client';
import MultipleChoiceImage from '@public/multiple-choice.svg';
import SingleChoiceImage from '@public/single-choice.svg';
import TypeAnswerImage from '@public/type-answer.svg';
import clsx from 'clsx';
import Form from 'next/form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { routes } from '@/lib/routes';

const buttons = [
  {
    title: 'Single Choice',
    description: 'One correct answer',
    image: SingleChoiceImage,
    type: QuestionType.SINGLE,
  },
  {
    title: 'Multiple Choice',
    description: 'Multiple correct answers',
    image: MultipleChoiceImage,
    type: QuestionType.MULTIPLE,
  },
  {
    title: 'Type Answer',
    description: 'Type the correct answer',
    image: TypeAnswerImage,
    type: QuestionType.TYPE_ANSWER,
  },
];

const initialState: CreateQuestionActionResponse = {
  success: false,
  message: '',
};

export default function AddQuestion({
  gameId,
  setQuestions,
  className,
  ...props
}: {
  gameId: string;
  setQuestions?: (questions: QuestionWithAnswers[]) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const createQuestion = createQuestionAction.bind(null, gameId);
  const [state, action, pending] = useActionState(createQuestion, initialState);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.message && state.questions) {
      toast.success({
        message: 'Success',
        description: state.message,
      });
      setIsOpen(false);
      if (!setQuestions) {
        router.refresh();
      } else {
        setQuestions(state.questions);
        const newQuestion = state.questions[state.questions.length - 1];
        router.push(routes.game.question.edit(gameId, newQuestion.id));
      }
    } else if (!state.success && state.message) {
      toast.error({
        message: 'Error',
        description: state.message,
      });
      setIsOpen(false);
    }
  }, [state.success, state.message]);

  return (
    <>
      <Button
        outline
        {...props}
        title="Add question"
        disabled={pending}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon
          aria-hidden="true"
          className="!stroke-4 !stroke-current !dark:stroke-current"
        />
        Add question
      </Button>

      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Add Question</DialogTitle>
        <DialogDescription>
          Select the type of question you want to add.
        </DialogDescription>
        <DialogBody>
          <div className="flex flex-col gap-4">
            {buttons.map((btn) => (
              <Form key={btn.title} action={action} className="flex flex-col">
                <input type="hidden" name="type" value={btn.type} />
                <QuestionButton
                  type="submit"
                  value={btn.type}
                  title={btn.title}
                  description={btn.description}
                  image={btn.image}
                  disabled={pending}
                />
              </Form>
            ))}
          </div>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function QuestionButton({
  title,
  description,
  image,
  ...props
}: {
  title: string;
  description: string;
  image: string;
} & Headless.ButtonProps) {
  return (
    <Headless.Button
      className={clsx([
        // Base
        'bg-zinc-400/10 dark:bg-white/10 flex flex-row gap-4 py-2 px-4 md:py-4 rounded-lg mx-0 w-full items-center',
        // Cursor
        'cursor-pointer touch-manipulation pointer-events-auto',
        // Hover
        'hover:bg-zinc-400/20 dark:hover:bg-white/20',
        // Disabled
        'data-disabled:pointer-events-none data-disabled:opacity-50',
      ])}
      {...props}
    >
      <div className="relative w-14 h-14 md:w-20 md:h-20 overflow-hidden bg-white/10 rounded-full">
        <Image
          src={image}
          alt={title}
          className="absolute inset-0 object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col items-start justify-center flex-1">
        <div className="w-full text-left">
          <div className="flex flex-row justify-start gap-2">
            <Heading className="text-white">{title}</Heading>
          </div>
          <Text className="text-base font-normal text-white/70 leading-none md:leading-normal">
            {description}
          </Text>
        </div>
      </div>
    </Headless.Button>
  );
}
