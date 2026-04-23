'use client';

import { Button, ButtonLoading } from '@/components/ui/button';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  Modal,
  ModalActions,
  ModalBody,
  ModalDescription,
  ModalTitle,
} from '@/components/ui/modal';
import { Strong } from '@/components/ui/text';
import { useToast } from '@/hooks/toast';
import { deleteGameAction } from '@/lib/actions/game';
import { ActionResponse } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
// import { DialogWithIcon } from '@/components/ui/dialog';

const initialState: ActionResponse = {
  success: false,
  message: '',
};

export default function DeleteGameModal({
  gameId,
  gameName,
}: {
  gameId: string;
  gameName: string;
}) {
  const toast = useToast();
  const router = useRouter();
  const deleteGameWithId = deleteGameAction.bind(null, gameId);
  const [state, action, pending] = useActionState(
    deleteGameWithId,
    initialState
  );
  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      router.push(routes.user.library); // Redirect to games list after deletion
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  const SubmitButton = pending ? ButtonLoading : Button;

  return (
    <Modal variant="error">
      <ModalBody>
        <ModalTitle>Delete this game?</ModalTitle>
        <ModalDescription>
          This will permanently delete <Strong>{gameName}</Strong> and all its
          questions. This action cannot be undone.
        </ModalDescription>
      </ModalBody>
      <ModalActions>
        <form action={action}>
          <SubmitButton
            color="error"
            type="submit"
            aria-label="delete"
            disabled={pending}
          >
            <TrashIcon className="stroke-2 size-5" />
            Delete game
          </SubmitButton>
        </form>
        <Button
          outline
          type="button"
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancel
        </Button>
      </ModalActions>
    </Modal>
    // <DialogWithIcon
    //   variant="error"
    //   open
    //   pending={pending}
    //   title="Delete this game?"
    //   description="Are you sure you want to delete this game? This action cannot be undone."
    //   actionText="Delete"
    //   onClose={() => setIsOpen(false)}
    //   action={action}
    // />
  );
}
