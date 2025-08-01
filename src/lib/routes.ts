export const routes = {
  home: '/',
  signin: '/auth/signin',
  signup: '/auth/signup',
  dashboard: '/admin/dashboard',
  games: '/admin/games',
  game: {
    view: (id: string) => `/admin/games/${id}`,
    edit: (id: string) => `/admin/games/${id}/edit`,
    question: {
      edit: (gameId: string, questionId: string) => `/admin/games/${gameId}/questions/${questionId}/edit`,
      create: (gameId: string) => `/admin/games/${gameId}/questions/create`,
    },
  },
  reports: '/admin/reports',
  settings: '/admin/settings',
  profile: '/admin/profile',
};
