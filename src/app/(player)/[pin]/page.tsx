import { Lobby } from '@/components/ui/session/lobby';
import { fetchSessionFromAdmin } from '@/lib/data';
import { requireUser } from '@/lib/session';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ pin: string }>
}) {
  const { pin } = await params;
  if (!session) {
    notFound();
  }
  return <Lobby gameSession={session} userId={user.id} />;
}

