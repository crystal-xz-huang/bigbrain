'use client';

import { actions, mainNavigation } from '@/components/ui/navigation/constants';
import { NavbarProfileDropdown } from '@/components/ui/navigation/profile-dropdown';
import { Link } from '@/components/ui/link';
import { Logo } from '@/components/ui/logo';
import {
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from '@/components/ui/navbar';
import { useNavLinks } from '@/hooks/navigation';
import type { User } from 'next-auth';

export default function DashboardNavbar({ user }: { user: User }) {
  const navigation = useNavLinks(mainNavigation);

  return (
    <Navbar>
      <Link href="/" aria-label="Home" className="sidebar-icon h-9">
        <Logo />
      </Link>
      <NavbarSection className="max-lg:hidden">
        {/* Navigation items */}
        {navigation.map(({ label, url, current }) => (
          <NavbarItem key={label} href={url} current={current}>
            {label}
          </NavbarItem>
        ))}
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        {/* Action buttons */}
        {actions.map((action) => {
          const LinkIcon = action.icon;
          return (
            <NavbarItem
              key={action.label}
              href={action.url}
              aria-label={action.label}
            >
              {LinkIcon && <LinkIcon />}
              <NavbarLabel className="hidden sm:block">
                {action.label}
              </NavbarLabel>
            </NavbarItem>
          );
        })}
        {/* Profile dropdown */}
        <NavbarProfileDropdown user={user} />
      </NavbarSection>
    </Navbar>
  );
}
