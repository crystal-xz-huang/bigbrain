import { getUserOrNull, verifyUser } from '@/lib/data/auth';
import {
  GameViewType,
  ORDER_BY_MOST_RECENT,
  SELECT_GAME_COLUMNS_FOR_EDIT,
  SELECT_GAME_COLUMNS_FOR_FEED,
  SELECT_GAME_COLUMNS_FOR_OWNER,
  SELECT_GAME_COLUMNS_FOR_VIEWER,
  WHERE_PUBLIC,
} from '@/lib/definitions/constants';
import type {
  AdminGamesListItemDTO,
  CategoryGamesListDTO,
  GameEditDTO,
  GamesListDTO,
  GamesListItemRaw,
  GameViewDTO,
  GameViewRaw,
  LibraryListItemDTO,
  LibraryListItemRaw,
  ProtectedGameDTO,
  ProtectedGameRaw,
  ProtectedGameViewDTO,
  PublicGameDTO,
  PublicGameRaw,
  PublicGamesListItemDTO,
  PublicGameViewDTO,
  AdminOwnerGamesListDTO,
  AdminOwnerGamesListItemDTO,
  GamesListItemDTO,
  SortOption,
  OrderOption,
} from '@/lib/definitions/types';
import { prisma } from '@/lib/prisma';
import { generateRandomString } from '@/lib/utils';
import { ViewGameSchema } from '@/lib/zod';
import { Category, GameStatus, GameVisibility } from '@prisma/client';
import { forbidden, notFound } from 'next/navigation';
import { cache } from 'react';
import * as z from 'zod';

/***************************************************************
                     Helper Functions
***************************************************************/

const getActiveSessionId = (
  sessions: { id: string; active: boolean }[]
): string | null => {
  const activeSession = sessions.find((s) => s.active);
  return activeSession ? activeSession.id : null;
};

const sumDuration = (questions: { duration: number }[]) =>
  questions.reduce((total, q) => total + q.duration, 0);

/***************************************************************
                     Mapping Functions
***************************************************************/

export const toPublicGameDTO = (g: PublicGameRaw): PublicGameDTO => ({
  id: g.id,
  name: g.name,
  image: g.image,
  createdAt: g.createdAt.toISOString(),
  categories: g.categories.map((c) => c.name),
  questionCount: g._count.questions,
  duration: sumDuration(g.questions),
  plays: g._count.sessions,
});

const toProtectedGameDTO = (g: ProtectedGameRaw): ProtectedGameDTO => ({
  id: g.id,
  name: g.name,
  image: g.image,
  createdAt: g.createdAt.toISOString(),
  categories: g.categories.map((c) => c.name),
  questionCount: g._count.questions,
  duration: sumDuration(g.questions),
  plays: g._count.sessions,
  // if there is a current user
  active: getActiveSessionId(g.sessions),
  played: g._count.sessions > 0,
});

// ----- Games List Items -----
const toGameListItemDTO = (g: GamesListItemRaw): GamesListItemDTO => ({
  id: g.id,
  name: g.name,
  image: g.image,
  createdAt: g.createdAt.toISOString(),
  questionCount: g._count.questions,
  duration: sumDuration(g.questions),
});

const toAdminGamesListItemDTO = (
  g: GamesListItemRaw
): AdminGamesListItemDTO => ({
  ...toGameListItemDTO(g),
  owner: { username: g.owner.username, image: g.owner.image },
  active: getActiveSessionId(g.sessions),
  played: g._count.sessions > 0,
});

const toPublicGamesListItemDTO = (
  g: GamesListItemRaw
): PublicGamesListItemDTO => ({
  ...toGameListItemDTO(g),
  owner: { username: g.owner.username, image: g.owner.image },
  active: undefined,
  played: undefined,
});

const toAdminOwnerGamesListItemDTO = (
  g: GamesListItemRaw
): AdminOwnerGamesListItemDTO => ({
  ...toGameListItemDTO(g),
  owner: undefined,
  active: getActiveSessionId(g.sessions),
  played: g._count.sessions > 0,
});

// ----- Library List Items -----
const toLibraryListItemDTO = (g: LibraryListItemRaw): LibraryListItemDTO => ({
  ...toProtectedGameDTO(g),
  status: g.status,
  visibility: g.visibility,
});

