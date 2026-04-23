// import CreatePlayerForm from '@/components/session/forms/create-player';
// import { Lobby } from '@/components/session/lobby';
// import { fetchSessionFromPin } from '@/lib/data/_data';
// import { getAvatarImages } from '@/lib/server';
// import { cookies } from 'next/headers';
// import { notFound } from 'next/navigation';

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ pin: string }>;
// }) {
//   const { pin } = await params;
//   const session = await fetchSessionFromPin(pin);
//   if (!session) {
//     notFound();
//   }

//   const cookieStore = await cookies();
//   const playerId = cookieStore.get('playerId')?.value || '';
//   if (!playerId) {
//     const avatars = getAvatarImages();
//     return <CreatePlayerForm pin={pin} avatars={avatars} />;
//   }

//   return <Lobby gameSession={session} userId={playerId} />;
// }
