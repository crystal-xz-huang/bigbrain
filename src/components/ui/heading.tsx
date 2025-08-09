import clsx from 'clsx';

export type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
} & React.ComponentPropsWithoutRef<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;

export function Heading({ className, level = 1, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        'text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white'
      )}
    />
  );
}

export function Subheading({ className, level = 2, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        'text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white'
      )}
    />
  );
}

export function HeadingOutlined({
  className,
  level = 1,
  children,
  ...props
}: HeadingProps & { children?: React.ReactNode }) {
  const Element: `h${typeof level}` = `h${level}`;
  return (
    <Element
      {...props}
      className={clsx(
        'xl:text-6xl lg:text-5xl text-6xl font-black leading-none font-sans tracking-[0.03em]',
        className,
      )}
    >
      <div className="relative inline-block">
        <div className="px-0 z-3 relative top-0 left-0">{children}</div>
        <div
          className="px-0 z-2 absolute top-0 left-0 text-transparent pointer-events-none select-none"
          style={{ WebkitTextStroke: '0.166667em rgb(0, 0, 0)' }}
        >
          {children}
        </div>
        <div
          className="px-0 top-px z-1 absolute left-0 text-transparent pointer-events-none select-none"
          style={{ WebkitTextStroke: '0.166667em rgb(0, 0, 0)' }}
        >
          {children}
        </div>
      </div>
    </Element>
  );
}
