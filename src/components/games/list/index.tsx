import { fetchFilteredGames, fetchGamesFromAdmin } from '@/lib/data';
import { requireUser } from '@/lib/session';

import GameCard from '@/components/games/list/card';
import EmptyState from '@/components/games/list/empty-state';

export default async function GamesList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const user = await requireUser();
  const games = await fetchGamesFromAdmin(user);
  const filteredGames = await fetchFilteredGames(query, currentPage, user);

  if (!games || games.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {filteredGames.map((game) => (
        <li key={game.id} className="col-span-1 w-full">
          <GameCard game={game} />
        </li>
      ))}
    </ul>
  );
}
