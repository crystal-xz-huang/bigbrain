'use client';

import type { ToastContextType } from '@/lib/types';
import { createContext } from 'react';

const ToastContext = createContext<ToastContextType | null>(null);

export default ToastContext;
