import { getGames } from '@/lib/data';
import { GameList, EmptyState } from '@/components/admin/games';
import React from 'react';
import { requireUser } from '@/lib/session';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Games',
  description: 'Manage your games',
};

export default async function GamesPage() {
  const user = await requireUser();
  const games = await getGames(user);

  // If the games array is empty, show the empty state
  if (!games || games.length === 0) {
    return <EmptyState />;
  }

  // Otherwise, show the list of games
  return <GameList games={games} />;
}
