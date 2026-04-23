import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/fieldset';
import { fileToDataUrl } from '@/lib/utils';
import * as Headless from '@headlessui/react';
import { PhotoIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import MediaUploadImage from '@public/icons/media-upload.svg';
import Image from 'next/image';

export function Fieldset({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldsetProps, 'as' | 'className'>) {
  return (
    <Headless.Fieldset
      {...props}
      className={clsx(className, 'h-full w-full min-w-0')}
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
      className={clsx(className, 'sr-only')}
      {...props}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(className, 'space-y-4 gap-y-0 flex flex-col w-full')}
    />
  );
}

export function FieldsetContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'lg:flex-row lg:justify-center lg:items-stretch lg:gap-4 flex flex-col items-center gap-3'
      )}
    />
  );
}

export function FieldsetAction({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={clsx(className, 'gap-4 flex w-full')} />;
}

/***************************************************************
            Field, Label, Input, Textarea Components
***************************************************************/

const styles = {
  base: [
    'flex-shrink w-full',
    '**:data-[slot=error]:invisible has-data-invalid:**:data-[slot=error]:visible',
    'has-user-valid:**:data-[slot=error]:invisible has-user-invalid:**:data-[slot=error]:visible',
  ],
  colors: {
    gold: [
      '**:data-[slot=label]:bg-[#FFCD75]',
      '**:data-[slot=control]:bg-[#FFCD75]',
    ],
    blue: [
      '**:data-[slot=label]:bg-[#47698f]',
      '**:data-[slot=control]:bg-[#47698f]',
    ],
    cyan: [
      '**:data-[slot=label]:bg-cyan-500',
      '**:data-[slot=control]:bg-cyan-500',
    ],
    green: [
      '**:data-[slot=label]:bg-[#00a76d]',
      '**:data-[slot=control]:bg-[#00a76d]',
    ],
    red: [
      '**:data-[slot=label]:bg-[#d5456c]',
      '**:data-[slot=control]:bg-[#d5456c]',
    ],
    teal: [
      '**:data-[slot=label]:bg-teal-700',
      '**:data-[slot=control]:bg-teal-700',
    ],
    charcoal: [
      '**:data-[slot=label]:bg-gray-700',
      '**:data-[slot=control]:bg-gray-700',
    ],
  },
};

type FieldColor = keyof typeof styles.colors;

export function Field({
  color,
  className,
  ...props
}: {
  color: FieldColor;
  className?: string;
} & Omit<Headless.FieldProps, 'as' | 'className'>) {
  return (
    <Headless.Field
      {...props}
      className={clsx(styles.base, styles.colors[color], className)}
    />
  );
}

export function Label({
  children,
  ...props
}: { children?: React.ReactNode } & Omit<
  Headless.LabelProps,
  'as' | 'className'
>) {
  return (
    <div className="flex flex-row justify-start w-full text-sm font-bold text-white transform translate-y-[1px] h-[31px]">
      <Headless.Label
        data-slot="label"
        {...props}
        className="select-none relative rounded-t-md inline-block px-3 py-2 leading-none"
      >
        {children}
        <div
          data-slot="error"
          className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-1 flex flex-col items-center justify-center bg-error size-5 text-sm leading-none font-black font-sans rounded-full text-white"
          title="Required field"
        >
          !
        </div>
      </Headless.Label>
      <Headless.Description
        data-slot="error"
        className="ml-auto text-glow-red-800 text-sm/8 font-normal"
      >
        This field is required
      </Headless.Description>
    </div>
  );
}

export function InputGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="control"
      className={clsx(
        'w-full rounded-b-xl rounded-tr-xl p-1.25 flex flex-col gap-1',
        className
      )}
      {...props}
    />
  );
}

export function Input({
  value,
  onChange,
  className,
  maxLength,
  ...props
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  maxLength?: number;
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
    <span
      data-slot="control"
      className={clsx(className, 'relative w-full mb-0')}
    >
      {/* Input */}
      <Headless.Input
        ref={inputRef}
        {...props}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        className={clsx(
          'peer transition font-medium py-3 w-full bg-white text-base text-black placeholder-black/50 focus:placeholder-black/0 text-left shadow-inner-hard-1 mb-0 z-0 px-0 pl-3 pr-3 border-none rounded-lg',
          'hover:bg-glow-neutral-300 dark:hover:bg-glow-neutral-1100 focus:outline-none focus:bg-white disabled:brightness-75 disabled:pointer-events-none max-lg:pr-20'
        )}
      />
      {/* Input Suffix */}
      <div className="z-1 right-2 top-1/2 absolute hidden flex-row items-center justify-center pl-2 space-x-1 transform -translate-y-1/2 peer-focus-within:flex">
        {maxLength && <CharacterCount value={value} maxLength={maxLength} />}
        <ClearInputButton onClick={handleClear} />
      </div>
    </span>
  );
}

export function Textarea({
  value,
  onChange,
  className,
  maxLength,
  ...props
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  maxLength?: number;
} & Omit<Headless.TextareaProps, 'as' | 'className'>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (!maxLength || e.target.value.length <= maxLength) {
      onChange(e);
    }
  };

  const handleClear = () => {
    const event = {
      target: { value: '' },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(event);
  };

  return (
    <span data-slot="control" className="relative w-full mb-0">
      <Headless.Textarea
        ref={ref}
        {...props}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        className={clsx(
          className,
          'peer transition font-medium w-full bg-white text-base text-black placeholder-black/50 focus:placeholder-black/0 text-left shadow-inner-hard-1 mb-0 z-0 py-3 px-0 pl-3 border-none rounded-lg min-h-[4.5rem] block m-0',
          'hover:bg-glow-neutral-300 dark:hover:bg-glow-neutral-1100 focus:outline-none focus:bg-white disabled:brightness-75 disabled:pointer-events-none pr-20 lg:pr-21'
        )}
      />
      <div className="z-1 right-2 top-2 absolute flex-row items-center justify-center pl-2 space-x-1 hidden peer-focus-within:flex">
        {maxLength && <CharacterCount value={value} maxLength={maxLength} />}
        <ClearInputButton onClick={handleClear} />
      </div>
    </span>
  );
}

