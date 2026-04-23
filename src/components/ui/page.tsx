import { Heading } from '@/components/ui/heading';
import clsx from 'clsx';

// Take up the full height and width of the parent container
function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx(className, 'w-full h-full container mx-auto')}>{children}</div>
  );
}

function PageHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-2 border-b border-zinc-950/10 dark:border-white/10">
      <Heading>{children}</Heading>
    </div>
  );
}

function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx(className, "container mx-auto mt-6")}>{children}</div>;
}

export { PageContent, PageHeading as Heading, Container};