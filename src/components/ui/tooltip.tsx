"use client"

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'

const TooltipContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
} | null>(null)

function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLElement>(null)

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerRef }}>
      <span className="relative">{children}</span>
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({
  children,
  ...props
}: React.ComponentProps<"span">) {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error('TooltipTrigger must be used within a Tooltip')
  }

  return (
    <span
      ref={context.triggerRef}
      tabIndex={0}
      onMouseEnter={() => context.setOpen(true)}
      onMouseLeave={() => context.setOpen(false)}
      onFocus={() => context.setOpen(true)}
      onBlur={() => context.setOpen(false)}
      className={clsx(
        "cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "data-[open]:bg-primary/10 data-[open]:text-primary-foreground",
        "transition-colors duration-200 ease-in-out"
      )}
      {...props}
    >
      {children}
    </span>
  )
}

const styles = {
  base: [
    // Base
    'absolute transition duration-300 ease-in-out data-closed:opacity-0 pointer-events-none',
    // Sizing
    'w-max rounded-md px-3 py-1.5 text-xs',
    // Background and text color
    "shadow-lg",
  ],
  colors : {
    primary: [
      'bg-black text-white dark:bg-white dark:text-black',
    ],
    secondary: [
      'bg-secondary text-secondary-content',
    ],
    accent: [
      'bg-accent text-accent-content',
    ],
    neutral: [
      'bg-neutral text-neutral-content',
    ],
    info: [
      'bg-info text-info-content',
    ],
    success: [
      'bg-success text-success-content',
    ],
    warning: [
      'bg-warning text-warning-content',
    ],
    error: [
      'bg-error text-error-content',
    ],
  },
  positions: {
    top: [
      'left-1/2 bottom-full mb-2 -translate-x-1/2',
    ],
    bottom: [
      'left-1/2 top-full mt-2 -translate-x-1/2',
    ],
    left: [
      'right-full top-1/2 mr-2 -translate-y-1/2',
    ],
    right: [
      'left-full top-1/2 ml-2 -translate-y-1/2',
    ],
  },
  arrows: {
    top: [
      'absolute left-1/2 top-full -translate-x-1/2 -mt-1 w-2 h-2 rotate-45',
    ],
    bottom: [
      'absolute left-1/2 bottom-full -translate-x-1/2 -mb-1 w-2 h-2 rotate-45',
    ],
    left: [
      'absolute left-full top-1/2 -translate-y-1/2 -ml-1 w-2 h-2 rotate-45',
    ],
    right: [
      'absolute right-full top-1/2 -translate-y-1/2 -mr-1 w-2 h-2 rotate-45',
    ],
  }
}

function TooltipContent({
  className,
  children,
  color = 'primary',
  position = 'top',
  ...props
}: React.ComponentProps<"div"> & {
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
  position?: "top" | "bottom" | "left" | "right"
}) {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error('TooltipContent must be used within a Tooltip')
  }

  return (
    <Headless.Transition show={context.open}>
      <div
        id="tooltip-content"
        role="tooltip"
        className={clsx(
          className,
          styles.base,
          styles.colors[color],
          styles.positions[position],
        )}
        {...props}
      >
        {children}
        <span className={clsx(styles.arrows[position], styles.colors[color])} />
      </div>
    </Headless.Transition>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
