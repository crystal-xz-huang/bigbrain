import { Button } from '@/components/ui/styled/button';
import { routes } from '@/lib/routes';

export default function StopGame({ gameId }: { gameId: string }) {
  return (
    <Button
      color="red"
      className="!text-base w-32 h-14"
      href={routes.game.view(gameId)}
    >
      Stop
    </Button>
  );
}
