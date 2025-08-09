'use client';

import { Button, ButtonClose } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/fieldset';
import { Text } from '@/components/ui/text';
import { fileToDataUrl } from '@/lib/utils';
import * as Headless from '@headlessui/react';
import { PhotoIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';

export function ControlGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(className, 'w-full flex items-center justify-between')}
    />
  );
}

export function ControlWrapper({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={clsx(className, 'flex-shrink-0')} />;
}

export function Fieldset({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldsetProps, 'as' | 'className'>) {
  return (
    <Headless.Fieldset
      {...props}
      className={clsx(
        className,
        'rounded-md border-1 border-zinc-950/10 dark:border-white/10 bg-zinc-950/5 dark:bg-white/5'
      )}
    />
  );
}

export function Field({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, 'as' | 'className'>) {
  return (
    <Headless.Field
      {...props}
      className={clsx(className, 'flex flex-col w-full')}
    />
  );
}

export function FieldsetHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'col-span-full py-2 px-5 border-b border-zinc-300 dark:border-white/10 flex items-center justify-between',
        'font-bold text-sm/6 text-zinc-500 dark:text-zinc-400 min-h-[3rem]'
      )}
    />
  );
}

export function Legend({
  className,
  ...props
}: { className?: string } & Omit<Headless.LegendProps, 'as' | 'className'>) {
  return (
    <Headless.Legend
      data-slot="legend"
      {...props}
      className={clsx(
        className,
        'text-sm/6 font-bold text-zinc-500 dark:text-zinc-400'
      )}
    />
  );
}

export function Label({
  className,
  invalid,
  children,
  ...props
}: {
  className?: string;
  invalid?: boolean;
  children?: React.ReactNode;
} & Omit<Headless.LabelProps, 'as' | 'className'>) {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className="flex flex-row justify-start w-full text-sm sm:text-xs font-bold text-white transform translate-y-[1px] h-[31px]"
    >
      <span
        className={clsx(
          className,
          'relative rounded-t-md inline-block px-3 py-2.5 leading-none'
        )}
      >
        {children}
        {invalid && <ErrorIcon />}
      </span>
    </Headless.Label>
  );
}

export function InputGroup({
  children,
  className,
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="control"
      className={clsx(className, 'rounded-b-xl rounded-tr-xl relative p-1')}
    >
      {children}
    </div>
  );
}

export function Input({
  className,
  maxLength = 75,
  value,
  onChange,
  ...props
}: {
  className?: string;
  maxLength?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<Headless.InputProps, 'as' | 'className'>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    const event = {
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!maxLength || e.target.value.length <= maxLength) {
      onChange(e);
    }
  };

  return (
    <div
      data-slot="control"
      className="relative isolate block w-full my-0 mb-0 text-left"
    >
      <div
        data-slot="buttons"
        className="z-1 right-2 top-1/2 absolute flex flex-row items-center justify-center pl-2 space-x-1 transform -translate-y-1/2"
      >
        {maxLength && (
          <CharacterCountdown maxLength={maxLength} value={value} />
        )}
        <ButtonClose onClick={handleClear} />
      </div>

      {/* Input field */}
      <Headless.Input
        ref={inputRef}
        {...props}
        value={value}
        onChange={handleChange}
        className={clsx(
          className,
          // Basic layout
          'py-3 w-full mb-0 z-0 px-0 pl-3 pr-24 outline-none',
          // Typography
          'text-left font-medium text-base/6 sm:text-sm/6 text-black placeholder-black/50',
          // Border
          'border-none rounded-lg',
          // Background color
          'bg-white hover:bg-white focus:bg-white',
          // Shadow
          'shadow-inner-hard-1',
          // Focus state
          'focus:placeholder-black/0 focus:outline-none',
          // Disabled state
          'disabled:brightness-75'
        )}
      />
    </div>
  );
}

