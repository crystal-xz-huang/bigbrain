import {
  getGameCategories,
  getTopPopularGames,
  getTopRecentGames,
  getTopRecentGamesForCategory,
  getTopRecentsGamesFromUser,
} from '@/lib/data/game-dto';
import { FeedLayout } from './feed-layout';
import UserFeed from './user-games';

export function UserGames() {
  // Don't await the data fetching function
  const data = getTopRecentsGamesFromUser();
  return <UserFeed promise={data} />;
}

export function RecentGames() {
  const data = getTopRecentGames();
  return <FeedLayout title="Recent Games" promise={data} />;
}

export function PopularGames() {
  const data = getTopPopularGames();
  return <FeedLayout title="Top Games" promise={data} ordered />;
}

export async function CategoryGames() {
  const categories = await getGameCategories();

  return (
    <>
      {categories.map((cat) => {
        const data = getTopRecentGamesForCategory(cat);
        return <FeedLayout key={cat.id} title={cat.name} promise={data} />;
      })}
    </>
  );
}
