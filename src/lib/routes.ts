export const routes = {
  home: '/',
  signin: '/auth/signin',
  signup: '/auth/signup',
  profile: '/user/profile',
  settings: '/user/settings',
  dashboard: '/user/dashboard',
  games: '/user/games',
  game: {
    view: (id: string) => `/user/games/${id}`,
    edit: (id: string) => `/user/games/${id}/edit`,
    question: {
      edit: (gameId: string, questionId: string) => `/user/games/${gameId}/edit?questionId=${questionId}`,
    },
  },
  session: {
    join: (pin: string) => `/join/${pin}`,
    play: (sessionId: string) => `/play/${sessionId}`,
    results: (sessionId: string) => `/results/${sessionId}`,
  }
};

export const publicRoutes = {
  home: '/',
  signin: '/auth/signin',
  signup: '/auth/signup',
}

export const adminRoutes = {
  dashboard: '/user/dashboard',
  games: '/user/games',
  game: {
    view: (id: string) => `/user/games/${id}`,
    edit: (id: string) => `/user/games/${id}/edit`,
    question: {
      edit: (gameId: string, questionId: string) => `/user/games/${gameId}/edit?questionId=${questionId}`,
    },
  },
  session: {
    play: (sessionId: string) => `/play/${sessionId}`,
    results: (sessionId: string) => `/results/${sessionId}`,
  }
}