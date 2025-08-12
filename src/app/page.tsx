import Image from 'next/image';
import BigBrain from '@/public/bigbrain.svg';
import type { Metadata } from 'next';
import { Link } from '@/components/ui/link';

export const metadata: Metadata = {
  title: {
    template: '%s | BigBrain',
    default: 'BigBrain',
  },
};

export default function Home() {
  return (
    <div className='relative bg-white dark:bg-zinc-900 min-h-screen w-screen'>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

        <header className="row-start-1 w-full">

          <nav className="flex items-center w-full h-full justify-between border-b-1">

            <Link href="/" className='block shrink-0 w-34 md:w-46 lg:w-80 h-full'>
              <Image
                src={BigBrain}
                alt="BigBrain Logo"
                className='block object-contain object-left w-full h-full'
              />
            </Link>


          </nav>
        </header>

        <main className="flex flex-col row-start-2 items-center w-full">
        </main>

        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
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
    </div>
  );
}
