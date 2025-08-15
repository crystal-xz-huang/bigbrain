'use client';

import { routes } from '@/lib/routes';
import type { NavButton, NavLink } from '@/lib/types';
import {
  HomeIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import CreateGameTrigger from '@/components/ui/games/triggers/create-game';

export const navigationLinks: NavLink[] = [
  { icon: HomeIcon, label: 'Home', href: routes.dashboard },
  { icon: InboxIcon, label: 'Games', href: routes.games, },
  { icon: QuestionMarkCircleIcon, label: 'Support', href: '#'},
  { icon: SparklesIcon, label: 'Changelog', href: '#' },
]

export const navigationButtons: NavButton[] = [
  { icon: PlusIcon, label: 'New game', trigger: CreateGameTrigger },
];
