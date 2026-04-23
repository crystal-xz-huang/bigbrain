
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const username = (await params).slug;
  return <>{username}</>;
}