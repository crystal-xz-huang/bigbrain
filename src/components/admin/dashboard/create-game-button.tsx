'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/16/solid';
import CreateGameTrigger from '@/components/game/create-game';

export default function CreateGameButton({ className }: { className?: string }) {
  return (
    <CreateGameTrigger>
      <Button type="button" className={className}>
        <PlusIcon />
        Create Game
      </Button>
    </CreateGameTrigger>
  );
}
