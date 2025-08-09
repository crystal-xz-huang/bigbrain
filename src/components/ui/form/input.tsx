'use client';

import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/fieldset';
import { Input as FormInput } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { fileToDataUrl } from '@/lib/utils';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { PhotoIcon } from '@heroicons/react/24/solid';
import React, { useRef, useState } from 'react';

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
