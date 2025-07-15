'use client';

import {
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';

import { routes } from '@/lib/routes';
import { NavLink } from '@/lib/types';

// Map of links to display in the side navigation.
export const mainNavigation: NavLink[] = [
  { label: 'Home', url: routes.dashboard, icon: HomeIcon },
];

export const secondaryNavigation: NavLink[] = [
  { label: 'Support', url: '/support', icon: QuestionMarkCircleIcon },
  { label: 'Changelog', url: '/changelog', icon: SparklesIcon },
];

export const actions: NavLink[] = [];
