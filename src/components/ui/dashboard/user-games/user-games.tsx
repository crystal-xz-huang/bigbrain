'use server';

import GameCard from '@/components/ui/dashboard/user-games/card';
import { Subheading } from '@/components/ui/heading';
import { TextLink } from '@/components/ui/text';
import { fetchGamesFromAdmin } from '@/lib/data';
import { routes } from '@/lib/routes';
import { requireUser } from '@/lib/session';

export default async function UserGames() {
  const user = await requireUser();
  const games = await fetchGamesFromAdmin(user.id);

  if (!games || games.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {/* Heading */}
      <div className="flex flex-row items-center justify-between text-base/7 font-semibold sm:text-sm/6">
        <Subheading>My Games</Subheading>
        <TextLink href={routes.games}>{`See all ${games.length}`}</TextLink>
      </div>
      {/* Games List */}
      <div className='mt-3'>
        <ul role="list" className="flex flex-row flex-shrink-0 pt-2 overflow-x-auto space-x-4">
          {games.map((game) => (
            <li
              key={game.id}
              className="relative flex flex-col flex-shrink-0 w-[200px] md:w-[250px]"
            >
              <GameCard game={game} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
