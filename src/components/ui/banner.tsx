import { ButtonPrimary } from '@/components/ui/button';
import type { HeadingProps } from '@/components/ui/heading';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

/***************************************************************
                      Banner Components
***************************************************************/

export function Banner({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        className,
        // Basic layout
        'md:w-1/2 rounded-xl md:p-8 lg:p-0 flex flex-row items-center justify-start w-full gap-8 p-4',
        // Typography
        'font-sans tracking-wide'
      )}
      {...props}
    />
  );
}

export function BannerImage({
  className,
  ...props
}: React.ComponentProps<typeof Image>) {
  /* eslint-disable jsx-a11y/alt-text */
  return (
    <div className="aspect-square lg:block relative hidden w-5/12 ml-8">
      <Image
        {...props}
        className={clsx(
          className,
          'absolute inset-0 object-contain w-full h-full'
        )}
      />
    </div>
  );
}

export function BannerContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        className,
        'lg:w-7/12 lg:mr-8 lg:my-8 flex flex-col items-center justify-center w-full'
      )}
      {...props}
    />
  );
}

export function BannerTitle({ className, level = 2, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;
  return (
    <Element
      {...props}
      className={clsx(
        className,
        'md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl md:pb-0 pb-2 text-3xl font-black leading-none text-center whitespace-nowrap mb-2'
      )}
    />
  );
}

export function BannerDescription({
  className,
  level = 3,
  ...props
}: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;
  return (
    <Element
      {...props}
      className={clsx(
        className,
        'md:text-base lg:text-xl flex flex-col items-center justify-center pb-4 text-sm font-extrabold leading-none text-center whitespace-nowrap'
      )}
    />
  );
}

export function BannerAction({
  className,
  ...props
}: React.ComponentProps<typeof ButtonPrimary>) {
  return (
    <ButtonPrimary
      className={clsx(
        'py-3 md:h-14 whitespace-nowrap md:px-6 md:w-auto md:py-0 px-6 min-w-[7rem] md:min-w-[12rem]',
        className
      )}
      {...props}
    />
  );
}

/***************************************************************
                     Full-Width Banner
***************************************************************/

export function BannerFull() {
  return (
    <div className="md:mb-5 relative mt-3 mb-3">
      <div className="flex w-full flex-col md:flex-row items-center justify-center bg-primary-100 p-8 rounded-xl gap-8">
        <h2 className="md:text-2xl lg:text-4xl text-2xl font-black leading-none text-center text-primary-content">
          Can't decide? Let players vote
        </h2>
        <ButtonPrimary className="py-3 md:h-14 whitespace-nowrap md:px-6 md:w-auto x-6md:py-0 p min-w-[7rem] md:min-w-[12rem]">
          Hello
        </ButtonPrimary>
      </div>
    </div>
  );
}
