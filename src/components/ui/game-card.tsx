import { ThumbnailIcon } from '@/components/ui/icon';
import { StatusIndicator } from '@/components/ui/indicator';
import clsx from 'clsx';

export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={clsx('relative flex flex-col gap-2', className)} {...props} />;
}

export function CardCover({ children }: React.ComponentProps<'div'>) {
  return (
    <div className="aspect-[4/3] relative w-full">
      <div className="md:rounded-xl z-1 absolute top-0 left-0 block w-full h-full overflow-hidden rounded-lg">
        {children}
      </div>
    </div>
  );
}

export function CardCoverImage({
  src,
  alt,
}: {
  src: string | null;
  alt?: string;
}) {
  return (
    <div className="absolute top-0 left-0 z-0 w-full h-full">
      <div className="bg-base-300 flex flex-col items-center justify-center w-full h-full z-1">
        {src ? (
          <img
            src={src}
            alt={alt || ''}
            className="absolute object-cover h-full w-full"
          />
        ) : (
          <ThumbnailIcon className="bg-base-300 w-24 h-24 mx-auto text-black/20" />
        )}
      </div>
    </div>
  );
}

export function CardAction({ children }: React.ComponentProps<'div'>) {
  return (
    <div className="z-2 absolute top-0 left-0 w-full h-full visible">
      <div className="z-3 absolute inset-0 flex flex-row items-center justify-center transition-opacity duration-300 ease-in-out bg-black/50 opacity-0 hover:opacity-100 ">
        {children}
      </div>
    </div>
  );
}

export function CardIndicator({ active }: { active?: boolean }) {
  return active ? (
    <div className="z-2 absolute -top-1 -right-2">
      <StatusIndicator color="green" size="md" />
    </div>
  ) : null;
}

export function CardBadge({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        className,
        'text-white/90 bg-black/70 text-xs md:text-sm rounded-br-md z-3 absolute left-0 top-0 pl-2 pr-2 md:pr-3 py-1.5 leading-none font-extrabold tracking-wide font-sans select-none'
      )}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'rounded-b-xl flex flex-col w-full text-xsm bg-transparent space-y-0.5',
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className="pb-1">
      <div
        className={clsx(
          className,
          'line-clamp-2 md:text-base md:leading-none overflow-hidden font-sans text-sm font-black leading-none tracking-normal text-black dark:text-white',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function CardDescription({
  className,
  children,
}: React.ComponentProps<'div'>) {
  return (
    <div className="flex flex-row flex-shrink-0 space-x-1 leading-0">
      <div
        className={clsx(
          className,
          'whitespace-nowrap overflow-ellipsis text-opacity-60 md:flex-row md:space-x-3 flex flex-col space-x-2 overflow-hidden font-bold text-xs md:text-sm text-zinc-500 dark:text-zinc-400'
        )}
      >
        {children}
      </div>
    </div>
  );
}
