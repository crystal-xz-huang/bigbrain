'use client';

import {
  Banner,
  BannerAction,
  BannerAvatar,
  BannerButton,
  BannerContent,
  BannerDescription,
  BannerFooter,
  BannerHeader,
  BannerTitle,
} from '@/components/ui/banners/profile-banner';
import { ButtonClose } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import type { ProfileBannerDTO } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { generateAvatarProps, generateUserStats } from '@/lib/utils';
import * as Headless from '@headlessui/react';
import { use, useState } from 'react';

export default function ProfileBanner({
  promise,
}: {
  promise: Promise<ProfileBannerDTO | null>;
}) {
  const [open, setOpen] = useState(true);
  const profile = use(promise);
  if (!profile) return null;

  // Destructure profile data
  const { username, name, image, stats } = profile;
  const avatarProps = generateAvatarProps({ name, image });
  const statsList = generateUserStats(stats);

  return (
    <div className="relative min-h-0">
      {open && (
        <ButtonClose
          className="absolute -top-2 -right-2 dark:bg-white/90"
          aria-label="Close banner"
          onClick={() => setOpen(false)}
        />
      )}
      <Headless.Transition show={open}>
        <Banner className="transition duration-300 ease-in data-closed:opacity-0">
          <BannerContent className="bg-beige-200 dark:bg-beige-300">
            <BannerHeader>
              <BannerAvatar {...avatarProps} className="dark:bg-neutral" />
              <BannerDescription>
                <p>Welcome back,</p>
                <BannerTitle className="text-beige-content">
                  {name || 'Admin User'}
                </BannerTitle>
                @
                <Link href="#" className="hover:underline underline-offset-2">
                  {username}
                </Link>
              </BannerDescription>
            </BannerHeader>
            <BannerAction>
              <BannerButton color="white" href={routes.user.settings}>
                View Profile
              </BannerButton>
            </BannerAction>
          </BannerContent>
          <BannerFooter className="bg-beige-100">
            {statsList.map((stat) => (
              <div
                key={stat.label}
                className="px-6 py-5 text-center text-sm font-semibold"
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
          </BannerFooter>
        </Banner>
      </Headless.Transition>
    </div>
  );
}