const CharacterCount = ({
  value,
  maxLength,
}: {
  value: string;
  maxLength: number;
}) => {
  return (
    <div
      data-slot="count"
      className="bg-black/20 min-w-[2rem] h-6 flex flex-col justify-center items-center rounded-full pr-3 pl-3"
    >
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
};

const ClearInputButton = ({
  className,
  ...props
}: { className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      data-slot="clear"
      type="button"
      aria-label="Clear input"
      className={clsx(
        className,
        'bg-black/20 min-w-[1.5rem] h-6 flex flex-col justify-center items-center rounded-full pr-0 pl-0 cursor-pointer'
      )}
      tabIndex={-1}
      onPointerDown={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        className="size-4 text-black/50"
      >
        <path
          fill="currentColor"
          d="m16.4 20-9.09-9.08a2.65 2.65 0 0 1 0-3.58 2.63 2.63 0 0 1 3.58 0L20 16.4l9.07-9.08a2.542 2.542 0 0 1 3.59 3.6L23.6 20l9.07 9.08a2.54 2.54 0 0 1-3.59 3.59L20 23.6l-9.09 9.09a2.553 2.553 0 0 1-3.61-3.61z"
        />
      </svg>
    </button>
  );
};

export function FileInput({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<Headless.InputProps, 'as' | 'className' | 'type'>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
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
      setFile(file);
      setError('');
    } catch (err) {
      onChange({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
      setError((err as Error).message || 'Failed to upload image');
    }
  }

  return (
    <Headless.Field
      className={clsx(
        className,
        'relative flex flex-col items-center gap-4 justify-between h-full w-full lg:justify-center'
      )}
    >
      {/* Preview Image */}
      {value && (
        <div className="relative w-full">
          <div className="aspect-square relative flex flex-col items-start w-full h-full overflow-hidden">
            <picture className="rounded-lg absolute inset-0 overflow-hidden bg-beige-300">
              <img
                src={value}
                alt="Current game thumbnail"
                className="object-cover w-full h-full"
              />
            </picture>
            <div />
          </div>
          <ClearInputButton
            aria-label="Clear image"
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-glow-neutral-500 dark:bg-glow-neutral-900 hover:brightness-90"
          />
        </div>
      )}

      {/* File Input */}
      <div className="flex flex-row items-center w-full h-full gap-4 lg:flex-col lg:justify-around">
        {!value && (
          <Image
            src={MediaUploadImage}
            alt=""
            className="h-32 block w-auto lg:h-auto lg:w-full"
          />
        )}
        <div
          data-slot="control"
          className="flex flex-col gap-4 h-full items-start lg:items-center lg:w-full **:data-[slot=error]:hidden has-data-invalid:**:data-[slot=error]:block **:data-[slot=description]:block has-data-invalid:**:data-[slot=description]:hidden"
        >
          <label data-slot="label" className="block w-full">
            <span className="sr-only">Choose game image</span>
            <input
              data-slot="control"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/jpg, image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="block w-full rounded-full text-sm font-bold text-white bg-purple hover:bg-purple-400 py-2 px-4 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {value ? 'Change image' : 'Upload image'}
            </button>
          </label>
          <Headless.Description
            data-slot="description"
            className="text-zinc-500 dark:text-zinc-400 text-xs/4"
          >
            JPG, JPEG or PNG. Max size 2MB.
          </Headless.Description>
          <Headless.Description
            data-slot="error"
            className="text-glow-red-800 text-sm font-normal"
          >
            {error}
          </Headless.Description>
        </div>
      </div>
    </Headless.Field>
  );
}

export function ImageInput({
  value,
  onChange,
  invalid,
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
      <div data-slot="control" className="flex items-center gap-x-3">
        {/* Preview Image */}
        {value ? (
          <div className="relative size-32">
            <picture className="size-full">
              <img
                src={value}
                alt="game thumbnail"
                className="rounded-lg object-cover"
              />
            </picture>
            {/* <ButtonClose
              type="button"
              aria-label="Clear image"
              className="absolute -top-2 -right-2 bg-zinc-950/80 dark:bg-zinc-100/90"
              tabIndex={-1}
              onClick={clearImage}
            /> */}
          </div>
        ) : (
          <PhotoIcon
            aria-hidden="true"
            className="text-zinc-300 dark:text-zinc-500 size-32"
          />
        )}

        {/* Upload Button */}
        <span data-slot="control">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            className="sr-only"
            onChange={handleFileChange}
          />
          <Button
            outline
            type="button"
            className="text-sm/6 sm:text-xs/6"
            onClick={() => fileInputRef.current?.click()}
          >
            {value ? 'Change image' : 'Upload image'}
          </Button>
        </span>

        {/* Description */}
        <Headless.Description
          data-slot="description"
          className="text-zinc-500 dark:text-zinc-400 text-xs/6"
        >
          JPG, JPEG or PNG. Max size 2MB.
        </Headless.Description>
      </div>

      {(invalid || error) && (
        <ErrorMessage>Failed to upload image</ErrorMessage>
      )}
    </>
  );
}
