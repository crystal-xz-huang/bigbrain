import clsx from 'clsx';
import { ThumbnailIcon } from '@/components/ui/icon';

export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'overflow-hidden rounded-lg bg-base-100 dark:bg-neutral shadow-sm',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        className,
        'px-8 py-8 min-h-[200px] bg-black/25 dark:text-white'
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={clsx('flex-1 px-4 py-5 sm:p-6', className)} {...props} />
  );
}

export function CardThumbnail({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div className={clsx(className, "w-auto aspect-[4/3] bg-black/30 rounded-2xl flex justify-center items-center")}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <ThumbnailIcon className="w-14 relative h-full m-auto text-white opacity-50" />
      )}
    </div>
  );
}
