import { HeadingOutlined } from '@/components/ui/heading';
import { splitString } from '@/lib/utils';
import clsx from 'clsx';

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
