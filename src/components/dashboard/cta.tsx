'use client';

import CreateGameTrigger from '@/components/games/triggers/create-game';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export function CreateGame() {
  return (
    <div className="overflow-hidden rounded-lg outline-2 outline-accent">
      <div className="px-4 py-5 sm:p-6">
        <Heading id="create-game-banner" className="!text-white sr-only">Create a game</Heading>
        <div className="sm:flex sm:items-start sm:justify-between">
          <Text>
            Bigrain is a hub to create awesome games that people love. Get started by making your own game.
          </Text>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:shrink-0 sm:items-center">
            <CreateGameTrigger>
              <Button type="button" outline>
                Create Game
              </Button>
            </CreateGameTrigger>
          </div>
        </div>
      </div>
    </div>
  );
}
