'use client';

import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/styled/button';
import { routes } from '@/lib/routes';
import clsx from 'clsx';
import {
  Card,
  CardAction,
  CardBadge,
  CardContent,
  CardHeader,
  CardIndicator,
  CardThumbnail,
  CardTitle,
} from './card';
import { GameWithQuestions } from '@/lib/types';

export default function Game({ game }: { game: GameWithQuestions }) {
  return (
    <Card className={clsx(!!game.active && 'outline-2 outline-emerald-500/50')}>
      <CardHeader>
        <CardThumbnail src={game.image} alt={game.name} />
        <CardAction>
          <Button
            className="!text-base w-32 h-14"
            href={routes.game.view(game.id)}
          >
            Play
          </Button>
        </CardAction>
        {game.active && <CardBadge>In Progress</CardBadge>}
      </CardHeader>
      <CardContent>
        {game.active ? (
          <CardTitle>{game.name}</CardTitle>
        ) : (
          <CardTitle href={routes.game.view(game.id)}>{game.name}</CardTitle>
        )}
        <Link
          className="text-xs/4 hover:underline underline-offset-2 text-zinc-500 dark:text-zinc-400"
          href={routes.game.edit(game.id)}
        >
          Edit quiz
        </Link>
      </CardContent>
      <CardIndicator active={!!game.active} />
    </Card>
  );
}
