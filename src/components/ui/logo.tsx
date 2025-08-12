import BigBrainLogo from '@/public/bigbrain-logo.svg';
import Image from 'next/image';
import clsx from 'clsx';
import { HeadingOutlined } from '@/components/ui/heading';
import { splitString } from '@/lib/utils';

export function Logo({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center w-full h-full">
      <Image
        src={BigBrainLogo}
        alt="Big Brain Logo"
        className={clsx(className, 'icon')}
      />
      <span
        className={clsx(
          className,
          'whitespace-nowrap ml-2.5 text-zinc-950 dark:text-white grow font-bungee'
        )}
      >
        {children || 'BigBrain'}
      </span>
    </div>
  );
}

export function LogoIcon({ className }: { className?: string }) {
  <Image
    src={BigBrainLogo}
    alt="Big Brain Logo"
    className={clsx(className, 'icon')}
  />;
}

export function LogoHeading({ className }: { className?: string }) {
  const name = 'BigBrain';
  const colors = [
    'text-red-pastel',
    'text-orange-pastel',
    'text-green-pastel',
    'text-cyan-pastel',
    'text-blue-pastel',
    'text-pink-pastel',
    'text-gold-pastel',
    'text-yellow-pastel',
  ];

  return (
    <HeadingOutlined className={clsx('relative tracking-normal ', className)}>
      <div className="flex flex-row items-center justify-center flex-nowrap">
        {splitString(name, name.length).map((part, index) => (
          <div key={index} className={clsx(colors[index])}>
            {part}
          </div>
        ))}
      </div>
    </HeadingOutlined>
  );
}
