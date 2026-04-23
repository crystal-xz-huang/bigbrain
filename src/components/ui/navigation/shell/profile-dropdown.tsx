'use client';

import { AvatarUser } from '@/components/ui/avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownLabel,
  DropdownMenu,
} from '@/components/ui/dropdown';
import { LibraryIcon, LogoutIcon, SettingsIcon } from '@/components/ui/icon';
import { NavbarItem } from '@/components/ui/navbar';
import { SidebarItem } from '@/components/ui/sidebar';
import { useSidebar } from '@/hooks/sidebar';
import type { UserDTO } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import * as Headless from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import Link from 'next/link';

function ProfileDropdownMenu({
  user,
  ...props
}: React.ComponentProps<typeof DropdownMenu> & {
  user: UserDTO;
}) {
  return (
    <DropdownMenu className="min-w-58" {...props}>
      <DropdownItem href="/user/profile">
        <AvatarUser user={user} square />
        <DropdownLabel>
          <div className="flex flex-col justify-center min-w-0 shrink">
            <span className="block truncate text-sm font-medium text-zinc-950 dark:text-white">
              {user.name || 'Community User'}
            </span>
            <span className="block truncate text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {user.email || `@${user.username}`}
            </span>
          </div>
        </DropdownLabel>
      </DropdownItem>
      <DropdownItem href={routes.user.library}>
        <LibraryIcon data-slot="icon" />
        <DropdownLabel>Library</DropdownLabel>
      </DropdownItem>
      <DropdownItem href={routes.user.settings}>
        <SettingsIcon data-slot="icon" />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href={routes.auth.signout}>
        <LogoutIcon data-slot="icon" />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

export function NavbarProfileDropdown({ user }: { user: UserDTO }) {
  return (
    <Dropdown>
      <DropdownButton as={NavbarItem} aria-label="Account menu">
        <AvatarUser user={user} className="sm:size-8! !size-10" square />
      </DropdownButton>
      <ProfileDropdownMenu
        anchor="bottom end"
        className="min-w-64"
        user={user}
      />
    </Dropdown>
  );
}

export function SidebarProfileDropdown({ user }: { user: UserDTO }) {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return (
      <Dropdown>
        <DropdownButton
          as={SidebarItem}
          aria-label="Account menu"
          className="lg:mb-2.5"
        >
          <AvatarUser user={user} className="size-8!" square />
        </DropdownButton>

        <ProfileDropdownMenu
          anchor="left end"
          user={user}
          className="min-w-58 ml-1"
        />
      </Dropdown>
    );
  }

  return (
    <Dropdown>
      <DropdownButton as={SidebarItem} className="lg:mb-2.5">
        <span className="flex min-w-0 items-center gap-3">
          <AvatarUser user={user} className="size-10" square />
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
      <ProfileDropdownMenu
        anchor="top start"
        user={user}
        className="lg:min-w-57 sm:min-w-69 ml-1"
      />
    </Dropdown>
  );
}

export function DropdownItem({
  className,
  ...props
}: { className?: string } & (
  | Omit<Headless.MenuItemProps<'button'>, 'as' | 'className'>
  | Omit<Headless.MenuItemProps<typeof Link>, 'as' | 'className'>
)) {
  const classes = clsx(
    className,
    // Base styles
    'group cursor-pointer rounded-lg px-3.5 py-2.5 focus:outline-hidden',
    // Text styles
    'text-left text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]',
    // Focus
    'data-focus:bg-zinc-500/10 dark:data-focus:bg-white/20 dark:data-focus:text-white',
    // Disabled state
    'data-disabled:opacity-50',
    // Forced colors mode
    'forced-color-adjust-none forced-colors:data-focus:bg-[Highlight] forced-colors:data-focus:text-[HighlightText] forced-colors:data-focus:*:data-[slot=icon]:text-[HighlightText]',
    // Use subgrid when available but fallback to an explicit grid layout if not
    'col-span-full flex items-center gap-xs min-w-0 shrink',
    // Icons
    '*:data-[slot=icon]:col-start-1 *:data-[slot=icon]:row-start-1 *:data-[slot=icon]:mr-3.5 *:data-[slot=icon]:ml-0.5 *:data-[slot=icon]:size-5',
    '*:data-[slot=icon]:text-zinc-500 data-focus:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-zinc-400 dark:data-focus:*:data-[slot=icon]:text-white',
    // Avatar
    '*:data-[slot=avatar]:mr-2.5 *:data-[slot=avatar]:-ml-1 *:data-[slot=avatar]:size-8 sm:*:data-[slot=avatar]:mr-2'
  );

  return 'href' in props ? (
    <Headless.MenuItem as={Link} {...props} className={classes} />
  ) : (
    <Headless.MenuItem
      as="button"
      type="button"
      {...props}
      className={classes}
    />
  );
}
