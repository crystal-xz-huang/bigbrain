'use client';

import { DialogWithIcon } from '@/components/ui/dialog';
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/ui/dropdown';
import { useToast } from '@/hooks/toast';
import { deleteGameAction } from '@/lib/actions';
import { routes } from '@/lib/routes';
import type { Game } from '@/lib/types';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GameCardDropdown({ game }: { game: Game }) {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDeleteGame = async (gameId: string) => {
    setPending(true);
    const response = await deleteGameAction(gameId);
    if (response.success && response.message) {
      toast.success({
        message: 'Success',
        description: response.message,
      });
      setIsOpen(false);
      router.refresh(); // refresh the current page
    } else if (!response.success && response.message) {
      toast.error({
        message: 'Error',
        description: response.message,
      });
    }
    setPending(false);
  };

  return (
    <>
      <Dropdown>
        <DropdownButton
          plain
          aria-label="More options"
          disabled={!!game.active}
        >
          <EllipsisHorizontalIcon aria-hidden="true" />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem href={routes.game(game.id)}>View</DropdownItem>
          <DropdownItem href={routes.game(game.id)}>Edit</DropdownItem>
          <DropdownItem onClick={() => setIsOpen(true)}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <DialogWithIcon
        variant="error"
        open={isOpen}
        disabled={pending}
        pending={pending}
        title="Delete this game?"
        description="Are you sure you want to delete this game? This action cannot be undone."
        actionText="Delete"
        onClose={() => setIsOpen(false)}
        onAction={() => handleDeleteGame(game.id)}
      />
    </>
  );
}
