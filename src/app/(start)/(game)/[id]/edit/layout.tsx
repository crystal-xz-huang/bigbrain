import { EditGameProvider } from '@/hooks/edit-game';
import { verifyUser } from '@/lib/data/auth';
import { getGameCategories, getGameEditDTO } from '@/lib/data/game-dto';
import { normalizeGameForEditing } from '@/lib/utils';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id: gameId } = await params;

  // fetch data
  const user = await verifyUser();
  const game = await getGameEditDTO(gameId, user.id);

  return {
    title: `Edit ${game.name}`,
  };
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  // Read the game ID from the URL parameters
  const gameId = (await params).id;

  // Fetch data
  const user = await verifyUser();
  const [game, categories] = await Promise.all([
    getGameEditDTO(gameId, user.id),
    getGameCategories(),
  ]);

  // Normalize the game data
  const normalizedGame = normalizeGameForEditing(game);

  // Render the form with the fetched data
  return (
    <EditGameProvider game={normalizedGame} categories={categories} user={user}>
      {children}
    </EditGameProvider>
  );
}
