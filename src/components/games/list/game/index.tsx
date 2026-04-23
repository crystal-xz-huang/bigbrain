'use client';

import { ButtonPrimary } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardBadge,
  CardCover,
  CardCoverImage,
  CardDescription,
  CardFooter,
  CardIndicator,
  CardTitle,
} from '@/components/ui/feed/card';
import { Link } from '@/components/ui/link';
import {
  LibraryListItemDTO,
  PublicGamesListItemDTO,
} from '@/lib/definitions/types';
import { formatDate, generateGameCardBadgeText, isLibraryGame } from '@/lib/utils';
import { routes } from '@/lib/routes';

import DropdownMenu from './dropdown-menu';
import GameMetadata from './metadata';
import { Text } from '@/components/ui/text';

export default function GameCard({
  game,
}: {
  game: LibraryListItemDTO | PublicGamesListItemDTO;
}) {
  const badgeText = generateGameCardBadgeText(game);

  return (
    <Card>
      <CardIndicator active={!!game.active} />
      <CardCover>
        <CardCoverImage src={game.image} alt={game.name} />
        <CardAction>
          {isLibraryGame(game) ? (
            <ButtonPrimary
              className="w-50 h-16 lg:text-base p-0"
              href={routes.game.view(game.id)}
            >
              View
            </ButtonPrimary>
          ) : (
            <ButtonPrimary className="w-50 h-16 lg:text-base p-0">
              Play Now
            </ButtonPrimary>
          )}
        </CardAction>
        {badgeText && <CardBadge>{badgeText}</CardBadge>}
      </CardCover>
      <CardFooter>
        <CardTitle>
          <Link
            className="hover:underline"
            title={game.name}
            href={routes.game.view(game.id)}
          >
            {game.name}
          </Link>
        </CardTitle>
        <CardDescription>
          <div className="flex flex-row items-center justify-between gap-2 w-full">
            <GameMetadata
              questionCount={game.questionCount}
              duration={game.duration}
            />
            {isLibraryGame(game) ? (
              <DropdownMenu game={game} />
            ) : (
              <Text className='text-center'>{formatDate(game.createdAt)}</Text>
            )}
          </div>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
