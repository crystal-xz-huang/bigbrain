'use client';

import { Input as FormInput } from '@/components/ui/input';
import * as Headless from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { useState } from 'react';

/***************************************************************
                  Input with Trailing Error Icon
***************************************************************/

function InputGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      <div className="my-2 grid grid-cols-1">{children}</div>
    </div>
  );
}

export function Input({
  invalid = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <InputGroup>
      <FormInput
        className="col-start-1 row-start-1 before:hidden"
        invalid={invalid}
        {...props}
      />
      {invalid && (
        <ExclamationCircleIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-rose-500 sm:size-4"
        />
      )}
    </InputGroup>
  );
}

/***************************************************************
                      Password Input
***************************************************************/

export function PasswordInput({ ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputGroup>
      <Input
        type={showPassword ? 'text' : 'password'}
        className="col-start-1 row-start-1 before:hidden"
        {...props}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeSlashIcon className="size-5 hover:opacity-100 opacity-50" />
        ) : (
          <EyeIcon className="size-5 hover:opacity-100 opacity-50" />
        )}
      </button>
    </InputGroup>
  );
}

/***************************************************************
                      Primary Input
***************************************************************/

export function PrimaryInput({
  onClear,
  className,
  ...props
}: Omit<Headless.InputProps, 'as' | 'className'> & {
  onClear?: () => void;
  className?: string;
}) {
  return (
    <div data-slot="control" className="relative isolate block w-full">
      <Headless.Input
        {...props}
        className={clsx(
          className,
          // Basic layout
          'px-4 py-3 pr-10 w-full mb-0 outline-none',
          // Typography
          'text-left font-medium text-base text-black placeholder-black/50',
          // Border
          'rounded-2xl border-[0.25rem] border-black',
          // Background color
          'bg-white hover:bg-white focus:bg-white',
          // Shadow
          'shadow-inner-hard-1',
          // Focus state
          'focus:placeholder-black/0 focus:outline-none',
          // Disabled state
          'data-disabled:brightness-75 data-disabled:pointer-events-none',
          // Invalid state
          'data-invalid:ring-3 data-invalid:ring-error ring-offset-2'
        )}
      />
      <button
        type="button"
        className={clsx(
          "top-1/2 right-2 absolute transform -translate-y-1/2 cursor-pointer",
          'disabled' in props && props.disabled ? 'opacity-50 pointer-events-none' : '',
        )}
        onClick={onClear}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
          className="h-10 text-black opacity-50"
        >
          <path
            fill="currentColor"
            d="M16 31a11.76 11.76 0 0 1-6.17-6.16 11.48 11.48 0 0 1 0-8.91A11.76 11.76 0 0 1 16 9.81a11.43 11.43 0 0 1 8.89 0 11.73 11.73 0 0 1 3.68 2.49A12 12 0 0 1 31 16a10.94 10.94 0 0 1 .91 4.45 11.18 11.18 0 0 1-.9 4.46A11.85 11.85 0 0 1 24.85 31 11.45 11.45 0 0 1 16 31Zm1.53-6.11L20.41 22l2.93 2.93a1.11 1.11 0 0 0 .8.33 1.07 1.07 0 0 0 .79-.32 1.09 1.09 0 0 0 .31-.79 1.06 1.06 0 0 0-.33-.77L22 20.43l3-2.95a1.1 1.1 0 0 0 0-1.55 1 1 0 0 0-.78-.32 1 1 0 0 0-.78.32l-3 3L17.46 16a1 1 0 0 0-.79-.32 1.09 1.09 0 0 0-.78.31 1.06 1.06 0 0 0-.32.78 1 1 0 0 0 .33.77l2.94 2.94-2.94 3a1 1 0 0 0-.33.76 1.12 1.12 0 0 0 1.91.78Z"
          />
        </svg>
      </button>
    </div>
  );
}
