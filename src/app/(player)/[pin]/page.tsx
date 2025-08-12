import { Lobby } from '@/components/ui/session/lobby';
import { fetchSessionFromPin, fetchSessionFromPlayer } from '@/lib/data';
import { notFound } from 'next/navigation';
import { cookies } from "next/headers";

export default async function Page({
  params,
}: {
  params: Promise<{ pin: string }>
}) {
  const { pin } = await params;
  const session = await fetchSessionFromPin(pin);
  if (!session) {
    notFound();
  }

  const playerId = cookies().get("playerId")?.value || null;
  if (!playerId) {
    
  }

  return <Lobby gameSession={session} userId={} />;
}
