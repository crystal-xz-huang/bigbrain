import 'dotenv/config';
import path from 'node:path';
import type { PrismaConfig } from 'prisma';

export default {
  schema: path.join('prisma', 'schema'), // ./prisma/schema/schema.prisma
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: `tsx prisma/seeds/main.ts`,
  },
} satisfies PrismaConfig;

