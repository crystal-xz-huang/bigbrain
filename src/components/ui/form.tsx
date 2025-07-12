import { Input } from '@/components/ui/input';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import React, { useState } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

function InputGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      <div className="my-2 grid grid-cols-1">{children}</div>
    </div>
  );
}

export function FormInput({
  invalid = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <InputGroup>
      <Input
        className='col-start-1 row-start-1 before:hidden'
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

export function InputPassword({ ...props}) {
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