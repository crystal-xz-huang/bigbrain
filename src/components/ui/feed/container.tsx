import clsx from 'clsx';

/***************************************************************
                     CONTAINER COMPONENTS
***************************************************************/

export function Feed({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={clsx("flex flex-col space-y-2", className)} {...props} />
  );
}

export function FeedHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      className={clsx(
        "flex flex-row items-center justify-between space-x-2 overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

export function FeedContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={clsx(className, "relative flex flex-col overflow-hidden")} {...props} />;
}
