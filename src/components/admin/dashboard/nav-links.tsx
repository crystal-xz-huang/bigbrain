'use client';

import { Navbar, NavbarItem, NavbarSection } from '@/components/ui/navbar';
import { SelectTabs } from '@/components/ui/select';
import type { TabLink } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useTabLinks } from '@/hooks/navigation';
import { routes } from '@/lib/routes';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const tabs: TabLink[] = [
  { name: 'Games', href: routes.games, current: true },
  { name: 'Reports', href: routes.reports, current: false },
];

export default function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const tabLinks = useTabLinks(tabs);

  return (
    <>
      {/* Mobile: select */}
      <div className={clsx("grid grid-cols-1 sm:hidden", className)}>
        <SelectTabs
          name="tabs"
          value={pathname}
          onChange={(e) => router.push(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.href}>
              {tab.name}
            </option>
          ))}
        </SelectTabs>
      </div>
      {/* Desktop: nav links */}
      <Navbar className={clsx("hidden sm:block", className)}>
        <NavbarSection className="-mb-px flex space-x-3 -ml-1.5">
          {tabLinks.map((tab) => (
            <NavbarItem
              key={tab.name}
              href={tab.href}
              current={tab.current}
              aria-current={tab.current ? 'page' : undefined}
            >
              {tab.name}
            </NavbarItem>
          ))}
        </NavbarSection>
      </Navbar>
    </>
  );
}
