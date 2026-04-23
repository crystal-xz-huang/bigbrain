import { CategoryNameEnum } from '@/lib/definitions/constants';
import type { NavLink } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import EntertainmentIcon from '@public/icons/navigation/entertainment.svg';
import GeographyIcon from '@public/icons/navigation/geography.svg';
import HistoryIcon from '@public/icons/navigation/history.svg';
import HomeIcon from '@public/icons/navigation/home.svg';
import LanguagesIcon from '@public/icons/navigation/languages.svg';
import SportsIcon from '@public/icons/navigation/sports.svg';
import STEMIcon from '@public/icons/navigation/stem.svg';
import TriviaIcon from '@public/icons/navigation/trivia.svg';

export const publicNavLinks: NavLink[] = [
  {
    label: 'Home',
    href: '/',
    image: HomeIcon,
  },
  {
    label: 'Entertainment',
    href: routes.browse(CategoryNameEnum.ENTERTAINMENT),
    image: EntertainmentIcon,
  },
  {
    label: CategoryNameEnum.GEOGRAPHY,
    href: routes.browse(CategoryNameEnum.GEOGRAPHY),
    image: GeographyIcon,
  },
  {
    label: CategoryNameEnum.HISTORY,
    href: routes.browse(CategoryNameEnum.HISTORY),
    image: HistoryIcon,
  },
  {
    label: CategoryNameEnum.LANGUAGES,
    href: routes.browse(CategoryNameEnum.LANGUAGES),
    image: LanguagesIcon,
  },
  {
    label: CategoryNameEnum.STEM,
    href: routes.browse(CategoryNameEnum.STEM),
    image: STEMIcon,
  },
  {
    label: CategoryNameEnum.SPORTS,
    href: routes.browse(CategoryNameEnum.SPORTS),
    image: SportsIcon,
  },
  {
    label: CategoryNameEnum.TRIVIA,
    href: routes.browse(CategoryNameEnum.TRIVIA),
    image: TriviaIcon,
  },
];

// export const navigation: NavLink[] = [
//   {
//     label: 'Home',
//     href: '/',
//     icon: HomeIcon,
//   },
//   {
//     label: CategoryNameEnum.ENTERTAINMENT,
//     href: '#',
//     icon: EntertainmentIcon,
//     description: 'Test your knowledge of movies, music, and pop culture.',
//   },
//   {
//     label: CategoryNameEnum.LANGUAGES,
//     href: '#',
//     icon: LanguagesIcon,
//     description:
//       'Learn and practice new languages, from Arabic to Zulu (yes that is a real language)! Boost your language art skills such as grammar, vocabulary, writing, reading comprehension, and more!',
//   },
//   {
//     label: CategoryNameEnum.STEM,
//     href: '#',
//     icon: STEMIcon,
//     description: 'STEM stands for Science, Technology, Engineering, and Math.',
//   },
//   {
//     label: CategoryNameEnum.TRIVIA,
//     href: '#',
//     icon: TriviaIcon,
//     description:
//       'A mix of fun trivia and general knowledge questions on everything from sports and animals to world landmarks, food, movies, and more!',
//   },
//   {
//     label: 'Love & Relationships',
//     href: '#',
//     icon: undefined,
//     description:
//       "Single as a pringle? Need help with your relationship or love life? We've got all the answers here. You'll thank us later.",
//   },
//   {
//     label: 'Zodiac',
//     href: '#',
//     icon: undefined,
//     description:
//       'All the best Zodiac quizzes in one place. See what your star sign says about you! Yes... astrology is scientically proven and these quizzes are 100% accurate.',
//   },
// ];
