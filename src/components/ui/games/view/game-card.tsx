import type { HeadingProps } from '@/components/ui/heading';
import clsx from 'clsx';
import React from 'react';

export function Card({
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className="bg-base-200 rounded-xl p-4 mb-8 overflow-hidden text-black font-sans tracking-wide"
      {...props}
    >
      <div className="lg:flex-row lg:space-y-0 lg:space-x-8 flex flex-col space-x-0 space-y-4">
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="xl:w-96 lg:w-80 w-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/10 rounded-lg z-1 w-full h-full">
        <div className="absolute inset-0 p-0">
          <div className="flex items-center justify-center w-full h-full overflow-hidden">
            <div className="flex items-center justify-center w-full h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardBody({ ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className="flex flex-col items-start flex-1 gap-4" {...props} />;
}

export function CardContent({
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div className="flex flex-col items-start gap-2" {...props} />;
}

export function CardFooter({
  children,
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className="flex flex-col items-start w-full gap-2 mt-5">
      <div className="flex flex-row flex-wrap w-full">{children}</div>
    </div>
  );
}

export function CardTitle({ className, level = 1, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;
  return (
    <Element
      {...props}
      className={clsx(className, 'text-2xl font-black leading-tight')}
    />
  );
}

export function CardThumbnail({
  src,
  alt,
}: {
  src: string | null;
  alt?: string;
}) {
  return !src ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      className="w-24 h-24 text-black/20"
    >
      <path
        fill="currentColor"
        d="M17.78 22.41a2.19 2.19 0 0 0 1.15.32 2.23 2.23 0 0 0 1.17-.32 2.31 2.31 0 0 0 .85-.85 2.33 2.33 0 0 0 0-2.32 2.39 2.39 0 0 0-.85-.85 2.23 2.23 0 0 0-1.17-.32 2.19 2.19 0 0 0-1.15.32 2.44 2.44 0 0 0-.84.85 2.33 2.33 0 0 0 0 2.32 2.36 2.36 0 0 0 .84.85Z"
      />
      <path
        fill="currentColor"
        d="M32.42 15.1a3.47 3.47 0 0 0-2.54-.86H27.7l-.59-3.33a3.41 3.41 0 0 0-1.29-2.32 3.4 3.4 0 0 0-2.65-.41L8.56 10.76A3.43 3.43 0 0 0 6.22 12a3.45 3.45 0 0 0-.41 2.63l1.78 10.23a3.35 3.35 0 0 0 1.29 2.32 3.44 3.44 0 0 0 2.65.4h.12V28a3.43 3.43 0 0 0 .86 2.51 3.49 3.49 0 0 0 2.54.86h14.83a3.47 3.47 0 0 0 2.54-.86 3.43 3.43 0 0 0 .86-2.51V17.61a3.43 3.43 0 0 0-.86-2.51Zm-1.68 1.68a1.39 1.39 0 0 1 .36 1v7.94l-3.6-3.32a2 2 0 0 0-1.44-.58 2.12 2.12 0 0 0-.75.14 2.37 2.37 0 0 0-.68.42l-4.33 3.84-1.73-1.57a2.51 2.51 0 0 0-.62-.4 1.64 1.64 0 0 0-.68-.15 1.52 1.52 0 0 0-.63.14 2.21 2.21 0 0 0-.61.4l-2.19 1.94v-8.75a1.39 1.39 0 0 1 .36-1 1.43 1.43 0 0 1 1-.35h14.51a1.43 1.43 0 0 1 1.03.3ZM11.33 25.4a1.41 1.41 0 0 1-1.08-.17 1.35 1.35 0 0 1-.53-1L8 14.5a1.36 1.36 0 0 1 .16-1.1 1.41 1.41 0 0 1 1-.51l14.27-2.52a1.36 1.36 0 0 1 1.06.16 1.41 1.41 0 0 1 .54 1l.48 2.73H15.05a3.49 3.49 0 0 0-2.54.86 3.41 3.41 0 0 0-.86 2.51v7.73Z"
      />
    </svg>
  ) : (
    <img
      src={src}
      alt={alt || 'Game Thumbnail'}
      className="object-cover w-full h-full"
    />
  );
}
