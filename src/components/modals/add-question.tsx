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
import * as Headless from '@headlessui/react';
import { QuestionType } from '@prisma/client';
import clsx from 'clsx';

import MultipleChoiceImage from '@public/icons/question-types/multiple-choice.svg';
import SingleChoiceImage from '@public/icons/question-types/single-choice.svg';
import TypeAnswerImage from '@public/icons/question-types/type-answer.svg';
import Image from 'next/image';

const typeOptions = [
  {
    value: QuestionType.SINGLE,
    label: 'Single Choice',
    description: 'One correct answer',
    image: SingleChoiceImage,
  },
  {
    value: QuestionType.MULTIPLE,
    label: 'Multiple Choice',
    description: 'Multiple correct answers',
    image: MultipleChoiceImage,
  },
  {
    value: QuestionType.TYPE_ANSWER,
    label: 'Type Answer',
    description: 'Type the correct answer',
    image: TypeAnswerImage,
  },
];

export default function AddQuestionModal({
  open,
  onClose,
  action,
  pending,
}: {
  open: boolean;
  onClose(): void;
  action: (formData: FormData) => void;
  pending: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Question</DialogTitle>
      <DialogDescription>
        Select the type of question you want to add.
      </DialogDescription>
      <DialogBody>
        <SelectQuestionTypeMenu action={action} pending={pending} />
      </DialogBody>
      <DialogActions>
        <Button plain onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SelectQuestionTypeMenu({
  action,
  pending,
}: {
  action: (formData: FormData) => void;
  pending: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      {typeOptions.map((option, idx) => (
        <form key={idx} action={action} className="flex flex-col">
          <input type="hidden" name="type" value={option.value} />
          <QuestionTypeOption
            type="submit"
            disabled={pending}
            label={option.label}
            description={option.description}
            image={option.image}
          />
        </form>
      ))}
    </div>
  );
}

function QuestionTypeOption({
  label,
  description,
  image,
  ...props
}: {
  label: string;
  description: string;
  image: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Headless.Button
      className={clsx([
        'bg-zinc-400/10 dark:bg-white/10 flex flex-row gap-4 py-2 px-4 md:py-4 rounded-lg mx-0 w-full items-center',
        'cursor-pointer touch-manipulation pointer-events-auto',
        'hover:bg-zinc-400/20 dark:hover:bg-white/20',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
      ])}
      {...props}
    >
      <div className="relative w-14 h-14 md:w-20 md:h-20 overflow-hidden bg-white/10 rounded-full">
        <Image
          src={image}
          alt={label}
          className="absolute inset-0 object-cover size-full"
        />
      </div>
      <div className="flex flex-col items-start justify-center flex-1">
        <div className="w-full text-left">
          <div className="flex flex-row justify-start gap-2">
            <Heading className="text-white">{label}</Heading>
          </div>
          <Text className="text-base font-normal text-white/70 leading-none md:leading-normal">
            {description}
          </Text>
        </div>
      </div>
    </Headless.Button>
  );
}
