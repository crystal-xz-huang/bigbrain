'use client';

import { Button } from '@/components/ui/button';
import { DialogWithIcon } from '@/components/ui/dialog';
import { useToast } from '@/hooks/toast';
import { TrashIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { DeleteQuestionActionResponse } from '@/lib/types';
import { deleteQuestionAction } from '@/lib/actions';

const initialState: DeleteQuestionActionResponse = {
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
  const deleteQuestion = deleteQuestionAction.bind(null, questionId);
  const [state, action, pending] = useActionState(deleteQuestion, initialState);

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
  }, [state.success, state.message]);

  return (
    <>
      <Button
        outline
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={pending}
        className="!rounded-full size-8"
        title="Delete this question"
        aria-label="delete"
      >
        <TrashIcon
          aria-hidden="true"
          className="!size-4 !data-hover:stroke-error"
        />
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
