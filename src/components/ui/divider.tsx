import clsx from 'clsx'

export function Divider({
  soft = false,
  className,
  ...props
}: { soft?: boolean } & React.ComponentPropsWithoutRef<'hr'>) {
  return (
    <hr
      role="presentation"
      {...props}
      className={clsx(
        className,
        'w-full border-t',
        soft && 'border-zinc-950/5 dark:border-white/5',
        !soft && 'border-zinc-950/10 dark:border-white/10'
      )}
    />
  )
}


export function DividerText({
  children
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center">
      <hr className="inline-block grow-4 border-zinc-950 dark:border-[#dedede]" />
      <span className="flex grow-1 justify-center text-center uppercase text-xs font-medium">{children}</span>
      <hr className="inline-block grow-4 border-zinc-950 dark:border-[#dedede]" />
    </div>
  );
}
