'use client';

import { DialogWithIcon } from '@/components/ui/dialog';
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
} from '@/components/ui/dropdown';
import {
  DeleteDropdownItem,
  EditDropdownItem,
  ViewDropdownItem,
} from '@/components/ui/dropdown-items';
import { useToast } from '@/hooks/toast';
import { deleteGameAction } from '@/lib/actions/game';
import { LibraryListItemDTO } from '@/lib/definitions/types';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { routes } from '@/lib/routes';

/***************************************************************
                     Dropdown Menu
***************************************************************/

const initialState = {
  success: false,
  message: '',
};

export default function GameDropdownMenu({ game }: { game: LibraryListItemDTO }) {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const deleteGameWithId = deleteGameAction.bind(null, game.id);
  const [state, action, pending] = useActionState(
    deleteGameWithId,
    initialState
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      setIsOpen(false);
      router.refresh(); // refresh the current page
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  return (
    <>
      <Dropdown>
        <DropdownButton
          plain
          aria-label="More options"
          disabled={!!game.active}
          className="h-full"
        >
          <EllipsisHorizontalIcon aria-hidden="true" />
        </DropdownButton>
        <DropdownMenu>
          <ViewDropdownItem href={routes.game.view(game.id)} />
          <EditDropdownItem href={routes.game.edit(game.id)} />
          <DeleteDropdownItem onClick={() => setIsOpen(true)} />
        </DropdownMenu>
      </Dropdown>

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
