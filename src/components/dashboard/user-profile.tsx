import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { fetchUserStats } from '@/lib/data';
import { requireUser } from '@/lib/session';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';

export default async function UserProfile() {
  const user = await requireUser();
  const userStats = await fetchUserStats(user);

  const stats = [
    {
      label: 'joined',
      value:
        userStats?.joinedAt?.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        }) || 'N/A',
    },
    { label: 'games', value: userStats?.totalGames || 0 },
  ];

  return (
    <div className="overflow-hidden rounded-lg shadow-lg outline-1 outline-zinc-950/10 bg-white dark:bg-white">
      <h2 id="profile-overview-title" className="sr-only">
        Profile Overview
      </h2>
      <div className="bg-base-200 dark:bg-white p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            {/* Image */}
            <div className="shrink-0 flex items-center justify-center">
              {user.image ? (
                <Image
                  alt={`${user.name}'s profile picture`}
                  src={user.image}
                  className="mx-auto size-20 rounded-full"
                />
              ) : (
                <Avatar
                  className="mx-auto size-20 bg-base-400 text-white dark:bg-white dark:text-black"
                  alt={user.name || ''}
                  initials={getInitials(user.name as string)}
                />
              )}
            </div>
            {/* User Info */}
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-sm font-medium text-gray-600">Welcome back,</p>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                {user.name}
              </p>
              <p className="text-sm font-medium text-gray-600">{user.email}</p>
            </div>
          </div>
          {/* Action Button */}
          <div className="mt-5 flex justify-center sm:mt-0">
            <Button outline>View Profile</Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 bg-base-100 dark:bg-zinc-50 divide-y divide-zinc-950/5 dark:divide-white/5 border-t border-zinc-950/5 dark:border-white/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="px-6 py-5 text-center text-sm font-medium"
          >
            {stat.label === 'joined' ? (
              <>
                <span className="text-gray-600">{stat.label}</span>{' '}
                <span className="text-gray-900">{stat.value}</span>
              </>
            ) : (
              <>
                <span className="text-gray-900">{stat.value}</span>{' '}
                <span className="text-gray-600">{stat.label}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
