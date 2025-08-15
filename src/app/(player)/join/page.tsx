import { Link } from '@/components/ui/link';
import EnterPinForm from '@/components/ui/session/forms/enter-pin';
import { routes } from '@/lib/routes';
import BigBrain from '@/public/bigbrain-play.svg';
import LandingBackgroundImage from '@/public/landing-background.jpg';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Enter Game PIN',
  description: 'Join a game by entering the PIN provided by the host',
};

export default function Page() {
  return (
    <>
      <div className="absolute inset-0 h-full w-full overflow-hidden z-0">
        <Image
          className="absolute inset-0 h-full w-full scale-[1.05] object-cover opacity-50 blur-2xl dark:opacity-30"
          src={LandingBackgroundImage}
          alt="Landing Background"
          priority
        />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-white dark:to-black" />
      </div>

      <div className="relative z-10 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className="col-span-full row-start-1 mt-[650px]">
          <Image
            src={BigBrain}
            alt="BigBrain logo"
            className="max-w-4xl w-full"
          />
        </header>

        <main className="flex flex-col row-start-2 items-center w-full">
          <EnterPinForm className="glitch bg-white dark:bg-black" />
        </main>

        <footer className="row-start-3 flex flex-col gap-3 flex-wrap items-center justify-center">
          <div>
            Create your own game for FREE at{' '}
            <Link
              href={routes.home}
              className="font-bold hover:underline hover:underline-offset-4"
            >
              bigbrain.com
            </Link>
          </div>
          <div className="flex items-center gap-[24px]">
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
          </div>{' '}
        </footer>
      </div>
    </>
  );
}
