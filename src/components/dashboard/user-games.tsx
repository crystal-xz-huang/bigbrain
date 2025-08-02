'use server';

import Game from '@/components/ui/cards/games/dashboard';
import { Subheading } from '@/components/ui/heading';
import { TextLink } from '@/components/ui/text';
import { fetchGamesFromAdmin } from '@/lib/data';
import { routes } from '@/lib/routes';
import { requireUser } from '@/lib/session';

export default async function UserGames() {
  const user = await requireUser();
  const games = await fetchGamesFromAdmin(user);

  if (!games || games.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-row items-center justify-between text-base/7 font-semibold sm:text-sm/6">
        <Subheading>My Games</Subheading>
        <TextLink href={routes.games}>{`See all ${games.length}`}</TextLink>
      </div>
      <ul
        role="list"
        className="flex flex-row flex-shrink-0 space-x-3 overflow-x-auto"
      >
        {games.map((game) => (
          <li key={game.id} className="flex-shrink-0 w-54">
            <Game game={game} />
          </li>
        ))}
      </ul>
    </div>
  );
}
