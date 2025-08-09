'use client';

import {
  mainNavigation,
  secondaryNavigation,
} from '@/components/ui/navigation/constants';
import { Link } from '@/components/ui/link';
import { Logo } from '@/components/ui/logo';
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
import { useNavLinks } from '@/hooks/navigation';
import { useSidebar } from '@/hooks/sidebar';
import { PlusIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import type { User } from 'next-auth';
import { SidebarProfileDropdown } from './profile-dropdown';

export default function DashboardSidebar({ user }: { user: User }) {
  const mainLinks = useNavLinks(mainNavigation);
  const secondaryLinks = useNavLinks(secondaryNavigation);
  const { isCollapsed, toggleCollapse } = useSidebar();

  return (
    <Sidebar className={clsx(isCollapsed && 'w-16')}>
      <SidebarHeader
        className={clsx(
          'flex items-center justify-between',
          isCollapsed ? 'flex-col' : 'flex-row'
        )}
      >
        <Link href="/" aria-label="Home" className="px-2 sidebar-icon h-9">
          <Logo className={clsx(isCollapsed && 'sr-only hidden')}/>
        </Link>

        <SidebarCloseButton
          aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
          title={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
          onClick={toggleCollapse}
        />
      </SidebarHeader>
      <SidebarBody className={clsx(isCollapsed && 'items-center')}>
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
                <SidebarLabel className={clsx(isCollapsed && 'sr-only hidden')}>
                  {link.label}
                </SidebarLabel>
              </SidebarItem>
            );
          })}
        </SidebarSection>
        <SidebarDivider className={clsx(isCollapsed && 'w-full')} />
        <SidebarSection>
          <SidebarHeading className={clsx(isCollapsed && 'sr-only hidden')}>
            Quick Actions
          </SidebarHeading>
          <SidebarItem href="#">
            <PlusIcon />
            <SidebarLabel className={clsx(isCollapsed && 'sr-only hidden')}>
              New game
            </SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarDivider className={clsx(isCollapsed && 'w-full')} />

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
                <SidebarLabel className={clsx(isCollapsed && 'sr-only hidden')}>
                  {link.label}
                </SidebarLabel>
              </SidebarItem>
            );
          })}
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter className={clsx(isCollapsed && 'items-center')}>
        <SidebarProfileDropdown user={user} isCollapsed={isCollapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}
