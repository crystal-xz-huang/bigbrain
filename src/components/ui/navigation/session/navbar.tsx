import { Link } from '@/components/ui/link';
import { Logo } from '@/components/ui/logo';
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
} from '@/components/ui/navbar';
import { UserIcon } from '@heroicons/react/20/solid';
import { splitString } from '@/lib/utils';
import clsx from 'clsx';

export default function NavbarComponent({
  pin,
  numPlayers,
}: {
  pin: string;
  numPlayers: number;
}) {
  return (
    <Navbar>
      <Link href="/" aria-label="Home" className="sidebar-icon h-9">
        <Logo className="md:text-lg/7 hidden md:inline-block" />
      </Link>
      <NavbarDivider />
      <NavbarSection>
        <NavbarItem>
          <SessionPin pin={pin} />
        </NavbarItem>
        <NavbarItem>
          <SessionPlayersCount count={numPlayers} />
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  );
}

function SessionPlayersCount({ count }: { count: number }) {
  return (
    <div className="flex flex-row h-full items-center space-x-1 select-none md:text-lg/7 font-black font-sans tracking-wide">
      <UserIcon className="size-5" />
      <div>{count}</div>
    </div>
  )
}

function SessionPin({ pin }: { pin: string }) {
  const len = pin.length;
  const mid = Math.floor(len / 2);

  return (
    <div className="md:text-lg/7 font-black font-sans tracking-wide flex flex-row h-full items-center">
      <span className="md:inline-block hidden pr-1 select-none">PIN</span>
      <span className="md:hidden inline-block select-none">#</span>
      {splitString(pin, len).map((char, idx) => (
        <span
          key={idx}
          className={clsx(
            'inline-block',
            idx === mid - 1 ? 'mr-[0.125rem]' : '',
            idx === mid ? 'ml-[0.125rem]' : ''
          )}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
