import { CategoryNameEnum } from "@/lib/definitions/constants";
import { CategoryNameStrings } from "@/lib/definitions/types";

export const publicRoutes = {
  home: '/',
  signin: '/auth/signin',
  signup: '/auth/signup',
  signout: '/auth/signout',
  entertainment: '/browse/entertainment',
  geography: '/browse/geography',
  history: '/browse/history',
  languages: '/browse/languages',
  stem: '/browse/stem',
  sports: '/browse/sports',
  trivia: '/browse/trivia',
};

export const protectedRoutes = {
  library: '/user/library',
  settings: '/user/settings',
};

export const routes = {
  home: '/',
  auth: {
    signin: '/auth/signin',
    signup: '/auth/signup',
    signout: '/auth/signout',
  },
  game: {
    create: '/create',
    view: (gameId: string) => `/${gameId}`,
    edit: (gameId: string) => `/${gameId}/edit`,
    delete: (gameId: string) => `/${gameId}/delete`,
    question: (gameId: string, questionId: string) =>
      `/${gameId}/edit?question=${questionId}`,
  },
  user: {
    profile: (username: string) => `/profile/@${username}`,
    library: '/user/library',
    settings: '/user/settings',
  },
  browse: (category: CategoryNameStrings) => {
    switch (category) {
      case CategoryNameEnum.ENTERTAINMENT:
        return '/browse/entertainment';
      case CategoryNameEnum.GEOGRAPHY:
        return '/browse/geography';
      case CategoryNameEnum.HISTORY:
        return '/browse/history';
      case CategoryNameEnum.LANGUAGES:
        return '/browse/languages';
      case CategoryNameEnum.STEM:
        return '/browse/stem';
      case CategoryNameEnum.SPORTS:
        return '/browse/sports';
      case CategoryNameEnum.TRIVIA:
        return '/browse/trivia';
      default:
        // fallback for unknown categories
        return `/browse/${category.toLowerCase()}`;
    }
  }
};
