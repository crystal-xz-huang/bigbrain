'use client';

import { createContext } from 'react';

type SidebarContext = {
  isCollapsed: boolean
  isOpen: boolean
  open: () => void
  close: () => void
  toggleCollapse: () => void
}

const SidebarContext = createContext<SidebarContext | null>(null);

export default SidebarContext;
