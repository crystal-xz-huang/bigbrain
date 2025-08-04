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

/***************************************************************
                     File Input
***************************************************************/
export function FileInput({
  value,
  onChange,
  accept = 'image/jpeg, image/png, image/jpg',
  maxSizeBytes = 2000000,
  ...props
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  accept?: string;
  maxSizeBytes?: number;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // reset the input value to allow re-uploading the same file
    e.target.value = '';

    if (file.size > maxSizeBytes) {
      setError(`File is too big. Max ${(maxSizeBytes / 1e6).toFixed(1)} MB`);
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setError('');
      onChange(dataUrl as string);
    } catch (err) {
      setError(err.message || 'Failed to load image. Please try again.');
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the file input
    onChange(null);
    setError('');
  };

  return (
    <>
      <div className="flex items-center gap-x-8">
        <div className="h-full w-50">
          {value ? (
            <div className="relative">
              <img
                alt=""
                src={value}
                className="size-full flex-none rounded-lg object-cover"
                onError={() =>
                  setError('Failed to load image. Please try again.')
                }
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-white/80 dark:bg-zinc-950/80 rounded-full p-1 cursor-pointer"
                onClick={handleRemoveImage}
              >
                <XMarkIcon
                  aria-hidden="true"
                  className="size-5 text-zinc-950 dark:text-white"
                />
              </button>
            </div>
          ) : (
            <PhotoIcon
              aria-hidden="true"
              className="size-full text-zinc-300 dark:text-zinc-500"
            />
          )}
        </div>
        <div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            ref={fileInputRef}
            className="sr-only"
            {...props}
          />

          <Button type="button" onClick={handleFileUpload}>
            <span className="hidden sm:inline">Change image</span>
            <span className="inline sm:hidden">Change</span>
          </Button>

          <Text className="mt-2 text-xs/5 sm:text-xs/5">
            {`JPG, JPEG or PNG. Max size ${(maxSizeBytes / 1e6).toFixed(
              1
            )} MB.`}
          </Text>
        </div>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
}
