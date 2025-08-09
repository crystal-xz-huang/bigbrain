import { requireUser } from '@/lib/session';
import { fetchUserStats } from '@/lib/data';
import { generateUserStats } from '@/lib/utils';
import { ProfileBanner } from '@/components/ui/dashboard/user-profile/profile-banner';

export default async function UserProfile() {
  const user = await requireUser();
  const userStats = await fetchUserStats(user);
  const stats = generateUserStats(userStats);

  return <ProfileBanner user={user} stats={stats} />;
}
