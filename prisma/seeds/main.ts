import { prisma } from '@/lib/prisma';

import seedUsers from './0_users';
import seedCategories from './1_categories';
import seedGames from './2_games';

async function main() {
  console.time('Seeding complete 🌱');

  // Seed Admin Users
  const users = await seedUsers(prisma);
  await seedCategories(prisma);
  await seedGames(prisma, users);

  console.timeEnd('Seeding complete 🌱');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
