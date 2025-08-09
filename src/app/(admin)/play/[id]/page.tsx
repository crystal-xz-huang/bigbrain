import { Lobby } from '@/components/ui/session/lobby';
import { fetchSessionFromAdmin } from '@/lib/data';
import { requireUser } from '@/lib/session';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const user = await requireUser();
  const session = await fetchSessionFromAdmin(user.id, id);
  if (!session) {
    notFound();
  }
  return <Lobby gameSession={session} userId={user.id} />;
}
