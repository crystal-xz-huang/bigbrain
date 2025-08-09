'use client';

import { ButtonClose } from '@/components/ui/button';
import {
  Banner,
  BannerAction,
  BannerContent,
  BannerDescription,
  BannerFooter,
  BannerHeader,
  BannerImage,
  BannerTitle,
} from '@/components/ui/dashboard/user-profile/banner';
import { getInitials } from '@/lib/utils';
import type { User } from 'next-auth';
import { useState } from 'react';
import * as Headless from '@headlessui/react';

export function ProfileBanner({
  user,
  stats,
}: {
  user: User;
  stats: { label: string; value: string | number }[];
}) {
  const [open, setOpen] = useState(true);

  const imageProps = user.image
    ? {
        src: user.image,
        alt: `${user.name}'s profile picture`,
      }
    : {
        initials: getInitials(user.name as string),
        alt: `${user.name}'s profile picture`,
      };

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
          <BannerContent className="bg-base-200 dark:bg-base-300">
            <BannerHeader>
              <BannerImage {...imageProps} className='dark:bg-neutral' />
              <BannerDescription>
                <p>Welcome back,</p>
                <BannerTitle className="text-base-content">
                  {user.name}
                </BannerTitle>
                <p>{user.email}</p>
              </BannerDescription>
            </BannerHeader>
            <BannerAction color="white">View Profile</BannerAction>
          </BannerContent>
          <BannerFooter className="bg-base-100">
            {stats.map((stat) => (
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
