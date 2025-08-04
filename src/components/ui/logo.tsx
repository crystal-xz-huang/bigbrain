import BigBrainLogo from '@public/bigbrain-logo.svg';
import Image from 'next/image';
import clsx from 'clsx';

export function Logo({ className }: { className?: string }) {
  return (
    <div className='flex items-center justify-between'>
      <Image src={BigBrainLogo} alt="Big Brain Logo" className="icon" />
      <span
        className={clsx(
          className,
          'whitespace-nowrap font-bold tracking-wider ml-2.5 text-zinc-950 dark:text-white'
        )}
      >
        BigBrain
      </span>
    </div>
  );
}
