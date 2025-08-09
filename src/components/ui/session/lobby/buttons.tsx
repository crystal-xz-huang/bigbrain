'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/toast';
import * as Headless from '@headlessui/react';
import {
  LinkIcon
} from '@heroicons/react/16/solid';
import clsx from 'clsx';
import React, { useState } from 'react';

export function ButtonLink({
  className,
  icon,
  children,
  tooltip,
  ...props
}: {
  className?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  tooltip?: string;
} & Omit<Headless.ButtonProps, 'as' | 'className'>) {
  const Icon = icon;
  const styles = [
    // color
    'text-zinc-950 dark:text-white text-sm font-bold leading-none font-sans',
    // hover
    'opacity-50 group-hover:opacity-100 transition-opacity',
  ];

  const TouchTarget = (
    <Headless.Button
      {...props}
      className={clsx(
        className,
        'group flex flex-row items-center gap-1 cursor-pointer'
      )}
    >
      <Icon className={clsx(styles, 'icon-sm')} />
      <div
        className={clsx(
          styles,
          'group-hover:underline text-sm font-normal leading-none'
        )}
      >
        {children}
      </div>
    </Headless.Button>
  );

  return tooltip ? (
    <Tooltip>
      <TooltipTrigger>{TouchTarget}</TooltipTrigger>
      <TooltipContent position="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    TouchTarget
  );
}

export function CopyLinkToClipboard({
  href, // The URL to copy
}: {
  href: string;
} & Omit<React.HTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success({ message: 'Copied to clipboard.' });
      })
      .catch((error) => {
        toast.error({
          message: 'Failed to copy link.',
          description: error.message,
        });
      });
  };

  return (
    <ButtonLink
      icon={LinkIcon}
      tooltip="Copy link to clipboard"
      onClick={copyToClipboard}
    >
      {copied ? 'Link copied!' : 'Copy'}
    </ButtonLink>
  );
}
