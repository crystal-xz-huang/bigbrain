'use client';

import { createContext } from 'react';

type SidebarContext = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContext | null>(null);

export default SidebarContext;
