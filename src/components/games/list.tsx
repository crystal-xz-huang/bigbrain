import EmptyState from '@/components/games/empty-state';
import Game from '@/components/ui/cards/games/list';
import { fetchFilteredGames, fetchGamesByUser } from '@/lib/data';
import { requireUser } from '@/lib/session';

export default async function GamesList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const user = await requireUser();
  const games = await fetchGamesByUser(user);
  const filteredGames = await fetchFilteredGames(query, currentPage, user);

  if (games.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {filteredGames.map((game) => (
        <li key={game.id} className="col-span-1 w-full">
          <Game game={game} />
        </li>
      ))}
    </ul>
  );
}
