'use client';

import { Branding } from '@/components/ui/branding';
import {
  actions,
  mainNavigation,
  secondaryNavigation,
} from '@/components/dashboard/items';
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
import { useNavItems } from '@/hooks/navigation';
import type { User } from 'next-auth';
import { SidebarProfileDropdown } from './profile-dropdown';

export default function DashboardSidebar({ user }: { user: User }) {
  const mainNavItems = useNavItems(mainNavigation);
  const secondaryNavItems = useNavItems(secondaryNavigation);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="#" aria-label="Home" className="px-2">
          <Branding />
        </Link>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          {/* Navigation items */}
          {mainNavItems.map(({ label, url, Icon, current }) => (
            <SidebarItem key={label} href={url} current={current}>
              <Icon />
              <SidebarLabel>{label}</SidebarLabel>
            </SidebarItem>
          ))}
        </SidebarSection>
        <SidebarDivider />
        <SidebarSection>
          <SidebarHeading>Quick Actions</SidebarHeading>
          {/* Action buttons */}
          {actions.map(({ label, url, Icon }) => (
            <SidebarItem key={label} href={url} aria-label={label}>
              <Icon />
              <SidebarLabel className="hidden md:block">{label}</SidebarLabel>
            </SidebarItem>
          ))}
        </SidebarSection>
        <SidebarSpacer />
        <SidebarSection>
          {/* Secondary navigation items */}
          {secondaryNavItems.map(({ label, url, Icon, current }) => (
            <SidebarItem key={label} href={url} current={current}>
              <Icon />
              <SidebarLabel>{label}</SidebarLabel>
            </SidebarItem>
          ))}
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        {/* Profile dropdown */}
        <SidebarProfileDropdown user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
