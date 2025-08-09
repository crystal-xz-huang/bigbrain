import { Heading } from '@/components/ui/heading';
import clsx from 'clsx';

// Wrapper for the page content with padding and max width
// function PageContent({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="mx-auto max-w-6xl p-6 lg:p-10">
//       <div className="container mx-auto">{children}</div>
//     </div>
//   );
// }


// Take up the full height and width of the parent container
function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx(className, 'grow flex-1 shrink-0')}>{children}</div>
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



export { PageContainer, PageContent, PageWrapper, PageHeading as Heading, Container};