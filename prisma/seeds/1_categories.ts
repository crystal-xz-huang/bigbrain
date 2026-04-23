import { categories } from './data';
import type { DB as Prisma } from '@/lib/definitions/types';

const seedCategories = async (prisma: Prisma): Promise<void> => {
  const start = Date.now();
  console.log('Seeding categories...');

  await Promise.all(
    categories.map((c) =>
      prisma.category.upsert({
        where: { name: c.name },
        update: {},
        create: c,
      })
    )
  );

  const end = Date.now();
  console.log(`Seeding categories completed in ${end - start}ms`);
};

export default seedCategories;
