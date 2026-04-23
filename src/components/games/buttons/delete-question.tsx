'use client';

import { Button } from '@/components/ui/button';
import { DialogWithIcon } from '@/components/ui/dialog';
import { useToast } from '@/hooks/toast';
import { deleteQuestionAction } from '@/lib/actions/game';
import { ActionResponse } from '@/lib/definitions/types';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const initialState: ActionResponse = {
  success: false,
  message: '',
};

export default function DeleteQuestion({
  questionId,
  onDelete,
}: {
  questionId: string;
  onDelete?: () => void;
}) {
  const toast = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, pending] = useActionState(
    deleteQuestionAction.bind(null, questionId),
    initialState
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success({
        message: 'Success',
        description: state.message,
      });
      setIsOpen(false);
      onDelete?.(); // update local state in parent
      router.refresh(); // refresh the current page
    } else if (!state.success && state.message) {
      toast.error({
        message: 'Error',
        description: state.message,
      });
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  return (
    <>
      <Button
        outline
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={pending}
        className="!rounded-full hover:bg-error/10!"
        title="Delete this question"
        aria-label="delete"
      >
        <TrashIcon className="icon stroke-error stroke-2" />
      </Button>

      <DialogWithIcon
        variant="error"
        open={isOpen}
        pending={pending}
        title="Delete this question?"
        description="Are you sure you want to delete this question? This action cannot be undone."
        actionText="Delete"
        onClose={() => setIsOpen(false)}
        action={action}
      />
    </>
  );
}
