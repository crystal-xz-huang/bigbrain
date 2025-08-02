'use client';

import { routes } from '@/lib/routes';
import type { NavLink } from '@/lib/types';
import {
  HomeIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';

// Map of links to display in the side navigation.
export const mainNavigation: NavLink[] = [
  { label: 'Home', url: routes.dashboard, icon: HomeIcon },
  { label: 'Games', url: routes.games, icon: InboxIcon },
];

export const secondaryNavigation: NavLink[] = [
  { label: 'Support', url: '/support', icon: QuestionMarkCircleIcon },
  { label: 'Changelog', url: '/changelog', icon: SparklesIcon },
];

export const actions: NavLink[] = [];
