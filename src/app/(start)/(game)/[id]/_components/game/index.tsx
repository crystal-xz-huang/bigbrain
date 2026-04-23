'use client';

import { Avatar } from '@/components/ui/avatar';
import { EditButton, ShareButton } from '@/components/ui/form/buttons';
import PlayGame from '@/components/games/buttons/play-game';
import { Link } from '@/components/ui/link';
import { GameViewDTO } from '@/lib/definitions/types';
import { formatDuration, pluralize } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/20/solid';
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardThumbnail,
  CardTitle,
} from './card';
import DropdownMenu from './dropdown-menu';
import { routes } from '@/lib/routes';
import { GameViewType } from '@/lib/definitions/constants';

export default function ViewGameDetails({ game }: { game: GameViewDTO }) {
  const isOwner = game.type === GameViewType.PROTECTED;

  return (
    <Card>
      <CardHeader>
        <CardThumbnail src={game.image} alt={`${game.name}'s image`} />
      </CardHeader>
      <CardBody>
        <CardContent>
          {/* User */}
          <div className="flex flex-row items-center gap-1">
            {game.owner.image ? (
              <Avatar className="size-6" src={game.owner.image} />
            ) : (
              <UserIcon className="size-6 rounded-full bg-neutral stroke-white fill-white" />
            )}
            <Link
              className="text-sm font-bold hover:underline p-1"
              title={`Quiz by ${game.owner.username}`}
              href={routes.user.profile(game.owner.username)}
            >
              {game.owner.username}
            </Link>
          </div>

          {/* Game Title */}
          <CardTitle>{game.name}</CardTitle>

          {/* Description */}
          <div className="md:text-base flex flex-row flex-wrap items-center w-full text-base font-black leading-snug text-black gap-2">
            <div className="whitespace-nowrap pr-4">
              {pluralize(game.questionCount, 'question')}
            </div>
            <div className="whitespace-nowrap pr-4">
              {formatDuration(game.duration)} duration
            </div>
            {isOwner && game.error && (
              <Link
                className="text-error whitespace-nowrap block pr-4 underline"
                href={routes.game.edit(game.id)}
              >
                {game.error}
              </Link>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {/* Action Buttons */}
          <div className="flex flex-row mb-5 mr-4 space-x-4">
            <PlayGame
              gameId={game.id}
              disabled={!!game.error}
              className="md:px-28 md:text-lg md:h-14 h-12 px-8 py-0"
            />
            {isOwner && (
              <>
                <EditButton href={routes.game.edit(game.id)} />
                <DropdownMenu gameId={game.id} canDelete={isOwner} />
              </>
            )}
          </div>
          <ShareButton />
        </CardFooter>
      </CardBody>
    </Card>
  );
}
