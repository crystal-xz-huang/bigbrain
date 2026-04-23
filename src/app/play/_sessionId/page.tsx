// import { Lobby } from '@/components/session/lobby';
// import { fetchSessionFromAdmin } from '@/lib/data/_data';
// import { getUser } from '@/lib/data/auth';
// import { notFound } from 'next/navigation';

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ sessionId: string }>
// }) {
//   const { sessionId } = await params;
//   const user = await getUser();
//   const session = await fetchSessionFromAdmin(user.id, sessionId);
//   if (!session) {
//     notFound();
//   }

//   return <Lobby gameSession={session} userId={user.id} />;
// }