export function Textarea({
  className,
  maxLength,
  value,
  onChange,
  ...props
}: {
  className?: string;
  maxLength?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
} & Omit<Headless.TextareaProps, 'as' | 'className'>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClear = () => {
    const event = {
      target: { value: '' },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(event);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!maxLength || e.target.value.length <= maxLength) {
      onChange(e);
    }
  };

  return (
    <div className={clsx(className, 'rounded-b-xl rounded-tr-xl p-1')}>
      <div data-slot="control" className="relative">
        {/* Buttons */}
        <div className="z-1 right-2 top-2 absolute flex flex-row items-center justify-center pl-2 space-x-1">
          {maxLength && (
            <CharacterCountdown maxLength={maxLength} value={value} />
          )}
          <ButtonClose
            aria-label="Clear input"
            tabIndex={-1}
            onClick={handleClear}
          />
        </div>

        <Headless.Textarea
          ref={textareaRef}
          {...props}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className="font-medium pl-4 pr-20 py-3 w-full outline-none text-base/6 sm:text-sm/6 text-black bg-white hover:bg-white-hover focus:bg-white border-0 rounded-lg placeholder-black/50 focus:placeholder-black/0 text-left shadow-inner-hard-1 disabled:brightness-75 min-h-[4.5rem] block m-0"
        />
      </div>
    </div>
  );
}

export function ImageInput({
  value,
  onChange,
  invalid,
  ...props
}: {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  invalid?: boolean;
} & Omit<Headless.InputProps, 'as' | 'className' | 'type'>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      onChange({
        target: { value: dataUrl },
      } as React.ChangeEvent<HTMLInputElement>);
      setError('');
    } catch (err) {
      console.error('Failed to read file:', err);
      onChange({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
      setError((err as Error).message || 'Failed to load image');
    }
  }

  return (
    <>
      <div className="flex items-center gap-x-3">
        <div>
          {value ? (
            <div className="relative size-32">
              <img
                fill="true"
                alt="game thumbnail"
                src={value}
                className="rounded-lg object-cover"
              />
              <ButtonClose
                aria-label="Clear image"
                tabIndex={-1}
                className="absolute -top-2 -right-2 bg-zinc-950/80 dark:bg-zinc-100/90"
                onClick={clearImage}
              />
            </div>
          ) : (
            <PhotoIcon
              aria-hidden="true"
              className="text-zinc-300 dark:text-zinc-500 size-32"
            />
          )}
        </div>
        <div>
          <input
            ref={fileInputRef}
            {...props}
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            className="sr-only"
            onChange={handleFileChange}
            aria-describedby="game-image-error"
          />
          <Button
            outline
            type="button"
            className="text-sm/6 sm:text-xs/6"
            onClick={() => fileInputRef.current?.click()}
          >
            {value ? 'Change image' : 'Upload image'}
          </Button>

          <Text className="mt-2 text-xs/5 sm:text-xs/5">
            JPG, JPEG or PNG. Max size 2MB.
          </Text>
        </div>
      </div>
      {(invalid || error) && (
        <ErrorMessage id="game-image-error">
          Failed to upload image
        </ErrorMessage>
      )}
    </>
  );
}

/***************************************************************
                     Helper Components
***************************************************************/

function CharacterCountdown({
  maxLength,
  value,
}: {
  maxLength: number;
  value: string;
}) {
  return (
    <div className="bg-black/20 min-w-[2rem] h-6 flex flex-col justify-center items-center rounded-full pr-3 pl-3">
      <div
        className={clsx(
          'whitespace-nowrap text-xs font-black leading-none select-none',
          maxLength - value.length <= 0 ? 'text-red-500' : 'text-black/50'
        )}
      >
        {maxLength - value.length}
      </div>
    </div>
  );
}

function ErrorIcon({ className, ...props }: { className?: string }) {
  return (
    <div
      data-slot="error"
      {...props}
      className={clsx(
        className,
        'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-1 flex flex-col items-center justify-center bg-error size-5 rounded-full text-sm font-black text-white font-sans pointer-events-none'
      )}
    >
      <span>!</span>
    </div>
  );
}
