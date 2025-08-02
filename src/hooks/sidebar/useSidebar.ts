'use client';

import { useContext } from 'react';
import SidebarContext from './context';

const useSidebar = () => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be inside SidebarProvider')
  return ctx
}

export default useSidebar;