export const routes = {
  home: '/',
  signin: '/auth/signin',
  signup: '/auth/signup',
  dashboard: '/admin/dashboard',
  settings: '/admin/settings',
  profile: (id: string) => `/admin/profile/${id}`,
};
