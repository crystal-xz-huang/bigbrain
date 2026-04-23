'use client';

import { TouchTarget } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { NavbarItem } from '@/components/ui/navbar';
import { CloseMenuIcon, OpenMenuIcon } from '@/components/ui/sidebar-layout';
import Tooltip from '@/components/ui/tooltip';
import { useSidebar } from '@/hooks/sidebar';
import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import { LayoutGroup, motion } from 'framer-motion';
import React, { forwardRef, useId } from 'react';
import { CloseSidebarIcon, OpenSidebarIcon } from '@/components/ui/icon';

/***************************************************************
                     Layout Components
***************************************************************/

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Headless.Dialog open={open} onClose={close} className="lg:hidden">
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <Headless.DialogPanel
        transition
        className="fixed inset-y-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-closed:-translate-x-full"
      >
        <div className="flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
          <div className="-mb-3 px-4 pt-3">
            <Headless.CloseButton as={NavbarItem} aria-label="Close navigation">
              <CloseMenuIcon />
            </Headless.CloseButton>
          </div>
          {children}
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  );
}

function DesktopSidebar({ children }: { children?: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const sidebarVariants = {
    open: {
      width: 256,
      transition: { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 1.0 },
    },
    collapsed: {
      width: 64,
      transition: { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 1.0 },
    },
  } as const;

  return (
    <motion.aside
      layoutRoot
      className={clsx('fixed inset-y-0 left-0 max-lg:hidden')}
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'open'}
    >
      {children}
    </motion.aside>
  );
}

