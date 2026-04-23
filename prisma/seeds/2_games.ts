import { GameConstraints } from '@/lib/definitions/constants';
import type { GameSeedTemplate, DB as Prisma } from '@/lib/definitions/types';
import { GameStatus, GameVisibility, type User } from '@prisma/client';
import { games } from './data';

/***************************************************************
                     Helper Functions
***************************************************************/

const getGameOwner = (name: string, admins: User[], fallback: User): User => {
  // deterministic hash so that the same game always gets the same owner
  let h = 5381;
  for (let i = 0; i < name.length; i++) h = (h << 5) + h + name.charCodeAt(i);
  return admins[Math.abs(h) % admins.length] ?? fallback;
};

const generateGame = (game: GameSeedTemplate) => ({
  name: game.name,
  image: game.image ?? null,
  description: game.description ?? null,
  status: game.status ?? GameStatus.PUBLISHED,
  visibility: game.visibility ?? GameVisibility.PUBLIC,
  tags: [...new Set((game.tags ?? []).map((t) => t.trim().toLowerCase()))], // normalize tags (trim and lowercase)
});

const generateQuestion = (
  gameId: string,
  question: GameSeedTemplate['questions'][number]
) => ({
  title: question.title,
  image: question.image ?? null,
  hint: question.hint ?? null,
  funfact: question.funfact ?? null,
  duration: question.duration ?? GameConstraints.DEFAULT_QUESTION_DURATION,
  points: question.points ?? GameConstraints.POINTS.STANDARD,
  type: question.type,
  gameId: gameId,
  answers: {
    create: question.answers.map((answer) => ({
      title: answer.title,
      correct: !!answer.correct,
    })),
  },
});

const createOrUpdateGamesFromAdmin = async (
  prisma: Prisma,
  owner: User,
  game: GameSeedTemplate
): Promise<void> => {
  // Upsert game without questions first
  const createdGame = await prisma.game.upsert({
    where: { name_ownerId: { name: game.name, ownerId: owner.id } },
    create: {
      ...generateGame(game),
      ownerId: owner.id,
      categories: { connect: game.categories.map((name) => ({ name })) },
    },
    update: {
      ...generateGame(game),
      categories: {
        set: [],
        connect: game.categories.map((name) => ({ name })),
      },
    },
    select: { id: true },
  });

  // Delete and replace all questions (and their answers)
  await prisma.question.deleteMany({ where: { gameId: createdGame.id } });
  for (const q of game.questions) {
    await prisma.question.create({ data: generateQuestion(createdGame.id, q) });
  }
};

/***************************************************************
                     Seed Games
***************************************************************/

const seedGames = async (prisma: Prisma, admins: User[]): Promise<void> => {
  const start = Date.now();
  console.log('Seeding games...');

  for (let i = 0; i < games.length; i++) {
    const g = games[i];

    // Keep existing owner if game already exists
    const existing = await prisma.game.findFirst({
      where: { name: g.name },
      select: { ownerId: true },
    });

    const owner = existing
      ? admins.find((a) => a.id === existing.ownerId)!
      : getGameOwner(g.name, admins, admins[i % admins.length]);

    // Remove any existing games with the same name but different owner
    await prisma.game.deleteMany({
      where: { name: g.name, ownerId: { not: owner.id } },
    });

    const t0 = Date.now();
    await createOrUpdateGamesFromAdmin(prisma, owner, g);
    const t1 = Date.now();

    console.log(`   → ${i + 1}/${games.length}: ${g.name} (${t1 - t0}ms)`);
  }

  const end = Date.now();
  console.log(`Seeding games completed in ${end - start}ms`);
};

export default seedGames;
