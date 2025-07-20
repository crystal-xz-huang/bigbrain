'use client';

import { actions, mainNavigation } from '@/components/admin/layout/nav-links';
import { Branding } from '@/components/ui/branding';
import { Link } from '@/components/ui/link';
import {
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from '@/components/ui/navbar';
import { useNavLinks } from '@/hooks/navigation';
import type { User } from 'next-auth';
import { NavbarProfileDropdown } from '@/components/admin/layout/dropdown';

export default function DashboardNavbar({ user }: { user: User }) {
  const navigation = useNavLinks(mainNavigation);

  return (
    <Navbar>
      <Link href="#" aria-label="Home" className="px-2">
        <Branding />
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