const toGameViewDTO = (g: GameViewRaw, type: GameViewType): GameViewDTO => {
  const parsed = ViewGameSchema.safeParse(g);
  let error = undefined;
  if (!parsed.success) {
    console.error('Game data is invalid:', z.prettifyError(parsed.error));
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    for (const field in fieldErrors) {
      if (fieldErrors[field]?.length) {
        error = fieldErrors[field][0];
        break;
      }
    }
  }
  return type === GameViewType.PUBLIC
    ? ({
        ...toPublicGameDTO(g),
        owner: { username: g.owner.username, image: g.owner.image },
        type: GameViewType.PUBLIC,
        error: error,
        description: g.description,
        tags: g.tags,
        questions: g.questions.map((q) => ({
          title: q.title,
          image: q.image,
          duration: q.duration,
          points: q.points,
          type: q.type,
          answers: q.answers.map((a) => ({
            title: generateRandomString(a.title.length),
            correct: a.correct,
          })),
        })),
      } satisfies PublicGameViewDTO)
    : ({
        ...toPublicGameDTO(g),
        owner: { username: g.owner.username, image: g.owner.image },
        type: GameViewType.PROTECTED,
        error: error,
        description: g.description,
        tags: g.tags,
        status: g.status,
        visibility: g.visibility,
        questions: g.questions.map((q) => ({
          id: q.id,
          title: q.title,
          image: q.image,
          duration: q.duration,
          points: q.points,
          type: q.type,
          hint: q.hint,
          funfact: q.funfact,
          answers: q.answers.map((a) => ({
            id: a.id,
            title: a.title,
            correct: a.correct,
          })),
        })),
      } satisfies ProtectedGameViewDTO);
};

/***************************************************************
                Fetch Game from an Admin (any)
***************************************************************/

type GameFromAdmin = {
  id: string;
  ownerId: string;
  name: string;
};

export async function getGameFromAdmin(
  gameId: string,
  ownerId: string
): Promise<GameFromAdmin> {
  const game = await prisma.game.findUnique({
    where: { id: gameId, ownerId },
    select: {
      id: true,
      ownerId: true,
      name: true,
    },
  });

  // If the game does not exist
  if (!game) {
    console.error('Invalid game ID');
    notFound();
  }

  return game;
}

/***************************************************************
      Public Games Feed (feed of games list on the homepage)
***************************************************************/

const MAX_GAMES_PER_LIST = 15;

export const getTopRecentGames = cache(async (): Promise<GamesListDTO> => {
  const user = await getUserOrNull();

  const recentRows = await prisma.game.findMany({
    where: WHERE_PUBLIC,
    orderBy: ORDER_BY_MOST_RECENT,
    take: MAX_GAMES_PER_LIST,
    select: SELECT_GAME_COLUMNS_FOR_FEED,
  });

  return {
    games: user
      ? recentRows.map(toAdminGamesListItemDTO)
      : recentRows.map(toPublicGamesListItemDTO),
  };
});

export const getTopPopularGames = cache(async (): Promise<GamesListDTO> => {
  const user = await getUserOrNull();

  const popularRows = await prisma.game.findMany({
    where: WHERE_PUBLIC,
    orderBy: [{ sessions: { _count: 'desc' } }, { createdAt: 'desc' }], // most played first, then by recency
    take: MAX_GAMES_PER_LIST,
    select: SELECT_GAME_COLUMNS_FOR_FEED,
  });

  return {
    games: user
      ? popularRows.map(toAdminGamesListItemDTO)
      : popularRows.map(toPublicGamesListItemDTO),
  };
});

export const getTopRecentGamesForCategory = cache(
  async (category: Category): Promise<CategoryGamesListDTO> => {
    const user = await getUserOrNull();
    const where = {
      ...WHERE_PUBLIC,
      categories: { some: { id: category.id } },
    };

    const [total, rows] = await Promise.all([
      prisma.game.count({ where }),
      prisma.game.findMany({
        where,
        orderBy: [{ sessions: { _count: 'desc' } }, { createdAt: 'desc' }],
        take: MAX_GAMES_PER_LIST,
        select: SELECT_GAME_COLUMNS_FOR_FEED,
      }),
    ]);

    const games = user
      ? rows.map(toAdminGamesListItemDTO)
      : rows.map(toPublicGamesListItemDTO);

    return { category: category.name, total, games };
  }
);

export const getTopRecentsGamesFromUser = cache(
  async (): Promise<AdminOwnerGamesListDTO | null> => {
    const user = await getUserOrNull();
    if (!user) return null;

    const [total, rows] = await Promise.all([
      prisma.game.count({ where: { ownerId: user.id } }),
      prisma.game.findMany({
        where: { ownerId: user.id },
        orderBy: ORDER_BY_MOST_RECENT,
        take: MAX_GAMES_PER_LIST,
        select: SELECT_GAME_COLUMNS_FOR_FEED,
      }),
    ]);

    return {
      total,
      games: rows.map(toAdminOwnerGamesListItemDTO),
    };
  }
);

/***************************************************************
                     View Game DTOs
***************************************************************/

