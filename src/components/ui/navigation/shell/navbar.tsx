'use client';

import {
  Logo,
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
  NavbarLabel,
} from '@/components/ui/navbar';
import { NavbarProfileDropdown } from './profile-dropdown';
import { UserDTO } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

/***************************************************************
                     Main Navigation
***************************************************************/

export default function MainNavbar({ user }: { user: UserDTO | null }) {
  return (
    <Navbar>
      {/* Logo */}
      <Logo />
      <NavbarSpacer />
      {/* Search */}
      <NavbarSection>
        <NavbarItem href="/search" aria-label="Search">
          <MagnifyingGlassIcon />
        </NavbarItem>
        {user && <NavbarProfileDropdown user={user} />}
      </NavbarSection>
      {/* Profile or Auth Links */}
      {!user && (
        <NavbarSection className='max-sm:hidden'>
          <NavbarItem href={routes.auth.signin}>
            <NavbarLabel>Log in</NavbarLabel>
          </NavbarItem>
          <NavbarItem href={routes.auth.signup}>
            <NavbarLabel>Sign up</NavbarLabel>
          </NavbarItem>
        </NavbarSection>
      )}
    </Navbar>
  );
}
