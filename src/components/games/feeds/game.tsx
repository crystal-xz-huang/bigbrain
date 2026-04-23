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
import { GamesListItemDTO } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { generateGameCardBadgeText, isAdminOwnerGame } from '@/lib/utils';
import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react';

export function Game({ game }: { game: GamesListItemDTO }) {
  const badgeText = generateGameCardBadgeText(game);

  return (
    <Card>
      <CardIndicator active={!!game.active} />
      <CardCover>
        <CardCoverImage src={game.image} alt={game.name} />
        {/* Button Overlay */}
        <CardAction>
          <ButtonPrimary color="orange" className="h-14 w-32 md:w-40" href="#">
            <span className="md:inline hidden">Play Now</span>
            <span className="md:hidden inline">Play</span>
          </ButtonPrimary>
        </CardAction>
        {/* Badge Overlay */}
        {badgeText && (
          <CardBadge>
            <div className="flex items-center">
              <CheckIcon className=" inline-block icon-xs !stroke-5" />
              <span className="md:inline-block hidden pl-1">{badgeText}</span>
            </div>
          </CardBadge>
        )}
      </CardCover>
      <CardFooter>
        <CardTitle>
          <TextLink href={routes.game.view(game.id)}>{game.name}</TextLink>
        </CardTitle>
        <CardDescription>
          {isAdminOwnerGame(game) ? (
            <TextLink href={routes.game.edit(game.id)}>Edit quiz</TextLink>
          ) : (
            <TextLink href={routes.user.profile(game.owner!.username)}>
              By {game.owner!.username}
            </TextLink>
          )}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}

export function GameHorizontal({ game }: { game: GamesListItemDTO }) {
  const badgeText = generateGameCardBadgeText(game);

  return (
    <Card className="flex flex-row items-center gap-0! bg-beige-100 dark:bg-white/10 drop-shadow-md rounded-2xl overflow-hidden h-37 sm:h-37 md:h-32 lg:h-34 2xl:h-35">
      <CardIndicator active={!!game.active} />
      <CardCover className="!rounded-r-none">
        <CardCoverImage src={game.image} alt={game.name} />
        {/* Button Overlay */}
        <CardAction>
          <ButtonPrimary color="orange" className="h-14 w-30 md:w-40" href="#">
            <span className="md:inline hidden">Play Now</span>
            <span className="md:hidden inline">Play</span>
          </ButtonPrimary>
        </CardAction>
        {/* Badge Overlay */}
        {badgeText && (
          <CardBadge>
            <div className="flex items-center">
              <CheckIcon className=" inline-block icon-xs !stroke-5" />
              <span className="md:inline-block hidden pl-1">{badgeText}</span>
            </div>
          </CardBadge>
        )}
      </CardCover>
      <CardFooter className="h-full! justify-center grow px-3">
        <CardTitle>
          <TextLink href={routes.game.view(game.id)}>{game.name}</TextLink>
        </CardTitle>
        <CardDescription>
          {isAdminOwnerGame(game) ? (
            <TextLink href={routes.game.edit(game.id)}>Edit quiz</TextLink>
          ) : (
            <TextLink href={routes.user.profile(game.owner!.username)}>
              By {game.owner!.username}
            </TextLink>
          )}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}

function TextLink({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link {...props} className="hover:underline hover:underline-offset-1" />
  );
}
