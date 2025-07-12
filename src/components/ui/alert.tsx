import * as React from 'react';
import clsx from 'clsx';

function cn(variant: 'default' | 'destructive' = 'default') {
  const base = [
    'relative w-full text-sm border border-zinc-950/20 dark:border-white/20 rounded-lg px-4 py-3 grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
    // Background color
    'bg-transparent dark:bg-white/5',
  ];

  const variantClasses = {
    default: 'text-zinc-950 dark:text-white',
    destructive: 'text-red-500 [&>svg]:text-current *:data-[slot=alert-description]:text-red-500/90',
  };

  return clsx(base, variantClasses[variant]);
}

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & {
  variant?: 'default' | 'destructive';
}) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={clsx(cn(variant), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={clsx(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={clsx(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
