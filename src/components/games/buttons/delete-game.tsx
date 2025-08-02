'use client';

import { Button } from '@/components/ui/button';
import { DialogWithIcon } from '@/components/ui/dialog';
import { useToast } from '@/hooks/toast';
import { TrashIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { DeleteGameActionResponse } from '@/lib/types';
import { deleteGameAction } from '@/lib/actions';
import { routes } from '@/lib/routes';

const initialState: DeleteGameActionResponse = {
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
      router.push(routes.games); // Redirect to games list after deletion
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
        className="!text-error"
        onClick={() => setIsOpen(true)}
        disabled={pending}
        title="Delete this game"
        aria-label="delete"
      >
        <TrashIcon aria-hidden="true" className="fill-error" />
        Delete game
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
