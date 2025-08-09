'use client';

import { InputGroup } from '@/components/ui//input';
import { HeadingOutlined } from '@/components/ui/heading';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { splitString } from '@/lib/utils';
import clsx from 'clsx';

export function CopyToClipboardInput({
  value,
  copied,
  onCopy,
  className,
}: {
  value: string;
  copied: boolean;
  onCopy: () => void;
  className?: string;
} & React.HTMLAttributes<HTMLInputElement>) {
  return (
    <InputGroup className="relative">
      <span
        data-slot="control"
        className={clsx([
          'relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
          'border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20',
          'bg-transparent dark:bg-white/5',
        ])}
      >
        <HeadingOutlined className={clsx(className, 'text-4xl text-left')}>
          <div className="flex flex-row items-center justify-center flex-1 gap-2">
            {splitString(value).map((part, index) => (
              <div key={index}>{part}</div>
            ))}
          </div>
        </HeadingOutlined>
      </span>

      <Tooltip>
        <TooltipContent>
          {copied ? 'Copied!' : 'Copy link to share'}
        </TooltipContent>
        <TooltipTrigger>
          <button
            onClick={onCopy}
            className={clsx(
              // Base
              'inline-flex items-center justify-center rounded-lg p-2',
              // Positioning
              'absolute end-2 top-1/2 -translate-y-1/2',
              // Cursor
              'cursor-pointer touch-manipulation pointer-events-auto',
              // Icon color
              'text-zinc-950 dark:text-zinc-200',
              // Background color
              'hover:bg-zinc-950/[2.5%] dark:hover:bg-white/10'
            )}
          >
            {copied ? (
              <svg
                className="size-3.5 text-success"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 12"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 5.917 5.724 10.5 15 1.5"
                />
              </svg>
            ) : (
              <svg
                className="size-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 20"
              >
                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
              </svg>
            )}
          </button>
        </TooltipTrigger>
      </Tooltip>
    </InputGroup>
  );
}
