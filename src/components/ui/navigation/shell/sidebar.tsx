'use client';

import { LogoIcon, LibraryIcon, LoginIcon } from '@/components/ui/icon';
import { publicNavLinks } from './nav-links';
import { useSidebar } from '@/hooks/sidebar';
import { UserDTO } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SidebarProfileDropdown } from './profile-dropdown';
import {
  Sidebar,
  SidebarBody,
  SidebarHeading,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  ToggleSidebarButton,
  SidebarItemWrapper,
} from './sidebar-layout';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  UserPlusIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/16/solid';

export default function MainSidebar({ user }: { user: UserDTO | null }) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <SidebarItem href="/" aria-label="Home">
          <LogoIcon data-slot="icon" />
          <SidebarLabel className="text-zinc-950 dark:text-white font-bungee text-xl/6 sm:text-lg/6">
            BigBrain
          </SidebarLabel>
        </SidebarItem>
        <ToggleSidebarButton />
      </SidebarHeader>
      {/* Body */}
      <SidebarBody>
        {user ? (
          <SidebarSection>
            <SidebarItemWrapper tooltip="Create game">
              <SidebarItem href={routes.game.create}>
                <PlusIcon className="sidebar-icon stroke-3" />
                <SidebarLabel>New game</SidebarLabel>
              </SidebarItem>
            </SidebarItemWrapper>

            <SidebarItemWrapper tooltip="Library">
              <SidebarItem
                href={routes.user.library}
                current={pathname === routes.user.library}
              >
                <LibraryIcon className="sidebar-icon fill-none!" />
                <SidebarLabel>Library</SidebarLabel>
              </SidebarItem>
            </SidebarItemWrapper>
          </SidebarSection>
        ) : (
          <SidebarSection>
            <SidebarItemWrapper tooltip="Log in">
              <SidebarItem href={routes.auth.signin}>
                <LoginIcon className="scale-110"/>
                <SidebarLabel>Log in</SidebarLabel>
              </SidebarItem>
            </SidebarItemWrapper>

            <SidebarItemWrapper tooltip="Sign up">
              <SidebarItem href={routes.auth.signup}>
                <UserPlusIcon className="scale-110"/>
                <SidebarLabel>Sign up</SidebarLabel>
              </SidebarItem>
            </SidebarItemWrapper>
          </SidebarSection>
        )}
        <SidebarDivider />
        <SidebarSection className={isCollapsed ? 'gap-2' : ''}>
          <SidebarHeading className="uppercase">Explore</SidebarHeading>
          {publicNavLinks.map(({ label, href, image }) => (
            <SidebarItemWrapper key={label} tooltip={label}>
              <SidebarItem href={href} current={pathname === href}>
                {image && (
                  <Image
                    data-slot="icon"
                    src={image}
                    alt={label}
                    className="scale-130"
                  />
                )}
                <SidebarLabel>{label}</SidebarLabel>
              </SidebarItem>
            </SidebarItemWrapper>
          ))}
        </SidebarSection>
      </SidebarBody>
      {/* Footer */}
      {user && (
        <SidebarFooter>
          <SidebarProfileDropdown user={user} />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
