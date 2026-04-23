import { CategoryNameEnum } from '@/lib/definitions/constants';
import type {
  CategoryNameStrings,
  GameSeedTemplate,
  UserSeedTemplate,
} from '@/lib/definitions/types';
import { Role } from '@prisma/client';

/***************************************************************
                     Users
***************************************************************/

export const admins: UserSeedTemplate[] = [
  {
    username: 'alice',
    name: 'Alice',
    email: 'alice@example.com',
    password: 'password123',
    role: Role.ADMIN,
  },
  {
    username: 'bob',
    name: 'Bob',
    email: 'bob@example.com',
    password: 'password123',
    role: Role.ADMIN,
  },
  {
    username: 'charlie',
    name: 'Charlie',
    email: 'charlie@example.com',
    password: 'password123',
    role: Role.ADMIN,
  },
  {
    username: 'dave',
    name: 'Dave',
    email: 'dave@example.com',
    password: 'password123',
    role: Role.ADMIN,
  },
];

/***************************************************************
                     Categories
***************************************************************/

export const categories: Array<{ name: string }> = Object.values(CategoryNameEnum).map((name) => ({ name }));

/***************************************************************
                     Games
***************************************************************/

import {
  EntertainmentGames,
  GeographyGames,
  HistoryGames,
  LanguagesGames,
  SportsGames,
  STEMGames,
} from './games';

export const games: GameSeedTemplate[] = [
  ...EntertainmentGames,
  ...GeographyGames,
  ...HistoryGames,
  ...LanguagesGames,
  ...SportsGames,
  ...STEMGames,
];

// Map GameSeedTemplate definitions to categories
export const gamesByCategoryMap: Record<CategoryNameStrings, GameSeedTemplate[]> = {
  [CategoryNameEnum.ENTERTAINMENT]: EntertainmentGames,
  [CategoryNameEnum.GEOGRAPHY]: GeographyGames,
  [CategoryNameEnum.HISTORY]: HistoryGames,
  [CategoryNameEnum.LANGUAGES]: LanguagesGames,
  [CategoryNameEnum.SPORTS]: SportsGames,
  [CategoryNameEnum.STEM]: STEMGames,
  [CategoryNameEnum.TRIVIA]: [],
} as const;
