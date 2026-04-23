import Modal from '@/components/modals/delete-game';
import { verifyUser } from '@/lib/data/auth';
import { getGameFromAdmin } from '@/lib/data/game-dto';
import { forbidden } from 'next/navigation';

export default async function DeleteGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const gameId = (await params).id;
  const user = await verifyUser();
  const game = await getGameFromAdmin(gameId, user.id);

  // If the user does not own the game
  if (game.ownerId !== user.id) {
    forbidden();
  }

  return <Modal gameId={gameId} gameName={game.name} />;
}
