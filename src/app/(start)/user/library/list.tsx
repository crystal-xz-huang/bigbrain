import Game from '@/components/games/list/game';
import { Subheading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { getFilteredGamesFromUser } from '@/lib/data/game-dto';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default async function GamesList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const games = await getFilteredGamesFromUser(query, currentPage);

  if (games.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-1">
        <FaceFrownIcon className="size-12" />
        <Subheading>{`Sorry, we couldn't find any results matching "${query}"`}</Subheading>
        <Text>Please check your spelling or broaden your search.</Text>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 auto-rows-fr sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {games.map((game) => (
        <li key={game.id} className="col-span-1 w-full h-full pb-4">
          <Game game={game} />
        </li>
      ))}
    </ul>
  );
}
