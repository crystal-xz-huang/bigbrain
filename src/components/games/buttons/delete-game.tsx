'use client';

import { Button } from '@/components/ui/button';
import { DialogWithIcon } from '@/components/ui/dialog';
import { TrashIcon } from '@/components/ui/icon';
import { useToast } from '@/hooks/toast';
import { deleteGameAction } from '@/lib/actions/game';
import { ActionResponse } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

const initialState: ActionResponse = {
  success: false,
  message: '',
};

export default function DeleteGame({ gameId }: { gameId: string }) {
  const toast = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const deleteGameWithId = deleteGameAction.bind(null, gameId);
  const [state, action, pending] = useActionState(
    deleteGameWithId,
    initialState
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success({
        message: 'Success',
        description: state.message,
      });
      setIsOpen(false);
      router.push(routes.user.library); // Redirect to games list after deletion
    }

    if (!state.success && state.message) {
      toast.error(state.message);
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  return (
    <>
      <Button
        outline
        type="button"
        className="!text-error"
        onClick={() => setIsOpen(true)}
        disabled={pending}
        title="Delete this game"
        aria-label="delete"
      >
        <span className="flex items-center justify-center gap-2">
          <TrashIcon className="h-full w-auto" />
          Delete game
        </span>
      </Button>

      <DialogWithIcon
        variant="error"
        open={isOpen}
        pending={pending}
        title="Delete this game?"
        description="Are you sure you want to delete this game? This action cannot be undone."
        actionText="Delete"
        onClose={() => setIsOpen(false)}
        action={action}
      />
    </>
  );
}
