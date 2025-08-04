'use client';

import CreateGameTrigger from '@/components/games/buttons/triggers/create-game';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/16/solid';

export default function CreateGameButton({
  className,
}: {
  className?: string;
}) {
  return (
    <CreateGameTrigger>
      <Button type="button" className={className}>
        <PlusIcon />
        Create Game
      </Button>
    </CreateGameTrigger>
  );
}
