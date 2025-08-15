import Image from 'next/image';
import BigBrain from '@/public/bigbrain.svg';
import type { Metadata } from 'next';
import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarDivider,
  NavbarSpacer,
} from '@/components/ui/navbar';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: {
    template: '%s | BigBrain',
    default: 'BigBrain',
  },
};

export default function Home() {
  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen overflow-y-hidden gap-16">
      <header className="row-start-1 sticky top-0 z-30 flex h-16 w-full justify-center border-b-1">
        <Navbar className="w-full h-full justify-between px-2">

          <Link href="/" className="block shrink-0 w-34 md:w-46 lg:w-80" aria-label="Home">
            <Image
              src={BigBrain}
              alt="BigBrain Logo"
              className="block object-contain object-left w-full h-full"
            />
          </Link>

          <NavbarSection>
            <NavbarItem href={routes.player.join}>Play</NavbarItem>
            <NavbarDivider />
            <NavbarItem href={routes.signin}>Sign in</NavbarItem>
            <NavbarItem href={routes.signup}>Sign up</NavbarItem>
          </NavbarSection>
        </Navbar>
      </header>

      <main className="flex flex-col row-start-2 items-center w-full p-8 sm:p-20"></main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center pb-20">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
