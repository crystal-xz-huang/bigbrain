'use client';

import {
  actions,
  mainNavigation,
  secondaryNavigation,
} from '@/components/navigation/constants';
import { Branding } from '@/components/ui/branding';
import { Link } from '@/components/ui/link';
import {
  Sidebar,
  SidebarBody,
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
import type { User } from 'next-auth';
import { SidebarProfileDropdown } from './dropdown';

export default function DashboardSidebar({ user }: { user: User }) {
  const mainLinks = useNavLinks(mainNavigation);
  const secondaryLinks = useNavLinks(secondaryNavigation);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="#" aria-label="Home" className="px-2">
          <Branding />
        </Link>
      </SidebarHeader>
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
      <SidebarFooter>
        {/* Profile dropdown */}
        <SidebarProfileDropdown user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
