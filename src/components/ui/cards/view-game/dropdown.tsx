'use client';

import { DialogWithIcon } from '@/components/ui/dialog';
import { Dropdown, DropdownItem, DropdownMenu } from '@/components/ui/dropdown';
import { Button } from '@/components/ui/styled/button';
import { useToast } from '@/hooks/toast';
import { deleteGameAction } from '@/lib/actions';
import { routes } from '@/lib/routes';
import * as Headless from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useActionState } from 'react';
import type { GameWithQuestions } from '@/lib/types';

const initialState = {
  success: false,
  message: '',
};

export function GameDropdown({ game }: { game: GameWithQuestions }) {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const deleteGameWithId = deleteGameAction.bind(null, game.id);
  const [state, action, pending] = useActionState(deleteGameWithId, initialState);

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
    }
  }, [state.success, state.message]);

  return (
    <>
      <Dropdown>
        <DropdownButton
          plain
          aria-label="More options"
          disabled={!!game.active}
        />
        <DropdownMenu>
          <DropdownItem href={routes.game.edit(game.id)}>Edit</DropdownItem>
          <DropdownItem onClick={() => setIsOpen(true)}>
            Delete game
          </DropdownItem>
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

function DropdownButton<T extends React.ElementType = typeof Button>({
  as = Button,
  ...props
}: { className?: string } & Omit<Headless.MenuButtonProps<T>, 'className'>) {
  return (
    <Headless.MenuButton
      as={as}
      className="text-2xl md:text-3xl md:w-14 md:h-14 shrink-0 flex flex-col items-center justify-center w-12 h-12 p-0 mb-4 mr-4"
      {...props}
    >
      <div className="md:size-8 size-6 flex items-center justify-center">
        <EllipsisHorizontalIcon aria-hidden="true" />
      </div>
    </Headless.MenuButton>
  );
}
