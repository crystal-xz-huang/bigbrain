'use client';

import { Link } from '@/components/ui/link';
import { Logo } from '@/components/ui/logo';
import {
  navigationButtons,
  navigationLinks,
} from '@/components/ui/navigation/user/constants';
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
import { splitArray } from '@/lib/utils';
import clsx from 'clsx';
import type { User } from 'next-auth';
import { SidebarProfileDropdown } from './profile-dropdown';

export default function SidebarComponent({ user }: { user: User }) {
  const links = splitArray(navigationLinks, 2);
  const mainNavLinks = useNavLinks(links[0]);
  const secondaryNavLinks = useNavLinks(links[1]);
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
          <Logo className={clsx(isCollapsed && 'sr-only hidden')} />
        </Link>

        <SidebarCloseButton
          aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
          title={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
          onClick={toggleCollapse}
        />
      </SidebarHeader>
      <SidebarBody className={clsx(isCollapsed && 'items-center')}>
        <SidebarSection>
          {/* Main navigation items */}
          {mainNavLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <SidebarItem
                key={link.label}
                href={link.href}
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
          {/* Quick action items */}
          <SidebarHeading className={clsx(isCollapsed && 'sr-only hidden')}>
            Quick Actions
          </SidebarHeading>
          {/* Action buttons */}
          {navigationButtons.map((btn) => {
            const BtnIcon = btn.icon;
            const BtnTrigger = btn.trigger;
            return (
              <BtnTrigger key={btn.label}>
                <SidebarItem aria-label={btn.label}>
                  {BtnIcon && <BtnIcon />}
                  <SidebarLabel
                    className={clsx(isCollapsed && 'sr-only hidden')}
                  >
                    {btn.label}
                  </SidebarLabel>
                </SidebarItem>
              </BtnTrigger>
            );
          })}
        </SidebarSection>
        <SidebarDivider className={clsx(isCollapsed && 'w-full')} />

        <SidebarSpacer />
        <SidebarSection>
          {/* Secondary navigation items */}
          {secondaryNavLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <SidebarItem
                key={link.label}
                href={link.href}
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
