'use client';

import { DialogWithIcon } from '@/components/ui/dialog';
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
} from '@/components/ui/dropdown';
import {
  CloneDropdownItem,
  DeleteDropdownItem,
} from '@/components/ui/dropdown-items';
import { useToast } from '@/hooks/toast';
import { cloneGameAction, deleteGameAction } from '@/lib/actions/game';
import { routes } from '@/lib/routes';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { useActionState, useEffect, useRef, useState } from 'react';

const initialState = {
  success: false,
  message: '',
};

export default function GameDropdownMenu({
  gameId,
  canDelete = false,
}: {
  gameId: string;
  canDelete: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteState, deleteGame, deletePending] = useActionState(
    deleteGameAction.bind(null, gameId),
    initialState
  );
  const [cloneState, cloneGame, clonePending] = useActionState(
    cloneGameAction.bind(null, gameId),
    initialState
  );

  useEffect(() => {
    if (!deleteState.success && deleteState.message) {
      toast.error({
        message: 'Error',
        description: deleteState.message,
      });
    }
    if (!cloneState.success && cloneState.message) {
      toast.error({
        message: 'Error',
        description: cloneState.message,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteState.success, deleteState.message, cloneState.success, cloneState.message]);

  return (
    <>
      <form action={cloneGame} ref={formRef} className="hidden" />

      <Dropdown>
        <DropdownButton
          rounded
          color="gray"
          aria-label="More options"
          className="text-2xl md:text-3xl md:w-14 md:h-14 w-12 h-12 p-0 mb-4 mr-4 flex flex-col items-center justify-center !rounded-full"
        >
          <EllipsisHorizontalIcon className="!md:size-8 !size-6 fill-black" />
        </DropdownButton>

        <DropdownMenu anchor="bottom">
          <CloneDropdownItem
            onClick={() => formRef.current?.requestSubmit()}
            disabled={deletePending || clonePending}
          />
          {canDelete && (
            <DeleteDropdownItem
              onClick={() => setIsOpen(true)}
              disabled={deletePending || clonePending}
            />
          )}
        </DropdownMenu>
      </Dropdown>

      <DialogWithIcon
        variant="error"
        open={isOpen}
        pending={deletePending}
        title="Delete this game?"
        description="Are you sure you want to delete this game? This action cannot be undone."
        actionText="Delete"
        onClose={() => setIsOpen(false)}
        action={deleteGame}
      >
        <input type="hidden" name="redirectTo" value={routes.user.library} />
      </DialogWithIcon>
    </>
  );
}
