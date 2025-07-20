'use client';

import { routes } from '@/lib/routes';
import type { Game } from '@/lib/types';
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
import GameCardDropdown from './dropdown';
import GameCardMetadata from './metadata';

export default function GameCard({ game }: { game: Game }) {
  return (
    <Card
      className={clsx(!!game.active && 'outline-2 outline-emerald-500/50')}
    >
      <CardHeader>
        <CardThumbnail src={game.image} alt={game.name} />
        {/* <MutateGameStateButton game={game} /> */}
        {game.active && <CardBadge>In Progress</CardBadge>}
      </CardHeader>
      <CardContent>
        {!game.active ? (
          <CardTitle href={routes.game(game.id)}>{game.name}</CardTitle>
        ) : (
          <CardTitle>{game.name}</CardTitle>
        )}
        <CardAction>
          <GameCardMetadata questions={game.questions} />
          <GameCardDropdown game={game} />
        </CardAction>
      </CardContent>
      <CardIndicator active={!!game.active} />
    </Card>
  );
}
