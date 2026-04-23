import { Link } from '@/components/ui/link';
import clsx from 'clsx';

/***************************************************************
                     LIST COMPONENTS
***************************************************************/

export function FeedList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul
      {...props}
      role="list"
      className={clsx(
        className,
        'flex flex-row overflow-x-auto space-x-4 w-full'
      )}
    />
  );
}

export function FeedListItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      {...props}
      className={clsx(
        className,
        'relative flex flex-col shrink-0 w-1/3 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 pb-5'
      )}
    />
  );
}

export function FeedLink({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      {...props}
      className={clsx(
        className,
        'text-zinc-950 dark:text-white underline underline-offset-[3.5px] decoration-2 decoration-accent data-hover:opacity-80 transition-opacity duration-200 text-base font-bold whitespace-nowrap'
      )}
    />
  );
}

export function NumberedFeedList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul
      {...props}
      role="list"
      className={clsx(
        className,
        'grid grid-flow-col grid-rows-3 space-x-4 overflow-x-auto pb-5 space-y-3'
      )}
    />
  );
}

export function NumberedFeedListItem({
  index,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { index: number }) {
  return (
    <li
      {...props}
      className={clsx(
        className,
        'relative flex flex-row items-center gap-2 row-span-1 col-span-1'
      )}
    >
      <div className="w-10 text-shadow-lg font-bold text-3xl/10 text-center">
        {index + 1}
      </div>
      <div className="w-85 sm:w-85 md:w-95">{children}</div>
    </li>
  );
}
