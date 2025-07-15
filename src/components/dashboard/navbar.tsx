'use client';

import { Branding } from '@/components/ui/branding';
import { actions, mainNavigation } from '@/components/dashboard/items';
import { Link } from '@/components/ui/link';
import {
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from '@/components/ui/navbar';
import { useNavItems } from '@/hooks/navigation';
import type { User } from 'next-auth';
import { NavbarProfileDropdown } from './profile-dropdown';

export default function DashboardNavbar({ user }: { user: User }) {
  const mainNavItems = useNavItems(mainNavigation);

  return (
    <Navbar>
      <Link href="#" aria-label="Home" className='px-2'>
        <Branding />
      </Link>
      <NavbarSection className="max-lg:hidden">
        {/* Navigation items */}
        {mainNavItems.map(({ label, url, current }) => (
          <NavbarItem key={label} href={url} current={current}>
            {label}
          </NavbarItem>
        ))}
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        {/* Action buttons */}
        {actions.map(({ label, url, Icon }) => (
          <NavbarItem key={label} href={url} aria-label={label}>
            <Icon />
            <NavbarLabel className="hidden sm:block">{label}</NavbarLabel>
          </NavbarItem>
        ))}
        {/* Profile dropdown */}
        <NavbarProfileDropdown user={user} />
      </NavbarSection>
    </Navbar>
  );
}
