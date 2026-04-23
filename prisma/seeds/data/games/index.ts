import { GameSeedTemplate } from '@/lib/definitions/types';

export { default as EntertainmentGames } from './entertainment';
export { default as GeographyGames } from './geography';
export { default as HistoryGames } from './history';
export { default as LanguagesGames } from './languages';
export { default as SportsGames } from './sports';

import engineering from './stem/engineering';
import math from './stem/math';
import science from './stem/science';
import technology from './stem/technology';

export const STEMGames: GameSeedTemplate[] = [
  ...engineering,
  ...math,
  ...science,
  ...technology,
];
