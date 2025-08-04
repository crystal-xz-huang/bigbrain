'use client';

import {
  EditButton,
  PlayButton,
  ShareButton,
} from '@/components/games/view/ui/buttons';
import Dropdown from '@/components/games/view/ui/dropdown';
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardThumbnail,
  CardTitle,
} from '@/components/games/view/ui/game-card';
import { Avatar } from '@/components/ui/avatar';
import { Link } from '@/components/ui/link';
import { routes } from '@/lib/routes';
import { GameWithQuestions } from '@/lib/types';
import {
  formatTime,
  generateErrorMessage,
  isInvalidGame,
  pluralSuffix,
  totalDuration,
  totalNumberOfQuestions,
} from '@/lib/utils';
import { UserIcon } from '@heroicons/react/20/solid';

export default function ViewGame({ game }: { game: GameWithQuestions }) {
  const duration = totalDuration(game.questions);
  const questionsCount = totalNumberOfQuestions(game.questions);

  return (
    <Card>
      <CardHeader>
        <CardThumbnail src={game.image} alt={`${game.name}'s image`} />
      </CardHeader>
      <CardBody>
        <CardContent>
          {/* User */}
          <div className="flex flex-row items-center gap-2">
            {game.owner.image ? (
              <Avatar className="size-6" src={game.owner.image} />
            ) : (
              <UserIcon className="size-6 rounded-full bg-neutral stroke-white fill-white" />
            )}
            <Link
              className="text-sm font-bold hover:underline p-1"
              title={`Quiz by ${game.owner.name}`}
              href="#"
            >
              {game.owner.name}
            </Link>
          </div>

          {/* Game Title */}
          <CardTitle>{game.name}</CardTitle>

          {/* Description */}
          <div className="md:text-base flex flex-row flex-wrap items-center w-full text-base font-black leading-snug text-black">
            <div className="whitespace-nowrap pr-4">
              {questionsCount} question{pluralSuffix(questionsCount)}
            </div>
            <div className="whitespace-nowrap pr-4">{formatTime(duration)}</div>
            {isInvalidGame(game) && (
              <Link
                className="text-error whitespace-nowrap block pr-4 underline"
                href={routes.game.edit(game.id)}
              >
                {generateErrorMessage(game)}
              </Link>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {/* Action Buttons */}
          <div className="flex flex-row mb-5 mr-4 space-x-4">
            <PlayButton disabled={isInvalidGame(game)} />
            <EditButton href={routes.game.edit(game.id)} />
          </div>
          <Dropdown game={game} />
          <ShareButton />
        </CardFooter>
      </CardBody>
    </Card>
  );
}
