'use client';

import PlayGame from '@/components/ui/games/buttons/play-game';
import {
  Card,
  CardCover,
  CardCoverImage,
  CardAction,
  CardBadge,
  CardFooter,
  CardTitle,
  CardDescription,
  CardIndicator,
} from '@/components/ui/game-card';
import { Link } from '@/components/ui/link';
import { routes } from '@/lib/routes';
import { AdminGame } from '@/lib/types';
import { CheckIcon } from '@heroicons/react/24/outline';
import { ButtonPrimary } from '@/components/ui/button';

export default function GameCard({ game }: { game: AdminGame }) {
  const generateBadgeText = (game: AdminGame) => {
    if (game.active) {
      return 'In progress';
    } else if (game.oldSessions.length > 0) {
      return 'Played';
    }
    return '';
  }
  const badgeText = generateBadgeText(game);

  return (
    <Card>
      <CardIndicator active={!!game.active} />
      <CardCover>
        <CardCoverImage src={game.image} alt={game.name} />
        {/* Button Overlay */}
        <CardAction>
          {game.active ? (
            <ButtonPrimary className="h-14 w-32 md:w-40" href={routes.session.play(game.active)}>
              <span className="md:inline hidden">Enter Game</span>
              <span className="md:hidden inline">Enter</span>
            </ButtonPrimary>
          ) : (
            <PlayGame gameId={game.id} className="h-14 w-32 md:w-40" />
          )}
        </CardAction>
        {/* Badge Overlay */}
        {badgeText && (
          <CardBadge>
          <div className="flex items-center">
            <CheckIcon className=" inline-block icon-xs !stroke-5" />
            <span className="md:inline-block hidden pl-1">
              {badgeText}
            </span>
          </div>
        </CardBadge>
        )}
      </CardCover>
      <CardFooter>
        <CardTitle className="h-[2rem]">
          <Link
            className="hover:underline"
            title={game.name}
            href={routes.game.view(game.id)}
          >
            {game.name}
          </Link>
        </CardTitle>
        <CardDescription>
          <Link className="hover:underline" href={routes.game.edit(game.id)}>
            Edit quiz
          </Link>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
