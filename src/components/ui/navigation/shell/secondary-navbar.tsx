'use client';

import { Link } from '@/components/ui/link';
import clsx from 'clsx';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { publicNavLinks } from './nav-links';

/***************************************************************
                     Secondary Navigation
***************************************************************/

export default function SecondaryNavbar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    // lg:hidden?
    <header className={clsx('block max-md:hidden md:pb-8', className)}>
      <nav className="flex flex-row justify-between w-full space-y-0 text-base">
        {publicNavLinks.map((link) => (
          <SecondaryNavItem
            key={link.label}
            label={link.label}
            href={link.href}
            current={pathname === link.href}
            {...(link.image && { image: link.image })}
          />
        ))}
      </nav>
    </header>
  );
}

function SecondaryNavItem({
  label,
  href,
  image,
  current,
}: {
  label: string;
  href: string;
  image?: StaticImport | string;
  current?: boolean;
}) {
  return (
    <Link
      key={label}
      href={href}
      className="whitespace-nowrap group flex flex-col space-x-0 items-center cursor-pointer"
    >
      {image && <Image src={image} alt={label} className="md:size-9 size-5" />}
      <div className="pb-1 md:text-xs text-base font-bold leading-snug transition-opacity group-hover:opacity-100 opacity-60 text-black dark:text-white">
        {label}
      </div>
      <div
        className={clsx(
          'w-full group-hover:opacity-100 transition-opacity h-1 bg-black dark:bg-white rounded-full hidden md:block',
          current ? 'opacity-100' : 'opacity-0'
        )}
      />
    </Link>
  );
}
