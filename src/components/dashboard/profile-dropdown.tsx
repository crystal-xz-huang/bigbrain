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
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  UserIcon,
} from '@heroicons/react/16/solid';
import type { User } from 'next-auth';
import { signOut } from "next-auth/react";

function ProfileDropdownMenu({ ...props }) {
  return (
    <DropdownMenu className="min-w-64" {...props}>
      <DropdownItem href="/my-profile">
        <UserIcon />
        <DropdownLabel>My profile</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/settings">
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={() => signOut({redirect: true, redirectTo: '/auth/login'})}>
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
        <AvatarUser user={user} />
      </DropdownButton>
      <ProfileDropdownMenu anchor="bottom end" />
    </Dropdown>
  );
}

export function SidebarProfileDropdown({ user }: { user: User }) {
  return (
    <Dropdown>
      <DropdownButton as={SidebarItem}>
        <span className="flex min-w-0 items-center gap-3">
          <AvatarUser user={user} />
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
