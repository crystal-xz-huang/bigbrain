'use client';

import { navigationButtons, navigationLinks } from '@/components/ui/navigation/user/constants';
import { NavbarProfileDropdown } from '@/components/ui/navigation/user/profile-dropdown';
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
import { splitArray } from '@/lib/utils';
import type { User } from 'next-auth';

export default function NavbarComponent({ user }: { user: User }) {
  const links = splitArray(navigationLinks, 2)[0];
  const navigation = useNavLinks(links);

  return (
    <Navbar>
      <Link href="/" aria-label="Home" className="sidebar-icon h-9">
        <Logo />
      </Link>
      <NavbarSection className="max-lg:hidden">
        {/* Navigation items */}
        {navigation.map(({ label, href, current }) => (
          <NavbarItem key={label} href={href} current={current}>
            {label}
          </NavbarItem>
        ))}
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        {/* Action buttons */}
        {navigationButtons.map((btn) => {
          const BtnIcon = btn.icon;
          const BtnTrigger = btn.trigger;
          return (
            <BtnTrigger key={btn.label}>
              <NavbarItem aria-label={btn.label}>
                {BtnIcon && <BtnIcon />}
                <NavbarLabel className="hidden sm:block">
                  {btn.label}
                </NavbarLabel>
              </NavbarItem>
            </BtnTrigger>
          );
        })}
        {/* Profile dropdown */}
        <NavbarProfileDropdown user={user} />
      </NavbarSection>
    </Navbar>
  );
}
