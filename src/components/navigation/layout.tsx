'use client';

import {
  actions,
  mainNavigation,
  secondaryNavigation,
} from '@/components/navigation/constants';
import { Link } from '@/components/ui/link';
import { NavbarItem } from '@/components/ui/navbar';
import {
  Sidebar,
  SidebarBody,
  SidebarCloseButton,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/ui/sidebar';
import { MobileSidebar, OpenMenuIcon } from '@/components/ui/sidebar-layout';
import { useSidebar } from '@/hooks/sidebar';
import { useNavLinks } from '@/hooks/navigation';
import BigBrainLogo from '@public/bigbrain-logo.svg';
import Image from 'next/image';
import React from 'react';
import type { User } from 'next-auth';

export function DashboardLayout({
  children,
}: React.PropsWithChildren<{
  user: User;
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const { isOpen: showSidebar, open, close } = useSidebar();
  const mainLinks = useNavLinks(mainNavigation);
  const secondaryLinks = useNavLinks(secondaryNavigation);

  return (
    <div className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Sidebar on desktop */}
      <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">
        <Sidebar>
          <SidebarHeader className="flex flex-row items-center justify-between">
            <Link
              href="/"
              aria-label="Home"
              className="flex h-9 w-9 items-center justify-center"
            >
              <Image
                src={BigBrainLogo}
                alt="Big Brain Logo"
                width={20}
                height={20}
                className="icon-lg"
              />
            </Link>
            <SidebarCloseButton onClick={close} />
          </SidebarHeader>
        </Sidebar>
        <SidebarBody>
          <SidebarSection>
            <SidebarHeading>Quick Actions</SidebarHeading>
            {/* Action buttons */}
            {actions.map((action) => {
              const LinkIcon = action.icon;
              return (
                <SidebarItem
                  key={action.label}
                  href={action.url}
                  aria-label={action.label}
                >
                  {LinkIcon && <LinkIcon />}
                  <SidebarLabel className="hidden md:block">
                    {action.label}
                  </SidebarLabel>
                </SidebarItem>
              );
            })}
          </SidebarSection>
          <SidebarDivider />
          <SidebarSection>
            {/* Navigation items */}
            {mainLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <SidebarItem
                  key={link.label}
                  href={link.url}
                  current={link.current}
                >
                  {LinkIcon && <LinkIcon />}
                  <SidebarLabel>{link.label}</SidebarLabel>
                </SidebarItem>
              );
            })}
          </SidebarSection>
          <SidebarSpacer />
          <SidebarSection>
            {/* Secondary navigation items */}
            {secondaryLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <SidebarItem
                  key={link.label}
                  href={link.url}
                  current={link.current}
                >
                  {LinkIcon && <LinkIcon />}
                  <SidebarLabel>{link.label}</SidebarLabel>
                </SidebarItem>
              );
            })}
          </SidebarSection>
        </SidebarBody>
        <SidebarFooter>{sidebar}</SidebarFooter>
      </div>

      {/* Sidebar on mobile */}
      <MobileSidebar open={showSidebar} close={close}>
        {sidebar}
      </MobileSidebar>

      {/* Navbar on mobile */}
      <header className="flex items-center px-4 lg:hidden">
        <div className="py-2.5">
          <NavbarItem onClick={open} aria-label="Open navigation">
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2 lg:pl-64">
        <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
