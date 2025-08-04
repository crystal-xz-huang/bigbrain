'use client'

import SidebarContext from './context';
import React from 'react';

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, isCollapsed, open, close, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarProvider;