export function SidebarLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const { isOpen: showSidebar, isCollapsed, open, close } = useSidebar();

  return (
    <div className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Sidebar on desktop */}
      <DesktopSidebar>{sidebar}</DesktopSidebar>

      {/* Sidebar on mobile */}
      <MobileSidebar open={showSidebar} close={close}>
        {sidebar}
      </MobileSidebar>

      {/* Navbar on mobile (only shown when screen < lg) */}
      <header className="flex items-center px-4 lg:hidden">
        <div className="py-2.5">
          <NavbarItem onClick={open} aria-label="Open navigation">
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      {/* Content */}
      <main
        className={clsx(
          'flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2',
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}

/***************************************************************
                     Sidebar Components
***************************************************************/

export function Sidebar({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <nav {...props} className={clsx(className, 'flex h-full min-h-0 flex-col')}>
      {children}
    </nav>
  );
}

export function SidebarHeader({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();
  const variants = {
    open: { flexDirection: 'row' },
    collapsed: { flexDirection: 'column' },
  };

  return (
    <motion.div
      {...props}
      animate={isCollapsed ? 'collapsed' : 'open'}
      variants={variants}
      transition={{ duration: 0.1 }}
      className={clsx(
        className,
        'flex items-center justify-between border-b border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
      )}
    >
      {children}
    </motion.div>
  );
}

export function SidebarBody({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();
  const variants = {
    open: { alignItems: 'stretch', height: 'auto' },
    collapsed: { alignItems: 'center', height: '100%' },
  };

  return (
    <motion.div
      {...props}
      layout="position"
      animate={isCollapsed ? 'collapsed' : 'open'}
      variants={variants}
      className={clsx(
        className,
        'flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8'
      )}
    >
      {children}
    </motion.div>
  );
}

export function SidebarFooter({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();
  return (
    <motion.div
      {...props}
      layout="position"
      animate={isCollapsed ? 'collapsed' : 'open'}
      variants={{
        open: { alignItems: 'stretch' },
        collapsed: { alignItems: 'center' },
      }}
      style={{ willChange: 'alignItems' }}
      className={clsx(
        className,
        'flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
      )}
    >
      {children}
    </motion.div>
  );
}

export function SidebarSection({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const id = useId();

  return (
    <LayoutGroup id={id}>
      <motion.div
        {...props}
        layout
        data-slot="section"
        className={clsx(className, 'flex flex-col gap-0.5')}
      >
        {children}
      </motion.div>
    </LayoutGroup>
  );
}

export function SidebarDivider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'hr'>) {
  return (
    <hr
      {...props}
      className={clsx(
        className,
        'my-4 border-t border-zinc-950/5 lg:-mx-4 dark:border-white/5 min-w-16'
      )}
    />
  );
}

export function SidebarSpacer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={clsx(className, 'mt-8 flex-1')}
    />
  );
}

export function SidebarHeading({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();
  return (
    <motion.h3
      {...props}
      animate={isCollapsed ? 'collapsed' : 'open'}
      variants={{
        open: { opacity: 1, transition: { duration: 0.3 } },
        collapsed: {
          opacity: 0,
          width: 0,
          height: 0,
          transition: { duration: 0 },
        },
      }}
      className={clsx(
        className,
        'mb-1 px-2 text-xs/6 font-medium text-zinc-500 dark:text-zinc-400'
      )}
    >
      {children}
    </motion.h3>
  );
}

/***************************************************************
                     Sidebar Item with Tooltip
***************************************************************/

export function SidebarItemWrapper({
  tooltip, // the tooltip
  children, // the sidebar item
}: {
  tooltip: string;
  children?: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();
  // If not collapsed, just return the children with the label next to it
  if (!isCollapsed) return children;

  return (
    <Tooltip content={tooltip} sideOffset={8} side="right" align="center">
      {children}
    </Tooltip>
  );
}

export const SidebarItem = forwardRef(function SidebarItem(
  {
    current,
    className,
    children,
    ...props
  }: { current?: boolean; className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, 'as' | 'className'>
    | Omit<Headless.ButtonProps<typeof Link>, 'as' | 'className'>
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  const { isCollapsed } = useSidebar();

  const classes = clsx(
    // Base
    'flex w-full items-center rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5',
    // Leading icon/icon-only
    '*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500 sm:*:data-[slot=icon]:size-5',
    // Trailing icon (down chevron or similar)
    isCollapsed
      ? 'gap-0'
      : '*:last:data-[slot=icon]:ml-auto *:last:data-[slot=icon]:size-5 sm:*:last:data-[slot=icon]:size-4 gap-3',
    // Avatar
    '*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 sm:*:data-[slot=avatar]:size-6',
    // Hover
    'data-hover:bg-zinc-950/5 data-hover:*:data-[slot=icon]:fill-zinc-950',
    // Active
    'data-active:bg-zinc-950/5 data-active:*:data-[slot=icon]:fill-zinc-950',
    // Current
    'data-current:*:data-[slot=icon]:fill-primary! data-current:bg-primary/10! data-current:text-primary!',
    // Dark mode
    'dark:text-white dark:*:data-[slot=icon]:fill-zinc-400',
    'dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-white',
    'dark:data-active:bg-white/5 dark:data-active:*:data-[slot=icon]:fill-white',
    'dark:data-current:*:data-[slot=icon]:fill-white'
  );

  return (
    <motion.span className={clsx(className, 'relative')} layout="position">
      {current && (
        <motion.span
          layoutId="current-indicator"
          className={clsx(
            'absolute inset-y-2 w-0.5 rounded-full bg-zinc-950 dark:bg-white',
            isCollapsed ? '-left-3.5' : '-left-4'
          )}
        />
      )}
      {'href' in props ? (
        <Headless.CloseButton
          as={Link}
          {...props}
          className={classes}
          data-current={current ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.CloseButton>
      ) : (
        <Headless.Button
          {...props}
          className={clsx('cursor-pointer', classes)}
          data-current={current ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </motion.span>
  );
});

export function SidebarLabel({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) return null;
  return (
    <motion.span
      {...props}
      animate={isCollapsed ? 'collapsed' : 'open'}
      variants={{
        open: { opacity: 1, width: 'auto', transition: { duration: 0.3 } },
        collapsed: { opacity: 0, width: 0, transition: { duration: 0 } },
      }}
      className={clsx(className, 'truncate overflow-hidden')}
    >
      {children}
    </motion.span>
  );
}

/***************************************************************
                      Sidebar Toggle Button
***************************************************************/

export function ToggleSidebarButton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'button'>) {
  const { isCollapsed, toggleCollapse } = useSidebar();
  return (
    <Tooltip
      content={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
      sideOffset={8}
      side="right"
      align="center"
    >
      <Headless.Button
        {...props}
        className={clsx(
          className,
          'flex items-center justify-center sidebar-icon h-9 w-9 max-lg:hidden',
          isCollapsed ? 'cursor-e-resize' : 'cursor-w-resize'
        )}
        aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <OpenSidebarIcon />
        ) : (
          <CloseSidebarIcon />
        )}
      </Headless.Button>
    </Tooltip>
  );
}
