import { Button } from '@/components/ui/button';
import React from 'react';

export function EditButton({ ...props }) {
  return (
    <Button
      rounded
      color="gray"
      type="button"
      className="text-base md:text-lg w-full md:px-16 md:h-14 h-12 !px-8 !py-0 flex items-center justify-center"
      {...props}
    >
      <span className="font-sans tracking-wide font-black whitespace-nowrap">
        Edit
      </span>
    </Button>
  );
}

export function ShareButton({
  ...props
}: Omit<React.ComponentPropsWithoutRef<'button'>, 'color'>) {
  return (
    <Button
      rounded
      color="gray"
      type="button"
      className="text-lg md:size-14 shrink-0 flex flex-col items-center justify-center size-12 p-0 mb-4 mr-4 !rounded-full"
      {...props}
    >
      <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        className="md:w-8 md:h-8 w-6 h-6"
      >
        <path
          d="M33.17 19.2c0 .13-.05.25-.15.34L21.84 29.76c-.13.12-.33.15-.49.08s-.27-.24-.27-.42v-4.46h-.3c-5.04.07-9.81.14-12.48 6.89a.47.47 0 0 1-.43.29c-.19 0-.36-.11-.43-.29a13.78 13.78 0 0 1-.72-7.93 13.78 13.78 0 0 1 3.77-7.01c2.67-2.67 6.41-3.97 10.58-3.7V8.97c0-.18.11-.35.27-.42s.36-.04.49.08l11.18 10.22c.09.09.15.21.15.34Z"
          fill="currentColor"
        />
      </svg>
    </Button>
  );
}
