'use client';

import { AvatarUser } from '@/components/ui/avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/ui/dropdown';
import { NavbarItem } from '@/components/ui/navbar';
import { SidebarItem } from '@/components/ui/sidebar';
import { routes } from '@/lib/routes';
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  UserIcon,
} from '@heroicons/react/16/solid';
import type { User } from 'next-auth';
import { signOut } from 'next-auth/react';

function ProfileDropdownMenu({ ...props }) {
  return (
    <DropdownMenu className="min-w-64" {...props}>
      <DropdownItem href={routes.profile}>
        <UserIcon />
        <DropdownLabel>My profile</DropdownLabel>
      </DropdownItem>
      <DropdownItem href={routes.settings}>
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem
        onClick={() => signOut({ redirect: true, redirectTo: routes.home })}
      >
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

export function NavbarProfileDropdown({ user }: { user: User }) {
  return (
    <Dropdown>
      <DropdownButton as={NavbarItem} aria-label="Account menu">
        <AvatarUser user={user} className="size-full" />
      </DropdownButton>
      <ProfileDropdownMenu anchor="bottom end" />
    </Dropdown>
  );
}

export function SidebarProfileDropdown({
  user,
  isCollapsed,
}: {
  user: User;
  isCollapsed?: boolean;
}) {
  if (isCollapsed) {
    return (
      <Dropdown>
        <DropdownButton as={SidebarItem} aria-label="Account menu" className="lg:mb-2.5">
          <AvatarUser user={user} className="!size-8" />
        </DropdownButton>
        <ProfileDropdownMenu anchor="top start" className="min-w-50"/>
      </Dropdown>
    );
  }

  return (
    <Dropdown>
      <DropdownButton as={SidebarItem} className="lg:mb-2.5">
        <span className="flex min-w-0 items-center gap-3">
          <AvatarUser user={user} className="size-10" />
          <span className="min-w-0">
            <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
              {user.name}
            </span>
            <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
              {user.email}
            </span>
          </span>
        </span>
        <ChevronUpIcon />
      </DropdownButton>
      <ProfileDropdownMenu anchor="top start" />
    </Dropdown>
  );
}
