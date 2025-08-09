import { Link } from '@/components/ui/link';
import { Logo } from '@/components/ui/logo';
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
} from '@/components/ui/navbar';
import { UserIcon } from '@heroicons/react/20/solid';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Navbar */}
      <header className="flex items-center px-4">
        <div className="min-w-0 flex-1">
          <NavbarComponent />
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col pb-2 lg:px-2">
        <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10 flex flex-col">
          <div className="grow flex flex-col">{children}</div>
        </div>
      </main>
    </div>
  );
}

function NavbarComponent() {
  return (
    <Navbar>
      <Link href="/" aria-label="Home" className="sidebar-icon h-9">
        <Logo className="md:text-lg/7 hidden md:inline-block" />
      </Link>
      <NavbarDivider />
      <NavbarSection>
        <NavbarItem>
          <div className="md:text-lg/7 font-black font-sans tracking-wide flex flex-row h-full items-center">
            <span className="md:inline-block hidden pr-1 select-none">PIN</span>
            <span className="md:hidden inline-block select-none">#</span>
            <span className="inline-block">7</span>
            <span className="inline-block">4</span>
            <span className="inline-block mr-[0.125rem]">5</span>
            <span className="inline-block ml-[0.125rem]">5</span>
            <span className="inline-block">4</span>
            <span className="inline-block">6</span>
          </div>
        </NavbarItem>
        <NavbarItem>
          <div className="flex flex-row h-full items-center space-x-1 select-none md:text-lg/7 font-black font-sans tracking-wide">
            <UserIcon className="size-5" />
            <div>1</div>
          </div>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  );
}