export async function getGameViewDTO(gameId: string): Promise<GameViewDTO> {
  const user = await getUserOrNull();
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: SELECT_GAME_COLUMNS_FOR_VIEWER,
  });

  if (!game) return notFound();

  // If the game is not public or published, only the owner can view it
  const OWNS_GAME = !!user && game.owner.id === user.id;
  const IS_PUBLIC = game.visibility === GameVisibility.PUBLIC;
  const IS_PUBLISHED = game.status === GameStatus.PUBLISHED;
  if (!OWNS_GAME && (!IS_PUBLIC || !IS_PUBLISHED)) {
    forbidden();
  }

  // Return the appropriate DTO based on ownership
  const type = OWNS_GAME ? GameViewType.PROTECTED : GameViewType.PUBLIC;
  return toGameViewDTO(game, type);
}

/***************************************************************
                     Edit Game DTOs
***************************************************************/

export async function getGameEditDTO(
  gameId: string,
  userId: string
): Promise<GameEditDTO> {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: SELECT_GAME_COLUMNS_FOR_EDIT,
  });

  // If the game does not exist
  if (!game) {
    console.error('Invalid game ID');
    notFound();
  }

  // If the user does not own the game
  if (game.ownerId !== userId) {
    console.error('Admin does not own this Game');
    forbidden();
  }

  // Map the game data to the GameEditDTO format
  return {
    ...game,
    updatedAt: game.updatedAt.toISOString(),
    categories: game.categories.map((c) => c.id),
  };
}

/***************************************************************
                     Game Categories
***************************************************************/

export const getGameCategories = cache(async (): Promise<Category[]> => {
  return prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
});

/***************************************************************
            User Library (Pagination + Search)
***************************************************************/

const ITEMS_PER_PAGE_LIBRARY = 6;

export const getTotalGamesFromUser = cache(async (): Promise<number> => {
  const user = await verifyUser();
  return prisma.game.count({ where: { ownerId: user.id } });
});

export const getFilteredGamesFromUser = cache(
  async (query: string, page: number): Promise<LibraryListItemDTO[]> => {
    const user = await verifyUser();
    const offset = (page - 1) * ITEMS_PER_PAGE_LIBRARY;

    const filteredGames = await prisma.game.findMany({
      where: {
        ownerId: user.id,
        name: { contains: query, mode: 'insensitive' },
      },
      orderBy: ORDER_BY_MOST_RECENT,
      take: ITEMS_PER_PAGE_LIBRARY,
      skip: offset,
      select: SELECT_GAME_COLUMNS_FOR_OWNER,
    });

    return filteredGames.map(toLibraryListItemDTO);
  }
);

export const getGamesPagesFromUser = cache(
  async (query: string): Promise<number> => {
    const user = await verifyUser();
    const total = await prisma.game.count({
      where: {
        ownerId: user.id,
        name: { contains: query, mode: 'insensitive' },
      },
    });
    return Math.ceil(total / ITEMS_PER_PAGE_LIBRARY);
  }
);

/***************************************************************
              Browse by Category (Search)
***************************************************************/

const ITEMS_PER_PAGE_CATEGORY = 15;

export const getTotalGamesFromCategory = cache(
  async (category: string): Promise<number> => {
    return prisma.game.count({
      where: {
        ...WHERE_PUBLIC,
        categories: {
          some: { name: { equals: category, mode: 'insensitive' } },
        },
      },
    });
  }
);

export const getTotalPagesFromCategory = cache(
  async (category: string, query: string): Promise<number> => {
    const total = await prisma.game.count({
      where: {
        ...WHERE_PUBLIC,
        name: { contains: query, mode: 'insensitive' },
        categories: {
          some: { name: { equals: category, mode: 'insensitive' } },
        },
      },
    });
    return Math.ceil(total / ITEMS_PER_PAGE_CATEGORY);
  }
);

export const getFilteredGamesFromCategory = cache(
  async (
    category: string,
    query: string,
    page: number,
    sort: SortOption,
    order: OrderOption
  ): Promise<PublicGamesListItemDTO[]> => {
    const offset = (page - 1) * ITEMS_PER_PAGE_CATEGORY;

    let orderBy = {};
    if (sort === 'questionCount') {
      orderBy = { questions: { _count: order } };
    } else if (sort === 'duration') {
      orderBy = {};
    } else if (sort === 'relevance') {
      orderBy = ORDER_BY_MOST_RECENT;
    } else {
      orderBy = { [sort]: order };
    }

    const filteredGames = await prisma.game.findMany({
      where: {
        ...WHERE_PUBLIC,
        name: { contains: query, mode: 'insensitive' },
        categories: {
          some: { name: { equals: category, mode: 'insensitive' } },
        },
      },
      orderBy: orderBy,
      take: ITEMS_PER_PAGE_CATEGORY,
      skip: offset,
      select: SELECT_GAME_COLUMNS_FOR_FEED,
    });

    const ret = filteredGames.map(toPublicGamesListItemDTO);
    if (sort === 'duration') {
      ret.sort((a, b) =>
        order === 'asc' ? a.duration - b.duration : b.duration - a.duration
      );
    }
    return ret;
  }
);
