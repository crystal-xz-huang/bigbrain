'use client';

import SidebarContext from './context';
import React from 'react';

const KEY = 'sidebar:collapsed';
const XL_BREAKPOINT = 1280; // Tailwind's xl breakpoint in px

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ----- User preference for collapsed state (persisted) -----
  // This is the *initial* collapsed state the user chose
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  });

  // Persist preference when it changes
  React.useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(KEY, isCollapsed ? '1' : '0'); } catch {}
  }, [isCollapsed, mounted]);

  // ----- Breakpoint override (autocollapse sidebar below xl) -----
  React.useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia(`(max-width: ${XL_BREAKPOINT - 1}px)`);
    const onChange = () => {
      if (mq.matches) { // Below breakpoint
        setIsCollapsed(true);
      } else {
        setIsCollapsed(localStorage.getItem(KEY) === '1');
      }
    };
    mq.addEventListener('change', onChange);
    onChange();
    return () => mq.removeEventListener('change', onChange);
  }, [mounted]);

  // ----- If mobile sidebar is opened, ensure it's expanded -----
  React.useEffect(() => {
    if (!mounted) return;
    if (isOpen) setIsCollapsed(false);
  }, [isOpen, mounted]);

  // ----- Actions -----
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const collapse = () => setIsCollapsed(true);
  const expand = () => setIsCollapsed(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isCollapsed: isCollapsed,
        open,
        close,
        collapse,
        expand,
        toggleCollapse,
      }}
    >
      {mounted ? children : null}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
