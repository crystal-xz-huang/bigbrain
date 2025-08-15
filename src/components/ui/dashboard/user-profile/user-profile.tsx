import { getUser } from '@/lib/dal';
import { fetchUserStats } from '@/lib/data';
import { generateUserStats } from '@/lib/utils';
import { ProfileBanner } from '@/components/ui/dashboard/user-profile/profile-banner';

export default async function UserProfile() {
  const user = await getUser();
  const userStats = await fetchUserStats(user);
  const stats = generateUserStats(userStats);

  return <ProfileBanner user={user} stats={stats} />;
}
