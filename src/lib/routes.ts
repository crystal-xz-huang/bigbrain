export const routes = {
  home: '/',
  signin: '/auth/signin',
  signup: '/auth/signup',
  dashboard: '/admin/dashboard',
  games: '/admin/dashboard/games',
  reports: '/admin/dashboard/reports',
  settings: '/admin/settings',
  profile: '/admin/profile',
  game: (id: string) => `/admin/game/${id}`,
};
