'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/toast';
import { createQuestionAction } from '@/lib/actions/game';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { CreateQuestionActionResponse } from '@/lib/definitions/types';

import AddQuestionModal from '@/components/modals/add-question';

const initialState: CreateQuestionActionResponse = {
  success: false,
  message: '',
};

export default function AddQuestion({
  gameId,
  className,
  ...props
}: {
  gameId: string;
  className?: string;
}) {
  const toast = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, pending] = useActionState(
    createQuestionAction.bind(null, gameId),
    initialState
  );

  useEffect(() => {
    if (state.success && state.message && state.question) {
      toast.success(state.message);
      setIsOpen(false);
      router.refresh();
    } else if (!state.success && state.message) {
      toast.error(state.message);
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <PlusIcon className="size-5 stroke-5" />
        Add question
      </Button>

      <AddQuestionModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        action={action}
        pending={pending}
      />
    </>
  );
}
