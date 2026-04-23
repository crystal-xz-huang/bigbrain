'use client';

import { ButtonPrimary } from '@/components/ui/button';
import { useToast } from '@/hooks/toast';
import { createQuestionAction } from '@/lib/actions/game';
import type {
  CreateQuestionActionResponse,
  QuestionDTO,
} from '@/lib/definitions/types';
import { useActionState, useEffect, useState } from 'react';
import AddQuestionModal from '@/components/modals/add-question';
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';

const initialState: CreateQuestionActionResponse = {
  success: false,
  message: '',
};

export default function AddQuestion({
  gameId,
  onAddQuestion,
  className,
}: {
  gameId: string;
  onAddQuestion(q: QuestionDTO): void;
  className?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, pending] = useActionState(
    createQuestionAction.bind(null, gameId),
    initialState
  );

  useEffect(() => {
    if (state.success && state.message && state.question) {
      toast.success(state.message);
      onAddQuestion(state.question);
      setIsOpen(false);
      // Redirect to question edit page
      router.push(routes.game.question(gameId, state.question.id));
    } else if (!state.success && state.message) {
      toast.error(state.message);
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        {/* Label */}
        <span className="flex flex-row items-center justify-center gap-2 max-sm:hidden">
          <div className="pl-2 text-xl font-bold text-zinc-950 dark:text-white">
            Add question
          </div>
          <ArrowRightIcon className="size-5 text-zinc-950 dark:text-white stroke-5" />
        </span>
        {/* Button */}
        <ButtonPrimary
          rounded={false}
          className={clsx(className, 'w-12 h-12 p-0 text-white')}
          color="cyan"
          title="Add question"
          disabled={pending}
          onClick={() => setIsOpen(true)}
        >
          <PlusIcon className="size-5 text-white stroke-5" />
        </ButtonPrimary>
      </div>

      <AddQuestionModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        action={action}
        pending={pending}
      />
    </>
  );
}
