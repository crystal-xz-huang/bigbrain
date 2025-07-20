'use client';

import { Subheading } from '@/components/ui/heading';
import { Input, InputGroup } from '@/components/ui/input';
import type { Game } from '@/lib/types';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { useMemo, useState } from 'react';
import GameCard from './game-card';

export default function GameList({ games }: { games: Game[] }) {
  const [query, setQuery] = useState('');

  const filteredGames = useMemo(() => {
    const q = query.toLowerCase();
    return games.filter((g) => g.name.toLowerCase().includes(q));
  }, [games, query]);

  return (
    <>
      <div className="pb-5 flex flex-col space-y-5 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Subheading>My Games</Subheading>
        <InputGroup>
          <MagnifyingGlassIcon aria-hidden="true" />
          <Input
            name="search"
            type="search"
            placeholder="Search games"
            aria-label="Search games"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <ul
        role="list"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-x-8 auto-rows-fr"
      >
        {filteredGames.map((game) => (
          <li key={game.id} className="col-span-1 h-full">
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </>
  );
}
