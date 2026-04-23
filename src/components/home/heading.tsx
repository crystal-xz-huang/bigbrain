import { HeadingProps } from '@/components/ui/heading';

export function Heading({ className, level = 2, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className="text-base font-extrabold text-zinc-950 sm:text-xl dark:text-white whitespace-nowrap capitalize tracking-normal"
    />
  );
}
