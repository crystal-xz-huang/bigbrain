import clsx from 'clsx'
import { Logo } from '@/components/ui/logo';

export function Branding({ size, className} : { size?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }) {
  // Default size is small
  size = size || 'xs';

  let sizeClasses = {
    xs: { logo: 'size-[20px]', text: 'text-base'},
    sm: { logo: 'size-6', text: 'text-lg'},
    md: { logo: 'size-8', text: 'text-2xl'},
    lg: { logo: 'size-10', text: 'text-3xl'},
  }[size];

  // Fallback to small size if size is not valid
  if (!sizeClasses) {
    sizeClasses = { logo: 'size-6', text: 'text-lg'};
  }

  return (
    <div className={clsx('flex items-center gap-2.5 py-2 w-full', className)}>
      <Logo className={sizeClasses.logo} />
      <span className={clsx('font-bold leading-none tracking-wider hidden sm:block text-zinc-950 dark:text-zinc-100', sizeClasses.text)}>
        BigBrain
      </span>
    </div>
  );
}